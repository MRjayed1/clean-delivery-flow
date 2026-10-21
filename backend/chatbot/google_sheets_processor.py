"""
GoogleSheetsProcessor — Replaces ExcelProcessor as the chatbot knowledge base source.

Reads structured data from a Google Sheet with columns: Category | Question | Answer.
Provides in-memory caching with configurable TTL and background refresh.
Falls back to hardcoded defaults if Google Sheets is unavailable.
"""

import os
import time
import threading
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


class GoogleSheetsProcessor:
    """
    Loads and caches chatbot knowledge from a Google Sheet.

    Expected sheet format (3 columns):
        Category    | Question           | Answer
        --------    | --------           | ------
        Greeting    | hello              | Hello! Welcome to LaundryOps...
        14-Day Rule | What is the rule?  | Every property must have...

    The processor supports:
    - Service account authentication via JSON credentials file or env var
    - In-memory caching with configurable TTL (default 300s / 5 min)
    - Thread-safe background refresh
    - Graceful fallback to cached data, then hardcoded defaults
    - Keyword-based matching with category-scoped search
    """

    @staticmethod
    def _clean_sheet_id(raw_id: str) -> str:
        """Extract clean Google Sheet ID from URL or ID string with fragment/params."""
        if not raw_id:
            return ""
        s = raw_id.strip()
        if "/d/" in s:
            s = s.split("/d/")[1].split("/")[0]
        if "#" in s:
            s = s.split("#")[0]
        if "?" in s:
            s = s.split("?")[0]
        return s.strip()

    def __init__(self):
        # Google Sheets configuration from environment
        raw_id = os.getenv("GOOGLE_SHEETS_ID", "")
        self.sheet_id: str = self._clean_sheet_id(raw_id)
        self.credentials_path: str = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials/service_account.json")
        self.cache_ttl: int = int(os.getenv("SHEET_CACHE_TTL", "300"))  # seconds

        # In-memory knowledge base: flat dict (intent -> response) for backward compat
        self.knowledge_base: Dict[str, str] = {}

        # Structured knowledge: category -> list of (question, answer) tuples
        self._structured_kb: Dict[str, List[Tuple[str, str]]] = {}

        # Cache metadata
        self._last_refresh: float = 0.0
        self._is_refreshing: bool = False
        self._lock: threading.Lock = threading.Lock()

        # Attempt initial load
        self._initial_load()

    # ------------------------------------------------------------------
    # Initialization
    # ------------------------------------------------------------------

    def _initial_load(self) -> None:
        """Try loading from Google Sheets; fall back to defaults on failure."""
        try:
            self._refresh_from_sheets()
            logger.info(
                "Google Sheets knowledge base loaded: %d entries across %d categories",
                len(self.knowledge_base),
                len(self._structured_kb),
            )
        except Exception as e:
            logger.warning("Failed to load Google Sheets on startup: %s. Using defaults.", e)
            self._load_default_knowledge_base()

    # ------------------------------------------------------------------
    # Google Sheets fetching
    # ------------------------------------------------------------------

    def _get_gspread_client(self):
        """
        Create an authenticated gspread client using service account credentials.

        Supports two modes:
        1. GOOGLE_CREDENTIALS_PATH — path to a JSON key file on disk
        2. GOOGLE_CREDENTIALS_JSON — raw JSON string (for cloud deployments
           where you inject the secret as an env var)
        """
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ]

        # Prefer raw JSON env var (cloud-friendly) over file path
        raw_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
        if raw_json:
            import json
            info = json.loads(raw_json)
            creds = Credentials.from_service_account_info(info, scopes=scopes)
        else:
            creds = Credentials.from_service_account_file(self.credentials_path, scopes=scopes)

        return gspread.authorize(creds)

    def _refresh_from_sheets(self) -> None:
        """
        Fetch all rows from the Google Sheet and rebuild the knowledge base.

        Expected columns: Category (A) | Question (B) | Answer (C)
        The first row is treated as a header and skipped.
        """
        if not self.sheet_id:
            raise ValueError("GOOGLE_SHEETS_ID environment variable is not set")

        client = self._get_gspread_client()
        spreadsheet = client.open_by_key(self.sheet_id)
        worksheet = spreadsheet.sheet1  # Use the first worksheet

        # Use get_all_values() to avoid crashes caused by empty trailing header columns
        rows = worksheet.get_all_values()
        if not rows or len(rows) < 2:
            raise ValueError("Google Sheet is empty or missing data rows (expected header row + at least 1 data row)")

        # Map column indices by lowercased header names
        header = [str(h).strip().lower() for h in rows[0]]
        cat_idx = header.index("category") if "category" in header else 0
        q_idx = header.index("question") if "question" in header else 1
        a_idx = header.index("answer") if "answer" in header else 2

        new_kb: Dict[str, str] = {}
        new_structured: Dict[str, List[Tuple[str, str]]] = {}

        for row in rows[1:]:
            if not row:
                continue
            category = row[cat_idx].strip() if len(row) > cat_idx else ""
            question = row[q_idx].strip() if len(row) > q_idx else ""
            answer = row[a_idx].strip() if len(row) > a_idx else ""

            # Skip empty question or answer rows
            if not question or not answer:
                continue

            # Flat knowledge base (backward compatible with ExcelProcessor)
            intent_key = question.lower()
            new_kb[intent_key] = answer

            # Structured knowledge base (category-aware)
            if not category:
                category = "General"
            if category not in new_structured:
                new_structured[category] = []
            new_structured[category].append((question.lower(), answer))

        if not new_kb:
            raise ValueError("Google Sheet returned no valid rows containing Question and Answer")

        # Thread-safe swap
        with self._lock:
            self.knowledge_base = new_kb
            self._structured_kb = new_structured
            self._last_refresh = time.time()

    # ------------------------------------------------------------------
    # Cache management
    # ------------------------------------------------------------------

    def is_cache_stale(self) -> bool:
        """Check if the cached data has exceeded the TTL."""
        return (time.time() - self._last_refresh) > self.cache_ttl

    def refresh_if_stale(self) -> None:
        """Trigger a background refresh if cache is stale. Non-blocking."""
        if self.is_cache_stale() and not self._is_refreshing:
            thread = threading.Thread(target=self._background_refresh, daemon=True)
            thread.start()

    def force_refresh(self) -> dict:
        """
        Synchronously refresh the knowledge base from Google Sheets.
        Returns a status dict for the API response.
        """
        try:
            self._refresh_from_sheets()
            return {
                "status": "success",
                "entries": len(self.knowledge_base),
                "categories": len(self._structured_kb),
                "last_refresh": self._last_refresh,
            }
        except Exception as e:
            logger.error("Force refresh failed: %s", e)
            return {"status": "error", "detail": str(e)}

    def _background_refresh(self) -> None:
        """Background thread target for non-blocking cache refresh."""
        self._is_refreshing = True
        try:
            self._refresh_from_sheets()
            logger.info("Background refresh completed: %d entries", len(self.knowledge_base))
        except Exception as e:
            logger.warning("Background refresh failed: %s. Keeping stale cache.", e)
        finally:
            self._is_refreshing = False

    def get_cache_status(self) -> dict:
        """Return cache metadata for monitoring endpoints."""
        return {
            "entries": len(self.knowledge_base),
            "categories": len(self._structured_kb),
            "category_names": list(self._structured_kb.keys()),
            "last_refresh": self._last_refresh,
            "cache_ttl": self.cache_ttl,
            "is_stale": self.is_cache_stale(),
            "is_refreshing": self._is_refreshing,
        }

    # ------------------------------------------------------------------
    # Knowledge base matching
    # ------------------------------------------------------------------

    def _stem_word(self, word: str) -> str:
        """Basic stemming for matching plurals, gerunds, and word variations."""
        w = word.lower().strip("?,!.:;\"'()")
        if len(w) <= 3:
            return w
        if w.endswith("services"):
            return "servic"
        if w.endswith("ies") and len(w) > 4:
            return w[:-3] + "y"
        if w.endswith("ing") and len(w) > 4:
            return w[:-3]
        if w.endswith("es") and len(w) > 4:
            return w[:-2]
        if w.endswith("s") and len(w) > 3:
            return w[:-1]
        return w

    def find_matching_response(self, user_message: str) -> Optional[str]:
        """
        Find the best matching response from the knowledge base.

        Matching strategy (ordered by priority):
        1. Exact match on the full question or intent key
        2. Alias & intent phrase matching (handles variations like "service", "pricing", "open hours")
        3. Partial substring matching
        4. Stemmed keyword overlap with chat slang filtering

        Triggers a background refresh if cache is stale.
        """
        # Kick off async refresh if needed (non-blocking)
        self.refresh_if_stale()

        user_clean = user_message.lower().strip("?,!.:;\"'() ")

        # --- 1. Exact match ---
        if user_clean in self.knowledge_base:
            return self.knowledge_base[user_clean]

        # --- 2. Intent Alias & Key Keyword Mapping ---
        INTENT_ALIASES: Dict[str, List[str]] = {
            "services": ["service", "services", "offer", "offers", "offering", "offerings", "provide", "provides", "providing", "clean", "cleaning", "dry cleaning", "laundry", "wash", "washing"],
            "pricing": ["price", "prices", "pricing", "cost", "costs", "rate", "rates", "charge", "charges", "fee", "fees", "how much", "expensive", "cheap", "payment plan"],
            "hours": ["hour", "hours", "time", "times", "timing", "timings", "open", "opening", "close", "closing", "schedule", "when are you open", "operating hours"],
            "contact": ["contact", "phone", "email", "mail", "call", "reach", "number", "support", "location", "address", "helpdesk", "human", "agent"],
            "greeting": ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "sup", "yo"],
            "order status": ["track", "tracking", "status", "order", "orders", "where is my", "where is", "check order"],
            "payment": ["pay", "payment", "payments", "card", "cards", "billing", "credit", "debit", "cash", "paypal"],
            "cancel order": ["cancel", "cancellation", "cancelling", "abort", "stop order"],
            "14-day rule": ["14 day", "14-day", "14 days", "rule", "policy", "deadline", "overdue rule"],
            "collection": ["collection", "collections", "pickup", "pick up", "delivery"],
            "running": ["running collection", "active collection", "processing"],
            "upcoming": ["upcoming collection", "scheduled pickup", "future collection"],
            "overdue": ["overdue collection", "late collection", "past deadline"],
        }

        # Check explicit alias match first
        for intent_key, aliases in INTENT_ALIASES.items():
            if intent_key in self.knowledge_base or any(k.lower() == intent_key for k in self.knowledge_base):
                actual_key = intent_key if intent_key in self.knowledge_base else next(k for k in self.knowledge_base if k.lower() == intent_key)
                for alias in aliases:
                    # Match alias as standalone word or phrase in user message
                    if alias in user_clean.split() or alias in user_clean:
                        return self.knowledge_base[actual_key]

        # --- 3. Partial match (question appears in user message or vice versa) ---
        best_match: Optional[str] = None
        best_score: int = 0

        for intent, response in self.knowledge_base.items():
            if intent == "default":
                continue

            intent_lower = intent.lower()

            # Check if the intent key appears within the user message
            if intent_lower in user_clean:
                match_score = len(intent_lower)
                if match_score > best_score:
                    best_score = match_score
                    best_match = response

            # Check if user message appears within the intent key
            elif user_clean in intent_lower:
                match_score = len(user_clean)
                if match_score > best_score:
                    best_score = match_score
                    best_match = response

        if best_match and best_score >= 3:  # Minimum 3-char overlap to avoid false matches
            return best_match

        # --- 4. Stemmed Keyword overlap ---
        stop_words = {
            "a", "an", "the", "is", "are", "was", "were", "what", "how", "do", "does", "did",
            "can", "could", "would", "should", "i", "you", "u", "ur", "your", "my", "to", "in",
            "of", "and", "or", "for", "it", "this", "that", "with", "on", "at", "by", "about",
            "please", "pls", "plz", "me", "tell", "know", "want", "need", "help", "have", "has",
            "had", "be", "been", "get", "got", "show", "list", "give", "us", "we", "any", "some"
        }
        user_words = [w for w in user_clean.split() if w not in stop_words]
        stemmed_user_words = set(self._stem_word(w) for w in user_words)

        if stemmed_user_words:
            best_keyword_match: Optional[str] = None
            best_keyword_score: float = 0.0

            for intent, response in self.knowledge_base.items():
                if intent == "default":
                    continue
                intent_words = [w for w in intent.lower().split() if w not in stop_words]
                stemmed_intent_words = set(self._stem_word(w) for w in intent_words)
                if not stemmed_intent_words:
                    continue

                overlap = stemmed_user_words & stemmed_intent_words
                if overlap:
                    # Score by fraction of intent words matched or user words matched
                    score = len(overlap) / min(len(stemmed_intent_words), len(stemmed_user_words))
                    if score > best_keyword_score:
                        best_keyword_score = score
                        best_keyword_match = response

            # Require at least 40% keyword overlap with stemmed words
            if best_keyword_match and best_keyword_score >= 0.4:
                return best_keyword_match

        return None

    # ------------------------------------------------------------------
    # Context helpers (used by ChatbotService for LLM prompts)
    # ------------------------------------------------------------------

    def get_relevant_context(self, user_message: str, max_categories: int = 5) -> str:
        """
        Return a formatted subset of the knowledge base relevant to the user's question.
        Used for injecting context into LLM prompts without sending the entire KB.

        This reduces token usage and improves response quality.
        """
        user_msg = user_message.lower()
        scored_categories: List[Tuple[float, str, List[Tuple[str, str]]]] = []

        for category, pairs in self._structured_kb.items():
            # Score each category by how well it matches the user message
            score = 0.0
            cat_lower = category.lower()

            # Category name appears in user message
            if cat_lower in user_msg:
                score += 3.0

            # Check keyword overlap with questions in this category
            for question, _ in pairs:
                q_words = set(question.split())
                u_words = set(user_msg.split())
                overlap = q_words & u_words
                score += len(overlap) * 0.5

            if score > 0:
                scored_categories.append((score, category, pairs))

        # Sort by relevance score descending, take top N
        scored_categories.sort(key=lambda x: x[0], reverse=True)
        top_categories = scored_categories[:max_categories]

        # If no categories matched, return all (capped) for general context
        if not top_categories:
            all_items = list(self._structured_kb.items())[:max_categories]
            top_categories = [(0, cat, pairs) for cat, pairs in all_items]

        # Format for injection into LLM system prompt
        lines = []
        for _, category, pairs in top_categories:
            lines.append(f"\n## {category}")
            for question, answer in pairs:
                lines.append(f"Q: {question}")
                lines.append(f"A: {answer}")
                lines.append("")

        return "\n".join(lines)

    def get_all_context(self) -> str:
        """Return the entire knowledge base formatted for LLM context (used as fallback)."""
        lines = []
        for category, pairs in self._structured_kb.items():
            lines.append(f"\n## {category}")
            for question, answer in pairs:
                lines.append(f"Q: {question}")
                lines.append(f"A: {answer}")
                lines.append("")
        return "\n".join(lines) if lines else self._format_flat_kb()

    def _format_flat_kb(self) -> str:
        """Format flat knowledge base (backward compat fallback)."""
        return "\n".join(f"- {k}: {v}" for k, v in self.knowledge_base.items())

    def get_all_intents(self) -> List[str]:
        """Get all available intent keys (backward compatible with ExcelProcessor)."""
        return list(self.knowledge_base.keys())

    # ------------------------------------------------------------------
    # Default fallback
    # ------------------------------------------------------------------

    def _load_default_knowledge_base(self) -> None:
        """
        Load hardcoded defaults if Google Sheets is unavailable.
        These mirror the original ExcelProcessor defaults so the chatbot
        remains functional even without a network connection.
        """
        self.knowledge_base = {
            "greeting": "Hello! Welcome to LaundryOps. How can I assist you today?",
            "hello": "Hi there! How can I help you with your laundry needs?",
            "hi": "Hello! Welcome to LaundryOps. How can I assist you today?",
            "hours": "Our working hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 3:00 PM.",
            "pricing": "For pricing information, please visit our pricing page or contact our support team at support@laundryops.com.",
            "services": "We offer laundry cleaning, dry cleaning, pickup and delivery services for Airbnb property management.",
            "contact": "You can reach us at support@laundryops.com or call us at +1 (305) 555-0000.",
            "order status": "Please check your order status in your dashboard under Collections.",
            "14-day rule": "Every property must have its laundry collected within 14 days of the last delivery. Properties exceeding this become overdue.",
            "collection": "Collections represent laundry pickup and delivery jobs. They can be Running (active), Upcoming (scheduled), or Overdue (past 14-day deadline).",
            "running": "Running collections are laundry jobs currently in the active cycle — picked up and being processed.",
            "upcoming": "Upcoming collections are scheduled future pickups that haven't started yet.",
            "overdue": "Overdue collections have exceeded the 14-day rule and need immediate attention.",
            "cancel order": "To cancel an order, please contact our support team at least 2 hours before the scheduled pickup.",
            "payment": "We accept all major credit cards, debit cards, and online payments.",
            "default": "I'm sorry, I didn't understand that. Could you please rephrase or ask another question? You can also contact our support team at support@laundryops.com.",
        }

        # Build structured KB from defaults
        self._structured_kb = {
            "General": [(k, v) for k, v in self.knowledge_base.items() if k in ("greeting", "hello", "hi", "hours", "contact", "default")],
            "Services": [(k, v) for k, v in self.knowledge_base.items() if k in ("services", "pricing", "payment")],
            "Collections": [(k, v) for k, v in self.knowledge_base.items() if k in ("collection", "running", "upcoming", "overdue", "14-day rule", "order status", "cancel order")],
        }
        self._last_refresh = time.time()

        logger.info("Loaded default knowledge base: %d entries", len(self.knowledge_base))
