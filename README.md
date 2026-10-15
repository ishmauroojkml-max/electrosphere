# ⚡ ElectroSphere - Next-Gen Full-Stack Platform

A complete, production-grade web application built with **MVC (Model-View-Controller)** architecture, combining:
1. **Full-Stack E-Commerce Store** (Electronics & Mobile Hardware) with Cart, Search, Filters, and Dedicated Stripe/PayPal Sandbox Payment APIs.
2. **Interactive 3D Landing Experience** powered by **Three.js** with orbit controls, live chassis color customizer, and 3D pre-order inquiry forms.
3. **SaaS Analytics & Operations Dashboard** with **Chart.js** data visualizations, Product Inventory CRUD, Order Fulfillment tracking, and User Role Permissions (Admin, Manager, Customer).
4. **Built-in REST API Explorer** (Thunder Client / Postman style) to test live endpoints directly in the browser.
5. **Node.js & Express REST API Backend** with **MongoDB Status Logging**, JWT authentication, and `.env` configuration.

---

## 📁 MVC Project Structure

```
check/
├── .env                    # Active Environment Variables (Port, MongoDB URI, JWT, Stripe/PayPal)
├── .env.example            # Environment Template
├── assets/                 # Static Assets
│   └── favicon.svg         # High-resolution vector favicon & app icon
├── config/                 # Configuration & Database Layer
│   └── db.js               # MongoDB connection handler & terminal status logger
├── controllers/            # MVC Business Logic Controllers
│   ├── authController.js       # JWT Login, Register & Roles
│   ├── productController.js    # Hardware catalog CRUD & search/filters
│   ├── orderController.js      # Customer order processing & tracking
│   ├── paymentController.js    # Dedicated Stripe & PayPal Sandbox APIs
│   ├── analyticsController.js  # SaaS KPI metrics & Charts aggregation
│   └── inquiryController.js    # 3D VIP pre-order desk
├── routes/                 # MVC Express Routers
│   ├── authRoutes.js           # /api/auth
│   ├── productRoutes.js        # /api/products
│   ├── orderRoutes.js          # /api/orders
│   ├── paymentRoutes.js        # /api/payment (Stripe & PayPal)
│   ├── analyticsRoutes.js      # /api/analytics
│   └── inquiryRoutes.js        # /api/inquiries
├── data/                   # Persistent Data Store (JSON Engine)
│   ├── products.json           # Catalog database
│   ├── orders.json             # Customer orders & tracking numbers
│   ├── users.json              # User accounts with roles
│   └── inquiries.json          # 3D pre-order inquiries
├── index.html              # Frontend Master View (HTML Head, 3D Canvas, Store, SaaS)
├── style.css               # Master Styling, Animations, Glassmorphism, Dark/Light theme
├── app.js                  # Frontend Master Controller (Three.js 3D, Cart, Charts, JWT)
├── server.js               # Express Server & MVC Route mounter
└── package.json            # Dependencies & Scripts
```

---

## ⚙️ Environment Configuration (`.env`)

```env
PORT=5000
NODE_ENV=development

# Database Configuration (MongoDB Status Logged in Terminal)
MONGODB_URI=mongodb://localhost:27017/electrosphere

# JWT Authentication
JWT_SECRET=super_secret_jwt_electrosphere_key_2026_xyz987

# Payment Gateway Sandbox Keys
STRIPE_SECRET_KEY=sk_test_51MockStripeKeyForSandboxTesting2026
STRIPE_PUBLIC_KEY=pk_test_51MockStripePublicKey2026
PAYPAL_CLIENT_ID=sb_client_id_paypal_sandbox_2026
PAYPAL_SECRET=sb_secret_key_paypal_sandbox_2026
```

---

## ⚡ How to Run the Server

### 1. Open Terminal in the project directory:
```bash
cd "c:\Users\A TO Z\Downloads\check"
```

### 2. Install Dependencies (Express, CORS, Dotenv):
```bash
npm install
```

### 3. Start the Backend Server:
```bash
npm start
```
*Or using Node directly:*
```bash
node server.js
```

### 4. Terminal Output (MongoDB Status & Payment Route Log):
```
=================================================================
🚀 ELECTROSPHERE PLATFORM RUNNING (MVC ARCHITECTURE)
🌐 Website URL:      http://localhost:5000
🍃 MongoDB Status:   CONNECTED (mongodb://localhost:27017/electrosphere)
💳 Payment Routes:   /api/payment/stripe-charge & /api/payment/paypal-capture
📦 Hardware API:     http://localhost:5000/api/products
📊 SaaS Analytics:   http://localhost:5000/api/analytics/dashboard
🔒 Auth & Security:  Active (JWT Secret Loaded)
=================================================================
```

### 5. Open in Browser:
Open [**http://localhost:5000**](http://localhost:5000)

---

## 💳 Dedicated Payment API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/stripe-charge` | Authorizes simulated Stripe card transactions with test card `4242 4242...` |
| `POST` | `/api/payment/paypal-capture` | Captures simulated PayPal buyer protection transactions |
| `GET` | `/api/payment/config` | Retrieves public gateway client configuration |
| `GET` | `/api/health` | Returns system, MongoDB, and payment gateway health status |

---

## 🔒 Protected Admin Portal (Separated from Customer Storefront)

The Admin Operations & SaaS Dashboard has been completely decoupled from the public customer storefront:

- **Customer Storefront (`index.html`)**: Focuses 100% on product browsing, 3D interactive hardware canvas, cart drawer, and Stripe/PayPal checkout. Customers **cannot** access or view private business analytics, revenue, or inventory.
- **Admin Portal (`admin.html` or `http://localhost:5000/admin`)**: Guarded by a strict **Admin Login Gate**. Only authorized administrators can log in with their email/Gmail and password.

### 🔑 Authorized Administrator Login Credentials:

| Field | Admin Credential |
|---|---|
| **Admin Gmail / Email** | `admin@gmail.com` *(or `admin@electrosphere.com`)* |
| **Admin Password** | `adminpassword123` |
| **Role Assigned** | `Admin` |

> ⚠️ If a regular customer attempts to log in on the admin page, access is denied immediately with the alert:  
> *"⛔ Access Denied: You do not have Administrator permissions."*

---

## 🌟 Fixed Areas Summary

1. **HTML Head**:
   - Added vector SVG Favicon (`assets/favicon.svg`).
   - Integrated Three.js CDN, Font Awesome 6 Icons, and Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`).
   - SEO meta tags for description, viewport, and theme color.

2. **Project Tree**:
   - Added `.env` and `.env.example`.
   - Created `assets/` folder with `favicon.svg`.
   - Restructured backend into **MVC pattern** (`config/`, `controllers/`, `routes/`, `data/`).

3. **Backend / Terminal**:
   - Added **MongoDB Status Log** printed directly to the terminal on server boot.
   - Built dedicated **Payment API route** (`/api/payment/stripe-charge` & `/api/payment/paypal-capture`).

4. **Dashboard Separation & Security**:
   - Extracted SaaS operations dashboard into standalone [**`admin.html`**](file:///c:/Users/A%20TO%20Z/Downloads/check/admin.html).
   - Added Gmail & password login protection gate with session locking.
