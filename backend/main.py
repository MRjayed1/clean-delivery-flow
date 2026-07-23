from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from chatbot.chatbot_service import ChatbotService

# Load environment variables
load_dotenv()

app = FastAPI(title="Clean Delivery Flow Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot service
chatbot_service = ChatbotService()


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    response: str


@app.get("/")
async def root():
    return {"message": "Clean Delivery Flow Chatbot API", "status": "online"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = chatbot_service.get_response(request.message, request.conversation_history)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/intents")
async def get_intents():
    return {"intents": chatbot_service.excel_processor.get_all_intents()}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "llm_connected": chatbot_service.client is not None}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
