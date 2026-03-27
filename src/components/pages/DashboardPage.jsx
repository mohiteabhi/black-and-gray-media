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
import PortfolioGalleryEditor from "../admin/editors/PortfolioGalleryEditor";
import TestimonialsEditor from "../admin/editors/TestimonialsEditor";
import CTASectionEditor from "../admin/editors/CTASectionEditor";
import FooterEditor from "../admin/editors/Footereditor";


const CMS_STRUCTURE = [
  {
    page: "Home",
    slug: "home",
    sections: [
      { name: "Hero Section", slug: "hero", component: <HeroSectionEditor /> },
      {
        name: "About Section",
        slug: "about",
        component: <AboutSectionEditor />,
        children: [
          { name: "Wedding Gallery", slug: "wedding-gallery", component: <WeddingGalleryEditor /> },
          { name: "FNB Gallery", slug: "fnb-gallery", component: <FNBGalleryEditor /> },
          { name: "Automotive Gallery", slug: "auto-gallery", component: <AutomotiveGalleryEditor /> },
          { name: "Influencer Gallery", slug: "influencer-gallery", component: <InfluencerGalleryEditor /> },
        ],
      },
      { name: "Portfolio Section", slug: "portfolio", component: <PortfolioGalleryEditor /> },
      { name: "Testimonials", slug: "testimonials", component: <TestimonialsEditor /> },
      { name: "CTA Section", slug: "cta", component: <CTASectionEditor /> },
      { name: "Footer", slug: "footer", component: <FooterEditor /> },
    ],
  },
];

/* ── Animated chevron ─────────────────────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        transition: "transform 0.25s ease",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <path
        d="M3 2L7 5L3 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Leaf nav item (no children) ──────────────────────────────────────────── */
function NavItem({ label, active, onClick, isChild = false }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-lg text-xs transition-all",
        isChild ? "pl-9 py-2" : "pl-6 py-2.5",
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

/* ── Section row — may have a collapsible child list ─────────────────────── */
function CollapsibleSection({ section, pageSlug, activeSectionSlug, activePageSlug, onSelect }) {
  const hasChildren = Boolean(section.children?.length);
  const isActive = activePageSlug === pageSlug && activeSectionSlug === section.slug;
  const isChildActive =
    hasChildren && section.children.some((c) => c.slug === activeSectionSlug && activePageSlug === pageSlug);

  const [childrenOpen, setChildrenOpen] = useState(isChildActive);

  function handleRowClick() {
    onSelect(pageSlug, section.slug);
    if (hasChildren) setChildrenOpen((v) => !v);
  }

  function handleChevronClick(e) {
    e.stopPropagation();
    setChildrenOpen((v) => !v);
  }

  return (
    <div>
      {/* Section button */}
      <button
        onClick={handleRowClick}
        className={[
          "w-full text-left rounded-lg text-xs transition-all flex items-center gap-1 pl-6 pr-2 py-2.5",
          isActive
            ? "bg-blue-500/15 border border-blue-500/25 text-blue-300 font-semibold"
            : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent",
        ].join(" ")}
      >
        <span className="flex-1 truncate">{section.name}</span>
        {hasChildren && (
          <span
            role="button"
            aria-label={childrenOpen ? "Collapse" : "Expand"}
            onClick={handleChevronClick}
            className={[
              "p-0.5 rounded transition-colors",
              isActive
                ? "text-blue-300/60 hover:text-blue-300"
                : "text-white/20 hover:text-white/50",
            ].join(" ")}
          >
            <Chevron open={childrenOpen} />
          </span>
        )}
      </button>

      {/* Children — animated max-height accordion */}
      {hasChildren && (
        <div
          style={{
            overflow: "hidden",
            maxHeight: childrenOpen ? `${section.children.length * 44}px` : "0px",
            transition: "max-height 0.28s ease",
          }}
        >
          {section.children.map((child) => (
            <NavItem
              key={child.slug}
              label={child.name}
              isChild
              active={activePageSlug === pageSlug && activeSectionSlug === child.slug}
              onClick={() => onSelect(pageSlug, child.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page group — label collapses / expands all sections under it ─────────── */
function CollapsiblePage({ page, activeSectionSlug, activePageSlug, onSelect }) {
  const [open, setOpen] = useState(true); // expanded by default

  // Max height = sum of each section row + potential children rows
  const expandedHeight =
    page.sections.reduce((acc, s) => acc + 44 + (s.children ? s.children.length * 40 : 0), 0) + 20;

  return (
    <div>
      {/* Page label as toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 mt-2 first:mt-0 group"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/25 group-hover:text-white/45 transition-colors">
          {page.page}
        </span>
        <span className="text-white/20 group-hover:text-white/40 transition-colors">
          <Chevron open={open} />
        </span>
      </button>

      {/* Sections accordion */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? `${expandedHeight}px` : "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        {page.sections.map((section) => (
          <CollapsibleSection
            key={section.slug}
            section={section}
            pageSlug={page.slug}
            activeSectionSlug={activeSectionSlug}
            activePageSlug={activePageSlug}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activePageSlug, setActivePageSlug] = useState(CMS_STRUCTURE[0].slug);
  const [activeSectionSlug, setActiveSectionSlug] = useState(CMS_STRUCTURE[0].sections[0].slug);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activePage = CMS_STRUCTURE.find((p) => p.slug === activePageSlug);

  const activeSection = (() => {
    if (!activePage) return null;
    for (const section of activePage.sections) {
      if (section.slug === activeSectionSlug) return section;
      if (section.children) {
        const child = section.children.find((c) => c.slug === activeSectionSlug);
        if (child) return child;
      }
    }
    return null;
  })();

  const activeParent =
    activePage?.sections.find((s) => s.children?.some((c) => c.slug === activeSectionSlug)) ?? null;

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  function handleSectionSelect(pageSlug, sectionSlug) {
    setActivePageSlug(pageSlug);
    setActiveSectionSlug(sectionSlug);
    setSidebarOpen(false);
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
          <CollapsiblePage
            key={page.slug}
            page={page}
            activeSectionSlug={activeSectionSlug}
            activePageSlug={activePageSlug}
            onSelect={handleSectionSelect}
          />
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
    <div
      className="min-h-screen bg-[#080b12] flex text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/[0.06] py-6 px-3"
        style={{ background: "rgba(10,14,26,0.9)" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          "lg:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col py-6 px-3 border-r border-white/[0.06] transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: "rgba(10,14,26,0.98)" }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors text-lg"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center gap-2 px-4 lg:px-8 py-3.5 border-b border-white/[0.06] shrink-0"
          style={{ background: "rgba(10,14,26,0.6)" }}
        >
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
          <div className="ml-auto shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide hidden sm:inline">
              Live site connected
            </span>
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide sm:hidden">Live</span>
          </div>
        </header>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8">
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
            <h1 className="text-xl lg:text-2xl font-bold text-white/90 tracking-tight">
              {activeSection?.name}
            </h1>
            <p className="text-xs lg:text-sm text-white/30 mt-1">
              Changes save directly to the live portfolio. Updates reflect immediately after saving.
            </p>
          </div>

          <div
            className="rounded-2xl p-4 lg:p-8 w-full max-w-2xl"
            style={{
              background: "rgba(15,20,35,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {activeSection?.component ?? (
              <p className="text-white/30 text-sm">
                Select a section from the sidebar to begin editing.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}