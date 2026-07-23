import os
from openai import OpenAI
from typing import Dict, List, Optional
from .excel_processor import ExcelProcessor


class ChatbotService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.model_name = os.getenv("MODEL_NAME", "mistralai/mistral-7b-instruct:free")
        self.client = None
        self.excel_processor = ExcelProcessor()
        
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
            )

    def get_response(self, user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """Get chatbot response from knowledge base or LLM."""
        # First check knowledge base
        kb_response = self.excel_processor.find_matching_response(user_message)
        if kb_response:
            return kb_response
        
        # If no match, use LLM with context
        if self.client:
            return self._get_llm_response(user_message, conversation_history)
        
        # Fallback to default
        return self.excel_processor.knowledge_base.get("default", 
            "I'm sorry, I couldn't understand that. Please try again or contact support.")

    def _get_llm_response(self, user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """Get response from OpenRouter LLM."""
        try:
            messages = []
            
            # System prompt with knowledge base context
            system_prompt = f"""You are a helpful customer support assistant for Clean Delivery Flow, a laundry service.
            Use the following knowledge base to answer questions:
            
            KNOWLEDGE BASE:
            {self._format_knowledge_base()}
            
            Always be friendly, professional, and helpful. If you don't know the answer, guide the user to contact support.
            """
            
            messages.append({"role": "system", "content": system_prompt})
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=0.7,
                max_tokens=500,
            )
            
            return completion.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error calling LLM: {e}")
            return self.excel_processor.knowledge_base.get("default",
                "I'm having trouble connecting right now. Please try again later or contact support.")

    def _format_knowledge_base(self) -> str:
        """Format knowledge base for LLM prompt."""
        formatted = []
        for intent, response in self.excel_processor.knowledge_base.items():
            formatted.append(f"- {intent}: {response}")
        return "\n".join(formatted)
