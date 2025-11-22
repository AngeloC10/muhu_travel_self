# 🌍 Muhu Travel Management System

A comprehensive **CRM and Reservation Management System** designed specifically for travel agencies. This application streamlines the process of managing clients, reservations, tour packages, and internal staff.

![Muhu Travel Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## ✨ Key Features

- **🔐 Role-Based Access Control (RBAC)**
  - **Admins**: Full system control, user management, and sensitive data access.
  - **Agents**: Focused interface for sales, client management, and reservations.
  
- **📅 Reservation Management**
  - Complete booking lifecycle management.
  - Passenger details, payment tracking, and status updates.

- **👥 Customer Relationship Management (CRM)**
  - Centralized client database.
  - History of interactions and bookings.

- **📦 Tour Package Management**
  - Create and manage travel packages with itineraries, pricing, and availability.

- **🏢 Enterprise Resource Planning**
  - Manage Employees and external Providers (Hotels, Transport, Guides).

- **📊 Dashboard & Analytics**
  - Real-time insights into sales performance and upcoming trips.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router DOM

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt

## 🚀 Getting Started

For detailed instructions on how to set up the project locally (Database, Backend, and Frontend), please refer to our **Setup Guide**:

👉 **[READ THE SETUP GUIDE](./SETUP_GUIDE.md)**

## 📂 Project Structure

```
MuhuV1/
├── backend/                # Express Server & Prisma ORM
│   ├── prisma/             # Database Schema & Seeds
│   └── src/
│       ├── controllers/    # Business Logic
│       ├── routes/         # API Endpoints
│       └── middleware/     # Auth & Validation
├── src/                    # React Frontend
│   ├── components/         # Reusable UI Components
│   ├── pages/              # Application Views
│   ├── context/            # Global State (Auth)
│   └── services/           # API Integration
└── SETUP_GUIDE.md          # Installation Instructions
```

## 🔒 Security Features

- **Secure Authentication**: Passwords are hashed using bcrypt.
- **Admin Authorization**: New account creation requires Admin approval.
- **Protected Routes**: Frontend routes are guarded based on authentication and role.
- **API Security**: Backend endpoints verify JWT tokens.

---

© 2024 Muhu Travel. All rights reserved.
