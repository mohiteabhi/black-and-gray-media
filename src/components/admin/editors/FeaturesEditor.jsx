// src/components/admin/editors/FeaturesEditor.jsx
// Services Page — Features Section editor.
//
// Data sources:
//   Media id=27 (features)      → text field stores JSON array of
//                                  [{ featureName, description }, …]
//   Media id=28 (featureImage)  → url field stores the "Professional Photography"
//                                  image shown beside the features list.
//
// Actions:
//   • Add feature    → append entry to JSON, PATCH /media/27
//   • Remove feature → remove entry, PATCH /media/27
//   • Edit fields    → PATCH /media/27
//   • Upload image   → PATCH /media/28/upload

import React, { useState, useEffect, useRef } from "react";
import { patchMediaText, uploadMedia } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const FEATURES_MEDIA_ID = MEDIA_IDS.services.featuresText; // 27
const IMAGE_MEDIA_ID    = MEDIA_IDS.services.featureImage;  // 28

const NAME_MAX = 80;
const DESC_MAX = 300;

// ── Helpers ─────────────────────────────────────────────────────────────────

function safeParse(raw, fallback) {
  try {
    let str = raw?.trim() || "";
    if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
    let parsed = JSON.parse(str);
    while (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed;
  } catch (_) {
    return fallback;
  }
}

// ── Reusable UI atoms ────────────────────────────────────────────────────────

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

function Skeleton({ className = "", style }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} style={style} />;
}

function CharCount({ value, max }) {
  const len = value.length;
  return (
    <span className={`text-xs tabular-nums ${len > max ? "text-red-400" : len > max * 0.85 ? "text-amber-400/70" : "text-white/20"}`}>
      {len} / {max}
    </span>
  );
}

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";
const textareaCls =
  "w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all resize-none";

// ── FeatureCard ──────────────────────────────────────────────────────────────

function FeatureCard({ feature, index, total, onChange, onRemove }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[11px] font-bold tracking-widest uppercase text-white/30">
          Feature {index + 1}
        </span>
        <button
          onClick={() => onRemove(index)}
          title="Remove feature"
          className="w-6 h-6 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs"
        >
          ✕
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Feature Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
            Feature Name
          </label>
          <input
            type="text"
            value={feature.featureName}
            onChange={e => onChange(index, "featureName", e.target.value)}
            placeholder="e.g. Extensive Equipment"
            className={inputCls}
          />
          <CharCount value={feature.featureName} max={NAME_MAX} />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
            Description
          </label>
          <textarea
            rows={3}
            value={feature.description}
            onChange={e => onChange(index, "description", e.target.value)}
            placeholder="Short description…"
            className={textareaCls}
          />
          <CharCount value={feature.description} max={DESC_MAX} />
        </div>
      </div>
    </div>
  );
}

// ── ImageUploader ────────────────────────────────────────────────────────────

function ImageUploader({ currentUrl, mediaId }) {
  const fileRef         = useRef(null);
  const [dragging,    setDragging]   = useState(false);
  const [file,        setFile]       = useState(null);
  const [preview,     setPreview]    = useState(currentUrl || null);
  const [imgStatus,   setImgStatus]  = useState(null);

  useEffect(() => { if (currentUrl && !file) setPreview(currentUrl); }, [currentUrl]);

  function selectFile(f) {
    if (!f.type.startsWith("image/")) {
      setImgStatus({ type: "error", message: "Please select an image file." });
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setImgStatus({ type: "error", message: "Image must be under 15 MB." });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setImgStatus(null);
  }

  async function handleUpload() {
    if (!file) return;
    setImgStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(mediaId, file);
      if (updated?.url) setPreview(updated.url);
      setFile(null);
      setImgStatus({ type: "success", message: "Image saved!" });
    } catch (err) {
      setImgStatus({ type: "error", message: err.message });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
          Section Image
        </label>
        <StatusPill state={imgStatus} />
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer ${
          dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
        }`}
        style={{ height: 220 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img src={preview} alt="Feature" className="w-full h-full object-cover" />
            {imgStatus?.type !== "loading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white/80 text-xs">Click or drop to replace</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xl">↑</div>
            <p className="text-xs text-white/40">Drop or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
            <p className="text-[10px] text-white/20">JPG, PNG, WEBP — max 15 MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files[0]; if (f) selectFile(f); e.target.value = ""; }}
      />

      {file && (
        <button
          onClick={handleUpload}
          disabled={imgStatus?.type === "loading"}
          className="self-start flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white
            bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.2)]
            hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {imgStatus?.type === "loading" && (
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Save Image
        </button>
      )}
    </div>
  );
}

// ── Main editor ──────────────────────────────────────────────────────────────

export default function FeaturesEditor() {
  const [loading,     setLoading]    = useState(true);
  const [fetchError,  setFetchError] = useState(null);
  const [features,    setFeatures]   = useState([]);
  const [imageUrl,    setImageUrl]   = useState(null);
  const [saveStatus,  setSaveStatus] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setFetchError(null);
    try {
      const res  = await fetch(API_CONFIG.endpoints.media.list);
      if (!res.ok) throw new Error(`Media fetch failed (${res.status})`);
      const data = await res.json();

      const featRecord  = data.find(i => i.id === FEATURES_MEDIA_ID);
      const imageRecord = data.find(i => i.id === IMAGE_MEDIA_ID);

      const parsed = safeParse(featRecord?.text, []);
      setFeatures(Array.isArray(parsed) ? parsed : []);
      setImageUrl(imageRecord?.url || null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Feature mutations ────────────────────────────────────────────────────

  function handleChange(index, field, value) {
    setFeatures(prev => prev.map((f, i) => i === index ? { ...f, [field]: value } : f));
    setSaveStatus(null);
  }

  function handleAdd() {
    setFeatures(prev => [...prev, { featureName: "", description: "" }]);
    setSaveStatus(null);
  }

  function handleRemove(index) {
    setFeatures(prev => prev.filter((_, i) => i !== index));
    setSaveStatus(null);
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  const hasErrors = features.some(
    f => f.featureName.length > NAME_MAX || f.description.length > DESC_MAX
  );
  const hasEmpty = features.some(
    f => !f.featureName.trim() || !f.description.trim()
  );

  async function handleSave() {
    if (hasErrors || hasEmpty) return;
    setSaveStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify(
        features.map(f => ({
          featureName:  f.featureName.trim(),
          description:  f.description.trim(),
        }))
      );
      await patchMediaText(FEATURES_MEDIA_ID, payload);
      setSaveStatus({ type: "success", message: "Features saved!" });
    } catch (err) {
      setSaveStatus({ type: "error", message: err.message });
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-3 w-48 mb-1" />
        <Skeleton className="h-3 w-64" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.06]">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-2xl">⚠</span>
        <p className="text-sm text-red-400">{fetchError}</p>
        <button onClick={load} className="text-xs text-blue-400 underline underline-offset-2">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Section image ── */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.015]">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Feature Image</p>
          <p className="text-[11px] text-white/25 mt-0.5">
            The "Professional Photography" photo shown beside the features list (media id {IMAGE_MEDIA_ID}).
          </p>
        </div>
        <ImageUploader currentUrl={imageUrl} mediaId={IMAGE_MEDIA_ID} />
      </div>

      {/* ── Features list ── */}
      <div className="flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Features List</p>
            <p className="text-[11px] text-white/25 mt-0.5">
              Add, edit or remove features (media id {FEATURES_MEDIA_ID}).
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white
              bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_4px_14px_rgba(16,185,129,0.2)]
              hover:opacity-90 transition-all whitespace-nowrap shrink-0"
          >
            <span>+</span> Add Feature
          </button>
        </div>

        {/* Cards */}
        {features.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-white/[0.07] text-center">
            <span className="text-3xl text-white/10">✦</span>
            <p className="text-sm text-white/25">No features yet.</p>
            <p className="text-xs text-white/15">Click "+ Add Feature" above to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                feature={feature}
                index={idx}
                total={features.length}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        {/* Save bar */}
        {features.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex flex-col gap-0.5">
              <StatusPill state={saveStatus} />
              {hasEmpty && !hasErrors && (
                <p className="text-[11px] text-amber-400/60 mt-1">
                  All feature name and description fields must be filled in.
                </p>
              )}
              {hasErrors && (
                <p className="text-[11px] text-red-400/70 mt-1">
                  Some fields exceed the character limit.
                </p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saveStatus?.type === "loading" || hasErrors || hasEmpty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
                bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.25)]
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saveStatus?.type === "loading" && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save Features
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
