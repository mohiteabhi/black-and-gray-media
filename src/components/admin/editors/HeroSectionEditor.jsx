// src/components/admin/editors/HeroSectionEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadMedia, patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const IDS = {
  heroImage: MEDIA_IDS.home.hero.image,  // 1
  heroText:  MEDIA_IDS.home.hero.text,   // 2
  logo:      MEDIA_IDS.global.logo,      // 6
};

// ── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ state }) {
  if (!state) return null;
  const styles = {
    loading: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    error:   "bg-red-500/10 border-red-500/25 text-red-400",
  };
  const icons = { loading: "⟳", success: "✓", error: "⚠" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${styles[state.type]}`}>
      <span className={state.type === "loading" ? "animate-spin inline-block" : ""}>{icons[state.type]}</span>
      {state.message}
    </span>
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, hint, children, status }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">{label}</p>
          {hint && <p className="text-[11px] text-white/25 mt-0.5 leading-relaxed">{hint}</p>}
        </div>
        <div className="shrink-0"><StatusPill state={status} /></div>
      </div>
      {children}
    </div>
  );
}

// ── Save button ──────────────────────────────────────────────────────────────
function SaveBtn({ onClick, disabled, label = "Save" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full sm:w-auto self-start px-5 py-2.5 rounded-lg text-sm font-semibold text-white
        bg-gradient-to-br from-blue-600 to-indigo-600
        shadow-[0_4px_14px_rgba(37,99,235,0.25)]
        hover:opacity-90 active:scale-[0.98] transition-all
        disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

// ── Main editor ──────────────────────────────────────────────────────────────
export default function HeroSectionEditor() {

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);

  // Hero image
  const [heroFile,      setHeroFile]      = useState(null);
  const [heroPreview,   setHeroPreview]   = useState(null);
  const [heroImgStatus, setHeroImgStatus] = useState(null);
  const heroInputRef = useRef(null);

  // Hero text
  const [heroText,   setHeroText]   = useState("");
  const [textStatus, setTextStatus] = useState(null);

  // Logo
  const [logoFile,    setLogoFile]    = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoStatus,  setLogoStatus]  = useState(null);
  const logoInputRef = useRef(null);

  // ── Fetch current values on mount ─────────────────────────────────────────
  useEffect(() => {
    async function fetchCurrentMedia() {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed to load media (${res.status})`);
        const data = await res.json();

        const heroImageRecord = data.find(item => item.id === IDS.heroImage);
        const heroTextRecord  = data.find(item => item.id === IDS.heroText);
        const logoRecord      = data.find(item => item.id === IDS.logo);

        if (heroImageRecord?.url) setHeroPreview(heroImageRecord.url);
        if (heroTextRecord?.text) setHeroText(heroTextRecord.text);
        if (logoRecord?.url)      setLogoPreview(logoRecord.url);
      } catch (err) {
        console.error("[HeroSectionEditor] fetch error:", err);
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    fetchCurrentMedia();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function selectHeroFile(file) {
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
    setHeroImgStatus(null);
  }

  async function saveHeroImage() {
    if (!heroFile) return;
    setHeroImgStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(IDS.heroImage, heroFile);
      if (updated?.url) setHeroPreview(updated.url);
      setHeroFile(null);
      setHeroImgStatus({ type: "success", message: "Hero image updated!" });
    } catch (err) {
      setHeroImgStatus({ type: "error", message: err.message });
    }
  }

  async function saveHeroText() {
    if (!heroText.trim()) return;
    setTextStatus({ type: "loading", message: "Saving…" });
    try {
      await patchMediaText(IDS.heroText, heroText.trim());
      setTextStatus({ type: "success", message: "Text saved!" });
    } catch (err) {
      setTextStatus({ type: "error", message: err.message });
    }
  }

  function selectLogoFile(file) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoStatus(null);
  }

  async function saveLogo() {
    if (!logoFile) return;
    setLogoStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(IDS.logo, logoFile);
      if (updated?.url) setLogoPreview(updated.url);
      setLogoFile(null);
      setLogoStatus({ type: "success", message: "Logo updated!" });
    } catch (err) {
      setLogoStatus({ type: "error", message: err.message });
    }
  }

  // ── Drag helpers ──────────────────────────────────────────────────────────
  function makeDropHandlers(onFilePicked) {
    return {
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onFilePicked(file);
      },
    };
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full sm:w-28" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" />
          {/* Portrait skeleton matching 1080×1382 ratio */}
          <Skeleton className="w-full max-w-[260px] mx-auto" style={{ aspectRatio: "1080/1382" }} />
          <Skeleton className="h-10 w-full sm:w-28" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-10 w-full sm:w-28 self-end" />
        </div>
      </div>
    );
  }

  // ── Fetch error ────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-2xl">⚠</span>
        <p className="text-sm text-red-400">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-blue-400 underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">

      {/* ── 1. Navbar Logo ──────────────────────────────────────────────────── */}
      <Field
        label="Navbar Logo"
        hint="Top-left of every page · PNG with transparent background recommended"
        status={logoStatus}
      >
        <div
          className="cursor-pointer rounded-xl border-2 border-dashed border-white/10
            hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
          onClick={() => logoInputRef.current?.click()}
          {...makeDropHandlers(selectLogoFile)}
        >
          {logoPreview ? (
            <div className="relative flex items-center justify-center h-20 sm:h-24 px-6">
              <img src={logoPreview} alt="Logo preview" className="max-h-12 sm:max-h-16 max-w-full object-contain" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                <p className="text-white/80 text-xs tracking-wide">Click to change</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">✦</div>
              <p className="text-sm text-white/50">Drop logo or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
              <p className="text-xs text-white/20">PNG, SVG, WEBP · transparent bg preferred</p>
            </div>
          )}
        </div>
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) selectLogoFile(f); }} />
        <SaveBtn onClick={saveLogo} disabled={!logoFile || logoStatus?.type === "loading"} label="Save Logo" />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 2. Hero Image — portrait 1080×1382 ──────────────────────────────── */}
      <Field
        label="Hero Image"
        hint="Portrait · 1080×1382px recommended · JPG, PNG, or MP4"
        status={heroImgStatus}
      >
        {/* Constrain to a max width so the tall portrait doesn't dominate on desktop */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto sm:mx-0">
          <div
            className="cursor-pointer rounded-xl border-2 border-dashed border-white/10
              hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden w-full"
            style={{ aspectRatio: "1080 / 1382" }}
            onClick={() => heroInputRef.current?.click()}
            {...makeDropHandlers(selectHeroFile)}
          >
            {heroPreview ? (
              <div className="relative w-full h-full">
                <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover" />
                {heroImgStatus?.type === "loading" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white/60 text-xs">Uploading…</span>
                  </div>
                )}
                {heroImgStatus?.type !== "loading" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white/80 text-xs tracking-wide">Click to change</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg text-white/30">↑</div>
                <div>
                  <p className="text-sm text-white/50">Drop here or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
                  <p className="text-xs text-white/20 mt-1">JPG, PNG, WEBP, MP4</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <input ref={heroInputRef} type="file" accept="image/*,video/mp4" className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) selectHeroFile(f); }} />
        <SaveBtn
          onClick={saveHeroImage}
          disabled={!heroFile || heroImgStatus?.type === "loading"}
          label="Save Image"
        />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 3. Hero Description Text ─────────────────────────────────────────── */}
      <Field
        label="Hero Description Text"
        hint="Short tagline shown below the heading in the hero section"
        status={textStatus}
      >
        <textarea
          value={heroText}
          onChange={(e) => { setHeroText(e.target.value); setTextStatus(null); }}
          placeholder="A creative team of photographers capturing portraits, brands, and places…"
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20
            bg-white/[0.04] border border-white/10
            focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none
            transition-all resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-white/20 shrink-0">{heroText.length} chars</span>
          <SaveBtn
            onClick={saveHeroText}
            disabled={!heroText.trim() || textStatus?.type === "loading"}
            label="Save Text"
          />
        </div>
      </Field>

    </div>
  );
}