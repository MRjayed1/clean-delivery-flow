"""
ChatbotService — Core orchestration layer for the LaundryOps AI assistant.

Workflow:
1. User message arrives
2. Check Google Sheets knowledge base for a direct match
3. If found → return immediately (no LLM call, saves cost)
4. If not found → build a targeted prompt using relevant KB context
5. Send to OpenRouter LLM with conversation history
6. Return LLM response (or graceful fallback on error)
"""

import os
import logging
from openai import OpenAI
from typing import Dict, List, Optional
from .google_sheets_processor import GoogleSheetsProcessor

logger = logging.getLogger(__name__)

# Maximum number of conversation history messages to send to the LLM.
# Keeps token usage bounded while preserving recent context.
MAX_HISTORY_MESSAGES = 10

# Maximum character length for the combined conversation history.
# Prevents excessively long prompts from blowing up token budgets.
MAX_HISTORY_CHARS = 3000


class ChatbotService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.model_name = os.getenv("MODEL_NAME", "mistralai/mistral-7b-instruct:free")
        self.client = None

        # --- CHANGE: Swap ExcelProcessor → GoogleSheetsProcessor ---
        # The GoogleSheetsProcessor is a drop-in replacement that:
        # - Uses the same knowledge_base dict and find_matching_response() interface
        # - Adds caching, background refresh, and structured category support
        self.sheets_processor = GoogleSheetsProcessor()

        if self.api_key:
            base_url = os.getenv("OPENROUTER_BASE_URL")
            if not base_url:
                if self.api_key.startswith("sk-or-"):
                    base_url = "https://openrouter.ai/api/v1"
                else:
                    base_url = "https://api.openai.com/v1"
                    if "mistral" in self.model_name:
                        self.model_name = "gpt-4o-mini"
            self.client = OpenAI(
                base_url=base_url,
                api_key=self.api_key,
            )

    def get_response(self, user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Get chatbot response — primary entry point.

        Priority chain:
        1. Google Sheets direct match → instant response, no LLM cost
        2. LLM with relevant KB context → intelligent generated response
        3. Hardcoded default → last resort fallback
        """
        # --- Step 1: Check knowledge base for direct match ---
        kb_response = self.sheets_processor.find_matching_response(user_message)
        if kb_response:
            logger.info("Direct KB match for: '%s'", user_message[:50])
            return kb_response

        # --- Step 2: Use LLM with context from knowledge base ---
        if self.client:
            return self._get_llm_response(user_message, conversation_history)

        # --- Step 3: Fallback when no LLM is configured ---
        logger.warning("No LLM client available, returning default response")
        return self.sheets_processor.knowledge_base.get("default",
            "I'm sorry, I couldn't understand that. Please try again or contact support at support@laundryops.com.")

    def _get_llm_response(self, user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Get response from OpenRouter LLM with knowledge base context.

        Improvements over the original:
        - Injects only RELEVANT categories instead of the entire KB (saves tokens)
        - Adds anti-hallucination guardrails in the system prompt
        - Includes support escalation instructions
        - Trims conversation history to stay within token limits
        """
        try:
            messages = []

            # --- Build system prompt with targeted context ---
            # get_relevant_context() scores categories by relevance to the user's
            # question and returns only the top matches, reducing token usage.
            relevant_context = self.sheets_processor.get_relevant_context(user_message)

            system_prompt = f"""You are the LaundryOps AI Assistant — a helpful, professional customer support agent for LaundryOps, a laundry logistics platform for Airbnb property management.

KNOWLEDGE BASE (use this as your primary source of truth):
{relevant_context}

RULES:
1. Answer ONLY based on the knowledge base above and the conversation context.
2. If the knowledge base contains the answer, use it directly — do not rephrase extensively.
3. If the answer is NOT in the knowledge base, say so honestly and suggest contacting support at support@laundryops.com or calling +1 (305) 555-0000.
4. NEVER invent information about pricing, policies, schedules, or procedures that is not in the knowledge base.
5. Be concise, friendly, and professional.
6. If the user seems frustrated or asks to speak to a human, provide the support contact information immediately.
7. For questions about specific orders, properties, or accounts, direct the user to check their dashboard or contact support with their details.

Keep responses under 150 words unless the question requires a detailed explanation."""

            messages.append({"role": "system", "content": system_prompt})

            # --- Add trimmed conversation history ---
            if conversation_history:
                trimmed = self._trim_history(conversation_history)
                messages.extend(trimmed)

            # --- Add current user message ---
            messages.append({"role": "user", "content": user_message})

            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=0.3,  # Lowered from 0.7 → less creative, more factual
                max_tokens=400,   # Lowered from 500 → more concise responses
            )

            response = completion.choices[0].message.content.strip()
            logger.info("LLM response generated for: '%s' (%d chars)", user_message[:50], len(response))
            return response

        except Exception as e:
            logger.error("Error calling LLM: %s", e)
            # Graceful fallback — don't crash, return a helpful message
            return self.sheets_processor.knowledge_base.get("default",
                "I'm having trouble connecting right now. Please try again later or contact support at support@laundryops.com.")

    def _trim_history(self, history: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Trim conversation history to fit within token budget.

        Strategy:
        - Keep only the most recent MAX_HISTORY_MESSAGES messages
        - Further trim if total character count exceeds MAX_HISTORY_CHARS
        - Always preserve the most recent messages (most relevant context)

        Why: Long conversation histories waste tokens and can cause the LLM
        to lose focus on the current question. Trimming keeps costs low
        and responses relevant.
        """
        # Take only the most recent messages
        trimmed = history[-MAX_HISTORY_MESSAGES:]

        # Further trim by character budget
        total_chars = 0
        result = []
        for msg in reversed(trimmed):
            msg_len = len(msg.get("content", ""))
            if total_chars + msg_len > MAX_HISTORY_CHARS:
                break
            result.insert(0, msg)
            total_chars += msg_len

        return result

    # ------------------------------------------------------------------
    # Convenience methods for API endpoints
    # ------------------------------------------------------------------

    def get_status(self) -> dict:
        """Return chatbot status for the /api/chat-status endpoint."""
        return {
            "llm_connected": self.client is not None,
            "model": self.model_name,
            "knowledge_base": self.sheets_processor.get_cache_status(),
        }

    def refresh_knowledge_base(self) -> dict:
        """Force refresh the Google Sheets knowledge base."""
        return self.sheets_processor.force_refresh()
