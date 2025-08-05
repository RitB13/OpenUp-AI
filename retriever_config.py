from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from utils.text_loader import load_documents, split_documents

def get_retriever():
    docs = load_documents()
    split_docs = split_documents(docs)

    # Use your fine-tuned model!
    embedding = HuggingFaceEmbeddings(model_name="./embedding_training/custom-wellness-embedder")
    vectordb = Chroma.from_documents(split_docs, embedding)
    
    retriever = vectordb.as_retriever(search_kwargs={"k": 2})
    return retriever
