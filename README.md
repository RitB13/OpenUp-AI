# 🧠 OpenUp AI – Your AI-Powered Emotional Support Therapist 💬

OpenUp AI is an intelligent, emotion-aware, Retrieval-Augmented Generation (RAG) based mental wellness companion built with cutting-edge NLP technologies. This project combines LLMs, custom-trained sentence embeddings, and emotion detection to deliver empathetic, personalized, and context-aware therapeutic conversations.

---
main page.png

## 🔥 Why This Project Stands Out

✅ **Real-World Impact**: Tackles mental health with AI-driven empathy  
✅ **ML-Powered Intelligence**: Emotion detection, few-shot prompting, and semantic retrieval  
✅ **RAG Pipeline**: Combines LLMs with a fine-tuned semantic knowledge retriever  
✅ **Custom Embeddings**: Trained with wellness-paired sentence data for deep contextual understanding  
✅ **Scalable Architecture**: Built with FastAPI, LangChain, HuggingFace stack  
✅ **Frontend Integration Ready**: CORS-enabled and production-deployable  
✅ **Clean Logs + Memory**: Retains conversation context for personalized therapy  

---

## 🛠️ Tech Stack

| Layer              | Tech / Model                                     |
|-------------------|--------------------------------------------------|
| Language Model     | `llama3-70b-8192`                                |
| Embedding Model    | Custom fine-tuned `all-MiniLM-L6-v2`             |
| Emotion Detector   | `j-hartmann/emotion-english-distilroberta-base` |
| Vector DB          | Chroma DB (Local)                                |
| Frameworks         | FastAPI, LangChain                               |
| Deployment         | Uvicorn (Backend), GitHub                        |

---

## 🧠 Core Features

### 1. 🎯 Emotion Detection  
- Implements a fine-tuned sentiment classifier (`j-hartmann/emotion-english-distilroberta-base`) to detect emotions like **sadness**, **anger**, **anxiety**, **joy**, and more from user messages.  
- The detected emotion guides a **tone mapping system** that adjusts the assistant's response style — e.g., empathetic for sadness, calm for anger, celebratory for joy — ensuring emotionally intelligent communication.

### 2. 🔁 Contextual Memory  
- Maintains recent dialogue context using `ConversationBufferWindowMemory` from LangChain (with a window size of 6 messages).  
- Enables **multi-turn conversations** that feel consistent and human-like by remembering what the user said earlier and how they felt.

### 3. 📚 Retrieval-Augmented Generation (RAG)  
- Loads domain-specific `.txt` documents such as `anxiety_spike.txt`, `career_burnout.txt`, and others from a curated knowledge base.  
- Documents are chunked, embedded using a **custom fine-tuned semantic embedder** (`all-MiniLM-L6-v2`), and stored in **Chroma vector database**.  
- The top-2 semantically relevant documents are retrieved for every user input to enrich the model’s response with real therapeutic insights.

### 4. ✨ Few-Shot Prompting  
- Integrates **emotion-specific few-shot examples** into the prompt dynamically — for instance, using comforting examples for sadness or motivational ones for burnout.  
- This improves the quality of generation while keeping prompts concise and emotionally aligned.

### 5. 📊 LLM Response Generation  
- Uses a high-parameter **open-weight LLM (`llama3-70b-8192`)** to generate responses.  
- Each response is generated based on a rich prompt that includes:  
  - The user’s **emotion**,  
  - A matching **tone instruction**,  
  - **Few-shot examples**,  
  - **Contextual memory**, and  
  - **Relevant knowledge snippets**.  
- The final output is a response that is **empathetic**, **grounded in real information**, and **cohesive across multiple turns**.

---

## 📁 Project Structure
OpenUp-AI/
│
├── app.py 
├── llm_config.py 
├── retriever_config.py 
├── requirements.txt 
│
├── frontend/
│ ├── index.html 
│ ├── style.css 
│ └── app.js 
│
├── prompts/
│ └── few_shot_examples.py 
│ └── personality.py
│ └── prompt_templates.py
│
├── utils/
│ ├── emotion_detector.py 
│ ├── text_loader.py 
│ └── analyzer.py 
│
├── logs/
│ └── chat_history.txt 
│
├── embedding_training/
│ ├── fine_tune_embedder.py 
│ ├── wellness_pairs.csv 
│ └── custom-wellness-embedder/ 
│
├── config/
│ └── generation_config.py

## ⚡ TL;DR — System Flow

1. **User sends message** ➡️
2. **Emotion is detected** (via DistilRoBERTa) ➡️
3. **Therapist tone is adjusted** (based on emotion) ➡️
4. **Relevant documents** are retrieved using custom embeddings + Chroma ➡️
5. **Few-shot examples** are injected (emotion-specific) ➡️
6. **Prompt is built** (emotion + memory + RAG + few-shots) ➡️
7. **LLM (LLaMA3-70B)** generates response ➡️
8. **Response is saved** along with emotion log.

## 🧩 System Architecture

                   ┌──────────────────────────────┐
                   │         User Input           │
                   └────────────┬─────────────────┘
                                │
                                ▼
                   ┌──────────────────────────────┐
                   │      Emotion Detection       │ ◄── DistilRoBERTa
                   └────────────┬─────────────────┘
                                │
              ┌────────────────┴──────────────┐
              ▼                               ▼
    ┌──────────────────┐              ┌────────────────────┐
    │ Tone Instruction │              │ Few-Shot Selector  │
    └──────────────────┘              └────────┬───────────┘
                                              │
                                              ▼
                                ┌──────────────────────────────┐
                                │   Memory Buffer (LangChain)  │
                                └────────────┬─────────────────┘
                                             │
                                ┌────────────▼──────────────┐
                                │     Knowledge Retriever   │ ◄── Chroma DB + Embeddings
                                └────────────┬──────────────┘
                                             │
                                ┌────────────▼─────────────┐
                                │     Final Prompt Builder │
                                └────────────┬─────────────┘
                                             │
                                ┌────────────▼─────────────┐
                                │       LLM Generation     │ ◄── LLaMA3-70B
                                └────────────┬─────────────┘
                                             │
                                ┌────────────▼─────────────┐
                                │     Response + Logging   │
                                └──────────────────────────┘

📜 License

This project is open-sourced under the MIT License.

🙏 Acknowledgements
- HuggingFace for Emotion & SentenceTransformer models
- LangChain for their brilliant memory and RAG support
- Community mental health forums for inspiring the mission

## “Mental health is not a destination, but a process. This project is one step toward that journey.”
