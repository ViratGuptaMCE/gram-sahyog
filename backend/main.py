import pandas as pd
import json
import io
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import logging
import gc
from typing import List

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
from deep_translator import GoogleTranslator

try:
    SUPPORTED_LANGUAGES = list(GoogleTranslator().get_supported_languages(as_dict=True).values())
except Exception as e:
    SUPPORTED_LANGUAGES = ['en', 'hi', 'ur', 'pa', 'bn', 'gu', 'mr', 'ta', 'te', 'kn', 'ml', 'or', 'as', 'ne']
import time
# import fitz  
# import pytesseract
# from PIL import Image

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY environment variable not set.")

class TokenRateLimiter:
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.clients = {}  

    def is_rate_limited(self, ip: str) -> bool:
        current_time = time.time()
        if ip not in self.clients:
            self.clients[ip] = []
        
        self.clients[ip] = [t for t in self.clients[ip] if current_time - t < self.window_seconds]
        
        if len(self.clients[ip]) >= self.requests_limit:
            return True
            
        self.clients[ip].append(current_time)
        return False

qa_limiter = TokenRateLimiter(requests_limit=10, window_seconds=60)
pdf_limiter = TokenRateLimiter(requests_limit=5, window_seconds=60)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Initializing HuggingFace Endpoint Embeddings...")
hf_token = os.getenv("HUGGINGFACE_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
embedding_model = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    huggingfacehub_api_token=hf_token
)

llm = None
if GROQ_API_KEY:
    logger.info("Initializing Groq LLM...")
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        groq_api_key=GROQ_API_KEY
    )
else:
    logger.warning("Groq LLM is not initialized because GROQ_API_KEY is missing.")

lawyer_df = pd.read_csv("lawyer.csv")
logger.info("Lawyer database loaded from CSV")

LAWYER_INDEX_PATH = "lawyer_faiss_index"
if os.path.exists(LAWYER_INDEX_PATH):
    logger.info("Loading existing lawyer FAISS index from disk...")
    lawyer_index = FAISS.load_local(
        folder_path=LAWYER_INDEX_PATH,
        embeddings=embedding_model,
        allow_dangerous_deserialization=True
    )
else:
    logger.info("Creating new lawyer FAISS index...")
    documents = []
    for idx, row in lawyer_df.iterrows():
        spec = str(row.get('Specialization', '')).strip() if pd.notna(row.get('Specialization')) else ''
        city = str(row.get('City', '')).strip() if pd.notna(row.get('City')) else ''
        desc = str(row.get('Description', '')).strip() if pd.notna(row.get('Description')) else ''
        name = str(row.get('Name', '')).strip() if pd.notna(row.get('Name')) else ''
        
        page_content = f"Specialization: {spec}\nCity: {city}\nDescription: {desc}"
        doc = Document(page_content=page_content, metadata={"name": name})
        documents.append(doc)
        
    lawyer_index = FAISS.from_documents(
        documents=documents,
        embedding=embedding_model
    )
    lawyer_index.save_local(LAWYER_INDEX_PATH)
    logger.info("Lawyer FAISS index created and saved successfully.")

class LLMWrapper:
    def __init__(self, llm_instance):
        if not llm_instance:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server.")
        self.llm = llm_instance

    def run(self, input_documents: List[str], question: str) -> str:
        try:
            context = "\n".join(input_documents)
            prompt = f"""
**Role:** You are a legal assistant. Answer based ONLY on the given context.
Answer should be well in points and proper format.

**Context:**
{context}

**Question:**
{question}

**Answer:**
"""
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            logger.error(f"Groq LLM Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate answer")

    def ans(self, question: str) -> str:
        try:
            prompt = f"""
**Role:** You are a legal assistant. Provide Legal response ONLY.
Answer should be well in points and proper format.

**Question:**
{question}
"""
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            logger.error(f"Groq LLM Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to answer question")

def extract_case_details_with_llm(query: str, text_context: str, generated_answer: str, existing_cities: List[str], existing_specs: List[str], llm_instance) -> dict:
    if not llm_instance:
        return {"specialization": "Unknown", "city": "Unknown"}
        
    prompt = f"""
You are a legal triage assistant. Your task is to analyze a user's query, some context from a legal document they uploaded, and the generated legal answer, and identify:
1. The most appropriate legal specialization required. Choose ONLY from this list:
{existing_specs}

2. The location (city) relevant to this legal matter. Choose ONLY from this list:
{existing_cities}

User Query: "{query}"
Document context snippet: "{text_context[:2000]}"
Generated answer snippet: "{generated_answer[:2000]}"

Instructions:
- Map the location to a city in the list. If a state (e.g. "Bihar") is mentioned, map it to the city/cities belonging to that state from the list (e.g. "Patna").
- If the location does not map to any city in the list, or is not mentioned anywhere, return "Unknown".
- If the specialization is not clear, map it to the closest match (e.g., land, rent, eviction, registration, mutation map to "Property"; general contract, agreement disputes map to "Civil"; theft, fraud, assault map to "Criminal"; divorce, inheritance, child custody map to "Family"; income tax, GST map to "Tax"; product defects, service complaints map to "Consumer Court"). If it doesn't match any, return "Unknown".

Return your answer as a raw JSON object with keys "specialization" and "city". Do not include any markdown, code blocks, explanation, or additional text.
Example response:
{{"specialization": "Property", "city": "Delhi"}}
"""
    try:
        response = llm_instance.invoke(prompt)
        text = response.content.strip()
        # Clean up markdown formatting if the LLM outputted them
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(text)
        logger.info(f"LLM extracted case details: {data}")
        return data
    except Exception as e:
        logger.error(f"Error extracting case details: {e}")
        # Manual fallback parsing
        result = {"specialization": "Unknown", "city": "Unknown"}
        try:
            text_lower = response.content.lower()
            for city in existing_cities:
                if city.lower() in text_lower:
                    result["city"] = city
                    break
            for spec in existing_specs:
                if spec.lower() in text_lower:
                    result["specialization"] = spec
                    break
        except Exception:
            pass
        return result

def rank_lawyers(query: str, text_context: str = "", generated_answer: str = "", k: int = 3) -> List[dict]:
    existing_cities = [str(c).strip() for c in lawyer_df['City'].dropna().unique()]
    existing_specs = [str(s).strip() for s in lawyer_df['Specialization'].dropna().unique()]
    
    # Extract case details using LLM
    details = extract_case_details_with_llm(query, text_context, generated_answer, existing_cities, existing_specs, llm)
    inferred_spec = details.get("specialization", "Unknown")
    inferred_city = details.get("city", "Unknown")
    
    logger.info(f"Ranking lawyers. Inferred Spec: {inferred_spec}, Inferred City: {inferred_city}")
    
    df = lawyer_df.copy()
    
    # Base relevance score
    relevance_scores = []
    for idx, row in df.iterrows():
        score = 0
        row_spec = str(row.get('Specialization', '')).strip()
        row_city = str(row.get('City', '')).strip()
        
        # City match (Highest priority)
        if inferred_city != "Unknown" and row_city.lower() == inferred_city.lower():
            score += 200
            
        # Specialization match
        if inferred_spec != "Unknown":
            if row_spec.lower() == inferred_spec.lower():
                score += 100
            # Related domains
            elif inferred_spec.lower() == "property" and row_spec.lower() == "civil":
                score += 30
            elif inferred_spec.lower() == "civil" and row_spec.lower() in ["property", "family", "consumer court"]:
                score += 30
                
        relevance_scores.append(score)
        
    df['Relevance_Score'] = relevance_scores
    
    # Semantic Search Score
    semantic_query = ""
    if inferred_spec != "Unknown":
        semantic_query += f"Specialization: {inferred_spec} "
    if inferred_city != "Unknown":
        semantic_query += f"City: {inferred_city} "
    semantic_query += query
    
    try:
        matched_docs = lawyer_index.similarity_search(semantic_query, k=max(k * 3, 15))
        semantic_names = {}
        for rank_idx, doc in enumerate(matched_docs):
            name = doc.metadata.get("name")
            if name:
                semantic_names[name] = max(50 - (rank_idx * 3), 10)
    except Exception as e:
        logger.error(f"Semantic search failed during lawyer ranking: {e}")
        semantic_names = {}
        
    df['Semantic_Score'] = df['Name'].map(semantic_names).fillna(0)
    
    # Experience and Rating
    if 'Experience_Years' not in df.columns:
        df['Experience_Years'] = df['Experience'].str.extract(r'(\d+)').astype(float).fillna(0).astype(int)
        
    df['Total_Score'] = (
        df['Relevance_Score'] + 
        df['Semantic_Score'] + 
        (df['Rating'].fillna(4.0) * 10) + 
        (df['Experience_Years'] * 0.5)
    )
    
    # Sort by total score, then rating, then experience
    ranked_df = df.sort_values(
        by=['Total_Score', 'Rating', 'Experience_Years'], 
        ascending=[False, False, False]
    )
    
    # Convert to list of dicts
    lawyers_list = json.loads(ranked_df.head(k).to_json(orient='records'))
    return lawyers_list

def extract_text_via_ocr(pdf_contents: bytes) -> str:
    raise RuntimeError("Required python libraries for OCR (pymupdf, pytesseract) are not installed on the server.")
    # try:    
        # if os.name == 'posix':
        #     for path in ['/usr/bin/tesseract', '/usr/local/bin/tesseract']:
        #         if os.path.exists(path):
        #             pytesseract.pytesseract.tesseract_cmd = path
        #             break
        
        # logger.info("Attempting OCR on PDF pages...")
        # doc = fitz.open(stream=pdf_contents, filetype="pdf")
        # ocr_text = []
        
        # max_pages = min(len(doc), 10)
        # for page_num in range(max_pages):
        #     logger.info(f"Performing OCR on page {page_num + 1}/{max_pages}")
        #     page = doc.load_page(page_num)
        #     pix = page.get_pixmap(dpi=100)
        #     img_data = pix.tobytes("png")
        #     img = Image.open(io.BytesIO(img_data))
            
        #     page_text = pytesseract.image_to_string(img, lang="hin+eng")
        #     ocr_text.append(page_text)
        #     del pix, img_data, img
            
        # full_text = "\n".join(ocr_text)
        # return full_text
    # except ImportError as e:
    #     logger.exception("OCR libraries missing")
    #     raise RuntimeError("Required python libraries for OCR (pymupdf, pytesseract) are not installed on the server.")
    # except Exception as e:
    #     logger.exception("OCR process failed")
    #     err_msg = str(e).lower()
    #     if "tesseract" in err_msg or "not found" in err_msg or "path" in err_msg or "executable" in err_msg:
    #         raise RuntimeError(
    #             "Tesseract OCR engine is not installed or not found on this system. "
    #             "Since you have deployed this backend on Render, please make sure your Web Service environment is set to 'Docker' "
    #             "in the Render Dashboard. This will force Render to build the app using our Dockerfile (which installs Tesseract OCR "
    #             "with English and Hindi packages natively)."
    #         )
    #     raise RuntimeError(f"Failed to perform OCR on PDF: {str(e)}")

@app.post("/process_pdf/")
async def process_pdf(
    request: Request,
    file: UploadFile = File(...),
    query: str = Form(...),
    translation_language: str = Form(None),
    extracted_text: str = Form(None)
):
    ip = request.client.host
    if pdf_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many PDF uploads. Try again soon.")
        
    try:
        contents = await file.read()
        import fitz
        doc = fitz.open(stream=contents, filetype="pdf")
        raw_text = "".join([page.get_text() or "" for page in doc])
        logger.info("File successfully read via PyMuPDF")

        if len(raw_text.strip()) < 100:
            if extracted_text :
                if len(extracted_text.strip()) < 50:
                    logger.info("Extracted text is empty or short.")
                    raise HTTPException(status_code=400, detail=str("Extracted Text is too short."))
                logger.info("Using client-side OCR text provided by frontend")
                raw_text = extracted_text
            else:
                # logger.info("Extracted text is empty or short. Running safe OCR fallback...")
                # try:
                #     raw_text = extract_text_via_ocr(contents)
                # except RuntimeError as ocr_error:
                #     raise HTTPException(status_code=400, detail=str(ocr_error))
                raise HTTPException(status_code=400, detail=str("We need OCR from client side tesseract , as pytesseract is not available."))

        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text")

        llm_chain = LLMWrapper(llm)

        # Vector retrieval block
        if len(raw_text) < 40000:
            logger.info("PDF text is small. Bypassing vector search entirely.")
            answer = llm_chain.run(input_documents=[raw_text], question=query)
        else:
            logger.info("PDF text is large. Using ultra-light FAISS runtime vector storage.")
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=150)
            texts = text_splitter.split_text(raw_text)
            
            # Using FAISS here avoids the memory footprint and persistence locks
            docsearch = FAISS.from_texts(texts, embedding=embedding_model)
            docs = docsearch.similarity_search(query, k=3)
            answer = llm_chain.run(
                input_documents=[doc.page_content for doc in docs],
                question=query
            )
            del docsearch, docs
            gc.collect()

        logger.info("Answer generated successfully")

        best_lawyers = rank_lawyers(query=query, text_context=raw_text, generated_answer=answer, k=1)
        best_lawyer = best_lawyers[0] if best_lawyers else None

        return JSONResponse(content={"answer": answer, "lawyer": best_lawyer})

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Processing failed")
        raise HTTPException(status_code=500, detail=str(e))


CITY_SYNONYMS = {
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "bombay": "Mumbai",
    "mumbai": "Mumbai",
    "calcutta": "Kolkata",
    "kolkata": "Kolkata",
    "madras": "Chennai",
    "chennai": "Chennai",
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "gurgaon": "Gurugram",
    "gurugram": "Gurugram",
    "pondicherry": "Puducherry",
    "puducherry": "Puducherry",
    "orissa": "Odisha",
    "trivandrum": "Thiruvananthapuram",
    "thiruvananthapuram": "Thiruvananthapuram",
    "baroda": "Vadodara",
    "vadodara": "Vadodara",
    "cochin": "Kochi",
    "kochi": "Kochi",
    "banaras": "Varanasi",
    "varanasi": "Varanasi",
    "allahabad": "Prayagraj",
    "prayagraj": "Prayagraj"
}

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
        
    return previous_row[-1]

def resolve_city_name(user_input: str, existing_cities: list) -> str:
    cleaned_input = user_input.strip().lower()
    if not cleaned_input:
        return ""

    if cleaned_input in CITY_SYNONYMS:
        synonym_resolved = CITY_SYNONYMS[cleaned_input]
        for city in existing_cities:
            if city.strip().lower() == synonym_resolved.lower():
                return city

    for city in existing_cities:
        city_lower = city.strip().lower()
        if cleaned_input == city_lower or cleaned_input in city_lower or city_lower in cleaned_input:
            return city

    best_match = None
    best_ratio = 0.0
    for city in existing_cities:
        city_lower = city.strip().lower()
        max_len = max(len(cleaned_input), len(city_lower))
        if max_len == 0:
            continue
        dist = levenshtein_distance(cleaned_input, city_lower)
        ratio = 1.0 - (dist / max_len)
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = city

    if best_ratio >= 0.75:
        return best_match

    return user_input.strip().title()


def resolve_city_name_with_llm(user_input: str, existing_cities: list, llm_instance) -> str:
    cleaned_input = user_input.strip()
    if not cleaned_input:
        return ""

    if not llm_instance:
        return resolve_city_name(user_input, existing_cities)

    cities_str = ", ".join(existing_cities)
    prompt = f"""
You are a geographical matching assistant.
You are given a list of unique cities present in a database:
[{cities_str}]

The user searched for the location: "{user_input}"

Your task is to map the user's searched location to the most appropriate city from the database list above.
Use your geographical knowledge:
- If the user searches for a state (e.g. "Bihar"), map it to the city/cities belonging to that state from the list (e.g. "Patna").
- If the user searches for a synonym or historical name (e.g. "Bombay"), map it to the corresponding city in the list (e.g. "Mumbai").
- If the user searches for a landmark or description (e.g. "Silicon Valley of India" or "capital of India"), map it to the correct city (e.g. "Bengaluru" or "Delhi").
- If it's a spelling typo (e.g. "Mumbay" -> "Mumbai"), correct it.

Return ONLY the exact city name from the list. Do not include any explanation, markdown, introductory text, or punctuation.
If the location does not map to any city in the list, return "None".

Database City Match:"""
    try:
        response = llm_instance.invoke(prompt)
        resolved = response.content.strip().replace('"', '').replace("'", "").strip()
        if resolved.endswith('.'):
            resolved = resolved[:-1]
        
        logger.info(f"LLM resolved location '{user_input}' to '{resolved}'")
        
        if resolved in existing_cities:
            return resolved
            
        return resolve_city_name(user_input, existing_cities)
    except Exception as e:
        logger.error(f"Error resolving location with LLM: {e}")
        return resolve_city_name(user_input, existing_cities)


@app.post("/get_lawyers/")
async def get_lawyers(
    domain: str = Form(...),
    location: str = Form(...),
    experience: int = Form(...)
):
    try:
        domain = domain.strip().title()
        
        existing_cities = [str(c).strip() for c in lawyer_df['City'].dropna().unique()]
        
        resolved_location = resolve_city_name_with_llm(location, existing_cities, llm)
        logger.info(f"Resolved search city '{location}' to database city name '{resolved_location}'")
        
        df = lawyer_df.copy()
        if 'Experience_Years' not in df.columns:
            df['Experience_Years'] = df['Experience'].str.extract(r'(\d+)').astype(float).fillna(0).astype(int)

        filtered = df[
            (df['City'].str.lower() == resolved_location.lower()) &
            (df['Specialization'] == domain) &
            (df['Experience_Years'] >= experience)
        ]
        response_data = json.loads(filtered.to_json(orient='records'))
        return JSONResponse(content={'lawyers': response_data})
    except Exception as e:
        logger.error(f"Error in /get_lawyers: {e}")
        return JSONResponse(content={'error': str(e)}, status_code=500)


class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    try:
        if request.target_lang not in SUPPORTED_LANGUAGES:
            raise HTTPException(status_code=400, detail="Unsupported language code.")
        
        translated_text = GoogleTranslator(source='auto', target=request.target_lang).translate(request.text)
        
        return {
            "original_text": request.text,
            "translated_text": translated_text,
            "source_lang": "auto",
            "target_lang": request.target_lang
        }
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


class QuestionRequest(BaseModel):
    question: str
    session_id: str = "default"

SESSION_HISTORIES = {}

@app.post("/getanswer")
async def get_answer(request: Request, body: QuestionRequest):
    ip = request.client.host
    if qa_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again in a minute.")
        
    try:
        if body.session_id not in SESSION_HISTORIES:
            SESSION_HISTORIES[body.session_id] = []
            
        history = SESSION_HISTORIES[body.session_id]

        lawyer_keywords = ["lawyer", "advocate", "suggest", "find", "good", "recommend", "वकील", "अधिवक्ता", "सजेस्ट", "मदद", "असिस्ट", "काउंसल"]
        is_asking_for_lawyer = any(kw in body.question.lower() for kw in lawyer_keywords)
        
        lawyers_context = ""
        if is_asking_for_lawyer:
            logger.info("User question triggers lawyer search. Ranking lawyers...")
            history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-4:]])
            best_lawyers = rank_lawyers(query=body.question, text_context=history_text, generated_answer="", k=3)
            
            lawyer_profiles = []
            for row in best_lawyers:
                profile = (
                    f"- Name: {row.get('Name')}\n"
                    f"  City: {row.get('City')}\n"
                    f"  Location: {row.get('Location')}\n"
                    f"  Specialization: {row.get('Specialization')}\n"
                    f"  Experience: {row.get('Experience')}\n"
                    f"  Rating: {row.get('Rating')}\n"
                    f"  Description: {row.get('Description')}"
                )
                lawyer_profiles.append(profile)
                
            lawyers_context = "\n\n".join(lawyer_profiles)

        system_prompt = """You are "Gramin Nyay Mitra" (Rural Legal Friend), a helpful AI legal assistant. 
Answer the user's questions in a clear, structured format using points (### headings, **bold** keypoints, bullet lists).
Always prioritize simple, easy-to-understand explanations suitable for rural citizens.
"""
        if lawyers_context:
            system_prompt += f"""\nHere are matched advocates from our database that you can suggest/recommend to the user if relevant to their request:
{lawyers_context}

Be sure to mention their names, specialization, city, rating, and description when recommending them. If they match the location requested (e.g. Bihar / Patna), highlight that!
"""
        
        messages = [SystemMessage(content=system_prompt)]
        
        for msg in history[-6:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))
                
        messages.append(HumanMessage(content=body.question))
        
        if not llm:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server.")
            
        response = llm.invoke(messages)
        answer = response.content
        
        history.append({"role": "user", "content": body.question})
        history.append({"role": "assistant", "content": answer})
        SESSION_HISTORIES[body.session_id] = history[-20:]
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error in /getanswer: {e}")
        raise HTTPException(status_code=500, detail=str(e))