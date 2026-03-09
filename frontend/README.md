<div align="center">

# LIFELINE — Frontend

### React 19 SPA for Civic Action & Emergency Response

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | Component-driven UI |
| **Vite** | 7 | Build tool with HMR |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Zustand** | 4.5 | Lightweight state management |
| **React Router DOM** | 7 | Client-side routing |
| **Leaflet / React-Leaflet** | 1.9 / 5.0 | Interactive maps |
| **Recharts** | 2.10 | Data visualization charts |
| **Axios** | 1.6 | HTTP client with interceptors |
| **Socket.IO Client** | 4.6 | Real-time WebSocket communication |
| **Firebase** | 12.7 | Google OAuth & push notifications |
| **GSAP** | 3.14 | High-performance scroll/fade animations |
| **React Hot Toast** | 2.4 | Toast notifications |
| **React Icons** | 5.6 | Feather icon set |
| **React Markdown** | 10.1 | Markdown rendering (AI responses) |
| **date-fns** | 4.1 | Date formatting & arithmetic |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev        # http://localhost:5173

# Production build
npm run build      # Outputs to dist/

# Preview production build
npm run preview

# Lint
npm run lint
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Routes

### Public

| Path | Page | Description |
|------|------|-------------|
| `/` | LandingPage | GSAP-animated hero, mission statement, community reports preview, map, impact stats |
| `/login` | Auth | Login / register toggle with GSAP transitions |
| `/forgot-password` | ForgotPassword | Email-based password reset request |
| `/reset-password` | ResetPassword | Token-validated password reset form |
| `/impact` | PublicImpactDashboard | Public-facing stats: total reports, resolved, active NGOs, category breakdowns (Recharts) |
| `/posts` | Posts | Community feed of civic reports with category filters, sort (newest/most voted), 30s auto-refresh |

### Authenticated

| Path | Page | Description |
|------|------|-------------|
| `/sos` | SOSPage | Hold-to-trigger (3s) emergency alert with category selection and geolocation capture |
| `/volunteer/tasks` | TaskBoard | Volunteer task assignments filtered by user, status tabs, severity badges, SLA deadlines |
| `/marketplace` | Shop | Product grid with category filters and search |
| `/marketplace/product/:id` | ProductDetail | Image carousel, pricing, stock, add-to-cart |
| `/marketplace/cart` | Cart | Quantity management, subtotal, Razorpay checkout |
| `/marketplace/orders` | Orders | Order history with status badges and tracking |
| `/rewards` | RewardsPage | Points balance, level, XP, streaks, redemption catalog, certificate download |
| `/rewards/leaderboard` | Leaderboard | Podium rankings with time-period filters (all time / monthly / weekly) |

### NGO (requires NGO_ADMIN or SUPER_ADMIN role)

| Path | Page | Description |
|------|------|-------------|
| `/ngo/dashboard` | NGODashboard | Kanban board (SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED), live stats |
| `/ngo/cases` | NGOCases | Table view of all cases with status/severity filters |

### Admin (requires SUPER_ADMIN role)

| Path | Page | Description |
|------|------|-------------|
| `/dashboard` | AdminDashboard | Overview with map visualization, report stats, KPIs |
| `/admin-reports` | AdminReports | Filterable report table with inline status editing |
| `/admin-analytics` | AdminAnalytics | 7-day trend, resolution rate, category distribution (Recharts) |
| `/admin-ai` | AdminAI | Multi-turn AI chat with session persistence (localStorage) |
| `/admin-ai-history` | AdminAIHistory | Saved AI chat session browser |
| `/admin/ngo-approvals` | NGOApprovals | Pending NGO registration approval/rejection queue |

---

## Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Sticky top nav with explore dropdown, responsive mobile menu |
| `Sidebar` | Collapsible admin sidebar (80px / 280px) with GSAP animation |
| `DashboardMap` | React-Leaflet map with category-colored pin markers and popups |
| `AnalyticsPanel` | Bar chart of issues by category percentage |
| `IssueCard` | Report card: image, category badge, location, status, upvotes, time-ago |
| `FilterBar` | Multi-level category filter (main / sub-category) with sort dropdown |
| `ReportPopup` | Modal for submitting civic reports with file upload and geolocation |
| `Auth` | Login/register toggle form with GSAP animations |
| `Footer` | Dark footer with brand, links, social/contact |
| `LoadingScreen` | Full-screen splash with SVG logo animation |
| `LogoAnimation` | GSAP-powered SVG stroke draw + fill animation |
| `MapSection` | Embedded Google Maps iframe |
| `NotificationBell` | Header icon with unread badge and dropdown panel |
| `SOSButton` | Floating hold-to-trigger emergency button (bottom-right) |

---

## State Management (Zustand)

### `authStore`
- `user`, `accessToken`, `refreshToken`, `isLoading`
- Actions: `loginSuccess()`, `logout()`, `initialize()`, `hasRole()`
- Persisted to `lifeline-auth` localStorage key

### `cartStore`
- `items[]` — `{ productId, name, price, image, ngoId, quantity }`
- Actions: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `getTotal()`, `getCount()`
- Persisted to `lifeline-cart` localStorage key

### `notificationStore`
- `notifications[]`, `unreadCount`
- Actions: `fetch()`, `markAllRead()`, `addNotification()`
- Real-time updates via Socket.IO

---

## Custom Hooks

| Hook | Returns | Purpose |
|------|---------|---------|
| `useGeolocation` | `{ location, error, loading, getLocation, watchLocation }` | Browser Geolocation API wrapper |
| `useNotifications` | `{ notifications, unreadCount, markAllRead, refresh }` | Notification state + socket listener |
| `useRewards` | `{ rewards, loading, error, refresh }` | User rewards profile fetcher |
| `useSidebar` | `{ isSidebarCollapsed, toggleSidebar, isMobile }` | Responsive sidebar state (768px breakpoint) |
| `useSocket` | Socket.IO instance or `null` | Singleton WebSocket connection with JWT auth |

---

## API Services

All services use the Axios instance from `services/api.js` which:
- Attaches Bearer token from localStorage
- Auto-refreshes on 401 using the refresh token
- Base URL: `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`)

| Service | Endpoints |
|---------|-----------|
| `auth.service` | register, login, logout, refresh, me, verify-email, forgot-password, reset-password, fcm-token |
| `reports.service` | CRUD reports, upvote, comment, resolve, nearby, mine |
| `sos.service` | create, respond, resolve, cancel, live location, chat, mine |
| `ngo.service` | list, profile, dashboard, register, update case, assign volunteer, nearby |
| `marketplace.service` | products, checkout, orders, ship |
| `rewards.service` | me, leaderboard, catalog, redeem, certificate download |

---

## Deployment

### Vercel

```bash
npm run build
# Deploy dist/ via Vercel CLI or GitHub integration
```

A `vercel.json` is included for SPA rewrites.

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Firestore rules and indexes are configured in `firestore.rules` and `firestore.indexes.json`.

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
├── package.json
├── vercel.json
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── public/
└── src/
    ├── App.jsx                     # Route definitions + guards
    ├── main.jsx                    # Entry point
    ├── index.css                   # Global styles + Tailwind
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── Footer.jsx
    │   ├── Auth.jsx
    │   ├── DashboardMap.jsx
    │   ├── AnalyticsPanel.jsx
    │   ├── IssueCard.jsx
    │   ├── FilterBar.jsx
    │   ├── ReportPopup.jsx
    │   ├── From.jsx
    │   ├── LoadingScreen.jsx
    │   ├── LogoAnimation.jsx
    │   ├── MapSection.jsx
    │   ├── notifications/
    │   │   └── NotificationBell.jsx
    │   └── sos/
    │       └── SOSButton.jsx
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── Posts.jsx
    │   ├── AdminDashboard.jsx
    │   ├── AdminReports.jsx
    │   ├── AdminAnalytics.jsx
    │   ├── AdminAI.jsx
    │   ├── AdminAIHistory.jsx
    │   ├── auth/
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   ├── admin/
    │   │   └── NGOApprovals.jsx
    │   ├── sos/
    │   │   └── SOSPage.jsx
    │   ├── ngo/
    │   │   ├── NGODashboard.jsx
    │   │   └── NGOCases.jsx
    │   ├── marketplace/
    │   │   ├── Shop.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   └── Orders.jsx
    │   ├── rewards/
    │   │   ├── RewardsPage.jsx
    │   │   └── Leaderboard.jsx
    │   ├── volunteer/
    │   │   └── TaskBoard.jsx
    │   └── impact/
    │       └── PublicImpactDashboard.jsx
    ├── services/
    │   ├── api.js                  # Axios instance + interceptors
    │   ├── auth.service.js
    │   ├── reports.service.js
    │   ├── sos.service.js
    │   ├── ngo.service.js
    │   ├── marketplace.service.js
    │   └── rewards.service.js
    ├── store/
    │   ├── authStore.js            # Auth + persistence
    │   ├── cartStore.js            # Cart + persistence
    │   └── notificationStore.js    # Notifications + socket
    ├── hooks/
    │   ├── useGeolocation.js
    │   ├── useNotifications.js
    │   ├── useRewards.js
    │   ├── useSidebar.js
    │   └── useSocket.js
    ├── utils/
    │   └── uploadSingleImage.jsx
    └── assets/
```
