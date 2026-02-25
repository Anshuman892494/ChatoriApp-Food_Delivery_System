# ChatoriApp - Food Delivery System

ChatoriApp is a premium, full-stack food delivery ecosystem designed to provide a seamless and luxurious ordering experience. The platform connects customers with top-tier restaurants, managing the entire lifecycle of an order from discovery and secure payment to real-time tracking and administrative oversight.

## Screenshot - Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/Anshuman892494/ChatoriApp-Food_Delivery_System/blob/main/Screenshot/Screenshot%202026-02-25%20054540.png?raw=true" />

## ✨ Key Features

### 👤 User Experience (`/client`)

- **Immersive Interface**: High-end aesthetics with smooth animations using **Framer Motion** and **GSAP**.
- **Dynamic Hero Sliders**: Interactive exploration of featured dishes and promotions.
- **Advanced Restaurant Discovery**: Browse by category, popularity, or specific cuisine.
- **Interactive Menu**: Richly detailed menu pages with categorization and dish availability.
- **Royal Cart**: A persistent, animated shopping cart with instant updates.
- **Smart Checkout**:
  - **Leaflet Map Integration**: Pinpoint delivery addresses with precision.
  - **Address Management**: Save and manage multiple delivery locations.
  - **Razorpay Secure Payments**: Industry-standard payment gateway for safe transactions.
- **Real-time Order Tracking**: Follow your feast with live status updates.
- **Personalized Profile**: Manage settings, order history, and preferences.
- **Aesthetic Modes**: Seamless switching between premium **Dark** and **Light** modes.
- **Firebase Auth**: Secure Google Sign-In and email/password authentication.

### 🍱 Restaurant & Catalog Management (`/admin` - Admin Role)

- **Central Dashboard**: Comprehensive overview of platform health and active orders.
- **Partner Management**: Onboard and manage restaurant partners with ease.
- **Advanced Inventory Control**:
  - Add, edit, and delete food items.
  - Manage categories and pricing.
  - Toggle item availability in real-time.
  - Upload high-quality food imagery via **Multer** and **Cloudinary**.
- **User Governance**: Oversee customer accounts and delivery roles.

### 🚚 Delivery Excellence (`/admin` - Delivery Role)

- **Task-Oriented Dashboard**: Dedicated interface for delivery partners to manage active assignments.
- **Milestone Management**: Instantly update order status (Picked up, In transit, Delivered).
- **Navigation Assistance**: Quick access to customer contact details and map coordinates.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-First approach)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **State Management**: React Context API
- **Routing**: React Router DOM

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JWT](https://jwt.io/) & [Firebase](https://firebase.google.com/)
- **File Storage**: [Cloudinary](https://cloudinary.com/) (using [Multer-Cloudinary-Storage](https://www.npmjs.com/package/multer-storage-cloudinary))

### Services

- **Payments**: [Razorpay](https://razorpay.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)

## 📁 Project Structure

```bash
food-delivery/
├── client/           # Customer Frontend (Vite + React)
│   ├── src/pages     # Home, Restaurant Menu, Cart, Checkout, Profile
│   └── src/context   # Auth, Cart, and Theme state management
├── admin/            # Admin & Delivery Frontend (Vite + React)
│   ├── src/pages     # Dashboards, Inventory, Users, Orders
│   └── src/context   # Role-based access and admin state
├── server/           # Backend REST API (Node/Express)
│   ├── config/       # DB (Mongoose), Cloudinary, and Firebase configs
│   ├── controllers/  # Core business logic (Auth, Food, Order, Payment)
│   ├── models/       # MongoDB/Mongoose schemas
│   ├── middleware/   # JWT Auth & Role-based Access Control
│   └── routes/       # API endpoint definitions
└── README.md
```

## ⚙️ Quick Start

### 1. Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Firebase Project (for Auth)
- Razorpay Account (for Payments)
- Cloudinary Account (for Image Storage)

### 2. Installation (Standard approach)

#### Backend

```bash
cd server
npm install
# Create .env with: MONGO_URI, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*
npm start
```

#### Client & Admin

```bash
# For User Portal
cd client
npm install
npm run dev

# For Admin/Delivery Portal
cd admin
npm install
npm run dev
```
