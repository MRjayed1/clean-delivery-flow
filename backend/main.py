"""
FastAPI backend for LaundryOps Chatbot.

Endpoints:
    GET  /              — Root status message
    POST /api/chat      — Main chat endpoint (message + conversation history)
    GET  /api/intents   — List all knowledge base intent keys
    GET  /api/health    — Health check with LLM + cache status
    POST /api/refresh-sheet  — Force refresh Google Sheets knowledge base
    GET  /api/chat-status    — Detailed chatbot status and cache info
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import logging
from dotenv import load_dotenv
from chatbot.chatbot_service import ChatbotService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="LaundryOps Chatbot API")

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


# ------------------------------------------------------------------
# Existing endpoints (preserved)
# ------------------------------------------------------------------


@app.get("/")
async def root():
    return {"message": "LaundryOps Chatbot API", "status": "online"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = chatbot_service.get_response(request.message, request.conversation_history)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error("Chat endpoint error: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/intents")
async def get_intents():
    """Return all knowledge base intent keys."""
    return {"intents": chatbot_service.sheets_processor.get_all_intents()}


@app.get("/api/health")
async def health_check():
    """Health check — includes LLM status and knowledge base cache info."""
    cache_status = chatbot_service.sheets_processor.get_cache_status()
    return {
        "status": "healthy",
        "llm_connected": chatbot_service.client is not None,
        "knowledge_base_entries": cache_status["entries"],
        "cache_stale": cache_status["is_stale"],
    }


# ------------------------------------------------------------------
# New endpoints
# ------------------------------------------------------------------


@app.post("/api/refresh-sheet")
async def refresh_sheet():
    """
    Force refresh the Google Sheets knowledge base cache.

    Use this after updating the Google Sheet to immediately reflect
    new content without waiting for the automatic TTL-based refresh.

    Returns the refresh status including entry count and any errors.
    """
    result = chatbot_service.refresh_knowledge_base()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result.get("detail", "Refresh failed"))
    return result


@app.get("/api/chat-status")
async def chat_status():
    """
    Detailed chatbot status including LLM connection, model info,
    and knowledge base cache metadata (entries, categories, TTL, staleness).

    Useful for monitoring and debugging.
    """
    return chatbot_service.get_status()


# ------------------------------------------------------------------
# Entry point
# ------------------------------------------------------------------


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
