<div align="center">

# LIFELINE

### AI-Driven Civic Action & Emergency Response Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack platform connecting **citizens**, **NGOs**, **volunteers**, and **authorities** in real-time to report civic issues, coordinate emergency responses, and gamify civic participation through AI-powered classification, live SOS tracking, and a social-impact marketplace.

> Community-Driven NGO Support, Emergency Response & Volunteer Ecosystem

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Real-Time & WebSockets](#real-time--websockets)
- [Scheduled Jobs](#scheduled-jobs)
- [Security](#security)
- [Deployment](#deployment)

---

## Features

### Civic Issue Reporting
- Submit reports with up to 7 media attachments (images/video)
- Anonymous reporting support
- **AI-powered analysis** — OpenAI GPT-4o-mini classifies severity (CRITICAL / SEVERE / MODERATE), extracts keywords, and validates legitimacy
- **Google Cloud Vision** — verifies uploaded images for content relevance
- **Geospatial auto-assignment** — nearest NGO handling the category is automatically assigned
- SLA-based escalation: CRITICAL (10min) → SEVERE (1h) → MODERATE (6h)
- Community upvoting and commenting
- Resolution proof submission with before/after media

### Emergency SOS System
- One-tap emergency alert (hold 3 seconds to trigger)
- **Real-time GPS tracking** — live location stream every 30 seconds
- Multi-channel notification — Socket.IO broadcast + Firebase push + Twilio SMS
- In-alert live chat between victim and responders
- 10-minute response SLA with automatic escalation
- SOS history with full audit trail

### NGO Portal
- NGO registration with document verification (admin approval required)
- Kanban-style case management — Incoming → Acknowledged → In Progress → Resolved
- Volunteer assignment per case
- Dashboard with live stats (active cases, resolved today, SLA breaches)
- Geospatial service area configuration

### Social Impact Marketplace
- NGOs list products (handicrafts, organic food, eco-friendly goods, art, clothing)
- **Razorpay** payment integration with reward-point discounts (1 pt = ₹0.1, max 50% off)
- Order tracking (Placed → Confirmed → Shipped → Delivered)
- Impact stories tied to each product

### Gamification & Rewards
- Points for every civic action (reports, upvotes, SOS, volunteering)
- **5-tier level system** — Newcomer → Helper → Activist → Champion → Legend
- Badge collection (First Report, Hero, Upvote Star, Legend)
- Daily streak tracking
- Redemption catalog — digital certificates, NGO letters, academic credits, internships
- PDF certificate generation with QR code verification
- Global and time-scoped leaderboards

### Admin Panel
- Platform-wide statistics and analytics
- User management (role/status updates)
- NGO approval/rejection workflow
- Report moderation
- AI-assisted analysis history

### Additional Features
- **Google OAuth 2.0** + email/password authentication
- **JWT dual-token strategy** — 15-min access token + 7-day refresh token
- Real-time notifications via Socket.IO + Firebase Cloud Messaging
- Weekly digest emails (Nodemailer + node-cron)
- Interactive Leaflet maps with category-colored markers
- Responsive design with GSAP animations
- Public impact dashboard with city-wide analytics

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | Component-driven UI library |
| **Vite** | 7 | Build tool with HMR |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Zustand** | 4.5 | Lightweight state management |
| **React Router DOM** | 7 | Client-side routing |
| **Leaflet / React-Leaflet** | 1.9 / 5.0 | Interactive maps |
| **Recharts** | 2.10 | Data visualization charts |
| **Axios** | 1.6 | HTTP client |
| **Socket.IO Client** | 4.6 | Real-time communication |
| **Firebase** | 12.7 | Google OAuth & cloud services |
| **GSAP** | 3.14 | High-performance animations |
| **React Hot Toast** | 2.4 | Toast notifications |
| **React Markdown** | 10.1 | Markdown rendering |
| **React Icons** | 5.6 | Icon library (Feather icons) |
| **date-fns** | 4.1 | Date utilities |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.18 | REST API framework |
| **MongoDB / Mongoose** | 8.0 | NoSQL database & ODM |
| **Socket.IO** | 4.6 | Real-time event broadcasting |
| **OpenAI** | 4.20 | GPT-4o-mini for report analysis |
| **Google Cloud Vision** | 4.0 | Image analysis & content moderation |
| **Firebase Admin** | 10.3 | Push notifications (FCM) |
| **Passport.js** | 0.7 | Google OAuth 2.0 strategy |
| **JSON Web Tokens** | 9.0 | Token-based authentication |
| **Cloudinary** | 2.9 | Media storage & transformation |
| **Razorpay** | 2.9 | Payment gateway |
| **Twilio** | 4.19 | SMS alerts (SOS & OTP) |
| **Nodemailer** | 8.0 | Email notifications |
| **PDFKit** | 0.14 | Certificate PDF generation |
| **QRCode** | 1.5 | QR codes for certificates |
| **Sharp** | 0.33 | Image processing |
| **node-cron** | 3.0 | Scheduled jobs |
| **Winston** | 3.11 | Structured logging |
| **Helmet** | 7.1 | HTTP security headers |
| **express-rate-limit** | 7.1 | API rate limiting |
| **express-validator / Joi** | 7.0 / 17.11 | Request validation |
| **Multer** | 1.4 | File upload handling |
| **bcryptjs** | 2.4 | Password hashing |

### DevOps & Tooling

| Technology | Purpose |
|---|---|
| **ESLint** | Code linting |
| **Nodemon** | Backend auto-restart in dev |
| **Jest + Supertest** | Backend testing |
| **Vercel** | Frontend deployment |
| **Firebase Hosting** | Alternative deployment with Firestore rules |

---

## Architecture

```
┌──────────────────┐       REST / WebSocket       ┌──────────────────────┐
│                  │ ◄──────────────────────────► │                      │
│   React 19 SPA   │                              │   Express REST API   │
│   Vite + GSAP    │                              │   Node.js Runtime    │
│   Tailwind CSS   │                              │                      │
│   Zustand Store  │                              │   Socket.IO Server   │
│   React-Leaflet  │                              │   Passport.js Auth   │
│                  │                              │                      │
└────────┬─────────┘                              └────┬─────────┬───────┘
         │                                              │         │
         │  Firebase Auth (Google OAuth)                │         │
         │  Firebase Cloud Messaging                    │         │
         └────────────► Firebase ◄──────────────────────┘         │
                                                                  │
                                                    MongoDB Atlas ◄┘
                                                    (Mongoose ODM)
                                                         │
                              ┌───────────────────────────┼───────────────────────────┐
                              │                           │                           │
                    ┌─────────┴─────────┐     ┌──────────┴──────────┐    ┌───────────┴───────────┐
                    │   AI & Analysis   │     │   Communication    │    │     Payments &        │
                    │                   │     │                    │    │     Media              │
                    │ • OpenAI 4o-mini  │     │ • Twilio SMS       │    │ • Razorpay Gateway    │
                    │ • GCP Vision API  │     │ • Nodemailer       │    │ • Cloudinary CDN      │
                    │                   │     │ • Firebase FCM     │    │ • Sharp Processing    │
                    └───────────────────┘     └────────────────────┘    └───────────────────────┘
```

### Request Flow — Report Submission

```
User submits report
        │
        ▼
  Express API receives request (Multer parses media)
        │
        ├──► Cloudinary: Upload images/video
        │
        ▼
  Report saved to MongoDB (status: SUBMITTED)
        │
        ├──► [Async] OpenAI GPT-4o-mini: Classify severity, keywords, legitimacy
        │         │
        │         ▼
        │    Google Cloud Vision: Validate images
        │         │
        │         ▼
        │    Update report with AI analysis (status: AI_VERIFIED)
        │
        ├──► [Async] Geo Service: Find nearest NGO within 10km
        │         │
        │         ▼
        │    Assign NGO + set SLA deadline
        │         │
        │         ▼
        │    Notify NGO admins (Push + SMS + Socket)
        │
        └──► Rewards Service: Award points to reporter
```

---

## Project Structure

```
LIFELINE/
├── backend/
│   ├── server.js                  # HTTP + Socket.IO bootstrap
│   ├── app.js                     # Express app configuration
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── db.js              # MongoDB connection
│       │   ├── firebase.js        # Firebase Admin SDK init
│       │   ├── cloudinary.js      # Cloudinary config
│       │   └── passport.js        # Google OAuth strategy
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── reports.controller.js
│       │   ├── sos.controller.js
│       │   ├── ngo.controller.js
│       │   ├── marketplace.controller.js
│       │   └── rewards.controller.js
│       ├── models/
│       │   ├── User.js            # Users with roles & geo
│       │   ├── Report.js          # Civic issues with AI analysis
│       │   ├── SosAlert.js        # Emergency alerts with live tracking
│       │   ├── Ngo.js             # NGO profiles & service areas
│       │   ├── Product.js         # Marketplace products
│       │   ├── Order.js           # Orders with Razorpay payments
│       │   ├── Reward.js          # Points, levels, badges, streaks
│       │   └── Notification.js    # Push/email/SMS notification log
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── reports.routes.js
│       │   ├── sos.routes.js
│       │   ├── ngo.routes.js
│       │   ├── marketplace.routes.js
│       │   ├── rewards.routes.js
│       │   └── admin.routes.js
│       ├── services/
│       │   ├── ai.service.js      # OpenAI + GCP Vision
│       │   ├── geo.service.js     # Geospatial NGO assignment
│       │   ├── notification.service.js  # FCM + Twilio + email
│       │   └── rewards.service.js # Points engine & leveling
│       ├── middleware/
│       │   ├── auth.middleware.js  # JWT verification
│       │   ├── role.middleware.js  # RBAC enforcement
│       │   ├── rateLimit.middleware.js
│       │   └── upload.middleware.js # Multer + Cloudinary
│       ├── jobs/
│       │   ├── slaMonitor.job.js  # Every-minute SLA check
│       │   └── weeklyDigest.job.js # Monday 9 AM digest
│       ├── sockets/
│       │   └── index.js           # Socket.IO event handlers
│       └── utils/
│           ├── logger.js          # Winston logger
│           ├── helpers.js         # Shared utilities
│           └── certificateGenerator.js # PDF + QR generation
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx                # Route definitions
│       ├── main.jsx               # Entry point
│       ├── index.css              # Global styles
│       ├── components/
│       │   ├── Navbar.jsx         # Top navigation
│       │   ├── Sidebar.jsx        # Admin sidebar
│       │   ├── DashboardMap.jsx   # Leaflet map with markers
│       │   ├── AnalyticsPanel.jsx # Category breakdown charts
│       │   ├── IssueCard.jsx      # Report card component
│       │   ├── FilterBar.jsx      # Category/status filters
│       │   ├── ReportPopup.jsx    # Report submission modal
│       │   ├── Auth.jsx           # Login/register forms
│       │   ├── Footer.jsx         # Site footer
│       │   ├── From.jsx           # Form component
│       │   ├── LoadingScreen.jsx   # Animated splash screen
│       │   ├── LogoAnimation.jsx   # SVG logo animation
│       │   ├── MapSection.jsx      # Embedded map section
│       │   ├── notifications/
│       │   │   └── NotificationBell.jsx
│       │   └── sos/
│       │       └── SOSButton.jsx   # Floating emergency button
│       ├── pages/
│       │   ├── LandingPage.jsx    # Public landing with GSAP hero
│       │   ├── Posts.jsx          # Community feed
│       │   ├── AdminDashboard.jsx # Admin overview
│       │   ├── AdminReports.jsx   # Report management
│       │   ├── AdminAnalytics.jsx # Platform analytics
│       │   ├── AdminAI.jsx        # AI analysis interface
│       │   ├── AdminAIHistory.jsx  # AI chat session history
│       │   ├── auth/              # Login, register, password reset
│       │   ├── admin/             # NGO approvals
│       │   ├── sos/               # Emergency SOS page
│       │   ├── ngo/               # NGO dashboard & cases
│       │   ├── marketplace/       # Shop, cart, orders
│       │   ├── rewards/           # Rewards & leaderboard
│       │   ├── volunteer/         # Task board
│       │   └── impact/            # Public impact dashboard
│       ├── services/              # API client modules
│       ├── store/                 # Zustand stores (auth, cart, notifications)
│       ├── hooks/                 # Custom hooks (geo, socket, notifications)
│       └── utils/
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** instance (local or Atlas)
- **Firebase** project (for Auth + Cloud Messaging)
- API keys for:
  - OpenAI (GPT-4o-mini)
  - Google Cloud Vision
  - Cloudinary
  - Twilio
  - Razorpay

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd LIFELINE

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Terminal 1 — Start backend
cd backend
npm run dev        # Starts with nodemon on configured port

# Terminal 2 — Start frontend
cd frontend
npm run dev        # Starts Vite dev server on http://localhost:5173
```

### Running Tests

```bash
cd backend
npm test           # Runs Jest with coverage report
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lifeline

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# OpenAI
OPENAI_API_KEY=sk-...

# Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=./gcp-credentials.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=your_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register (CITIZEN / VOLUNTEER / NGO_ADMIN) | — |
| POST | `/login` | Login with email & password | — |
| POST | `/logout` | Revoke refresh token | Required |
| POST | `/refresh` | Issue new access token | — |
| POST | `/verify-email` | Verify email via OTP | Required |
| POST | `/forgot-password` | Request password reset link | — |
| POST | `/reset-password` | Reset password with token | — |
| GET | `/me` | Get current user profile | Required |
| PATCH | `/fcm-token` | Update FCM push token | Required |
| GET | `/google` | Google OAuth redirect | — |
| GET | `/google/callback` | Google OAuth callback | — |

### Reports — `/api/reports`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create report (up to 7 media files) | Optional |
| GET | `/` | List reports (paginated, filterable) | — |
| GET | `/:id` | Get report details | — |
| GET | `/mine` | Get user's reports | Required |
| GET | `/nearby` | Geospatial query (lng, lat, radius) | — |
| PATCH | `/:id/status` | Update report status | Required |
| POST | `/:id/upvote` | Toggle upvote | Required |
| POST | `/:id/comments` | Add comment | Required |
| POST | `/:id/resolve` | Submit resolution proof | Required |

**Query Params:** `category`, `status`, `severity`, `city`, `page`, `limit`, `sort` (newest/popular), `lng`, `lat`, `radius`

### SOS — `/api/sos`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Trigger emergency SOS | Required |
| GET | `/mine` | Get SOS history | Required |
| PATCH | `/:id/respond` | NGO responds to SOS | Required |
| PATCH | `/:id/resolve` | Mark SOS resolved | Required |
| PATCH | `/:id/cancel` | Cancel SOS alert | Required |
| POST | `/:id/location` | Update live location | Required |
| GET | `/:id/chat` | Get chat messages | Required |
| POST | `/:id/chat` | Send chat message | Required |

**Rate Limit:** 3 SOS per minute per user

### NGOs — `/api/ngos`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register NGO with documents | Required |
| GET | `/` | List verified NGOs | — |
| GET | `/:id` | Get NGO profile | — |
| GET | `/:id/dashboard` | NGO admin dashboard | Required |
| GET | `/nearby` | Nearby NGOs (geo query) | — |
| PATCH | `/:id/cases/:caseId` | Update case status | Required |
| POST | `/:id/volunteers` | Assign volunteer to case | Required |

### Marketplace — `/api/marketplace`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | List products | — |
| GET | `/products/:id` | Product details | — |
| POST | `/products` | Create product (NGO admin) | Required |
| PATCH | `/products/:id` | Update product | Required |
| POST | `/cart/checkout` | Initiate Razorpay checkout | Optional |
| POST | `/orders` | Create order (verify payment) | Optional |
| GET | `/orders/mine` | User's order history | Required |
| PATCH | `/orders/:id/ship` | Mark order shipped | Required |

### Rewards — `/api/rewards`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Balance, level, badges, streak | Required |
| GET | `/leaderboard` | Top users (scope: alltime/monthly/weekly) | — |
| GET | `/catalog` | Redemption catalog | — |
| POST | `/redeem` | Redeem reward item | Required |
| GET | `/certificates` | User's certificates | Required |
| GET | `/certificates/download` | Download certificate PDF | Required |

### Admin — `/api/admin` (SUPER_ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Platform-wide statistics |
| GET | `/users` | List all users (paginated) |
| PATCH | `/users/:id` | Update user role/status |
| GET | `/ngos/pending` | Pending NGO registrations |
| PATCH | `/ngos/:id/approve` | Approve/reject NGO |
| PATCH | `/reports/:id` | Moderate report |
| GET | `/analytics` | System analytics |

---

## Database Models

### User
Roles: `CITIZEN`, `VOLUNTEER`, `NGO_ADMIN`, `AUTHORITY`, `SUPER_ADMIN`
- Email/password or Google OAuth authentication
- 2dsphere-indexed geolocation
- FCM token for push notifications
- Notification prefs (push, SMS, email)
- Refresh token array (max 5)

### Report
Statuses: `SUBMITTED` → `AI_VERIFIED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`
- AI analysis (severity, keywords, confidence score, legitimacy)
- Geospatial location with city/state
- SLA deadline with breach tracking
- Escalation history across NGOs
- Community upvotes and comments

### SOS Alert
Statuses: `ACTIVE` → `RESPONDED` → `RESOLVED` / `CANCELLED`
- Live location array (last 100 GPS points)
- Real-time chat messages
- Multi-NGO notification log with response tracking
- SMS alert audit trail

### NGO
- GeoJSON polygon service area + point headquarters
- Document verification (registration, tax exemption)
- Aggregate stats (cases handled, resolution rate, avg response time)
- Admin approval workflow

### Product & Order
- NGO-linked products with stock management
- Razorpay payment verification (order ID, payment ID, signature)
- Reward points discount integration
- Order lifecycle tracking

### Reward
- Balance, XP, and 5-tier level system
- Badge collection with earned timestamps
- Streak tracking (current, longest)
- Full transaction history (earned/redeemed)

### Notification
Types: `SOS_NEARBY`, `REPORT_STATUS`, `SLA_BREACH`, `TASK_ASSIGNED`, `POINTS_EARNED`, `BADGE_UNLOCKED`, `ORDER_UPDATE`, `ESCALATION`, `WEEKLY_SUMMARY`, `GENERAL`
- Priority levels: LOW, MEDIUM, HIGH, URGENT
- Read/unread tracking

---

## Real-Time & WebSockets

Socket.IO handles all real-time features with JWT-authenticated connections.

### Auto-Joined Rooms
| Room | Audience | Events |
|------|----------|--------|
| `user_{userId}` | Individual user | Personal notifications |
| `ngo_{ngoId}` | NGO admin team | Case assignments, SOS alerts |
| `admin_room` | Super admins | Platform-wide events |

### Dynamic Rooms
| Room | Joined Via | Events |
|------|------------|--------|
| `sos_{sosId}` | `join_sos` | `new_sos`, `sos_responded`, `sos_resolved`, `location_update`, `sos_message` |
| `report_{reportId}` | `join_report` | Status updates, new comments |

---

## Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| **SLA Monitor** | Every minute | Checks overdue reports, marks SLA breaches, triggers multi-level escalation |
| **Weekly Digest** | Mon 9:00 AM | Sends personalized summary of earned points, level, and streak to active users |

### SLA Escalation Levels

| Level | Action |
|-------|--------|
| 1 → 2 | Reassign to next closest NGO + SMS alert |
| 2 → 3 | Notify all NGOs in the city handling that category |
| 3 → 4 | Notify government authorities |
| 4+ | Emergency services escalation |

---

## Security

- **Helmet** — sets secure HTTP headers (CSP, HSTS, X-Frame-Options)
- **CORS** — restricted to configured `CLIENT_URL`
- **Rate Limiting** — API: 200/15min, Auth: 20/15min, SOS: 3/min
- **JWT Dual-Token** — short-lived access (15min) + rotating refresh (7d, max 5 per user)
- **bcryptjs** — password hashing with salt rounds
- **Timing-safe comparison** — for OTP/token verification
- **RBAC** — role-based middleware guards on all protected routes
- **Input Validation** — express-validator + Joi schemas on all endpoints
- **Multer** — file type whitelist (JPEG, PNG, WebP, GIF, MP4, MOV, MP3, WAV, WebM), 50MB limit

---

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build       # Outputs to dist/
# Deploy via Vercel CLI or GitHub integration
```

A [vercel.json](frontend/vercel.json) is included for SPA rewrites.

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

Firestore rules and indexes are configured in [firestore.rules](frontend/firestore.rules) and [firestore.indexes.json](frontend/firestore.indexes.json).

### Backend

Deploy the `backend/` directory to any Node.js host (Railway, Render, AWS, etc.) with the environment variables configured. Entry point: `server.js`.
