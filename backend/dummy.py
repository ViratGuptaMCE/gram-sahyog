import pandas as pd
import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document



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


print("\n Gemini RAG Chatbot Ready. Type your question or 'exit' to quit.")
while True:
    query = input("You:  ")
    if query.lower() in ["exit", "quit"]:
        break
    answer = qa_chain.invoke({"query": query})

    print("Bot:", answer['result'])