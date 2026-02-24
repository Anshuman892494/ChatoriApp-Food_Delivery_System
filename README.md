# ChatoriApp - Food Delivery System

ChatoriApp is a premium, full-stack food delivery application designed to provide a seamless "Royal Feast" experience. The platform connects customers with a diverse range of restaurants and manages the entire lifecycle of an order—from selection and payment to delivery and administrative oversight.

## 🚀 Key Modules

### 1. User Application (`/client`)

The customer-facing portal designed with a focus on high-end aesthetics and responsiveness.

- **Home & Explore**: Interactive hero sliders, popular dish highlights, and restaurant listings.
- **Menu & Cart**: Detailed restaurant pages with categorized menus and a persistent, animated shopping cart.
- **Checkout & Payments**: Address selection with Leaflet Map integration and secure payments via Razorpay.
- **Order Tracking**: Real-time status updates and order history.
- **Personalization**: User profile management and a system-wide Dark/Light mode.

### 2. Delivery Partner Portal (`/admin` - Delivery Role)

A specialized interface for delivery personnel to manage their assigned tasks.

- **Assigned Tasks**: View active orders assigned for delivery.
- **Status Updates**: Simple controls to update order milestones (e.g., _Picked Up_, _In Transit_, _Delivered_).
- **Navigation Info**: Access to customer delivery addresses and contact information.

### 3. Admin Dashboard (`/admin` - Admin Role)

The central command center for managing the platform's operations.

- **Restaurant Management**: Add, edit, and monitor restaurant partners.
- **Catalog Control**: Manage food items, pricing, and availability.
- **User Oversight**: View and manage all platform users, including delivery partners and admins.
- **Order Monitoring**: A bird's-eye view of all transactions and delivery statuses across the platform.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS (Mobile-First Design), Framer Motion (Animations), React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens) for session management, Firebase for Google Sign-In.
- **Payments**: Razorpay Integration.
- **Maps**: Leaflet / React-Leaflet.

## 📁 Project Structure

```bash
food-delivery/
├── client/           # Customer Frontend (Vite + React)
├── admin/            # Admin & Delivery Frontend (Vite + React)
├── server/           # Backend REST API (Node/Express)
│   ├── config/       # Database & Environment configuration
│   ├── controllers/  # Business logic for each resource
│   ├── models/       # Mongoose data schemas
│   ├── middleware/   # Authentication & Role-based access control
│   └── routes/       # API endpoint definitions
└── README.md
```

## ⚙️ Quick Start

### 1. Prerequisites

- Node.js (v16+)
- MongoDB connection string

### 2. Server Setup

```bash
cd server
npm install
# Configure your .env with MONGO_URI, JWT_SECRET, etc.
npm start
```

### 3. Client (User) Setup

```bash
cd client
npm install
npm run dev
```

### 4. Admin (Admin/Delivery) Setup

```bash
cd admin
npm install
npm run dev
```

---
