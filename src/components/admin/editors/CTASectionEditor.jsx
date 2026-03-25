// src/components/admin/editors/CTASectionEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadMedia, patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const CTA_TEXT_ID = MEDIA_IDS.cta.text; // 21
const CTA_BG_ID   = MEDIA_IDS.cta.bg;   // 22

const HEADING_MAX = 80;
const TEXT_MAX    = 300;

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

function SaveBtn({ onClick, disabled, label = "Save" }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full sm:w-auto self-start px-5 py-2.5 rounded-lg text-sm font-semibold text-white
        bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.25)]
        hover:opacity-90 active:scale-[0.98] transition-all
        disabled:opacity-40 disabled:cursor-not-allowed">
      {label}
    </button>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

function CharCount({ value, max }) {
  const len  = value.length;
  const over = len > max;
  return (
    <span className={`text-xs tabular-nums ${over ? "text-red-400" : len > max * 0.85 ? "text-amber-400/70" : "text-white/20"}`}>
      {len} / {max}
    </span>
  );
}

export default function CTASectionEditor() {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);

  // Text fields
  const [heading,     setHeading]     = useState("");
  const [bodyText,    setBodyText]    = useState("");
  const [textStatus,  setTextStatus]  = useState(null);

  // BG image
  const [bgFile,      setBgFile]      = useState(null);
  const [bgPreview,   setBgPreview]   = useState(null);
  const [bgStatus,    setBgStatus]    = useState(null);
  const [dragging,    setDragging]    = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch current values ───────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setFetchLoading(true);
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = await res.json();

        const textRecord = data.find(item => item.id === CTA_TEXT_ID);
        const bgRecord   = data.find(item => item.id === CTA_BG_ID);

        if (textRecord?.text) {
          try {
            let raw = textRecord.text.trim();
            // Strip wrapping single quotes
            if (raw.startsWith("'") && raw.endsWith("'")) raw = raw.slice(1, -1);
            // Recursively unwrap double-encoded strings
            let parsed = JSON.parse(raw);
            while (typeof parsed === "string") parsed = JSON.parse(parsed);
            // Accept array or plain object
            const obj = Array.isArray(parsed) ? parsed[0] : parsed;
            if (obj?.heading) setHeading(obj.heading);
            if (obj?.text)    setBodyText(obj.text);
          } catch (e) {
            console.warn("[CTASectionEditor] parse error:", e.message, "raw:", textRecord.text?.slice(0, 80));
          }
        }

        if (bgRecord?.url) setBgPreview(bgRecord.url);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, []);

  // ── Save text (patches JSON to media id 21) ────────────────────────────────
  async function saveText() {
    if (!heading.trim() || !bodyText.trim()) return;
    if (heading.length > HEADING_MAX || bodyText.length > TEXT_MAX) return;
    setTextStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify([{ heading: heading.trim(), text: bodyText.trim() }]);
      await patchMediaText(CTA_TEXT_ID, payload);
      setTextStatus({ type: "success", message: "Text saved!" });
    } catch (err) {
      setTextStatus({ type: "error", message: err.message });
    }
  }

  // ── BG image handlers ──────────────────────────────────────────────────────
  function selectBgFile(file) {
    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
    setBgStatus(null);
  }

  async function saveBg() {
    if (!bgFile) return;
    setBgStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(CTA_BG_ID, bgFile);
      if (updated?.url) setBgPreview(updated.url);
      setBgFile(null);
      setBgStatus({ type: "success", message: "Background updated!" });
    } catch (err) {
      setBgStatus({ type: "error", message: err.message });
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="w-full" style={{ aspectRatio: "16/5" }} />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" /><Skeleton className="h-12 w-full" /><Skeleton className="h-10 w-28" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" /><Skeleton className="h-24 w-full" /><Skeleton className="h-10 w-28 self-end" />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-2xl">⚠</span>
        <p className="text-sm text-red-400">{fetchError}</p>
        <button onClick={() => window.location.reload()} className="text-xs text-blue-400 underline underline-offset-2">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── 1. Background Image ─────────────────────────────────────────────── */}
      <Field
        label="Background Image"
        hint="Full-width background behind the CTA text · JPG or PNG recommended"
        status={bgStatus}
      >
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
            dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
          }`}
          style={{ aspectRatio: "16/5" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) selectBgFile(f); }}
        >
          {bgPreview ? (
            <div className="relative w-full h-full group">
              <img src={bgPreview} alt="BG preview" className="w-full h-full object-cover" />
              {/* Simulated overlay preview with rose highlights */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 px-6">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest text-center line-clamp-2">
                  {heading
                    ? heading.trim().split(" ").filter(Boolean).map((word, i, arr) => {
                        const isRose = i === 1 || i === arr.length - 1;
                        return (
                          <span key={i}>
                            {i > 0 && " "}
                            {isRose ? <span className="text-rose-400">{word}</span> : word}
                          </span>
                        );
                      })
                    : <span className="text-white/30">YOUR HEADING HERE</span>
                  }
                </p>
              </div>
              {bgStatus?.type !== "loading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white/80 text-xs tracking-wide">Click to change</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-lg">↑</div>
              <p className="text-sm text-white/40">Drop image or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
              <p className="text-xs text-white/20">JPG, PNG, WEBP · wide landscape recommended</p>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files[0]; if (f) selectBgFile(f); e.target.value = ""; }} />
        <SaveBtn onClick={saveBg} disabled={!bgFile || bgStatus?.type === "loading"} label="Save Background" />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 2. Heading ──────────────────────────────────────────────────────── */}
      <Field
        label="CTA Heading"
        hint={`Main bold heading · "MOMENTS" and "HEART" display in rose on the live site · max ${HEADING_MAX} chars`}
        status={null}
      >
        <input type="text" value={heading}
          onChange={e => { setHeading(e.target.value); setTextStatus(null); }}
          placeholder="CAPTURING THE MOMENTS THAT CAPTIVATE YOUR HEART"
          className={[inputCls, heading.length > HEADING_MAX ? "border-red-500/50" : ""].join(" ")}
        />
        <div className="flex items-center justify-between">
          <CharCount value={heading} max={HEADING_MAX} />
          {/* Live rose preview — 2nd and last word in rose */}
          {heading.trim() && (
            <p className="text-xs text-white/30 italic truncate max-w-[60%] text-right">
              {heading.trim().split(" ").filter(Boolean).map((word, i, arr) => {
                const isRose = i === 1 || i === arr.length - 1;
                return (
                  <span key={i}>
                    {i > 0 && " "}
                    {isRose ? <span className="text-rose-400">{word}</span> : word}
                  </span>
                );
              })}
            </p>
          )}
        </div>
      </Field>

      {/* ── 3. Body Text ────────────────────────────────────────────────────── */}
      <Field
        label="CTA Body Text"
        hint={`Paragraph below the heading · max ${TEXT_MAX} chars`}
        status={textStatus}
      >
        <textarea value={bodyText}
          onChange={e => { setBodyText(e.target.value); setTextStatus(null); }}
          placeholder="Professional wedding photography and cinematic videography services…"
          rows={4}
          className={[inputCls, "resize-none leading-relaxed", bodyText.length > TEXT_MAX ? "border-red-500/50" : ""].join(" ")}
        />
        <div className="flex items-center justify-between gap-4">
          <CharCount value={bodyText} max={TEXT_MAX} />
          <SaveBtn
            onClick={saveText}
            disabled={
              !heading.trim() || !bodyText.trim() ||
              textStatus?.type === "loading" ||
              heading.length > HEADING_MAX ||
              bodyText.length > TEXT_MAX
            }
            label="Save Text"
          />
        </div>
      </Field>

    </div>
  );
}