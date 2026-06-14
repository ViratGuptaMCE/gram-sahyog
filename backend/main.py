import pandas as pd
import json
import io
import os
import logging
from typing import List

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from PyPDF2 import PdfReader

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
from googletrans import Translator, LANGUAGES
import time

# ----------------------------------------------------------------------
# Setup
# ----------------------------------------------------------------------
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY environment variable not set.")

# ----------------------------------------------------------------------
# Rate Limiting Engine
# ----------------------------------------------------------------------
class TokenRateLimiter:
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.clients = {}  # ip -> list of timestamps

    def is_rate_limited(self, ip: str) -> bool:
        current_time = time.time()
        if ip not in self.clients:
            self.clients[ip] = []
        
        # Keep only timestamps within sliding window
        self.clients[ip] = [t for t in self.clients[ip] if current_time - t < self.window_seconds]
        
        if len(self.clients[ip]) >= self.requests_limit:
            return True
            
        self.clients[ip].append(current_time)
        return False

# Limit to 10 requests per min for Q&A, and 5 requests per min for document uploads
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

# Initialize local HuggingFace Embeddings
logger.info("Initializing HuggingFace Embeddings...")
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'}
)

# Initialize Groq LLM (if API key is present)
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

# Load lawyer database from CSV
lawyer_df = pd.read_csv("lawyer.csv")
logger.info("Lawyer database loaded from CSV")

# Initialize / load lawyer Chroma index
LAWYER_INDEX_PATH = "lawyer_chroma_index"
if os.path.exists(LAWYER_INDEX_PATH):
    logger.info("Loading existing lawyer Chroma index from disk...")
    lawyer_chroma = Chroma(
        collection_name="lawyers",
        persist_directory=LAWYER_INDEX_PATH,
        embedding_function=embedding_model
    )
else:
    logger.info("Creating new lawyer Chroma index...")
    documents = []
    for idx, row in lawyer_df.iterrows():
        spec = str(row.get('Specialization', '')).strip() if pd.notna(row.get('Specialization')) else ''
        city = str(row.get('City', '')).strip() if pd.notna(row.get('City')) else ''
        desc = str(row.get('Description', '')).strip() if pd.notna(row.get('Description')) else ''
        name = str(row.get('Name', '')).strip() if pd.notna(row.get('Name')) else ''
        
        page_content = f"Specialization: {spec}\nCity: {city}\nDescription: {desc}"
        doc = Document(page_content=page_content, metadata={"name": name})
        documents.append(doc)
        
    lawyer_chroma = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=LAWYER_INDEX_PATH,
        collection_name="lawyers"
    )
    logger.info("Lawyer Chroma index created and saved successfully.")

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

def extract_text_via_ocr(pdf_contents: bytes) -> str:
    try:
        import fitz  # PyMuPDF
        import pytesseract
        from PIL import Image
        import io
        
        logger.info("Attempting OCR on PDF pages...")
        doc = fitz.open(stream=pdf_contents, filetype="pdf")
        ocr_text = []
        
        # Limit to 10 pages for performance and timeout safety on free tier
        max_pages = min(len(doc), 10)
        for page_num in range(max_pages):
            logger.info(f"Performing OCR on page {page_num + 1}/{max_pages}")
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=150)
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            
            # Use both English and Hindi for Tesseract OCR to support our bilingual content
            page_text = pytesseract.image_to_string(img, lang="hin+eng")
            ocr_text.append(page_text)
            
        full_text = "\n".join(ocr_text)
        return full_text
    except ImportError as e:
        logger.error(f"OCR libraries missing: {e}")
        raise RuntimeError("Required python libraries for OCR (pymupdf, pytesseract) are not installed on the server.")
    except Exception as e:
        err_msg = str(e).lower()
        if "tesseract" in err_msg or "not found" in err_msg or "path" in err_msg or "executable" in err_msg:
            logger.error("Tesseract binary not found on the system.")
            raise RuntimeError(
                "Tesseract OCR engine is not installed on this system. "
                "Since you have deployed this backend on Render, please change your Web Service environment setting from 'Python' to 'Docker' "
                "in the Render Dashboard. This will force Render to build the app using our Dockerfile (which installs Tesseract OCR "
                "with English and Hindi packages natively)."
            )
        logger.error(f"OCR process failed: {e}")
        raise RuntimeError(f"Failed to perform OCR on PDF: {str(e)}")

@app.post("/process_pdf/")
async def process_pdf(
    request: Request,
    file: UploadFile = File(...),
    query: str = Form(...),
    translation_language: str = Form(None)
):
    # Check PDF rate limit
    ip = request.client.host
    if pdf_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many PDF uploads. Please try again in a minute.")
        
    try:
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        raw_text = ''.join([page.extract_text() or "" for page in pdf_reader.pages])
        logger.info("File successfully read")

        # Fallback to OCR if extracted text is empty or too short (e.g. less than 100 characters)
        if len(raw_text.strip()) < 100:
            logger.info("Extracted text is empty or too short. Falling back to OCR...")
            try:
                raw_text = extract_text_via_ocr(contents)
                logger.info("OCR successfully completed")
            except RuntimeError as ocr_error:
                logger.error(f"OCR Fallback failed: {ocr_error}")
                raise HTTPException(
                    status_code=400, 
                    detail=f"PDF contains no readable text, and OCR fallback failed: {str(ocr_error)}"
                )

        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text")

        llm_chain = LLMWrapper(llm)

        # Optimize: if PDF is small, bypass vector search entirely for maximum speed & accuracy
        if len(raw_text) < 40000:
            logger.info("PDF text is small. Bypassing vector search for speed.")
            answer = llm_chain.run(
                input_documents=[raw_text],
                question=query
            )
        else:
            logger.info("PDF text is large. Using vector search.")
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=2000,
                chunk_overlap=200
            )
            texts = text_splitter.split_text(raw_text)
            if not texts:
                raise HTTPException(status_code=400, detail="Text splitting failed")
            
            docsearch = Chroma.from_texts(texts, embedding=embedding_model) 
            docs = docsearch.similarity_search(query, k=4)
            logger.info("Embeddings generated and documents searched")
            answer = llm_chain.run(
                input_documents=[doc.page_content for doc in docs],
                question=query
            )
        
        logger.info("Answer generated")

        # Find the best matching lawyer locally with 0 LLM tokens using the Chroma index
        search_query = query
        if not search_query.strip():
            search_query = answer[:1000]
            
        logger.info("Searching lawyer Chroma index...")
        matched_docs = lawyer_chroma.similarity_search(search_query, k=5)
        matched_names = [doc.metadata.get("name") for doc in matched_docs if doc.metadata.get("name")]
        
        df = lawyer_df.copy()
        if 'Experience_Years' not in df.columns:
            df['Experience_Years'] = df['Experience'].str.extract(r'(\d+)').astype(float).fillna(0).astype(int)
            
        matched_df = df[df['Name'].isin(matched_names)]
        if matched_df.empty:
            matched_df = df
            
        matched_df = matched_df.sort_values(by=['Rating', 'Experience_Years'], ascending=[False, False])
        best_lawyer = json.loads(matched_df.iloc[0].to_json())

        return JSONResponse(content={"answer": answer, "lawyer": best_lawyer})

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Processing failed")
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------------------------------------------------
# City Name Resolution Layer (Synonyms & Typo Fuzzy Matching)
# ----------------------------------------------------------------------
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

    # 1. Match against known synonyms
    if cleaned_input in CITY_SYNONYMS:
        synonym_resolved = CITY_SYNONYMS[cleaned_input]
        # Verify if synonym city is in database
        for city in existing_cities:
            if city.strip().lower() == synonym_resolved.lower():
                return city

    # 2. Check simple substring containment
    for city in existing_cities:
        city_lower = city.strip().lower()
        if cleaned_input == city_lower or cleaned_input in city_lower or city_lower in cleaned_input:
            return city

    # 3. Levenshtein fuzzy string distance matching
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

    # Accept if similarity ratio >= 75%
    if best_ratio >= 0.75:
        return best_match

    # Fallback to standard capitalized form
    return user_input.strip().title()


def resolve_city_name_with_llm(user_input: str, existing_cities: list, llm_instance) -> str:
    cleaned_input = user_input.strip()
    if not cleaned_input:
        return ""

    if not llm_instance:
        # Fall back to rule-based matching if LLM is not initialized (no API key)
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
        
        # Get unique cities list from lawyer dataset
        existing_cities = [str(c).strip() for c in lawyer_df['City'].dropna().unique()]
        
        # Resolve city using LLM (with fallback to synonyms and fuzzy matching)
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


translator = Translator()

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
        if request.target_lang not in LANGUAGES:
            raise HTTPException(status_code=400, detail="Unsupported language code.")
        translation = await translator.translate(request.text, dest=request.target_lang)
        return {
            "original_text": request.text,
            "translated_text": translation.text,
            "source_lang": translation.src,
            "target_lang": translation.dest
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
    # Check rate limit
    ip = request.client.host
    if qa_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again in a minute.")
        
    try:
        # Check if the query is asking about finding/recommending advocates/lawyers
        lawyer_keywords = ["lawyer", "advocate", "suggest", "find", "good", "recommend", "वकील", "अधिवक्ता", "सजेस्ट", "मदद", "असिस्ट", "काउंसल"]
        is_asking_for_lawyer = any(kw in body.question.lower() for kw in lawyer_keywords)
        
        lawyers_context = ""
        if is_asking_for_lawyer:
            logger.info("User question triggers lawyer search. Querying Chroma...")
            # Query the Chroma index for relevant advocates
            matched_docs = lawyer_chroma.similarity_search(body.question, k=3)
            
            # Format advocate profiles
            lawyer_profiles = []
            for doc in matched_docs:
                name = doc.metadata.get("name", "Unknown Advocate")
                # Look up full details in lawyer_df
                df_match = lawyer_df[lawyer_df['Name'] == name]
                if not df_match.empty:
                    row = df_match.iloc[0]
                    profile = (
                        f"- Name: {row.get('Name')}\n"
                        f"  City: {row.get('City')}\n"
                        f"  Location: {row.get('Location')}\n"
                        f"  Specialization: {row.get('Specialization')}\n"
                        f"  Experience: {row.get('Experience')}\n"
                        f"  Rating: {row.get('Rating')}\n"
                        f"  Description: {row.get('Description')}"
                    )
                else:
                    profile = f"- Name: {name}\n  Details: {doc.page_content}"
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

        if body.session_id not in SESSION_HISTORIES:
            SESSION_HISTORIES[body.session_id] = []
            
        history = SESSION_HISTORIES[body.session_id]
        
        messages = [SystemMessage(content=system_prompt)]
        
        # Append last 6 messages of history (3 turns)
        for msg in history[-6:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))
                
        # Append current question
        messages.append(HumanMessage(content=body.question))
        
        if not llm:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server.")
            
        response = llm.invoke(messages)
        answer = response.content
        
        # Save to history
        history.append({"role": "user", "content": body.question})
        history.append({"role": "assistant", "content": answer})
        SESSION_HISTORIES[body.session_id] = history[-20:]
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error in /getanswer: {e}")
        raise HTTPException(status_code=500, detail=str(e))