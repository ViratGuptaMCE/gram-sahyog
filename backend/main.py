
import pandas as pd
import json


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googletrans import Translator, LANGUAGES

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
import io
import logging
import os
import google.generativeai as genai
from typing import List
from langchain_core.embeddings import Embeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(GEMINI_API_KEY)
if not GEMINI_API_KEY:
    raise ValueError("Please set GEMINI_API_KEY environment variable")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize lawyer data at startup
def load_lawyer_data():
    # Read the CSV file
    df = pd.read_csv("lawyer.csv")
    text = "\n".join(df.astype(str).fillna("").agg(" ".join, axis=1))
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_text(text)
    documents = [Document(page_content=t) for t in texts]
    
    # Use the existing Gemini embeddings configuration
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GEMINI_API_KEY  # Pass the API key directly
    )
    
    vectorstore = FAISS.from_documents(documents, embedding_model)
    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        temperature=0.2,
        google_api_key=GEMINI_API_KEY  # Pass the API key directly
    )
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
    return df, qa_chain

# Load lawyer data once at startup
lawyer_df, lawyer_qa_chain = load_lawyer_data()

# Proper LangChain-compatible Embeddings class
class GeminiEmbeddings(Embeddings):
    def __init__(self):
        self.model = "gemini-embedding-exp-03-07"
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple texts using Gemini"""
        try:
            embeddings = []
            for text in texts:
                response = genai.embed_content(
                    model=self.model,
                    content=text,
                    task_type="retrieval_document"
                )
                embeddings.append(response["embedding"])
            return embeddings
        except Exception as e:
            logger.error(f"Embedding Error: {e}")
            raise
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query using Gemini"""
        try:
            response = genai.embed_content(
                model=self.model,
                content=text,
                task_type="retrieval_query"
            )
            return response["embedding"]
        except Exception as e:
            logger.error(f"Embedding Query Error: {e}")
            raise
    
    # Make the class callable for backward compatibility
    def __call__(self, text: str) -> List[float]:
        return self.embed_query(text)

# Initialize Gemini models
gemini_embeddings = GeminiEmbeddings()
gemini_chat = genai.GenerativeModel('gemini-2.5-flash')

class GeminiWrapper:
    def __init__(self, model):
        self.model = model
    
    def run(self, input_documents: List[str], question: str) -> str:
        try:
            context = "\n".join(input_documents)
            prompt = f"""
            **Role:** You are a legal assistant. Answer based ONLY on the given context.
            Answer should be well in points and proper format
            
            **Context:**
            {context}
            
            **Question:**
            {question}
            
            **Answer:**
            """
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini Error: {e}")
            raise "Failed to generate answer. Please try again."
        
    def ans(self, question: str) -> str:
        try:
            prompt = f"""
            **Role:** You are a legal assistant. Provide Legal response ONLY.
            Answer should be well in points and proper format
            
            **Question:**
            {question}
            """
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini Error : {e}")
            raise HTTPException(status_code=500, detail="Failed to answer question")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_pdf/")
async def process_pdf(
    file: UploadFile = File(...),
    query: str = Form(...),
    translation_language: str = Form(None)
):
    try:
        # Read and extract text from PDF
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        raw_text = ''.join([page.extract_text() or "" for page in pdf_reader.pages])
        logger.info("File successfully read")
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no readable text")

        # Split text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,  # Increase chunk size (fewer API calls)
            chunk_overlap=200
        )
        texts = text_splitter.split_text(raw_text)
        logger.info(f"Text split into {len(texts)} chunks")
        
        if not texts:
            raise HTTPException(status_code=400, detail="Text splitting failed")

        # Create FAISS vectorstore with Gemini embeddings
        docsearch = FAISS.from_texts(
            texts=texts,
            embedding=gemini_embeddings
        )
        docs = docsearch.similarity_search(query, k=3)
        logger.info("Embeddings generated and documents searched")

        # Get answer from Gemini
        llm_chain = GeminiWrapper(gemini_chat)
        answer = llm_chain.run(
            input_documents=[doc.page_content for doc in docs],
            question=query
        )
        logger.info("Answer generated")
            
        # Use pre-loaded lawyer data
        query = "provide one best lawyer for this case , do not answer anything except the name , the response should be strictly of format 'name = NAME_OF_LAWYER' nothing else : " + answer[0:2000]
        answer2 = lawyer_qa_chain.invoke({"query": query})

        print("Bot:", answer2)

        lawName = answer2['result'].split('=')[1].strip() 
        lawNameObj = lawyer_df[lawyer_df['Name']==lawName]
        lawResp = json.loads(lawNameObj.to_json(orient='records'))
        print(lawResp)
        return JSONResponse(content={"answer": answer, "lawyer": lawResp[0]})

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Processing failed")
        raise HTTPException(status_code=500, detail=str(e))






##
##
###
####
@app.post("/get_lawyers/")
async def get_lawyers(
    domain: str = Form(...),
    location: str = Form(...),
    experience: int = Form(...)
):
    try:
        location = location.strip().title()
        domain = domain.strip().title()
        df = pd.read_csv('lawyer.csv')
        df['Experience_Years'] = df['Experience'].str.extract(r'(\d+)').astype(int)

        filtered = df[
            (df['City'] == location) &
            (df['Specialization'] == domain) &
            (df['Experience_Years'] >= experience)
        ]

        print(filtered)
        response_data = json.loads(filtered.to_json(orient='records'))
        return JSONResponse(content={'lawyers': response_data})
    except Exception as e:
        print("Error Occured")
        return JSONResponse(content={'error': str(e)}, status_code=500)


class TranslationRequest(BaseModel):
    text: str
    target_lang: str  # language code like 'hi', 'en'

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str

# Initialize translator
translator = Translator()

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    try:
        # Validate target language
        if request.target_lang not in LANGUAGES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported language code. Supported codes: {list(LANGUAGES.keys())}"
            )

        # Perform translation (synchronous operation)
        translation = await translator.translate(
            request.text,
            dest=request.target_lang
        )

        return {
            "original_text": request.text,
            "translated_text": translation.text,
            "source_lang": translation.src,
            "target_lang": translation.dest
        }

    except Exception as e:
        logging.error(f"Translation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )
    

class QuestionRequest(BaseModel):
    question: str

@app.post("/getanswer")
async def getAnswer(request: QuestionRequest):
    try:
        llm_chain = GeminiWrapper(gemini_chat)
        answer = llm_chain.ans(
            question= request.question
        )
        return {"answer": answer}
    except Exception as e:
        logging.error(f"Error getting answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
