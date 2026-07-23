# Clean Delivery Flow - Laundry Management System

## Build by SELF

## Project Overview

A comprehensive laundry clean delivery management system built with React, TypeScript, Vite, and shadcn-ui.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router DOM
- React Query

## Features

- Dashboard with analytics
- Collection management with calendar
- Admin management
- Company management
- Property management
- Reports
- AI Chatbot for consumer support

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+ (for chatbot backend)

### Installation

```sh
# Step 1: Install frontend dependencies
npm install

# Step 2: Install backend dependencies (for chatbot)
cd backend
pip install -r requirements.txt

# Step 3: Start the frontend development server
npm run dev

# Step 4: Start the backend server (in a new terminal)
cd backend
python main.py
```

## Project Structure

```
clean-delivery-flow/
├── src/
│   ├── components/
│   │   ├── collections/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── properties/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── App.tsx
├── backend/
│   ├── main.py
│   ├── chatbot/
│   └── requirements.txt
└── public/
```

## Building for Production

```sh
npm run build
```
