# Urbano Nursery — Full-Stack Gardening Marketplace (MERN)

Welcome to **Urbano Nursery**, a complete full-stack web marketplace inspired by modern nurseries and sustainable living websites. It brings plant enthusiasts, local botanical nurseries, and certified professional gardeners together onto one unified platform.

---

## 🌿 Application Links

- **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
- **Backend API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Shop Catalog:** [http://localhost:5173/shop](http://localhost:5173/shop)
- **Gardening Services:** [http://localhost:5173/services](http://localhost:5173/services)
- **Expert Gardeners:** [http://localhost:5173/gardeners](http://localhost:5173/gardeners)

---

## 🔑 Ready-to-Use Demo Test Accounts

The database comes pre-seeded with realistic data and test accounts for all roles:

| Role | Email | Password | Status / Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@urbanonursery.com` | `Admin@12345` | Full Control Center: approve vendors, manage listings, monitor orders/bookings, resolve dispute tickets. |
| **Nursery Vendor (Approved)** | `greenhaven@urbanonursery.com` | `Nursery@12345` | Green Haven Botanical Nursery: add/edit plant listings, manage stock, fulfill incoming customer orders. |
| **Nursery Vendor (Pending)** | `bloomflora@urbanonursery.com` | `Pending@12345` | Bloom & Flora Hub: shows pending approval screen until approved by Admin. |
| **Gardener Specialist** | `ramesh.gardener@urbanonursery.com` | `Gardener@12345` | 8 Yrs Experience: accept/reject service bookings, mark jobs completed, track earnings. |
| **Customer** | `ananya.customer@urbanonursery.com` | `Customer@12345` | Browse catalog, add to cart, checkout with COD/demo payment, track orders, book gardeners, submit reviews. |

> 💡 **Quick Tip:** The login page at `/login` includes **1-Click Test Demo Buttons** to instantly log in as any role without typing!

---

## 🚀 Quick Start Guide (Beginner Friendly)

### Step 1: Ensure MongoDB is Running
Make sure MongoDB is running locally (e.g. `mongodb://127.0.0.1:27017`) or configure your MongoDB Atlas connection string in `server/.env`.

### Step 2: Install Dependencies
Open a terminal in the root `Urbano Nursery` folder and run:
```bash
# In the root folder
npm install

# In the server folder
cd server
npm install

# In the client folder
cd ../client
npm install
```

### Step 3: Seed Sample Botanical Data
Populate the database with sample products, categories, services, gardeners, orders, and reviews:
```bash
cd server
npm run seed
```

### Step 4: Run the Application
You can run both server and client concurrently from the root directory:
```bash
npm run dev
```
Or run them in two separate terminal windows:
```bash
# Terminal 1 (Backend API on port 5000)
cd server
npm run dev

# Terminal 2 (Frontend React App on port 5173)
cd client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📁 Project Architecture & Files Created

```
Urbano Nursery/
├── package.json                   # Root package with concurrently scripts
├── .gitignore                     # Git ignore rules
├── README.md                      # Complete beginner guide & documentation
│
├── server/                        # Backend (Node.js & Express & MongoDB)
│   ├── package.json
│   ├── .env                       # Environment variables
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.js              # Mongoose database connection
│       ├── models/
│       │   ├── User.js            # User model with bcrypt & role-based profiles
│       │   ├── Category.js        # Category model with slug
│       │   ├── Product.js         # Products with care guides, stock, nursery refs
│       │   ├── Service.js         # Gardening services (lawn, pruning, plant doctor)
│       │   ├── Booking.js         # Appointments with slot collision protection
│       │   ├── Order.js           # Orders with server-side stock and total verification
│       │   ├── Review.js          # Product, service, and gardener reviews
│       │   └── Complaint.js       # Customer dispute and support tickets
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── categoryController.js
│       │   ├── productController.js
│       │   ├── serviceController.js
│       │   ├── bookingController.js
│       │   ├── orderController.js
│       │   ├── reviewController.js
│       │   ├── complaintController.js
│       │   └── adminController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── categoryRoutes.js
│       │   ├── productRoutes.js
│       │   ├── serviceRoutes.js
│       │   ├── bookingRoutes.js
│       │   ├── orderRoutes.js
│       │   ├── reviewRoutes.js
│       │   ├── complaintRoutes.js
│       │   └── adminRoutes.js
│       ├── middleware/
│       │   ├── authMiddleware.js   # JWT verification, role check, vendor approval gate
│       │   └── errorMiddleware.js  # Centralized error handler & 404 router
│       ├── utils/
│       │   ├── seedData.js         # Seed categories & services constants
│       │   └── seedRunner.js       # Full database population runner
│       └── server.js               # Express application entry point
│
└── client/                         # Frontend (React 18 + Vite + Vanilla CSS)
    ├── package.json
    ├── vite.config.js              # Vite config with /api proxy to localhost:5000
    ├── index.html                  # HTML entry with Google fonts (Outfit & Plus Jakarta Sans)
    └── src/
        ├── context/
        │   ├── AuthContext.jsx     # User authentication state & token sync
        │   ├── CartContext.jsx     # Persistent cart, free shipping meter, totals
        │   └── ToastContext.jsx    # Animated notification alerts
        ├── services/
        │   └── api.js              # Axios instance with Bearer token interceptor
        ├── styles/
        │   └── index.css           # Modern forest green / cream design system
        ├── components/
        │   ├── Navbar.jsx          # Responsive header with search & cart counter
        │   ├── Footer.jsx          # Footer with trust badges & newsletter
        │   ├── ProductCard.jsx     # Product card with badges, stock alert, quick add
        │   ├── ServiceCard.jsx     # Service package card with features & duration
        │   ├── GardenerCard.jsx    # Specialist card with rating & direct booking
        │   ├── RatingStars.jsx     # Interactive & display star ratings
        │   └── Modal.jsx           # Accessible dialog component
        ├── pages/
        │   ├── Home.jsx            # Hero, search, categories, trending, services, reviews
        │   ├── Shop.jsx            # Multi-filter catalog (category, sun, price, stock)
        │   ├── ProductDetail.jsx   # Gallery, botanical care matrix, reviews submission
        │   ├── Cart.jsx            # Cart items, promo code (URBANO10), summary
        │   ├── Checkout.jsx        # Delivery address, COD/demo payment
        │   ├── MyOrders.jsx        # Order status tracking, invoice, cancel action
        │   ├── ServicesPage.jsx    # Gardening service packages catalog
        │   ├── GardenersPage.jsx   # Directory of verified gardeners
        │   ├── BookService.jsx     # Booking form with date/slot selection & anti-double-booking
        │   ├── MyBookings.jsx      # Scheduled appointments, status, cancel & rate
        │   ├── MyComplaints.jsx    # File disputes & view admin resolutions
        │   ├── Profile.jsx         # Profile editing & default delivery addresses
        │   ├── Login.jsx           # Sign in with 1-click test accounts
        │   ├── Register.jsx        # Role-based registration (Customer, Nursery, Gardener)
        │   ├── NurseryDashboard.jsx# Nursery inventory, product CRUD, incoming orders
        │   ├── GardenerDashboard.jsx # Appointment management, earnings summary
        │   └── AdminDashboard.jsx  # Approvals, users, products, orders, dispute resolution
        ├── App.jsx                 # Routing configuration
        └── main.jsx                # React DOM root
```

---

## 🌟 Key Features Implemented

1. **Role-Based Access Control (RBAC):**
   - 4 Roles: `customer`, `nursery`, `gardener`, `admin`.
   - Nursery and Gardener accounts start in `pending` status until verified and approved by an Admin in the Admin Console.
2. **Customer Shopping Flow:**
   - Real-time catalog search & filters (indoor/outdoor, price range, categories, in-stock only).
   - Botanical Care Matrix (Light, Water, Soil, Temperature, Humidity).
   - Quantity adjustments, free delivery threshold calculation (Free delivery above ₹999).
   - Promo code demo simulation (`URBANO10` for 10% off).
   - Cash on Delivery or Demo Instant Online Payment.
   - Order history tracking (Pending &rarr; Processing &rarr; Shipped &rarr; Delivered &rarr; Cancelled).
   - Order cancellation with automatic inventory stock restoration.
3. **Gardener Booking System:**
   - Browse certified horticultural specialists.
   - Select service type, date, and time slot (Morning, Afternoon, Evening).
   - **Anti-double-booking collision check:** Server validates that the gardener does not already have an active appointment for the requested time slot.
   - Punctuality & service review ratings.
4. **Vendor & Nursery Dashboard:**
   - View active botanical listings and stock levels.
   - Add new plants with botanical name, price, stock, category, and care guidelines.
   - Edit and delete listings.
   - View incoming customer orders and update shipping fulfillment status.
   - Revenue and inventory metrics.
5. **Gardener Dashboard:**
   - View upcoming client appointments.
   - One-click Accept, Reject, Start, and Mark Completed actions.
   - Summary cards: Total Appointments, Active Jobs, Completed Jobs, Total Earnings (₹).
6. **Administrator Control Center:**
   - Global dashboard metrics (Users, Products, Orders, Bookings, Revenue, Pending Approvals).
   - Approve or reject pending nursery & gardener registrations with one click.
   - Activate or deactivate user accounts.
   - Delete inappropriate listings.
   - Review and resolve customer dispute tickets with resolution explanations.

---

## 🔒 Security & Best Practices

- Passwords hashed with `bcryptjs` using a salt work factor of 10.
- Authenticated via JSON Web Tokens (JWT) passed in `Authorization: Bearer <token>` headers.
- Protected server routes with JWT middleware verifying user existence and active status.
- Server-side price calculations and stock availability validation.
- Clean separation of concerns with modular controllers, models, and routes.
