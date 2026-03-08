<div align="center">

# 🆘 LIFELINE
### *Complete Technical Blueprint & Build Guide*

> **Community-Driven NGO Support, Emergency Response & Volunteer Ecosystem**
> A full-stack platform built to connect citizens, NGOs, volunteers, and authorities in real-time.

[![JavaScript](https://img.shields.io/badge/JavaScript-99.6%25-F7DF1E?style=for-the-badge&logo=javascript)](https://github.com/jrdevadattan/IndiaInnovates)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge)]()
[![Made With Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20for%20India-FF6B6B?style=for-the-badge)]()

**[India Innovates](https://github.com/jrdevadattan/IndiaInnovates) · DTIL Project**

---

</div>

## 📖 Table of Contents

1. [Project Vision](#-project-vision)
2. [Complete System Architecture](#-complete-system-architecture)
3. [Full Tech Stack](#-full-tech-stack)
4. [All Features to Build](#-all-features-to-build)
   - [Authentication & User Roles](#1-authentication--user-roles)
   - [Issue Reporting System](#2-issue-reporting-system)
   - [SOS Emergency System](#3-sos-emergency-system)
   - [AI Analysis Engine](#4-ai-analysis-engine)
   - [NGO Dashboard](#5-ngo-dashboard)
   - [SLA & Auto-Escalation Engine](#6-sla--auto-escalation-engine)
   - [Volunteer System](#7-volunteer-system)
   - [Rewards & Gamification](#8-rewards--gamification)
   - [NGO Marketplace](#9-ngo-marketplace)
   - [Notifications](#10-notifications)
   - [Admin Panel](#11-admin-panel)
   - [Public Impact Dashboard](#12-public-impact-dashboard)
5. [Database Schema](#-database-schema)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Folder Structure](#-folder-structure)
8. [Environment Variables](#-environment-variables)
9. [Installation & Setup](#-installation--setup)
10. [Third-Party Services Setup](#-third-party-services-setup)
11. [Deployment Guide](#-deployment-guide)
12. [Future Roadmap](#-future-roadmap)
13. [Contributing](#-contributing)

---

## 🎯 Project Vision

LIFELINE is a **unified digital platform** that solves the critical disconnect between community problems and the organizations equipped to solve them. The platform operates on six core principles:

| Principle | What It Means |
|-----------|---------------|
| **Transparency** | Every report, action, and resolution is publicly trackable |
| **Accountability** | SLA timers and auto-escalation ensure no issue is ignored |
| **Speed** | AI-powered routing gets the right NGO in seconds, not days |
| **Inclusion** | Works for all literacy levels with voice, photo, and video inputs |
| **Sustainability** | Marketplace revenue model keeps NGOs self-funded |
| **Motivation** | Gamified volunteer rewards turn one-time helpers into lifelong contributors |

---

## 🏛️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│   React Web App  │  React Native Mobile  │  Progressive Web App    │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS / WebSocket
┌────────────────────────────▼────────────────────────────────────────┐
│                         API GATEWAY                                 │
│            Node.js + Express  │  Rate Limiting  │  Auth Middleware  │
└──────┬──────────┬─────────────┬──────────────────┬──────────────────┘
       │          │             │                  │
┌──────▼──┐  ┌────▼────┐  ┌────▼────┐  ┌──────────▼──────────┐
│  Auth   │  │ Reports │  │  NGO    │  │   AI/ML Service     │
│ Service │  │ Service │  │ Service │  │  (Classification)   │
└──────┬──┘  └────┬────┘  └────┬────┘  └──────────┬──────────┘
       │          │             │                  │
┌──────▼──────────▼─────────────▼──────────────────▼──────────────────┐
│                         DATABASE LAYER                              │
│     MongoDB Atlas   │   Redis Cache   │   Firebase Firestore        │
└─────────────────────────────────────────────────────────────────────┘
       │                         │
┌──────▼────────┐      ┌─────────▼──────────────────────────────────┐
│  File Storage │      │           EXTERNAL SERVICES                │
│  Cloudinary   │      │  Google Maps  │  Twilio SMS  │  SendGrid   │
│               │      │  FCM Push     │  Razorpay    │  OpenAI API │
└───────────────┘      └────────────────────────────────────────────┘
```

---

## 🧰 Full Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React.js** | 18+ | Core UI framework |
| **React Router v6** | 6+ | Client-side routing |
| **Tailwind CSS** | 3+ | Utility-first styling |
| **Framer Motion** | 10+ | Animations & transitions |
| **React Query (TanStack)** | 5+ | Server state management |
| **Zustand** | 4+ | Global client state |
| **Leaflet.js / React-Leaflet** | 4+ | Interactive maps |
| **Socket.io-client** | 4+ | Real-time WebSocket connection |
| **Axios** | 1+ | HTTP client |
| **React Hook Form** | 7+ | Form management |
| **Zod** | 3+ | Schema validation |
| **Recharts** | 2+ | Data visualization & charts |
| **Firebase SDK** | 10+ | Push notifications |
| **React Dropzone** | 14+ | File upload UI |
| **date-fns** | 3+ | Date formatting |
| **React Hot Toast** | 2+ | Toast notifications |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20 LTS | Runtime |
| **Express.js** | 4+ | REST API framework |
| **Socket.io** | 4+ | Real-time bidirectional events |
| **Mongoose** | 8+ | MongoDB ODM |
| **JWT (jsonwebtoken)** | 9+ | Authentication tokens |
| **bcryptjs** | 2+ | Password hashing |
| **Multer** | 1+ | File upload handling |
| **node-cron** | 3+ | Scheduled SLA timer jobs |
| **express-rate-limit** | 7+ | API rate limiting |
| **helmet** | 7+ | HTTP security headers |
| **cors** | 2+ | Cross-origin resource sharing |
| **winston** | 3+ | Logging |
| **joi** | 17+ | Request validation |

### Database & Storage
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Primary database (users, reports, NGOs, rewards) |
| **Redis** | Session cache, SLA timer state, real-time queues |
| **Cloudinary** | Media storage (images, videos from reports) |

### AI / ML Services
| Technology | Purpose |
|-----------|---------|
| **OpenAI GPT-4o API** | Report analysis, severity classification, keyword extraction |
| **Google Cloud Vision API** | Image content analysis and verification |
| **Google Maps Geocoding API** | Convert coordinates to human-readable addresses |
| **Google Places API** | Nearby NGO discovery |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend hosting |
| **Railway / Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **GitHub Actions** | CI/CD pipeline |

### Third-Party APIs
| Service | Purpose |
|---------|---------|
| **Firebase Cloud Messaging (FCM)** | Push notifications |
| **Twilio** | SMS alerts for SOS emergencies |
| **SendGrid** | Transactional emails |
| **Razorpay** | Marketplace payments (India-first) |
| **Google Maps JavaScript API** | Map rendering |

---

## 🔨 All Features to Build

---

### 1. Authentication & User Roles

**What to build:**
A multi-role authentication system supporting five distinct user types, each with a different onboarding flow, dashboard, and permissions.

**User Roles:**
| Role | Description | Access |
|------|-------------|--------|
| `CITIZEN` | General public who report issues | Report, track own reports, marketplace |
| `VOLUNTEER` | Community helpers who resolve issues | Task board, rewards, leaderboard |
| `NGO_ADMIN` | NGO representatives | Full NGO dashboard, case management |
| `AUTHORITY` | Government officials | Escalated cases, city-wide view |
| `SUPER_ADMIN` | Platform administrators | Everything + platform management |

**Features to implement:**
- Registration with role selection
- Email verification via SendGrid OTP
- Phone number verification via Twilio OTP
- JWT access token + refresh token rotation (access: 15min, refresh: 7d)
- Google OAuth2.0 social login
- Password reset via email link
- Role-based route guards on frontend
- NGO registration requires document upload + admin approval
- "Remember me" with long-lived refresh tokens
- Device management (see logged-in devices, revoke sessions)

**Libraries:**
```
Backend:  jsonwebtoken, bcryptjs, passport-google-oauth20, nodemailer, twilio
Frontend: firebase/auth (Google OAuth), react-router (protected routes)
```

**Database Collection: `users`**
```js
{
  _id, name, email, phone, passwordHash,
  role: "CITIZEN" | "VOLUNTEER" | "NGO_ADMIN" | "AUTHORITY" | "SUPER_ADMIN",
  isVerified, profilePicture,
  ngoId,          // if role is NGO_ADMIN
  rewardPoints,   // if role is VOLUNTEER or CITIZEN
  location: { type: "Point", coordinates: [lng, lat] },
  notificationPreferences: { push, sms, email },
  createdAt, updatedAt
}
```

---

### 2. Issue Reporting System

**What to build:**
A rich, multi-step form that lets citizens report any community issue with media, location, and context — then tracks it through to resolution.

**Features to implement:**
- Multi-step report wizard (Category → Details → Location → Media → Review)
- Issue categories: `Sanitation`, `Infrastructure`, `Health`, `Environment`, `Safety`, `Disaster`, `Other`
- Rich text description with character limit
- Upload up to 5 photos or 2 videos per report (max 50MB total)
- Voice-to-text description input (Web Speech API)
- Auto-detect GPS location with map pin confirmation
- Manual address search as fallback (Google Places autocomplete)
- Anonymous reporting option (no user account required)
- Duplicate detection — warn if similar issue exists nearby
- Real-time status tracker shown to reporter:
  ```
  Submitted → Verified by AI → Assigned to NGO → In Progress → Resolved ✅
  ```
- Comment thread on each report for public updates
- Share report via link for community awareness
- "Me too" upvote button — boosts priority score of important issues
- Report history page for logged-in users

**Libraries:**
```
Frontend: react-dropzone, react-hook-form, @react-google-maps/api,
          Web Speech API (built-in browser), framer-motion
Backend:  multer, cloudinary, sharp (image compression)
```

**Database Collection: `reports`**
```js
{
  _id, reporterId, isAnonymous,
  category: "SANITATION" | "INFRASTRUCTURE" | "HEALTH" | ...,
  title, description,
  media: [{ url, type: "IMAGE" | "VIDEO", cloudinaryId }],
  location: { type: "Point", coordinates: [lng, lat], address, city, state },
  aiAnalysis: {
    severity: "CRITICAL" | "SEVERE" | "MODERATE",
    keywords: [],
    confidenceScore,
    isVerified,
    analyzedAt
  },
  status: "SUBMITTED" | "AI_VERIFIED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  assignedNgoId, assignedVolunteerId,
  slaDeadline, slaBreached,
  escalationHistory: [{ ngoId, escalatedAt, reason }],
  upvotes: [userId],
  comments: [{ userId, text, createdAt }],
  resolvedAt, resolutionProof: [{ url, type }],
  createdAt, updatedAt
}
```

---

### 3. SOS Emergency System

**What to build:**
A one-tap emergency alert that bypasses all AI classification steps and immediately pings the nearest NGO and authorities simultaneously.

**Features to implement:**
- Big red **SOS button** accessible from any screen (sticky floating button)
- Hold for 3 seconds to prevent accidental triggers (with countdown animation)
- Instantly captures:
  - GPS coordinates (auto, no waiting)
  - Optional voice note (auto-starts recording)
  - Optional photo/video attachment
- SOS broadcasts to:
  1. All verified NGOs within 5km radius
  2. Assigned emergency authority for the area
  3. User's saved emergency contacts (SMS via Twilio)
- SOS gets a **10-minute SLA** timer — no AI delay
- Audio alert plays on NGO dashboard when a new SOS arrives
- SOS tracking page for the user: "Help is X minutes away"
- **SOS Chat** — direct text channel between user and the responding NGO/volunteer
- Auto-share live location every 30 seconds during active SOS
- Cancel SOS with confirmation (to prevent false alarms)

**Libraries:**
```
Backend:  twilio (SMS), socket.io (real-time NGO alert), node-cron (SLA timer)
Frontend: navigator.geolocation API, MediaRecorder API (voice), socket.io-client
```

**Database Collection: `sos_alerts`**
```js
{
  _id, userId,
  location: { type: "Point", coordinates: [lng, lat] },
  voiceNoteUrl, mediaUrls,
  status: "ACTIVE" | "RESPONDED" | "RESOLVED" | "CANCELLED",
  respondingNgoId, respondingVolunteerId,
  notifiedNgos: [{ ngoId, notifiedAt, responded: Boolean }],
  notifiedAuthorities: [{ authorityId, notifiedAt }],
  smsAlertsSent: [{ phone, sentAt }],
  chatMessages: [{ senderId, text, createdAt }],
  liveLocation: [{ coordinates, recordedAt }],
  createdAt, resolvedAt
}
```

---

### 4. AI Analysis Engine

**What to build:**
An AI pipeline that automatically processes each incoming report, assigns severity, extracts keywords, verifies the content is legitimate, and routes it to the best available NGO.

**Processing Pipeline:**

```
New Report Submitted
       ↓
1. IMAGE ANALYSIS (Google Cloud Vision)
   - Detect objects, scenes, unsafe content
   - Extract visual context from photos
       ↓
2. TEXT ANALYSIS (OpenAI GPT-4o)
   - Extract keywords and location clues
   - Classify issue category
   - Assess urgency from language
   - Detect spam or false reports
       ↓
3. SEVERITY SCORING
   - CRITICAL:  Immediate life risk, mass affected, disaster
   - SEVERE:    Health risk, large group affected, urgent infrastructure
   - MODERATE:  Quality of life issue, small area, non-urgent
       ↓
4. PROXIMITY MATCHING
   - Find all NGOs within 10km handling this category
   - Score NGOs by: proximity + current capacity + past response rate
       ↓
5. ASSIGNMENT
   - Assign top-scored NGO
   - Start SLA timer
   - Push real-time notification to NGO dashboard
```

**OpenAI Prompt Design:**
```js
// backend/src/services/ai.service.js
const systemPrompt = `You are an AI classifier for a community issue
reporting platform in India. Analyze reports and respond ONLY in valid JSON.`;

const userPrompt = `
Analyze this community report:
Title: ${report.title}
Description: ${report.description}
Category: ${report.category}
Image Analysis: ${imageDescription}
Location: ${report.location.city}, ${report.location.state}

Respond with this exact JSON:
{
  "severity": "CRITICAL|SEVERE|MODERATE",
  "confidence": 0.0,
  "keywords": ["keyword1", "keyword2"],
  "isLegitimate": true,
  "reason": "brief explanation",
  "suggestedCategory": "...",
  "estimatedAffected": "individual|small_group|community|mass"
}`;
```

**Libraries:**
```
Backend: openai (npm), @google-cloud/vision, axios
```

---

### 5. NGO Dashboard

**What to build:**
A powerful, real-time operations center for NGO administrators to manage incoming cases, assign volunteers, and track resolution.

**Features to implement:**

**Overview Panel:**
- Live count widgets: Active Cases, Pending, Resolved Today, SLA Breaches
- Severity breakdown donut chart (Critical / Severe / Moderate)
- Response rate and average resolution time metrics

**Interactive Map View:**
- All active issues plotted with colored pins by severity
- Cluster grouping when zoomed out
- Heatmap toggle to see problem density zones
- Volunteer location dots (real-time GPS if enabled)

**Case Management (Kanban Board):**
```
[INCOMING]  →  [ACKNOWLEDGED]  →  [IN PROGRESS]  →  [RESOLVED]
```
- Drag-and-drop cards between columns (`@dnd-kit/core`)
- Filter by severity, category, date, volunteer assigned
- Bulk actions: Assign, Escalate, Close

**Case Detail View:**
- Full report: media gallery, description, location map
- One-click volunteer assignment
- SLA timer countdown (red when < 20% time remaining)
- Escalate button with reason selection
- Resolution submission form (notes + evidence upload)
- Full activity timeline

**Volunteer Management:**
- Roster with live availability status
- Assign volunteers to cases
- Volunteer performance stats

**Libraries:**
```
Frontend: recharts, react-leaflet, leaflet.heat, @dnd-kit/core, socket.io-client
```

---

### 6. SLA & Auto-Escalation Engine

**What to build:**
A background job system that monitors every active case's timer and automatically escalates when NGOs don't respond in time.

**SLA Tiers:**
| Severity | Response SLA | Resolution SLA |
|----------|-------------|----------------|
| CRITICAL | 10 minutes | 2 hours |
| SEVERE | 1 hour | 12 hours |
| MODERATE | 6 hours | 48 hours |

**Escalation Ladder:**
```
Level 1: Assigned NGO (SLA timer starts)
    ↓ (no response within SLA)
Level 2: Next closest NGO + SMS to NGO coordinator
    ↓ (no response at 50% of new SLA)
Level 3: All NGOs in city with matching category notified
    ↓ (still no response)
Level 4: Government Authority for the district
    ↓ (CRITICAL only)
Level 5: Emergency services (police/fire/ambulance)
```

**Implementation:**
```js
// backend/src/jobs/slaMonitor.job.js
const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  const breachedCases = await Report.find({
    status: { $in: ['ASSIGNED', 'IN_PROGRESS'] },
    slaDeadline: { $lte: new Date() },
    slaBreached: false
  });

  for (const report of breachedCases) {
    await escalateReport(report);       // find next NGO
    await notifyEscalation(report);     // push + SMS + email
    report.slaBreached = true;
    await report.save();
  }
});
```

---

### 7. Volunteer System

**What to build:**
A complete task management system — volunteers discover tasks, claim them, take on-ground action, and submit resolution proof.

**Task Flow:**
```
1. Volunteer CLAIMS a task (or NGO assigns it)
2. Timer: 30 min to reach location
3. On-site: chat with reporter and NGO
4. Upload EVIDENCE of resolution (before/after photos)
5. NGO or AI verifies evidence
6. Task marked RESOLVED → points credited instantly
```

**Features to implement:**
- Nearby tasks map (all open cases near volunteer)
- Task feed sorted by: proximity / severity / reward points
- Filter by category and search radius
- Volunteer profile: points, badges, skills, area of operation
- Skills selection: First Aid, Rescue, Legal Aid, Food Distribution, etc.
- NGOs can verify/endorse volunteer skills
- AI task recommendation based on skills + location

**Libraries:**
```
Frontend: react-leaflet (nearby tasks map), framer-motion (task card animations)
Backend:  MongoDB $geoNear (proximity search), cloudinary (evidence upload)
```

---

### 8. Rewards & Gamification

**What to build:**
A points-based system that turns participation into tangible career and academic benefits.

**How Points Are Earned:**
| Action | Points |
|--------|--------|
| Report a verified issue | 10 pts |
| SOS report | 25 pts |
| Issue resolved (reporter bonus) | 15 pts |
| Complete volunteer task (Moderate) | 50 pts |
| Complete volunteer task (Severe) | 100 pts |
| Complete volunteer task (Critical/SOS) | 250 pts |
| First task of the day | 20 pts bonus |
| 7-day activity streak | 100 pts bonus |
| Report gets 10 upvotes | 30 pts |
| Refer a new volunteer | 50 pts |

**How Points Are Redeemed:**
| Reward | Points Required |
|--------|----------------|
| Digital Certificate of Participation | 100 pts |
| NGO Letter of Recommendation | 500 pts |
| Academic Credit (partner universities) | 1000 pts |
| Internship with partner NGO | 2000 pts |
| Marketplace 10% discount | 200 pts |
| Marketplace 25% discount | 500 pts |

**Gamification Elements:**
- **Leaderboard** — weekly, monthly, all-time (city / state / national)
- **Badges** — 30+ unique achievement badges with SVG art
- **Levels** — Newcomer → Helper → Activist → Champion → Legend
- **Streaks** — daily/weekly activity streaks with bonus multipliers
- **Team Challenges** — NGOs create group missions with shared rewards
- **Impact Score** — visible public score showing total community impact

**Certificate Generation:**
- Auto-generate PDF using PDFKit or Puppeteer
- Unique QR code on each certificate (links to verification page)
- Digital NGO/authority signature
- One-click share to LinkedIn

**Libraries:**
```
Backend:  pdfkit or puppeteer (PDF), qrcode (QR generation)
Frontend: recharts (progress charts), framer-motion (badge unlock animation)
```

---

### 9. NGO Marketplace

**What to build:**
An in-app e-commerce store where NGOs sell handmade and eco-friendly products to fund their operations sustainably.

**Features to implement:**

**Product Listings:**
- NGO creates listings: title, description, price, photos, stock quantity
- Categories: Handmade Crafts, Organic Food, Eco-Friendly Products, Art, Clothing
- Product tags: "Made by Survivors", "Women-Made", "Upcycled"
- Each product shows the NGO's name and impact story

**Shopping Experience:**
- Browse by category, NGO, price range, tags
- Product detail page with photo gallery and NGO story
- "100% of revenue goes to [NGO Name]" badge on each item
- Cart with item management

**Checkout:**
- Guest checkout (no account needed)
- Razorpay payment gateway (UPI, Net Banking, Cards, Wallets)
- Order confirmation email (SendGrid)
- GST invoice generation
- Apply reward points as discount at checkout

**Order Management:**
- Buyer: Order history, shipping status
- NGO: Fulfillment dashboard, mark as shipped, tracking number upload
- Admin: Revenue oversight, monthly payout management

**Revenue Model:**
- 90% of revenue → NGO directly
- 10% platform fee for sustainability
- Monthly automated payouts via Razorpay Route

**Libraries:**
```
Frontend: react-hook-form (checkout), razorpay checkout JS
Backend:  razorpay (npm), sendgrid (order emails), pdfkit (invoices)
```

---

### 10. Notifications

**What to build:**
A multi-channel notification system that keeps every user informed across push, SMS, and email.

**Notification Matrix:**

| Event | In-App | Push (FCM) | SMS (Twilio) | Email |
|-------|--------|-----------|--------------|-------|
| New SOS near volunteer | ✅ | ✅ | ✅ | ❌ |
| Report status update | ✅ | ✅ | ❌ | ✅ |
| SLA breach warning | ✅ | ✅ | ✅ | ✅ |
| Task assigned to volunteer | ✅ | ✅ | ✅ | ❌ |
| Points earned | ✅ | ✅ | ❌ | ❌ |
| Badge unlocked | ✅ | ✅ | ❌ | ❌ |
| Order placed / shipped | ✅ | ✅ | ❌ | ✅ |
| Escalation triggered | ✅ | ✅ | ✅ | ✅ |
| Weekly impact summary | ✅ | ❌ | ❌ | ✅ |

**Notification Center UI:**
- Bell icon with unread count badge
- Grouped: Urgent / Updates / Rewards / Orders
- Per-type on/off toggles in settings
- Do Not Disturb hours

**FCM Push Setup:**
```js
// backend/src/services/notification.service.js
const admin = require('firebase-admin');

async function sendPushNotification(fcmToken, title, body, data) {
  await admin.messaging().send({
    token: fcmToken,
    notification: { title, body },
    data,
    android: { priority: 'high' },
    apns: { payload: { aps: { sound: 'default' } } }
  });
}
```

---

### 11. Admin Panel

**What to build:**
A super-admin dashboard for platform governance — NGO approvals, content moderation, user management, and analytics.

**Features to implement:**

**NGO Management:**
- Review new NGO registration applications
- Verify NGO documents (registration cert, 80G cert, etc.)
- Approve / Reject / Suspend NGO accounts
- Manually assign NGOs to geographic service zones

**User Management:**
- View all users with role filters
- Suspend / Ban users
- Promote users to volunteer or authority roles

**Report Moderation:**
- Review AI-flagged false or abusive reports
- Override AI severity classification
- Track reports with most escalations (systemic issues)

**Platform Analytics:**
- Total reports by city/state (choropleth map)
- Daily/weekly/monthly active users
- NGO response rate benchmarks
- Volunteer retention rates
- Marketplace GMV and transaction volume

**System Health:**
- API response time
- Database connection status
- Background job (cron) status
- Error log viewer

---

### 12. Public Impact Dashboard

**What to build:**
A publicly accessible, no-login page showing real-time social impact metrics to build trust and inspire new users.

**Metrics to display:**
- Total Issues Reported (all time / this month)
- Issues Resolved (with % resolution rate)
- Active Volunteers (weekly)
- NGOs on Platform
- SOS Alerts Responded To
- Average Response Time by city
- Marketplace: Products sold, Revenue generated for NGOs

**Visualizations:**
- India map with city-level heatmap of issues
- Line chart: Issues Reported vs Resolved (last 12 months)
- Top 10 most active cities
- Category breakdown pie chart
- NGO leaderboard by impact score
- Animated counting numbers on key stats (using Framer Motion)

**Libraries:**
```
Frontend: recharts, react-simple-maps (India SVG map), framer-motion
```

---

## 🗄️ Database Schema

### MongoDB Collections Overview
```
📦 lifeline-db
├── users
├── reports
├── sos_alerts
├── ngos
├── rewards
├── redemptions
├── notifications
├── marketplace_products
├── orders
├── sla_logs
├── escalation_logs
└── analytics_snapshots
```

**`ngos` collection:**
```js
{
  _id, name, registrationNumber,
  email, phone, website,
  adminIds: [userId],
  categories: ["HEALTH", "SANITATION", ...],
  serviceArea: { type: "Polygon", coordinates: [] },
  headquarters: { type: "Point", coordinates: [lng, lat], address },
  documents: [{ type, url, verified }],
  isVerified, isActive,
  stats: {
    totalCasesHandled, resolvedCount,
    avgResponseTimeMinutes, slaBreachCount,
    volunteerCount, marketplaceRevenue
  },
  bankDetails: { accountNumber, ifsc, upiId },
  createdAt
}
```

**`rewards` collection:**
```js
{
  _id, userId,
  balance: Number,
  level: "NEWCOMER" | "HELPER" | "ACTIVIST" | "CHAMPION" | "LEGEND",
  xp: Number,
  streak: { current, longest, lastActiveDate },
  badges: [{ id, name, earnedAt }],
  transactions: [{
    type: "EARNED" | "REDEEMED",
    points, reason, referenceId, createdAt
  }]
}
```

### Required MongoDB Indexes
```js
// Run once after first launch — enables all geospatial queries
db.reports.createIndex({ location: "2dsphere" })
db.ngos.createIndex({ serviceArea: "2dsphere" })
db.users.createIndex({ location: "2dsphere" })
db.sos_alerts.createIndex({ location: "2dsphere" })
db.reports.createIndex({ status: 1, slaDeadline: 1 })  // SLA cron job
db.reports.createIndex({ createdAt: -1 })               // Sort by newest
```

---

## 📡 API Endpoints Reference

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout (revoke refresh token)
POST   /api/auth/refresh           - Get new access token
POST   /api/auth/verify-email      - Verify email OTP
POST   /api/auth/verify-phone      - Verify phone OTP
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset with token
GET    /api/auth/google            - Google OAuth redirect
GET    /api/auth/google/callback   - Google OAuth callback
```

### Reports
```
POST   /api/reports                - Submit new report
GET    /api/reports                - List reports (with filters)
GET    /api/reports/:id            - Get report details
PATCH  /api/reports/:id/status     - Update status (NGO/Admin)
POST   /api/reports/:id/upvote     - Upvote a report
POST   /api/reports/:id/comments   - Add comment
POST   /api/reports/:id/resolve    - Submit resolution evidence
GET    /api/reports/nearby         - Reports near coordinates
GET    /api/reports/mine           - Current user's reports
```

### SOS
```
POST   /api/sos                    - Create SOS alert
PATCH  /api/sos/:id/respond        - NGO responds to SOS
PATCH  /api/sos/:id/resolve        - Mark SOS resolved
PATCH  /api/sos/:id/cancel         - Cancel SOS
POST   /api/sos/:id/location       - Update live location
GET    /api/sos/:id/chat           - Get SOS chat messages
POST   /api/sos/:id/chat           - Send SOS chat message
```

### NGO
```
POST   /api/ngos/register          - Register new NGO
GET    /api/ngos                   - List all verified NGOs
GET    /api/ngos/:id               - NGO details
GET    /api/ngos/:id/dashboard     - Full dashboard data
PATCH  /api/ngos/:id/cases/:caseId - Update case status
POST   /api/ngos/:id/volunteers    - Assign volunteer to case
GET    /api/ngos/nearby            - Find NGOs near coordinates
```

### Rewards
```
GET    /api/rewards/me             - My rewards balance + history
GET    /api/rewards/leaderboard    - Top volunteers
GET    /api/rewards/catalog        - Redemption catalog
POST   /api/rewards/redeem         - Redeem points for reward
GET    /api/rewards/certificates   - Get earned certificates
```

### Marketplace
```
GET    /api/marketplace/products          - List products
GET    /api/marketplace/products/:id      - Product details
POST   /api/marketplace/products          - Create product (NGO)
PATCH  /api/marketplace/products/:id      - Update product (NGO)
POST   /api/marketplace/cart/checkout     - Initiate Razorpay checkout
POST   /api/marketplace/orders            - Create order
GET    /api/marketplace/orders/mine       - My order history
PATCH  /api/marketplace/orders/:id/ship   - Mark as shipped (NGO)
```

---

## 📁 Folder Structure

```
IndiaInnovates/
│
├── frontend/                          # React Application (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                    # Images, icons, fonts
│   │   ├── components/
│   │   │   ├── common/                # Button, Modal, Card, Toast, Spinner
│   │   │   ├── map/                   # MapView, IssuePin, HeatMap, ClusterMap
│   │   │   ├── report/                # ReportForm, ReportCard, StatusTracker
│   │   │   ├── sos/                   # SOSButton, SOSChat, SOSTracker
│   │   │   ├── ngo/                   # NGODashboard, KanbanBoard, CaseCard
│   │   │   ├── volunteer/             # TaskFeed, TaskCard, VolunteerProfile
│   │   │   ├── rewards/               # PointsBalance, Leaderboard, BadgeGrid
│   │   │   ├── marketplace/           # ProductCard, Cart, Checkout, OrderCard
│   │   │   └── notifications/         # NotificationBell, NotificationList
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── auth/                  # Login, Register, ForgotPassword
│   │   │   ├── citizen/               # ReportPage, MyReports, TrackReport
│   │   │   ├── volunteer/             # TaskBoard, MyTasks, Profile
│   │   │   ├── ngo/                   # Dashboard, Cases, Analytics
│   │   │   ├── marketplace/           # Shop, ProductDetail, Cart, Orders
│   │   │   ├── rewards/               # Rewards, Leaderboard, Certificates
│   │   │   ├── impact/                # PublicImpactDashboard
│   │   │   └── admin/                 # AdminPanel, NGOApprovals
│   │   ├── hooks/
│   │   │   ├── useGeolocation.js
│   │   │   ├── useSocket.js
│   │   │   ├── useNotifications.js
│   │   │   └── useRewards.js
│   │   ├── services/                  # API call functions
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── auth.service.js
│   │   │   ├── reports.service.js
│   │   │   ├── sos.service.js
│   │   │   ├── ngo.service.js
│   │   │   ├── rewards.service.js
│   │   │   └── marketplace.service.js
│   │   ├── store/                     # Zustand global state
│   │   │   ├── authStore.js
│   │   │   ├── notificationStore.js
│   │   │   └── cartStore.js
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   ├── severityColors.js
│   │   │   └── geoUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                  # MongoDB connection
│   │   │   ├── redis.js               # Redis connection
│   │   │   ├── firebase.js            # Firebase admin init
│   │   │   └── cloudinary.js          # Cloudinary config
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Report.js
│   │   │   ├── SosAlert.js
│   │   │   ├── Ngo.js
│   │   │   ├── Reward.js
│   │   │   ├── Notification.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── reports.routes.js
│   │   │   ├── sos.routes.js
│   │   │   ├── ngo.routes.js
│   │   │   ├── rewards.routes.js
│   │   │   └── marketplace.routes.js
│   │   ├── controllers/               # Route handler functions
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   ├── role.middleware.js     # Role-based access control
│   │   │   ├── upload.middleware.js   # Multer + Cloudinary
│   │   │   └── rateLimit.middleware.js
│   │   ├── services/
│   │   │   ├── ai.service.js          # OpenAI + Vision API pipeline
│   │   │   ├── sla.service.js         # SLA + escalation logic
│   │   │   ├── notification.service.js# FCM + Twilio + SendGrid
│   │   │   ├── rewards.service.js     # Points calculation
│   │   │   └── geo.service.js         # Geospatial queries
│   │   ├── jobs/
│   │   │   ├── slaMonitor.job.js      # Cron: check SLA every minute
│   │   │   └── weeklyDigest.job.js    # Cron: weekly email summary
│   │   ├── sockets/
│   │   │   ├── sos.socket.js          # SOS real-time events
│   │   │   └── dashboard.socket.js    # NGO dashboard live updates
│   │   └── utils/
│   │       ├── logger.js              # Winston logger
│   │       ├── emailTemplates.js      # HTML email templates
│   │       └── certificateGenerator.js# PDF certificate with QR code
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Run tests on every PR
│       └── deploy.yml                 # Auto-deploy on merge to main
│
└── README.md
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Backend (`backend/.env`)
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lifeline
REDIS_URL=redis://localhost:6379

# Auth
JWT_ACCESS_SECRET=your_access_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_key

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Maps
GOOGLE_MAPS_API_KEY=your_maps_key

# Notifications
FIREBASE_SERVICE_ACCOUNT_KEY=./config/serviceAccountKey.json
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Email
SENDGRID_API_KEY=SG.your_sendgrid_key
EMAIL_FROM=noreply@lifeline.in

# Payments
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Platform Config
PLATFORM_COMMISSION_RATE=0.10
SLA_CRITICAL_MINUTES=10
SLA_SEVERE_MINUTES=60
SLA_MODERATE_MINUTES=360
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js `v20+`
- MongoDB Atlas account (free M0 tier works to start)
- Redis (local or [Upstash](https://upstash.com) free tier)
- Accounts for: Firebase, OpenAI, Google Cloud, Cloudinary, Twilio, SendGrid, Razorpay

### Step 1 — Clone Repository
```bash
git clone https://github.com/jrdevadattan/IndiaInnovates.git
cd IndiaInnovates
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your credentials
npm run dev
# Server starts at http://localhost:5000
```

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# Fill in .env with your credentials
npm run dev
# App starts at http://localhost:3000
```

### Step 4 — Initialize Database Indexes
Run this once in MongoDB Atlas shell or Compass after first launch:
```js
db.reports.createIndex({ location: "2dsphere" })
db.ngos.createIndex({ serviceArea: "2dsphere" })
db.users.createIndex({ location: "2dsphere" })
db.sos_alerts.createIndex({ location: "2dsphere" })
db.reports.createIndex({ status: 1, slaDeadline: 1 })
```

---

## 🔧 Third-Party Services Setup

### Firebase (Push Notifications + Auth)
1. [Firebase Console](https://console.firebase.google.com) → Create Project → "lifeline"
2. Enable **Cloud Messaging (FCM)** in project settings
3. Generate Service Account key → download `serviceAccountKey.json` → place in `backend/src/config/`
4. Add Web App → copy the Firebase config to your frontend `.env`

### OpenAI (AI Classification)
1. [platform.openai.com](https://platform.openai.com) → API Keys → Create key
2. Add to backend `.env` as `OPENAI_API_KEY`
3. Requires GPT-4o access (needs paid credits)

### Google Cloud (Maps + Vision)
1. [Google Cloud Console](https://console.cloud.google.com) → New Project
2. Enable APIs: Maps JavaScript, Geocoding, Places, Cloud Vision
3. Create API Key → add HTTP referrer restrictions for Maps, IP restrictions for Vision

### Twilio (SMS Alerts)
1. [twilio.com](https://www.twilio.com) → Create account → Get trial number
2. Buy an Indian (+91) number for SMS to Indian users
3. Add Account SID, Auth Token, and phone number to `.env`

### Cloudinary (Media Storage)
1. [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard shows Cloud Name, API Key, API Secret
3. Create upload presets for reports and SOS separately

### Razorpay (Marketplace Payments)
1. [razorpay.com](https://razorpay.com) → Create account
2. Dashboard → Settings → API Keys → Generate test keys
3. For Route (payouts to NGOs): enable Razorpay Route in dashboard

---

## 🌐 Deployment Guide

### Frontend → Vercel
```bash
cd frontend && npm run build
# Push to GitHub
# Connect repo to vercel.com → auto-deploys on every push to main
# Add all VITE_ environment variables in Vercel project settings
```

### Backend → Railway
```bash
# Push to GitHub
# Create new project at railway.app
# Connect to GitHub → select /backend folder
# Add all environment variables in Railway dashboard
# Railway auto-detects Node.js, runs npm start
```

### Database → MongoDB Atlas
- Free M0 cluster for development
- Upgrade to M10+ for production (required for full Atlas Search)
- Whitelist Railway's static IP in Atlas Network Access

### CI/CD with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy on Push to Main
on:
  push:
    branches: [main]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd frontend && npm ci && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🔮 Future Roadmap

### v1.0 — Foundation *(Current Phase)*
- [x] Frontend scaffolding (React)
- [ ] Backend scaffolding (Node + Express + MongoDB)
- [ ] Auth system with all roles
- [ ] Issue reporting with media upload
- [ ] Basic NGO dashboard with map
- [ ] SLA timer engine

### v1.5 — Intelligence
- [ ] AI severity classification (OpenAI + Vision)
- [ ] Real-time WebSocket events
- [ ] Push notifications (FCM)
- [ ] Auto-escalation cron jobs
- [ ] SMS alerts via Twilio

### v2.0 — Community
- [ ] Volunteer task system
- [ ] Rewards + points + badges
- [ ] Leaderboard
- [ ] Certificate generation (PDF + QR)
- [ ] NGO Marketplace with Razorpay

### v2.5 — Scale
- [ ] Admin panel
- [ ] Public impact dashboard
- [ ] Multi-language (Hindi, Tamil, Telugu, Bengali)
- [ ] Mobile app (React Native)

### v3.0 — Ecosystem
- [ ] University partnership API (academic credits)
- [ ] Government API integrations
- [ ] Crowdfunding module for NGO causes
- [ ] NGO collaboration network
- [ ] Offline mode (PWA + Service Workers)
- [ ] AI community impact predictions
- [ ] AI-powered chatbot for reporting assistance

---

## 🤝 Contributing

**We welcome contributions in all areas:**

| Area | Good First Issues |
|------|-----------------|
| **Frontend** | Component styling, form validation, responsive design |
| **Backend** | New API endpoints, input validation, error handling |
| **AI/ML** | Better classification prompts, multilingual support |
| **DevOps** | CI/CD setup, Docker configuration |
| **Docs** | API documentation, inline code comments |

**Contribution Steps:**
1. Fork the repository
2. `git checkout -b feature/your-feature-name`
3. Write code + tests
4. `git commit -m 'feat: describe your change'`
5. Open a Pull Request with screenshots or demo video

---

## 👥 Team

| Name | Role |
|------|------|
| **Preetha Mondal** | Team Member |
| **Praveen Kumar Saini** | Team Member |
| **Priyansh Loyal** | Team Member |
| **Priyansh Bhaskar** | Team Member |

*Built for the DTIL Project — [India Innovates Initiative](https://github.com/jrdevadattan/IndiaInnovates)*

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

> *"Empower every citizen to become a changemaker — where technology, transparency, and community action create lasting social impact."*

**⭐ Star this repo if you believe in community-driven change!**

[Report a Bug](https://github.com/jrdevadattan/IndiaInnovates/issues) · [Request a Feature](https://github.com/jrdevadattan/IndiaInnovates/issues) · [Join as Contributor](CONTRIBUTING.md)

Made with ❤️ in India

</div>
