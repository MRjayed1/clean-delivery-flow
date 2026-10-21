<div align="center">

# 🚚 Clean Delivery Flow
### Full-Stack Dual-Ecosystem (B2C & B2B Hospitality) Laundry Logistics & Maintenance Platform

[![Live Frontend](https://img.shields.io/badge/Frontend_App-clean--delivery--flow.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://clean-delivery-flow.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend_API-clean--delivery--flow.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://clean-delivery-flow.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/Repository-MRjayed1%2Fclean--delivery--flow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MRjayed1/clean-delivery-flow)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📌 Project Overview

**Clean Delivery Flow** is a decoupled, full-stack laundry, linen maintenance, and logistics platform engineered to serve both **individual consumers (B2C)** and **commercial hospitality partners (B2B)** under a unified architecture. 

While the public-facing storefront streamlines on-demand household laundry bookings and doorstep deliveries, the dedicated **B2B Admin & Operations Panel** is purpose-built for high-turnover hospitality businesses—specifically **Airbnbs, Motels, Boutique Hotels, and Serviced Apartments**—to automate bulk linen turnaround, room-turnover laundry maintenance, and scheduled fleet dispatch.

The platform runs on a distributed cloud architecture, pairing an edge-deployed **Vercel Frontend** with a dedicated RESTful **Backend API hosted on Render**.

---

## 🌐 Live Deployments & Environments

| Environment | URL | Hosting Provider | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web Application (B2C & B2B UI)** | [https://clean-delivery-flow.vercel.app/](https://clean-delivery-flow.vercel.app/) | **Vercel** (Edge CDN) | 🟢 Active |
| **Backend REST API Server** | [https://clean-delivery-flow.onrender.com](https://clean-delivery-flow.onrender.com) | **Render** (Cloud Web Service) | 🟢 Active |
| **Source Code Repository** | [github.com/MRjayed1/clean-delivery-flow](https://github.com/MRjayed1/clean-delivery-flow) | **GitHub** | 🟢 Public |

> **⚡ Reviewer Note on Backend Cold Starts:** The backend service is hosted on Render's cloud instance (`clean-delivery-flow.onrender.com`). If the API has been idle for 15+ minutes, the initial API request may take **30–50 seconds** to wake up the container. Subsequent requests execute with sub-second latency.

---

## 🏢 Dual-Sided Business Architecture (B2C + B2B)

| Dimension | 🛍️ B2C Customer Storefront (Front Page) | 🏨 B2B Hospitality & Admin Portal |
| :--- | :--- | :--- |
| **Target Audience** | Individual households, students, and daily residential clients | Airbnb hosts, Motel operators, Hotel facility managers, & Commercial properties |
| **Primary Use Case** | On-demand personal garment care, dry cleaning, and wash-and-fold | Bulk linen & towel sanitation, between-guest turnover syncing, and recurring maintenance contracts |
| **Order Volume** | Per-bag or per-item retail orders | High-volume batch processing (by weight/linen count) & multi-property SLA tracking |
| **Scheduling Flow** | Flexible pickup/drop-off time slot booking | Automated recurring route dispatches aligned with guest check-out/check-in windows |
| **Management Tools** | Instant price estimation, order tracking, and digital receipts | Fleet dispatch control, property-wise invoicing, stain/damage reporting, and inventory health |

---

## 🖼️ Live Interface Previews

> *The views below are dynamically rendered from the active production deployment on Vercel.*

### 1. B2C Storefront & Primary Application View
<div align="center">
  <a href="https://clean-delivery-flow.vercel.app/">
    <img src="https://s0.wp.com/mshots/v1/https%3A%2F%2Fclean-delivery-flow.vercel.app%2F?w=1280&h=800" alt="Clean Delivery Flow - Live Desktop View" width="100%" style="border-radius: 10px; border: 1px solid #30363d;" />
  </a>
  <p><em>B2C Customer Landing & Booking Interface (1280x800) — Click image to launch live application</em></p>
</div>

### 2. Multi-Viewport Operations (B2B Dispatch & Mobile Courier Views)
| 💻 Widescreen B2B / Dispatch Viewport | 📱 Mobile Customer & Field Rider Viewport |
| :---: | :---: |
| <img src="https://api.microlink.io/?url=https://clean-delivery-flow.vercel.app&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1440&viewport.height=900" alt="Widescreen View" width="100%" /> | <img src="https://api.microlink.io/?url=https://clean-delivery-flow.vercel.app&screenshot=true&meta=false&embed=screenshot.url&viewport.width=390&viewport.height=844&viewport.isMobile=true" alt="Mobile Responsive View" width="55%" /> |
| *Commercial Operations & Order Overview* | *On-the-Go Booking & Rider Status Updates* |

---

## ✨ Key Features

### 🛍️ B2C Consumer Front-End
* **Instant Service Booking:** Frictionless scheduling for wash-and-fold, dry cleaning, and express garment care.
* **Transparent Pricing & Slot Selection:** Real-time service categorization and convenient doorstep pickup/delivery window selection.
* **Live Order Progression:** Visual step-by-step tracking from *Pickup Scheduled* to *Delivered*.

### 🏨 B2B Admin & Hospitality Maintenance Panel (Airbnb, Motels & Hotels)
* **Hospitality Property Management:** Centralized oversight for multi-unit Airbnb hosts, motels, and hotels requiring strict linen turnaround SLAs between guest stays.
* **Bulk Linen & Turnover Pipeline:** Specialized workflow stages (*Dirty Linen Pickup $\rightarrow$ Commercial Wash/Sanitization $\rightarrow$ Quality & Stain Inspection $\rightarrow$ Crisp Folding/Packaging $\rightarrow$ Property Restock*).
* **Commercial Dispatch & Route Coordination:** Assign and monitor pickup/delivery fleets across multiple hotel/motel locations simultaneously.
* **Operational KPIs & SLA Monitoring:** Real-time visibility into active commercial loads, pending hospitality pickups, turnaround velocity, and facility capacity.

### ⚙️ Backend API & Service Layer (Render)
* **Unified RESTful API:** Handles order lifecycle state transitions, B2B property maintenance schedules, and customer booking payloads.
* **Role & Workflow Segregation:** Separates retail B2C booking transactions from high-volume B2B hospitality batch operations.
* **CORS & Security Middleware:** Configured for secure cross-origin communication between the Vercel client (`clean-delivery-flow.vercel.app`) and the Render API (`clean-delivery-flow.onrender.com`).

---

## 🏗️ Full-Stack System Architecture

```mermaid
graph TD
    subgraph Client_Layer [🌐 Frontend Application - Vercel]
        A1[🛍️ B2C Customer Storefront]
        A2[🏨 B2B Hospitality Admin Panel<br/>Airbnb / Motels / Hotels]
    end

    subgraph API_Layer [⚙️ Backend Server - Render]
        B1[REST API Gateway<br/>clean-delivery-flow.onrender.com]
        B2[Order & SLA State Machine]
        B3[Hospitality Fleet & Batch Controller]
    end

    subgraph Pipeline_Stages [🔄 Core Laundry & Delivery Lifecycle]
        C1[Stage 1: Scheduled Pickup]
        C2[Stage 2: Commercial Wash & Sanitization]
        C3[Stage 3: QA & Packaging]
        C4[Stage 4: Doorstep Delivery / Room Restock]
    end

    A1 -->|Retail Booking & Tracking Requests| B1
    A2 -->|Bulk Linen Maintenance & Dispatch Commands| B1
    B1 --> B2
    B1 --> B3
    B2 & B3 --> C1 --> C2 --> C3 --> C4
    C4 -->|Live Status Sync & Analytics| A1 & A2
```
