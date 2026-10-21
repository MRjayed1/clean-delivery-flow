import pandas as pd
import os

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Example data in Intent | Response format
data = {
    "Intent": [
        "greeting",
        "hello",
        "hi",
        "how are you",
        "hours",
        "working hours",
        "opening hours",
        "pricing",
        "price",
        "cost",
        "services",
        "what services do you offer",
        "laundry service",
        "contact",
        "contact us",
        "phone number",
        "email",
        "order status",
        "track order",
        "where is my order",
        "cancel order",
        "cancel my order",
        "refund",
        "payment",
        "payment methods",
        "how to pay",
        "delivery",
        "delivery time",
        "pickup",
        "complaint",
        "problem",
        "issue",
        "thank you",
        "thanks",
        "goodbye",
        "bye",
        "default"
    ],
    "Response": [
        "Hello! Welcome to Clean Delivery Flow. How can I assist you today?",
        "Hi there! How can I help you with your laundry needs?",
        "Hello! Welcome to Clean Delivery Flow. How can I assist you today?",
        "I'm doing great, thank you for asking! How can I help you today?",
        "Our working hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 3:00 PM.",
        "Our working hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 3:00 PM.",
        "Our working hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 3:00 PM.",
        "For detailed pricing information, please visit our pricing page or contact our support team at support@laundryops.com. We offer competitive rates for all our laundry services.",
        "For detailed pricing information, please visit our pricing page or contact our support team at support@laundryops.com.",
        "For detailed pricing information, please visit our pricing page or contact our support team at support@laundryops.com.",
        "We offer comprehensive laundry services including: regular laundry cleaning, dry cleaning, express service, pickup and delivery, and commercial laundry solutions.",
        "We offer comprehensive laundry services including: regular laundry cleaning, dry cleaning, express service, pickup and delivery, and commercial laundry solutions.",
        "We offer regular laundry cleaning, dry cleaning, pickup and delivery services. Let us know what you need!",
        "You can reach us at support@laundryops.com or call us at +1 (305) 555-0000. Our team is here to help!",
        "You can reach us at support@laundryops.com or call us at +1 (305) 555-0000.",
        "Our phone number is +1 (305) 555-0000. Feel free to call us during working hours.",
        "You can email us at support@laundryops.com. We typically respond within 24 hours.",
        "Please check your order status in your dashboard. If you need further assistance, contact us with your order ID.",
        "You can track your order in your dashboard under 'My Orders'. Need help? Contact us with your order ID.",
        "Please log in to your dashboard to check your order status, or contact us with your order number for assistance.",
        "To cancel an order, please contact our support team at least 2 hours before the scheduled pickup time. Cancellation policies may apply.",
        "To cancel an order, please contact our support team at least 2 hours before the scheduled pickup time.",
        "For refund inquiries, please contact our support team at support@laundryops.com with your order details.",
        "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and online payment methods including PayPal.",
        "We accept all major credit cards, debit cards, and online payments.",
        "You can pay securely online through our website or app using your preferred payment method.",
        "Delivery times typically range from 24-48 hours. Express service is available for same-day delivery in select areas.",
        "Standard delivery is 24-48 hours. Express service is available for urgent needs.",
        "We offer convenient pickup services from your location. Schedule a pickup through your dashboard or contact us.",
        "We apologize for any inconvenience. Please contact our support team at support@laundryops.com with details of your complaint, and we'll resolve it promptly.",
        "I'm sorry to hear you're having a problem. Please contact us with details, and we'll help resolve it.",
        "We're here to help! Please describe the issue, or contact our support team for immediate assistance.",
        "You're welcome! If you need any further assistance, feel free to ask anytime.",
        "You're very welcome! Have a great day!",
        "Goodbye! Thank you for choosing Clean Delivery Flow. Have a wonderful day!",
        "Bye! We look forward to serving you again soon.",
        "I'm sorry, I didn't understand that. Could you please rephrase or ask another question? You can also contact our support team at support@laundryops.com."
    ]
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to Excel
excel_path = "data/chatbot_data.xlsx"
df.to_excel(excel_path, index=False)

print(f"Example Excel file created successfully at: {excel_path}")
print(f"Total intents: {len(df)}")
print("\nYou can replace this file with your own Excel file in the same format (Intent | Response)")
