# EasyLaundry - Laundry Management System & AI Support

> A modern, end-to-end laundry management platform featuring an operations dashboard, customer service workflow, order tracking, and an intelligent AI chatbot assistant.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-blue?style=for-the-badge)](https://clean-delivery-flow.vercel.app/)

---

## Live Demo

🔗 **Live Application:** [https://clean-delivery-flow.vercel.app/](https://clean-delivery-flow.vercel.app/)

---

## How This Was Built

Honesty and attribution in engineering:
- **Scaffold Origin:** This project originated from a Lovable scaffold, which generated the initial UI layouts and administrative pages (Admin, Collections, Properties, and Companies).
- **Custom Engineering & Extensions:**
  - **AI Chatbot Backend:** Architected and implemented a custom FastAPI backend integrating OpenRouter LLM with a live Google Sheets knowledge base (`gspread`) featuring TTL caching and thread-safe background sync.
  - **Customer-Facing Features:** Developed the customer storefront, service catalog, cart drawer, checkout modal, and real-time order tracking (`/track-order`, `/customer-services`, `/customer-orders`).
  - **EasyLaundry Branding:** Rebranded the entire application across frontend and backend, unified typography, styling, and assets. *(Note: The brand logo was AI-generated).*
  - **Reliability & Security Hardening:** Implemented CORS origin restriction, secret-header protection for administrative cache-refresh endpoints, sanitized production error responses, isolated demo credential configurations, and dynamic fallback handling.

---

## Demo Limitations

Please keep the following architectural boundaries in mind when reviewing this demo:
- **Mock Data:** Collections, property lists, company records, and customer orders utilize in-memory/browser-state mock data for demonstration purposes without a persistent SQL/NoSQL database.
- **Client-Side Demo Auth:** Authentication (`/login`) is a client-side demo implementation designed for role-based UI preview (Admin, Staff, Customer). It does not use secure HTTP-only cookie sessions or JWT tokens.

---

## Screenshots

<!-- Add your application screenshots below -->
| Dashboard & Analytics | Customer Services & Cart |
| :---: | :---: |
| ![Dashboard Screenshot](public/placeholder.svg) | ![Services Screenshot](public/placeholder.svg) |

| AI Support Chatbot | Order Tracking |
| :---: | :---: |
| ![Chatbot Screenshot](public/placeholder.svg) | ![Order Tracking Screenshot](public/placeholder.svg) |

---

## Key Features

- **Operations Dashboard:** Live metrics, revenue statistics, collection overdue alerts, and activity logs.
- **Collection Calendar:** Interactive calendar view for scheduling, re-scheduling, and managing laundry pickups.
- **Customer Services & Ordering:** Service selection, laundry wash/dry/fold options, dynamic cart, and customer checkout flow.
- **Order Tracking:** Real-time visual progress bar tracking laundry status from pickup to delivery.
- **AI Support Chatbot:**
  - Direct intent matching against Google Sheets FAQ entries (zero token cost & instant response).
  - OpenRouter LLM fallback for conversational responses when questions go beyond direct knowledge base items.
  - Automatic cache with configurable TTL and secret-secured manual refresh.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide Icons, React Router DOM, TanStack React Query.
- **Backend:** Python 3.8+, FastAPI, Uvicorn, OpenRouter / OpenAI SDK, Google Sheets API (`gspread`), Pydantic, python-dotenv.

---

## Project Structure

```text
easy-laundry/
├── frontend (root)/
│   ├── src/
│   │   ├── components/      # UI, layout, chatbot, dashboard & customer components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Mock data, demo config, utilities
│   │   ├── pages/           # Admin, Dashboard, Customer Services, Track Order, etc.
│   │   └── App.tsx          # App routing and providers
│   ├── public/              # Static assets and logo
│   └── index.html
├── backend/
│   ├── chatbot/
│   │   ├── chatbot_service.py         # AI orchestration & OpenRouter client
│   │   └── google_sheets_processor.py # Google Sheets integration & caching
│   ├── main.py                        # FastAPI endpoints & CORS configuration
│   ├── requirements.txt               # Pinned Python dependencies
│   └── .env.example                   # Backend environment template
└── README.md
```

---

## Environment Variables

### Frontend (`.env`)
Create a `.env` file in the project root:
```env
# URL pointing to the FastAPI backend /api/chat endpoint
VITE_CHAT_API_URL=http://localhost:8000/api/chat

# Optional contact info overrides
VITE_CONTACT_EMAIL=support@easylaundry.com
VITE_CONTACT_PHONE=+1 (555) 123-4567
```

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
# LLM Provider Configuration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
MODEL_NAME=mistralai/mistral-7b-instruct:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Google Sheets Knowledge Base (Optional)
GOOGLE_SHEETS_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS_PATH=credentials/service_account.json
# Or provide the JSON string directly:
# GOOGLE_CREDENTIALS_JSON={"type": "service_account", ...}
SHEET_CACHE_TTL=300

# Security & CORS
REFRESH_TOKEN=your_secure_refresh_token_here
FRONTEND_URL=http://localhost:5173

# Server Port
BACKEND_PORT=8000
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+

### 1. Frontend Setup
```sh
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 2. Backend Setup
```sh
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
The backend API will start at `http://localhost:8000`.

---

## API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status check | No |
| `POST` | `/api/chat` | Send message and conversation history to chatbot | No |
| `GET` | `/api/intents` | List all cached knowledge base intent keys | No |
| `GET` | `/api/health` | Health check (LLM connectivity & cache stats) | No |
| `POST` | `/api/refresh-sheet` | Force-refresh Google Sheets knowledge base | **Yes** (`X-Refresh-Token` header) |
| `GET` | `/api/chat-status` | Detailed metadata on LLM and knowledge base | No |

---

## License

This project is open-source and available under the [MIT License](LICENSE).
