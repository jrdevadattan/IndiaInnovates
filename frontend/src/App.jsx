import React, { useState, useEffect, lazy, Suspense } from "react";
import useAuthStore from "./store/authStore";
import Auth from "./components/Auth";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";

// Existing pages
import LandingPage from "./pages/LandingPage";
import Posts from "./pages/Posts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAI from "./pages/AdminAI";
import AdminAIHistory from "./pages/AdminAIHistory";

// New pages — lazy loaded
const SOSPage = lazy(() => import("./pages/sos/SOSPage"));
const NGODashboard = lazy(() => import("./pages/ngo/NGODashboard"));
const NGOCases = lazy(() => import("./pages/ngo/NGOCases"));
const Shop = lazy(() => import("./pages/marketplace/Shop"));
const ProductDetail = lazy(() => import("./pages/marketplace/ProductDetail"));
const Cart = lazy(() => import("./pages/marketplace/Cart"));
const Orders = lazy(() => import("./pages/marketplace/Orders"));
const RewardsPage = lazy(() => import("./pages/rewards/RewardsPage"));
const Leaderboard = lazy(() => import("./pages/rewards/Leaderboard"));
const TaskBoard = lazy(() => import("./pages/volunteer/TaskBoard"));
const PublicImpactDashboard = lazy(() => import("./pages/impact/PublicImpactDashboard"));
const NGOApprovals = lazy(() => import("./pages/admin/NGOApprovals"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Floating components
import SOSButton from "./components/sos/SOSButton";

const PageFallback = () => (
  <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">Loading...</div>
);

// Redirects non-admins away from admin routes
function AdminGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// Redirects unauthenticated users to login
function AuthGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Redirects non-NGO/admin users away from NGO routes
function NGOGuard({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ngo' && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/impact" element={<PublicImpactDashboard />} />

          {/* Community feed */}
          <Route path="/posts" element={<Posts />} />

          {/* SOS */}
          <Route path="/sos" element={<AuthGuard><SOSPage /></AuthGuard>} />

          {/* Volunteer */}
          <Route path="/volunteer/tasks" element={<AuthGuard><TaskBoard /></AuthGuard>} />

          {/* NGO routes */}
          <Route path="/ngo/dashboard" element={<NGOGuard><NGODashboard /></NGOGuard>} />
          <Route path="/ngo/cases" element={<NGOGuard><NGOCases /></NGOGuard>} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<AuthGuard><Shop /></AuthGuard>} />
          <Route path="/marketplace/product/:id" element={<AuthGuard><ProductDetail /></AuthGuard>} />
          <Route path="/marketplace/cart" element={<AuthGuard><Cart /></AuthGuard>} />
          <Route path="/marketplace/orders" element={<AuthGuard><Orders /></AuthGuard>} />

          {/* Rewards */}
          <Route path="/rewards" element={<AuthGuard><RewardsPage /></AuthGuard>} />
          <Route path="/rewards/leaderboard" element={<AuthGuard><Leaderboard /></AuthGuard>} />

          {/* Admin routes — requires role === 'admin' */}
          <Route path="/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin-dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin-reports" element={<AdminGuard><AdminReports /></AdminGuard>} />
          <Route path="/admin-analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
          <Route path="/admin-ai" element={<AdminGuard><AdminAI /></AdminGuard>} />
          <Route path="/admin-ai-history" element={<AdminGuard><AdminAIHistory /></AdminGuard>} />
          <Route path="/admin/ngo-approvals" element={<AdminGuard><NGOApprovals /></AdminGuard>} />
        </Routes>
      </Suspense>

      {/* Floating SOS button shown on all pages when logged in */}
      <SOSButton />
    </div>
  );
}

export default App;
