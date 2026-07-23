import pandas as pd
from typing import Dict, List, Optional


class ExcelProcessor:
    def __init__(self, excel_path: str = "data/chatbot_data.xlsx"):
        self.excel_path = excel_path
        self.knowledge_base: Dict[str, str] = {}
        self.load_knowledge_base()

    def load_knowledge_base(self) -> None:
        """Load intent-response pairs from Excel file."""
        try:
            df = pd.read_excel(self.excel_path)
            if "Intent" in df.columns and "Response" in df.columns:
                for _, row in df.iterrows():
                    intent = str(row["Intent"]).strip().lower()
                    response = str(row["Response"]).strip()
                    if intent and response:
                        self.knowledge_base[intent] = response
            else:
                raise ValueError("Excel file must have 'Intent' and 'Response' columns")
        except FileNotFoundError:
            print(f"Warning: {self.excel_path} not found. Using default responses.")
            self._load_default_knowledge_base()
        except Exception as e:
            print(f"Error loading Excel: {e}")
            self._load_default_knowledge_base()

    def _load_default_knowledge_base(self) -> None:
        """Load default knowledge base if Excel file not found."""
        self.knowledge_base = {
            "greeting": "Hello! Welcome to Clean Delivery Flow. How can I assist you today?",
            "hours": "Our working hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 3:00 PM.",
            "pricing": "For pricing information, please visit our pricing page or contact our support team at support@laundryops.com.",
            "services": "We offer laundry cleaning, dry cleaning, pickup and delivery services. Let us know what you need!",
            "contact": "You can reach us at support@laundryops.com or call us at +1 (305) 555-0000.",
            "order status": "Please check your order status in your dashboard or contact us with your order ID.",
            "cancel order": "To cancel an order, please contact our support team at least 2 hours before the scheduled pickup.",
            "payment": "We accept all major credit cards, debit cards, and online payments.",
            "default": "I'm sorry, I didn't understand that. Could you please rephrase or ask another question?"
        }

    def find_matching_response(self, user_message: str) -> Optional[str]:
        """Find the best matching response from knowledge base."""
        user_message_lower = user_message.lower()
        
        # Exact match first
        if user_message_lower in self.knowledge_base:
            return self.knowledge_base[user_message_lower]
        
        # Partial match
        for intent, response in self.knowledge_base.items():
            if intent in user_message_lower or any(word in user_message_lower for word in intent.split()):
                return response
        
        return None

    def get_all_intents(self) -> List[str]:
        """Get all available intents."""
        return list(self.knowledge_base.keys())
