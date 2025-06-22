# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.vectorstores import Chroma
# from deep_translator import GoogleTranslator
# import os
# import io
# import logging
# import numpy as np
# from azure.ai.inference import ChatCompletionsClient, EmbeddingsClient
# from azure.ai.inference.models import SystemMessage, UserMessage
# from azure.core.credentials import AzureKeyCredential
import pandas as pd
import json
# app = FastAPI()

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # GitHub AI Configuration
# endpoint = "https://models.github.ai/inference"
# model = "openai/gpt-4.1"
# token = "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"  # Get from environment variables

# # Initialize clients
# chat_client = ChatCompletionsClient(
#     endpoint=endpoint,
#     credential=AzureKeyCredential(token),
#     model=model
# )

# embeddings_client = EmbeddingsClient(
#     endpoint=endpoint,
#     credential=AzureKeyCredential(token),
#     model="text-embedding-ada-002"  # Verify correct model name
# )

# class GitHubAIEmbeddings:
#     def __init__(self, client):
#         self.client = client
    
#     def embed_documents(self, texts):
#         try:
#             # Corrected embedding call with proper parameter
#             response = self.client.embed(input=texts)
            
#             # Handle different response formats
#             if hasattr(response, 'data'):
#                 return [np.array(embedding.embedding) for embedding in response.data]
#             elif hasattr(response, 'embeddings'):
#                 return [np.array(embedding) for embedding in response.embeddings]
#             else:
#                 raise ValueError("Unexpected embedding response format")
#         except Exception as e:
#             logger.error(f"Embedding Error: {e}")
#             raise
    
#     def embed_query(self, text):
#         return self.embed_documents([text])[0]

# class GitHubAIWrapper:
#     def __init__(self, client):
#         self.client = client
    
#     def run(self, input_documents, question):
#         try:
#             context = "\n".join([doc.page_content for doc in input_documents])
#             messages = [
#                 SystemMessage(content="You are a legal assistant. Answer questions based on the provided documents."),
#                 UserMessage(content=f"Context:\n{context}\n\nQuestion: {question}")
#             ]
#             response = self.client.complete(messages=messages)
#             return response.choices[0].message.content
#         except Exception as e:
#             logger.error(f"Chat Error: {e}")
#             raise

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/process_pdf/")
# async def process_pdf(file: UploadFile = File(...), query: str = Form(...), translation_language: str = Form(None)):
#     try:
#         # Read and extract text from PDF
#         contents = await file.read()
#         pdf_reader = PdfReader(io.BytesIO(contents))
#         raw_text = ''.join([page.extract_text() or "" for page in pdf_reader.pages])
#         logger.info("File successfully read")
        
#         if not raw_text.strip():
#             raise HTTPException(status_code=400, detail="PDF contains no readable text")

#         # Split text
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=200
#         )
#         texts = text_splitter.split_text(raw_text)
#         logger.info(f"Text split into {len(texts)} chunks")
        
#         if not texts:
#             raise HTTPException(status_code=400, detail="Text splitting failed")

#         # Generate embeddings using GitHub AI
#         embeddings = GitHubAIEmbeddings(embeddings_client)
#         docsearch = Chroma.from_texts(texts, embeddings)
#         docs = docsearch.similarity_search(query, k=3)
#         logger.info("Embeddings generated and documents searched")

#         # Get answer from GitHub AI
#         github_chain = GitHubAIWrapper(chat_client)
#         answer = github_chain.run(input_documents=docs, question=query)
#         logger.info("Answer generated")

#         # Handle translation
#         if translation_language:
#             logger.info(f"Translating to {translation_language}")
#             try:
#                 translated_answer = GoogleTranslator(
#                     source='auto', 
#                     target=translation_language
#                 ).translate(answer)
#                 logger.info("Translation successful")
#                 return JSONResponse(content={
#                     "answer": answer,
#                     "translated_answer": translated_answer
#                 })
#             except Exception as e:
#                 logger.error(f"Translation error: {e}")
#                 return JSONResponse(content={"answer": answer, "error": str(e)})
        
#         return JSONResponse(content={"answer": answer})

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Processing failed")
#         raise HTTPException(status_code=500, detail=str(e))
# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.vectorstores import Chroma
# from deep_translator import GoogleTranslator
# import os
# import io
# import logging
# from sentence_transformers import SentenceTransformer  # Free embeddings
# from transformers import pipeline  # Free LLM (small models)
# from typing import List

# app = FastAPI()

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load free embedding model (Sentence Transformers)
# embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight & free

# # Load a free LLM (small but works offline)
# qa_pipeline = pipeline(
#     "text-generation",
#     model="mistralai/Mistral-7B-Instruct-v0.1",  # Free & decent
#     device="cpu"  # Use GPU if available ("cuda")
# )

# class FreeLLMWrapper:
#     def __init__(self, pipeline):
#         self.pipeline = pipeline
    
#     def run(self, input_documents: List[str], question: str) -> str:
#         try:
#             context = "\n".join(input_documents)
#             prompt = f"""
#             [INST] You are a helpful legal assistant. Answer based on the given context.
#             Context: {context}
#             Question: {question}
#             Answer: [/INST]
#             """
#             response = self.pipeline(
#                 prompt,
#                 max_new_tokens=150,
#                 temperature=0.7,
#                 do_sample=True
#             )
#             return response[0]['generated_text'].split("Answer:")[-1].strip()
#         except Exception as e:
#             logger.error(f"LLM Error: {e}")
#             raise

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/process_pdf/")
# async def process_pdf(
#     file: UploadFile = File(...),
#     query: str = Form(...),
#     translation_language: str = Form(None)
# ):
#     try:
#         # Read and extract text from PDF
#         contents = await file.read()
#         pdf_reader = PdfReader(io.BytesIO(contents))
#         raw_text = ''.join([page.extract_text() or "" for page in pdf_reader.pages])
#         logger.info("File successfully read")
        
#         if not raw_text.strip():
#             raise HTTPException(status_code=400, detail="PDF contains no readable text")

#         # Split text
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=200
#         )
#         texts = text_splitter.split_text(raw_text)
#         logger.info(f"Text split into {len(texts)} chunks")
        
#         if not texts:
#             raise HTTPException(status_code=400, detail="Text splitting failed")

#         # Generate embeddings (free Sentence Transformers)
#         embeddings = embedding_model.encode(texts)
#         docsearch = Chroma.from_texts(texts, embeddings)
#         docs = docsearch.similarity_search(query, k=3)
#         logger.info("Embeddings generated and documents searched")

#         # Get answer from free LLM
#         llm_chain = FreeLLMWrapper(qa_pipeline)
#         answer = llm_chain.run(input_documents=[doc.page_content for doc in docs], question=query)
#         logger.info("Answer generated")

#         # Handle translation
#         if translation_language:
#             logger.info(f"Translating to {translation_language}")
#             try:
#                 translated_answer = GoogleTranslator(
#                     source='auto', 
#                     target=translation_language
#                 ).translate(answer)
#                 logger.info("Translation successful")
#                 return JSONResponse(content={
#                     "answer": answer,
#                     "translated_answer": translated_answer
#                 })
#             except Exception as e:
#                 logger.error(f"Translation error: {e}")
#                 return JSONResponse(content={"answer": answer, "error": str(e)})
        
#         return JSONResponse(content={"answer": answer})

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Processing failed")
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googletrans import Translator, LANGUAGES
from typing import Optional

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from deep_translator import GoogleTranslator
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

# Configure Gemini

os.environ["GEMINI_API_KEY"] = "AIzaSyD__GHOuZ5dGpz0Wi8e4Jrx99DxzbVcevk"
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY")
print(GEMINI_API_KEY)
if not GEMINI_API_KEY:
    raise ValueError("Please set GEMINI_API_KEY environment variable")

genai.configure(api_key=GEMINI_API_KEY)

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
            logger.error(f"Embedding Error: {e}")
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
            chunk_size=1000,
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

        # Handle translation
        # if translation_language:
        #     logger.info(f"Translating to {translation_language}")
        #     try:
        #         translated_answer = GoogleTranslator(
        #             source='auto', 
        #             target=translation_language
        #         ).translate(answer)
        #         logger.info("Translation successful")
        #         return JSONResponse(content={
        #             "answer": answer,
        #             "translated_answer": translated_answer
        #         })
        #     except Exception as e:
        #         logger.error(f"Translation error: {e}")
        #         return JSONResponse(content={"answer": answer, "error": str(e)})
            
        # Lawyer Given
        os.environ["GOOGLE_API_KEY"] = "AIzaSyD__GHOuZ5dGpz0Wi8e4Jrx99DxzbVcevk"
        df = pd.read_csv("lawyer.csv")
        text = "\n".join(df.astype(str).fillna("").agg(" ".join, axis=1))
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_text(text)
        documents = [Document(page_content=t) for t in texts]
        embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = FAISS.from_documents(documents, embedding_model)


        llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-flash", temperature=0.2)
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
        
        query = "provide one best lawyer for this case , do not answer anything except the name , the response should be strictly of format 'name = NAME_OF_LAWYER' nothing else : " + answer[0:2000]
        answer2 = qa_chain.invoke({"query": query})

        print("Bot:", answer2)

        lawName = answer2['result'].split('=')[1].strip() 
        lawNameObj = df[df['Name']==lawName]
        lawResp = json.loads(lawNameObj.to_json(orient='records'))
        print(lawResp)
        return JSONResponse(content={"answer": answer, "lawyer" :lawResp[0] })

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Processing failed")
        raise HTTPException(status_code=500, detail=str(e))





# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# # from langchain.embeddings.openai import OpenAIEmbeddings
# # from langchain.llms import OpenAI
# from langchain_openai import OpenAIEmbeddings, OpenAI
# from langchain.vectorstores import FAISS
# from langchain.chains.question_answering import load_qa_chain
# from deep_translator import GoogleTranslator 
# import os
# import io
# import logging

# app = FastAPI()

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Set your OpenAI API key here
# os.environ["OPENAI_API_KEY"] = "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"

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Change this to the domain of your frontend in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/process_pdf/")
# async def process_pdf(file: UploadFile = File(...), query: str = Form(...), translation_language: str = Form(None)):
#     try:
#         # Read the uploaded file
#         contents = await file.read()
#         pdf_reader = PdfReader(io.BytesIO(contents))
#         print("File Read")

#         # Extract text from the PDF
#         raw_text = ''
#         for page in pdf_reader.pages:
#             text = page.extract_text()
#             if text:
#                 raw_text += text
        
#         # Split text into chunks
#         text_splitter = RecursiveCharacterTextSplitter(
#             separators=["\n\n", "\n", ".", "!", "?"],
#             chunk_size=1000,
#             chunk_overlap=200,
#             length_function=len
#         )
#         texts = text_splitter.split_text(raw_text)

#         # After text splitting, add validation:
#         if not texts or len(texts) == 0:
#             raise HTTPException(status_code=400, detail="No extractable text found in PDF")

#         # Generate embeddings with error handling
#         try:
#             embeddings = OpenAIEmbeddings()
#             document_search = FAISS.from_texts(texts, embeddings)
#             docs = document_search.similarity_search(query, k=1)  # Ensure k is reasonable
#         except Exception as e:
#             logger.error(f"FAISS Error: {e}")
#             raise HTTPException(status_code=500, detail=f"Vector store error: {str(e)}")

#         # Load QA chain and get answer
#         chain = load_qa_chain(OpenAI(), chain_type="stuff")
#         context = "You are a lawyer and provide assistance with legal questions."
#         prompt = f"Context: {context}\n\nQuestion: {query}\n\nPlease provide a detailed answer based on the given documents. Also Specify the next steps we can take to handle the issue."
#         answer = chain.run(input_documents=docs, question=prompt)

#         if translation_language!="en":
#             try:
#                 context_translation = f"Translate this legal answer to {translation_language}: {answer}"
#                 translated_answer = GoogleTranslator(source='auto', target=translation_language).translate(context_translation)
#                 print("you got it")
#                 # Postprocess translated answer (Optional)
#                 # Add any specific postprocessing logic here
                
#                 return JSONResponse(content={"answer": answer, "translated_answer": translated_answer})
#             except Exception as e:
#                 logger.error(f"Translation error: {e}")
#                 return JSONResponse(content={"answer": answer, "error": str(e)})
#         print("No translation ? ")
#         return JSONResponse(content={"answer": answer})

#     except Exception as e:
#         logger.error(f"Error processing request: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")


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