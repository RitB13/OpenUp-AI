from fastapi import FastAPI
from pydantic import BaseModel
from llm_config import load_llm
from retriever_config import get_retriever
from prompts.few_shot_examples import few_shot_examples
from fastapi.middleware.cors import CORSMiddleware
from utils.emotion_detector import detect_emotion
from langchain.memory import ConversationBufferWindowMemory
import os

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and retriever once
llm_pipeline = load_llm()
retriever = get_retriever()

# LangChain Conversation Memory 
memory = ConversationBufferWindowMemory(k=6, return_messages=False, memory_key="history", input_key="input")

# Ensure logs folder exists
os.makedirs("logs", exist_ok=True)

# Request schema
class ChatInput(BaseModel):
    user_input: str

@app.post("/chat")
async def chat(input_data: ChatInput):
    user_input = input_data.user_input

    # Detect emotion
    emotion = detect_emotion(user_input).strip().lower()  

    # Use tone instruction based on emotion
    tone_map = {
        "sadness": "Respond with warmth, support, and understanding.",
        "anger": "Validate the user's feelings and respond calmly.",
        "anxiety": "Respond reassuringly and suggest calming strategies.",
        "joy": "Celebrate the moment and encourage continued growth.",
        "neutral": "Maintain a supportive and grounded tone.",
    }
    tone_instruction = tone_map.get(emotion, "Respond with empathy.")

    # Choose matching few-shots
    few_shot_context = few_shot_examples.get(emotion, few_shot_examples["default"])

    # RAG Retrieval
    relevant_docs = retriever.invoke(user_input)  # Replaces deprecated get_relevant_documents
    retrieved_knowledge = "\n".join([doc.page_content for doc in relevant_docs])

    # Build context with emotion and tone
    emotion_context = f"User Emotion: {emotion}\n{tone_instruction}\n"
    rag_context = f"{emotion_context}Helpful therapeutic information:\n{retrieved_knowledge}"

    # Memory context (auto-updated by LangChain)
    past_convo = memory.load_memory_variables({}).get("history", "")

    # Final Prompt Construction
    full_input = (
    f"{rag_context}\n\n"
    f"{few_shot_context}\n"
    f"Conversation so far:\n{past_convo}\n"
    f"User: {user_input}\nTherapist:"
    )

    # LLM Response (Groq returns plain string)
    response = llm_pipeline.invoke(full_input)

    # Clean up response if it repeats the prefix
    if "Therapist:" in response:
        response = response.split("Therapist:")[-1].strip()

    # Update LangChain memory
    memory.save_context(
        {"input": user_input},
        {"output": response}
    )

    # Save to logs with emotion
    with open("logs/chat_history.txt", "a") as f:
        f.write(f"\nUser: {user_input}\nEmotion: {emotion}\nTherapist: {response}\n")

    return {"response": response, "emotion": emotion}
