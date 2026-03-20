// src/components/pages/DashboardPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeroSectionEditor from "../admin/editors/HeroSectionEditor";
import AboutSectionEditor from "../admin/editors/AboutSectionEditor";
import WeddingGalleryEditor from "../admin/editors/WeddingGalleryEditor";
import FNBGalleryEditor from "../admin/editors/FNBGalleryEditor";
import AutomotiveGalleryEditor from "../admin/editors/AutomotiveGalleryEditor";
import InfluencerGalleryEditor from "../admin/editors/Influencergalleryeditor";

const CMS_STRUCTURE = [
  {
    page: "Home",
    slug: "home",
    sections: [
      { name: "Hero Section", slug: "hero", component: <HeroSectionEditor /> },
      {
        name: "About Section", slug: "about", component: <AboutSectionEditor />,
        children: [
          { name: "Wedding Gallery",    slug: "wedding-gallery",    component: <WeddingGalleryEditor /> },
          { name: "FNB Gallery",        slug: "fnb-gallery",        component: <FNBGalleryEditor /> },
          { name: "Automotive Gallery", slug: "auto-gallery",       component: <AutomotiveGalleryEditor /> },
          { name: "Influencer Gallery", slug: "influencer-gallery", component: <InfluencerGalleryEditor /> },
        ],
      },
    ],
  },
];

function NavItem({ label, active, onClick, indent = false, isChild = false }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-lg text-xs transition-all",
        isChild ? "pl-9 py-2" : indent ? "pl-6 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-blue-500/15 border border-blue-500/25 text-blue-300 font-semibold"
          : isChild
            ? "text-white/30 hover:text-white/60 hover:bg-white/[0.03] border border-transparent"
            : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent",
      ].join(" ")}
    >
      {isChild && <span className="mr-1.5 text-white/20">└</span>}
      {label}
    </button>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activePageSlug, setActivePageSlug]       = useState(CMS_STRUCTURE[0].slug);
  const [activeSectionSlug, setActiveSectionSlug] = useState(CMS_STRUCTURE[0].sections[0].slug);
  const [sidebarOpen, setSidebarOpen]             = useState(false);

  const activePage = CMS_STRUCTURE.find((p) => p.slug === activePageSlug);
  // Search top-level sections and their children
  const activeSection = (() => {
    if (!activePage) return null;
    for (const section of activePage.sections) {
      if (section.slug === activeSectionSlug) return section;
      if (section.children) {
        const child = section.children.find(c => c.slug === activeSectionSlug);
        if (child) return child;
      }
    }
    return null;
  })();
  // Find parent section if active section is a child
  const activeParent = activePage?.sections.find(
    s => s.children?.some(c => c.slug === activeSectionSlug)
  ) ?? null;

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  function handleSectionSelect(pageSlug, sectionSlug) {
    setActivePageSlug(pageSlug);
    setActiveSectionSlug(sectionSlug);
    setSidebarOpen(false); // close drawer on mobile after selecting
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <span className="text-blue-500 text-lg">✦</span>
        <span className="text-xs font-bold tracking-widest uppercase text-white/40">CMS Admin</span>
      </div>

      {/* Nav tree */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {CMS_STRUCTURE.map((page) => (
          <div key={page.slug}>
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-white/25 mt-2 first:mt-0">
              {page.page}
            </p>
            {page.sections.map((section) => (
              <div key={section.slug}>
                <NavItem
                  label={section.name}
                  indent
                  active={activePageSlug === page.slug && activeSectionSlug === section.slug}
                  onClick={() => handleSectionSelect(page.slug, section.slug)}
                />
                {/* Children — shown indented under parent, always visible */}
                {section.children?.map((child) => (
                  <NavItem
                    key={child.slug}
                    label={child.name}
                    indent
                    isChild
                    active={activePageSlug === page.slug && activeSectionSlug === child.slug}
                    onClick={() => handleSectionSelect(page.slug, child.slug)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] px-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/25 flex items-center justify-center text-xs text-blue-400 font-bold uppercase">
            {user?.username?.[0] || "A"}
          </div>
          <span className="text-xs text-white/40 truncate">{user?.username || "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-white/30 hover:text-red-400 transition-colors px-1 py-1"
        >
          ← Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#080b12] flex text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Desktop sidebar ───────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/[0.06] py-6 px-3"
        style={{ background: "rgba(10,14,26,0.9)" }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile sidebar drawer overlay ────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ────────────────────────────────────────────── */}
      <aside
        className={[
          "lg:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col py-6 px-3 border-r border-white/[0.06] transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: "rgba(10,14,26,0.98)" }}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors text-lg"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header
          className="flex items-center gap-2 px-4 lg:px-8 py-3.5 border-b border-white/[0.06] shrink-0"
          style={{ background: "rgba(10,14,26,0.6)" }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden mr-2 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <span className="text-xs text-white/25 hidden sm:inline">{activePage?.page}</span>
          <span className="text-white/15 text-xs hidden sm:inline">›</span>
          {activeParent && (
            <>
              <span className="text-xs text-white/25 hidden sm:inline">{activeParent.name}</span>
              <span className="text-white/15 text-xs hidden sm:inline">›</span>
            </>
          )}
          <span className="text-xs text-white/60 font-medium truncate">{activeSection?.name}</span>

          {/* Live badge */}
          <div className="ml-auto shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide hidden sm:inline">Live site connected</span>
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide sm:hidden">Live</span>
          </div>
        </header>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8">

          {/* Section header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/20 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                {activePage?.page}
              </span>
              <span className="text-white/15 text-xs">›</span>
              {activeParent && (
                <>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/20 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                    {activeParent.name}
                  </span>
                  <span className="text-white/15 text-xs">›</span>
                </>
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white/90 tracking-tight">{activeSection?.name}</h1>
            <p className="text-xs lg:text-sm text-white/30 mt-1">
              Changes save directly to the live portfolio. Updates reflect immediately after saving.
            </p>
          </div>

          {/* Editor card */}
          <div
            className="rounded-2xl p-4 lg:p-8 w-full max-w-2xl"
            style={{
              background: "rgba(15,20,35,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {activeSection?.component ?? (
              <p className="text-white/30 text-sm">Select a section from the sidebar to begin editing.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}