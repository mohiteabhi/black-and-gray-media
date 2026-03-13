// src/components/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Already authenticated — replace login in history so back button
  // never lands here again after a successful session.
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      // Use replace so /admin/login is removed from history — pressing back
      // from dashboard will never return to the login form.
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* ── Decorative orbs ── */}
      <div
        className="pointer-events-none absolute -top-32 -right-20 w-[520px] h-[520px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 w-[400px] h-[400px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* ── Subtle dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl px-10 py-11"
        style={{
          background: "rgba(15, 20, 35, 0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(37,99,235,0.1)",
        }}
      >
        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-blue-500 text-xl leading-none">✦</span>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
            CMS Admin
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[1.85rem] font-bold text-slate-100 tracking-tight leading-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-white/35 mb-8">
          Sign in to manage your portfolio
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-medium tracking-wide text-white/50">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className={[
                "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 outline-none transition-all",
                "bg-white/[0.04] border",
                error
                  ? "border-red-500/50 focus:border-red-500/70"
                  : "border-white/10 focus:border-blue-500/60 focus:bg-white/[0.06]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              ].join(" ")}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium tracking-wide text-white/50">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={[
                  "w-full rounded-xl px-4 py-3 pr-11 text-sm text-slate-100 placeholder-white/20 outline-none transition-all",
                  "bg-white/[0.04] border",
                  error
                    ? "border-red-500/50 focus:border-red-500/70"
                    : "border-white/10 focus:border-blue-500/60 focus:bg-white/[0.06]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                ].join(" ")}
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-base leading-none p-1 bg-transparent border-none cursor-pointer"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-red-300 bg-red-500/[0.08] border border-red-500/25">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white tracking-wide transition-all
              bg-gradient-to-br from-blue-600 to-indigo-600
              shadow-[0_4px_16px_rgba(37,99,235,0.3)]
              hover:opacity-90 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(37,99,235,0.4)]
              active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;