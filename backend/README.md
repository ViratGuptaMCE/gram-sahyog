# Gram Sahyog Niti Marg - Backend Service

This is the backend API service for **Gram Sahyog Niti Marg** (Rural Legal Help & Lawyer Matching Portal). It is built with **FastAPI** and integrates a local RAG (Retrieval-Augmented Generation) pipeline for document analysis and legal Q&A.

---

## Core Backend Integrations

1. **Sliding-Window Token Rate Limiting**:
   - Implemented custom `TokenRateLimiter` per client IP.
   - Limit: **10 requests/minute** for `/getanswer` (chat).
   - Limit: **5 requests/minute** for `/process_pdf/` (document uploads).
   - Protects backend API keys and prevents token exhaustion/rate errors.

2. **Hybrid Location Resolution Layer**:
   - Resolves user-entered locations dynamically using a Llama-3 model on Groq (`resolve_city_name_with_llm`).
   - Falls back to a custom **Levenshtein fuzzy distance algorithm** (requiring $\ge 75\%$ similarity) and a city synonyms dictionary.
   - Map states containing cities in the database (e.g., `"Bihar"` ➔ `"Patna"`) or common typos/synonyms (e.g., `"Mumbay"` or `"Bombay"` ➔ `"Mumbai"`) automatically.

3. **Conversational QA Session History**:
   - The `/getanswer` endpoint maintains in-memory session histories mapped to a unique `session_id`.
   - Concatenates the last 3 conversational turns (6 messages) to maintain chatbot context.

4. **Context-Aware Lawyer Recommendations**:
   - Dynamically parses chat queries for lawyer-related intent (e.g. keywords like `"lawyer"`, `"advocate"`, `"वकील"`, etc.).
   - If triggered, performs semantic similarity searches on the lawyer FAISS index and automatically injects matching profiles into the system prompt context.

5. **Optimized PDF Analysis (RAG) & OCR Fallback**:
   - Bypasses vector indexing for small documents (< 40,000 characters) for faster response times.
   - Chunk-splits and indexes large documents using a lightweight `FAISS` vector index on CPU for low-latency similarity queries.
   - Automatically detects unreadable/scanned PDFs and runs a server-side Tesseract OCR fallback using PyMuPDF and `pytesseract` (extracts up to 10 pages in Hindi and English).
   - Integrates with the frontend client-side OCR fallback: accepts pre-extracted text using the `extracted_text` Form-Data parameter if the server lacks native Tesseract binaries.

---

## Tech Stack & Libraries

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python web framework)
- **Vector Embeddings**: [HuggingFace sentence-transformers](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) (`all-MiniLM-L6-v2`) running locally on CPU.
- **Vector DB**: [FAISS](https://github.com/facebookresearch/faiss) (`faiss-cpu`) - a lightweight, fast local vector library that runs entirely on CPU without database locks or heavy container overhead.
- **Large Language Model**: [Groq Cloud API](https://groq.com/) with LangChain (`langchain-groq` utilizing `llama-3.3-70b-versatile`)
- **Text Extraction & PDF Reader**: [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/) (`pymupdf`/`fitz`) - replacing PyPDF2 for reduced memory consumption and better layout preservation.
- **OCR Engine**: [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) via `pytesseract` (for server-side fallback).
- **Data Handling**: `pandas` (manages the lawyer directory CSV)
- **Translation**: [deep-translator](https://github.com/nidhaloff/deep-translator) (replaces `googletrans` for robust translation)

---

## Directory Structure

```text
backend/
├── main.py                    # Main FastAPI application, endpoints & rate limiter
├── lawyer.csv                 # Advocate directory database
├── lawyer_faiss_index/        # Local FAISS index folder (auto-generated)
├── requirements.txt           # Python dependency declarations
├── .env                       # Backend environment variables
└── README.md                  # This documentation file
```

---

## Setup & Running Instructions

### Prerequisites

Make sure you have **Python 3.8+** installed.

### 1. Create and Activate Virtual Environment
From the `backend` directory:
```bash
# Create venv
python -m venv venv

# Activate venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory with the following variables:
```env
GROQ_API_KEY=your_groq_api_key_here
```
*Note: You can obtain a free Groq API key from [Groq Console](https://console.groq.com/).*

### 4. Run the Server
Start the development server using `uvicorn`:
```bash
uvicorn main:app --reload
```
The server will start at **`http://localhost:8000`**.

---

## API Endpoints

### 1. Process PDF & Match Lawyer
* **Endpoint**: `/process_pdf/`
* **Method**: `POST`
* **Rate Limit**: 5 requests/min per IP
* **Form-Data Params**:
  * `file`: (Binary PDF File)
  * `query`: (String) e.g., "What are the rules regarding property partition?"
  * `translation_language`: (Optional String) e.g., `"hi"`
  * `extracted_text`: (Optional String) Text extracted via client-side OCR fallback.
* **Response**:
  ```json
  {
    "answer": "Generated RAG legal explanation...",
    "lawyer": {
      "Name": "Advocate Nandita Sharma",
      "Location": "Rohini Court, Delhi",
      "Experience": "12 years Experience",
      "Specialization": "Property",
      "Image_Url": "...",
      "Rating": 4.8,
      "City": "Delhi",
      "Description": "..."
    }
  }
  ```

### 2. Get/Filter Lawyers
* **Endpoint**: `/get_lawyers/`
* **Method**: `POST`
* **Form-Data Params**:
  * `domain`: (String) e.g., `"Civil"`
  * `location`: (String) e.g., `"Bihar"` or `"Mumbay"`
  * `experience`: (Integer) e.g., `5`
* **Response**:
  ```json
  {
    "lawyers": [
      {
        "Name": "Advocate Ashvin Khillare",
        "City": "Mumbai",
        "Specialization": "Civil",
        "Experience": "6 years Experience",
        "Rating": 4.9,
        "Image_Url": "...",
        "Description": "..."
      }
    ]
  }
  ```
  *Note: The location field is processed by the hybrid resolution layer to match synonyms/typos/states.*

### 3. Language Translation
* **Endpoint**: `/translate`
* **Method**: `POST`
* **JSON Request Body**:
  ```json
  {
    "text": "Hello World",
    "target_lang": "hi"
  }
  ```
* **Response**:
  ```json
  {
    "original_text": "Hello World",
    "translated_text": "नमस्ते दुनिया",
    "source_lang": "en",
    "target_lang": "hi"
  }
  ```

### 4. Direct General Legal Q&A (Gramin Nyay Mitra)
* **Endpoint**: `/getanswer`
* **Method**: `POST`
* **Rate Limit**: 10 requests/min per IP
* **JSON Request Body**:
  ```json
  {
    "question": "Explain Article 21 of the Indian Constitution.",
    "session_id": "user-session-abc"
  }
  ```
* **Response**:
  ```json
  {
    "answer": "Article 21 provides that no person shall be deprived of his life..."
  }
  ```
