// src/components/pages/DashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4 relative overflow-hidden">

      {/* ── Decorative orbs — matches login page ── */}
      <div
        className="pointer-events-none absolute -top-32 -right-20 w-[520px] h-[520px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* ── Grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-4 animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
          <span className="text-2xl text-blue-400">✦</span>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400 tracking-wide">Authenticated</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-slate-100 tracking-tight">
          Login Successful
        </h1>

        {/* Sub */}
        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
          Welcome{user?.username ? <>, <span className="text-white/60 font-medium">{user.username}</span></> : ""}!
          You're now in the CMS admin area.
        </p>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-3 px-5 py-2 rounded-lg text-sm text-white/50 border border-white/10 bg-transparent hover:text-white/80 hover:border-white/25 transition-all cursor-pointer"
        >
          Sign out
        </button>
      </div>

      {/* Fade-up keyframe — injected inline since Tailwind arbitrary animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;