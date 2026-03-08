import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { login, register } from "../services/auth.service";
import useAuthStore from "../store/authStore";
import { FiEye } from "react-icons/fi";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.set(".auth-card", { y: 30, opacity: 0 });
    gsap.set(".auth-item", { y: 16, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".auth-card", { y: 0, opacity: 1, duration: 0.5 })
      .to(".auth-item", { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, "-=0.25");
  }, { scope: containerRef, dependencies: [mode] });

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let data;
      if (isSignup) {
        ({ data } = await register({ name, email, password }));
      } else {
        ({ data } = await login({ email, password }));
      }
      loginSuccess(data.user, data.accessToken, data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{ background: "radial-gradient(circle at 50% 30%, #a6e676 0%, #8ed462 50%, #5fa832 100%)" }}
      ref={containerRef}
    >
      {/* Back to home */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm text-[#1a1a1a] text-[14px] font-medium transition-colors backdrop-blur-sm"
      >
        ← Home
      </Link>

      <div className="auth-card w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 md:p-10">
        {/* Logo / brand */}
        <div className="auth-item text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#8ED462] rounded-2xl mb-4 shadow-md text-white">
            <FiEye size={26} />
          </div>
          <h2 className="text-[26px] font-bold text-[#1a1a1a]">
            {isSignup ? "Join NagrikEye" : "Welcome back"}
          </h2>
          <p className="text-[#666] text-sm mt-1">
            {isSignup ? "Create your civic account" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="auth-item">
              <label className="block text-[13px] font-semibold text-[#444] uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] placeholder-[#999] outline-none border border-transparent focus:border-[#8ED462] focus:bg-white transition-all text-[15px]"
              />
            </div>
          )}

          <div className="auth-item">
            <label className="block text-[13px] font-semibold text-[#444] uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] placeholder-[#999] outline-none border border-transparent focus:border-[#8ED462] focus:bg-white transition-all text-[15px]"
            />
          </div>

          <div className="auth-item">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-semibold text-[#444] uppercase tracking-wide">
                Password
              </label>
              {!isSignup && (
                <Link to="/forgot-password" className="text-[13px] text-[#339966] hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              placeholder={isSignup ? "Min 6 characters" : "Your password"}
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] placeholder-[#999] outline-none border border-transparent focus:border-[#8ED462] focus:bg-white transition-all text-[15px]"
            />
          </div>

          {error && (
            <div className="auth-item bg-red-50 border border-red-200 text-red-600 text-[14px] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-item w-full rounded-xl bg-[#1a1a1a] hover:bg-black py-3.5 font-semibold text-white transition-colors text-[16px] disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading
              ? isSignup ? "Creating account…" : "Signing in…"
              : isSignup ? "Create Account" : "Sign In"
            }
          </button>
        </form>

        {/* Divider */}
        <div className="auth-item flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-[#e5e5e5]" />
          <span className="text-[12px] text-[#999] font-medium">OR</span>
          <div className="h-px flex-1 bg-[#e5e5e5]" />
        </div>

        {/* Google OAuth */}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`}
          className="auth-item flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#e5e5e5] bg-white hover:border-[#8ED462] hover:bg-[#f7fff2] py-3 text-[#1a1a1a] font-medium transition-all text-[15px] cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </a>

        <p className="auth-item mt-6 text-center text-[14px] text-[#666]">
          {isSignup ? "Already have an account?" : "New to NagrikEye?"}{" "}
          <span
            onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); }}
            className="cursor-pointer text-[#339966] font-semibold hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up free"}
          </span>
        </p>
      </div>
    </div>
  );
}
