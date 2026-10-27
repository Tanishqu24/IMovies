# 🎬 IMovies – Movie Ticket Booking Made Simple
### Complete MERN Stack Capstone Engineering Project

**IMovies** is a complete, modern, responsive, and fully functional cinema ticket booking web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed with a cinema-inspired **Midnight Cinema** dark purple theme, it features interactive cinema seating maps, real-time seat lock synchronization via **Socket.IO**, simulated multi-method payments, instant QR code & printable PDF ticket generation, and dedicated role-based portals for **Super Admins**, **Theatre Managers**, and **Customers**.

---

## 🌟 Key Features

### 🍿 1. Customer Cinema Website
- **Cinematic Homepage**: Dynamic blockbuster hero banner carousel, trending movies, now showing catalog with genre filter pills, and upcoming releases countdown.
- **City Selector**: Instant location filtering (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Pune).
- **Movies Catalog**: Search by title, director, or cast; filter by genre, language, minimum rating, and status; sort by newest/oldest/rating; responsive grid with pagination.
- **Movie Details**: Full backdrop header, trailer modal (YouTube embed), director and cast profiles, audience reviews, date picker, and cinema showtimings.
- **Interactive Cinema Seat Selection**:
  - Curved screen visual indicator ("All Eyes This Way").
  - Multi-tier seat categories: **VIP Recliners** (₹500), **Premium** (₹320), and **Regular** (₹220).
  - Dynamic seat states: *Available*, *Selected*, *Temporarily Locked*, and *Booked*.
  - **Socket.IO Real-Time Sync**: Synchronizes locked and booked seats across connected devices instantly to prevent double-booking.
  - Server-side atomic locking with 8-minute countdown timer.
- **Checkout & Simulated Payment Gateway**:
  - Itemized ticket breakdown with convenience fee and 18% GST calculation.
  - Promotional discount coupon code validator (e.g., `WELCOME50`, `BLOCKBUSTER20`).
  - Simulated payment options: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Card, Net Banking, and Wallets.
- **Booking Confirmation & Ticket PDF Download**:
  - Confetti celebration upon confirmation.
  - Authentic cinema ticket stub design with QR code, barcode pattern, and movie metadata.
  - 1-click **Download Ticket as PDF** powered by `html2canvas` and `jsPDF`.
- **My Bookings & Cancellation**:
  - View Upcoming, Completed, and Cancelled tickets.
  - 1-click cancellation with 90% instant refund calculation and automatic seat release back to the cinema auditorium.

### 🛡️ 2. Super Admin Portal (`/admin`)
- **Dashboard Analytics**:
  - Real-time MongoDB metrics: Total Users, Total Movies, Total Theatres, Total Shows, Total Bookings, Total Revenue.
  - Interactive **Recharts**: Monthly Revenue Bar Chart, Booking Status Distribution Pie Chart, Most Popular Movies, and Recent Transactions.
- **Full CRUD Management**:
  - **Movies**: Add, edit, archive movies, upload poster/backdrop URLs, assign certification and genres.
  - **Theatres**: Add cinemas, assign managers, configure facilities (Dolby Atmos, IMAX, Recliners, Food Court).
  - **Screens**: Configure auditorium screens and seat capacities.
  - **Shows**: Schedule movie shows with date, start time, auditorium selection, and tier pricing.
  - **Bookings**: Inspect all platform transactions and trigger admin cancellations with refunds.
  - **Users**: Search, filter by role, promote/demote roles (Admin, Manager, Customer), deactivate accounts.
  - **Payments**: Audit logs of transaction IDs, gateways, and timestamps.
  - **Reviews**: Moderate user comments and ratings.
  - **Coupons**: Create flat or percentage discount coupons with expiry dates and usage caps.

### 🏢 3. Theatre Manager Portal (`/manager`)
- **Scoped Management**: Managers can only view and manage theatres, screens, and shows assigned to their account.
- **Auditorium Scheduling**: Schedule movie screenings and configure seat pricing for assigned theatres.
- **Theatre Bookings**: Monitor seat occupancy in real-time.
- **Revenue Analytics**: Settlement records and gross revenue reports for managed theatres.

---

## 🎨 Theme: Midnight Cinema

| Color | Hex Code | Usage |
|---|---|---|
| **Primary Background** | `#0B1020` | Main canvas and page backdrop |
| **Secondary Background** | `#11182B` | Navigation bars, input fields, and toolbars |
| **Card Background** | `#171D33` | Movie cards, panels, and modal containers |
| **Primary Purple** | `#7C3AED` | Primary buttons, brand accents, and active indicators |
| **Accent Purple** | `#A855F7` | Glowing highlights, hero accents, and badges |
| **Border Color** | `#27324A` | Dividers, card borders, and outlines |
| **Primary Text** | `#F8FAFC` | Main headings and titles |
| **Secondary Text** | `#94A3B8` | Subtitles, labels, and muted text |
| **Success Green** | `#22C55E` | Confirmed bookings, verified tags, and active status |
| **Error Red** | `#EF4444` | Cancellations, alerts, and delete actions |

---

## 💻 Technology Stack

### Frontend
- **React.js 18** (bootstrapped with **Vite**)
- **React Router DOM v7** (Declarative client-side routing & protected routes)
- **Tailwind CSS** (Custom cinema design system & responsive utility classes)
- **Lucide React** (Modern iconography)
- **Recharts** (Interactive analytics charts)
- **Socket.IO Client** (Live seat selection & availability sync)
- **qrcode.react** (Ticket QR code rendering)
- **html2canvas & jsPDF** (Client-side cinema ticket PDF export)
- **Canvas Confetti** (Booking celebration animation)
- **React Hot Toast** (Toast notifications)
- **Axios** (Configured HTTP client with automatic JWT token attachment)

### Backend
- **Node.js** & **Express.js**
- **MongoDB Community Edition** & **Mongoose ODM**
- **Socket.IO Server** (Websocket room-based seat locking)
- **JSON Web Tokens (JWT)** (Secure stateless authentication)
- **bcryptjs** (Salted password hashing)
- **Express Validator** (Server-side input validation)
- **Express Rate Limit** (DDoS and brute-force prevention on auth endpoints)
- **Morgan** (HTTP request logger)
- **CORS** & **Dotenv**

---

## 📁 Project Structure

```text
IMovies/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # AdminSidebar, AdminHeader, StatCard
│   │   │   ├── common/              # Navbar, Footer, ProtectedRoute, Modal, ConfirmModal, Pagination, EmptyState
│   │   │   └── customer/            # HeroBanner, MovieCard, TrailerModal, ReviewSection, TicketPDF
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication & session state
│   │   │   ├── CityContext.jsx      # City selection state
│   │   │   └── SocketContext.jsx    # Real-time Socket.IO instance
│   │   ├── layouts/
│   │   │   ├── CustomerLayout.jsx   # Customer shell (Navbar + Footer)
│   │   │   ├── AdminLayout.jsx      # Super Admin portal shell (Sidebar + Header)
│   │   │   └── ManagerLayout.jsx    # Theatre Manager shell
│   │   ├── pages/
│   │   │   ├── customer/            # HomePage, MoviesPage, MovieDetailsPage, TheatresPage,
│   │   │   │                        # SeatSelectionPage, CheckoutPage, BookingSuccessPage,
│   │   │   │                        # MyBookingsPage, ProfilePage, AboutPage, LoginPage, RegisterPage
│   │   │   ├── admin/               # AdminDashboardPage, AdminMoviesPage, AdminTheatresPage,
│   │   │   │                        # AdminScreensPage, AdminShowsPage, AdminBookingsPage,
│   │   │   │                        # AdminUsersPage, AdminPaymentsPage, AdminReviewsPage, AdminCouponsPage
│   │   │   └── manager/             # ManagerDashboardPage, ManagerTheatresPage, ManagerScreensPage,
│   │   │                            # ManagerShowsPage, ManagerBookingsPage, ManagerRevenuePage
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with interceptors
│   │   ├── App.jsx                  # Main application routes
│   │   ├── index.css                # Tailwind directives & custom cinema styles
│   │   └── main.jsx                 # Entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                          # Express.js + MongoDB Backend
│   ├── config/
│   │   └── db.js                    # Mongoose MongoDB connection
│   ├── controllers/                 # auth, user, movie, theatre, screen, show, booking, payment, review, coupon, analytics
│   ├── middleware/                  # auth (protect, authorize), validate, errorHandler
│   ├── models/                      # User, Movie, Theatre, Screen, Show, Booking, Payment, Review, Coupon, Notification
│   ├── routes/                      # Modular REST API routes
│   ├── seeders/
│   │   └── seed.js                  # Database seeder script
│   ├── services/
│   │   └── seatLockService.js       # Real-time in-memory seat lock manager with TTL
│   ├── utils/
│   │   └── generateToken.js         # JWT token generator
│   ├── app.js                       # Express application setup
│   ├── server.js                    # HTTP + Socket.IO server startup
│   ├── .env                         # Server environment configuration
│   └── package.json
├── package.json                     # Root orchestrator scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Community Server** running locally on port `27017`

### 1. Database Seeding
To populate MongoDB with sample accounts, movies, theatres, screens, and shows:

```bash
npm run seed
```

### 2. Run the Full Application (Concurrently)
From the project root:

```bash
npm run dev
```

This starts:
- **Backend API & Socket.IO Server**: `http://localhost:5000`
- **Frontend Client**: `http://localhost:5173`

*(Alternatively, run them separately in two terminals:)*
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

---

## 🔑 Demo Login Credentials

The seeder populates predefined accounts for all user roles. Quick demo login buttons are also provided on the [Login Page](http://localhost:5173/login) for instant evaluation:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `admin@imovies.com` | `Password123!` | Complete access to `/admin` dashboard, analytics, and all CRUD |
| **Theatre Manager 1** | `rajesh.manager@imovies.com` | `Password123!` | Managed access to `/manager` portal for assigned Mumbai theatres |
| **Theatre Manager 2** | `anita.manager@imovies.com` | `Password123!` | Managed access to `/manager` portal for assigned Bengaluru theatres |
| **Customer** | `aarav@gmail.com` | `Password123!` | Book movies, select seats, apply coupons, download tickets |

---

## 🎟️ Active Demo Coupons

During checkout, test any of the following valid coupons:

- **`WELCOME50`**: Flat ₹50 OFF on orders above ₹300
- **`IMOVIES100`**: Flat ₹100 OFF on orders above ₹800
- **`BLOCKBUSTER20`**: 20% OFF (up to ₹150) on orders above ₹500
- **`VIPPASS`**: 15% OFF (up to ₹200) on orders above ₹600

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Private | Update user personal details |
| `PUT` | `/api/auth/change-password` | Private | Update account password |
| `GET` | `/api/movies` | Public | Search, filter, and paginate movies |
| `GET` | `/api/movies/featured/home` | Public | Get featured hero, trending, and now showing |
| `GET` | `/api/movies/:id` | Public | Retrieve single movie details & reviews |
| `POST` | `/api/movies` | Admin | Create new movie record |
| `PUT` | `/api/movies/:id` | Admin | Update movie details |
| `DELETE` | `/api/movies/:id` | Admin | Remove movie from catalog |
| `GET` | `/api/theatres` | Public | List theatres with city and facility filters |
| `GET` | `/api/theatres/cities` | Public | Get list of active cinema cities |
| `POST` | `/api/theatres` | Admin | Create cinema theatre |
| `GET` | `/api/shows/movie/:movieId` | Public | Group shows by theatre for a movie & date |
| `GET` | `/api/shows/:id` | Public | Get show seat layout, booked, and locked seats |
| `POST` | `/api/shows` | Admin / Manager | Schedule a new show |
| `POST` | `/api/bookings/lock-seats` | Private | Temporarily lock seats during checkout |
| `POST` | `/api/bookings/unlock-seats`| Private | Release temporarily locked seats |
| `POST` | `/api/bookings` | Private | Create booking & simulate payment |
| `GET` | `/api/bookings/my-bookings` | Private | Retrieve current user's booking history |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel booking and trigger 90% refund |
| `POST` | `/api/coupons/validate` | Private | Validate coupon code and compute discount |
| `GET` | `/api/analytics/admin` | Admin | Aggregate dashboard metrics and Recharts data |
| `GET` | `/api/analytics/manager` | Manager | Scoped statistics for assigned theatres |

---

## ⚡ Socket.IO Real-time Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `joinShow` | Client ➔ Server | `{ showId }` | User enters seat selection page for a show |
| `leaveShow` | Client ➔ Server | `{ showId }` | User leaves seat selection page |
| `seatStatusChanged` | Server ➔ Room | `{ showId, bookedSeats, lockedSeats }` | Broadcasted when seats are locked, unlocked, or confirmed |
| `remoteSeatSelected` | Server ➔ Room | `{ seatId, isSelected, userId }` | Real-time visual cue when another user clicks a seat |

---

## 🎓 Capstone Project Declaration
- **Project Title**: IMovies – Movie Ticket Booking Made Simple
- **Architecture**: MERN Stack (MongoDB, Express, React, Node)
- **Design System**: Midnight Cinema Dark Purple (`#0B1020`, `#11182B`, `#171D33`, `#7C3AED`, `#A855F7`)
- **Developer**: Tanishk
- **Academic Year**: 2026

