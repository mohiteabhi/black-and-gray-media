// src/components/admin/editors/TestimonialsEditor.jsx
import React, { useState, useEffect } from "react";
import { patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const MEDIA_ID    = MEDIA_IDS.testimonials.section; // 19
const MAX_REVIEWS = 6;
const MAX_CHARS   = 300; // review character limit (matches existing reviews ~250 chars)

const EMPTY_REVIEW = () => ({ id: Date.now(), client: "", "client location": "", "client review": "" });

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

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

// ── Single review card editor ────────────────────────────────────────────────
function ReviewCard({ review, index, onChange, onRemove, canRemove }) {
  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";
  const reviewLen = (review["client review"] || "").length;
  const overLimit = reviewLen > MAX_CHARS;

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/25">Review</span>
          <span className="text-xs font-semibold text-white/60">#{index + 1}</span>
        </div>
        {canRemove && (
          <button onClick={() => onRemove(review.id)}
            className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">
            Remove
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 p-4">
        {/* Name + Location row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Client Name</label>
            <input type="text" value={review.client} onChange={e => onChange(review.id, "client", e.target.value)}
              placeholder="e.g. Jane Smith" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Location / Company</label>
            <input type="text" value={review["client location"]} onChange={e => onChange(review.id, "client location", e.target.value)}
              placeholder="e.g. Mumbai, India" className={inputCls} />
          </div>
        </div>

        {/* Review text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Review</label>
          <textarea
            value={review["client review"]}
            onChange={e => onChange(review.id, "client review", e.target.value)}
            placeholder="Write the client's review here…"
            rows={4}
            maxLength={MAX_CHARS}
            className={[inputCls, "resize-none leading-relaxed",
              overLimit ? "border-red-500/50 focus:border-red-500/60" : ""
            ].join(" ")}
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs tabular-nums ${overLimit ? "text-red-400" : reviewLen > MAX_CHARS * 0.85 ? "text-amber-400/70" : "text-white/20"}`}>
              {reviewLen} / {MAX_CHARS} chars
            </span>
            {overLimit && <span className="text-xs text-red-400">Too long — shorten the review</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function TestimonialsEditor() {
  const [reviews,      setReviews]      = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [saveStatus,   setSaveStatus]   = useState(null);

  // ── Fetch current testimonials ─────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setFetchLoading(true);
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = await res.json();
        const record = data.find(item => item.id === MEDIA_ID);
        if (record?.text) {
          const raw   = record.text.trim();
          const clean = raw.startsWith("'") && raw.endsWith("'") ? raw.slice(1, -1) : raw;
          setReviews(JSON.parse(clean));
        } else {
          // No data yet — start with one empty card
          setReviews([EMPTY_REVIEW()]);
        }
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleChange(id, field, value) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setSaveStatus(null);
  }

  function addReview() {
    if (reviews.length >= MAX_REVIEWS) return;
    setReviews(prev => [...prev, EMPTY_REVIEW()]);
  }

  function removeReview(id) {
    setReviews(prev => prev.filter(r => r.id !== id));
    setSaveStatus(null);
  }

  async function saveAll() {
    // Validate — no empty names, no over-limit reviews
    const hasEmpty   = reviews.some(r => !r.client.trim() || !r["client review"].trim());
    const hasOverLim = reviews.some(r => r["client review"].length > MAX_CHARS);
    if (hasEmpty) { setSaveStatus({ type: "error", message: "All reviews need a name and text." }); return; }
    if (hasOverLim) { setSaveStatus({ type: "error", message: "One or more reviews exceed the character limit." }); return; }

    setSaveStatus({ type: "loading", message: "Saving…" });
    try {
      // Re-assign sequential IDs before saving
      const toSave = reviews.map((r, i) => ({ ...r, id: i + 1 }));
      await patchMediaText(MEDIA_ID, JSON.stringify(toSave));
      setReviews(toSave);
      setSaveStatus({ type: "success", message: "Testimonials saved!" });
    } catch (err) {
      setSaveStatus({ type: "error", message: err.message });
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-40" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
        <Skeleton className="h-10 w-32 self-end" />
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

  const canAdd     = reviews.length < MAX_REVIEWS;
  const hasOverLim = reviews.some(r => r["client review"].length > MAX_CHARS);
  const hasEmpty   = reviews.some(r => !r.client.trim() || !r["client review"].trim());

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Testimonials</p>
          <p className="text-[11px] text-white/25 mt-0.5">
            {reviews.length} of {MAX_REVIEWS} reviews · {MAX_CHARS} char limit per review
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill state={saveStatus} />
          {canAdd && (
            <button onClick={addReview}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white/70 border border-white/10 hover:border-white/25 hover:text-white/90 transition-all">
              + Add Review
            </button>
          )}
        </div>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4">
        {reviews.map((review, i) => (
          <ReviewCard
            key={review.id}
            review={review}
            index={i}
            onChange={handleChange}
            onRemove={removeReview}
            canRemove={reviews.length > 1}
          />
        ))}
      </div>

      {/* Max reached hint */}
      {!canAdd && (
        <p className="text-[11px] text-white/25 text-center">Maximum {MAX_REVIEWS} reviews reached.</p>
      )}

      {/* Save all */}
      <div className="flex justify-end pt-2 border-t border-white/[0.06]">
        <button
          onClick={saveAll}
          disabled={saveStatus?.type === "loading" || hasOverLim || hasEmpty}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
            bg-gradient-to-br from-blue-600 to-indigo-600
            shadow-[0_4px_14px_rgba(37,99,235,0.25)]
            hover:opacity-90 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saveStatus?.type === "loading" && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Save All Testimonials
        </button>
      </div>

    </div>
  );
}