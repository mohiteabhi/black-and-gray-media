// src/components/admin/editors/AboutSectionEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadMedia, patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const IDS = {
  introTitle: MEDIA_IDS.about.intro.title,  // 3
  introText:  MEDIA_IDS.about.intro.text,   // 4
  introVideo: MEDIA_IDS.about.intro.video,  // 5
};

// Service definitions — icon label is display only (icons are hardcoded in frontend)
const SERVICES = [
  { key: "wedding",    label: "Wedding Shoot",              icon: "💍", ids: MEDIA_IDS.about.services.wedding    },
  { key: "fnb",        label: "FNB (Food & Beverages)",     icon: "🍽", ids: MEDIA_IDS.about.services.fnb        },
  { key: "automotive", label: "Automotive",                  icon: "🚗", ids: MEDIA_IDS.about.services.automotive },
  { key: "influencer", label: "Influencer & Personal Brand", icon: "🎬", ids: MEDIA_IDS.about.services.influencer },
];

// ── Shared UI primitives ─────────────────────────────────────────────────────
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

function Skeleton({ className = "", style = {} }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} style={style} />;
}

const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

// ── Service card editor ───────────────────────────────────────────────────────
function ServiceEditor({ service, initialData }) {
  const { ids, label, icon } = service;

  const [title,       setTitle]       = useState(initialData?.title       || "");
  const [text,        setText]        = useState(initialData?.text        || "");
  const [coverPreview,setCoverPreview]= useState(initialData?.coverUrl    || null);
  const [coverFile,   setCoverFile]   = useState(null);
  const [coverType,   setCoverType]   = useState(initialData?.coverType   || null); // 'image'|'video'

  const [titleStatus, setTitleStatus] = useState(null);
  const [textStatus,  setTextStatus]  = useState(null);
  const [coverStatus, setCoverStatus] = useState(null);

  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false); // accordion open/closed

  function selectFile(file) {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverType(file.type.startsWith("video") ? "video" : "image");
    setCoverStatus(null);
  }

  async function saveTitle() {
    if (!title.trim()) return;
    setTitleStatus({ type: "loading", message: "Saving…" });
    try {
      await patchMediaText(ids.title, title.trim());
      setTitleStatus({ type: "success", message: "Saved!" });
    } catch (err) { setTitleStatus({ type: "error", message: err.message }); }
  }

  async function saveText() {
    if (!text.trim()) return;
    setTextStatus({ type: "loading", message: "Saving…" });
    try {
      await patchMediaText(ids.text, text.trim());
      setTextStatus({ type: "success", message: "Saved!" });
    } catch (err) { setTextStatus({ type: "error", message: err.message }); }
  }

  async function saveCover() {
    if (!coverFile) return;
    setCoverStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(ids.cover, coverFile);
      if (updated?.url) setCoverPreview(updated.url);
      setCoverFile(null);
      setCoverStatus({ type: "success", message: "Cover updated!" });
    } catch (err) { setCoverStatus({ type: "error", message: err.message }); }
  }

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{icon}</span>
          <span className="text-sm font-semibold text-white/80">{label}</span>
        </div>
        <span className={`text-white/30 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="flex flex-col gap-6 px-4 py-5 border-t border-white/[0.06]">

          {/* Cover image / video */}
          <Field label="Cover Media" hint="Background image or video shown on the service card" status={coverStatus}>
            <div
              className={`cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
              }`}
              style={{ aspectRatio: "16/9" }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
            >
              {coverPreview ? (
                <div className="relative w-full h-full group">
                  {coverType === "video" ? (
                    <video src={coverPreview} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  )}
                  {coverStatus?.type === "loading" && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white/60 text-xs">Uploading…</span>
                    </div>
                  )}
                  {coverStatus?.type !== "loading" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white/80 text-xs tracking-wide">Click to change</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-lg">↑</div>
                  <p className="text-sm text-white/40">Drop image/video or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
                  <p className="text-xs text-white/20">JPG, PNG, WEBP, MP4</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={(e) => { const f = e.target.files[0]; if (f) selectFile(f); }} />
            <SaveBtn onClick={saveCover} disabled={!coverFile || coverStatus?.type === "loading"} label="Save Cover" />
          </Field>

          {/* Service title */}
          <Field label="Service Title" hint="Displayed as the heading on the service card" status={titleStatus}>
            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setTitleStatus(null); }}
              placeholder={`e.g. ${label}`} className={inputCls} />
            <SaveBtn onClick={saveTitle} disabled={!title.trim() || titleStatus?.type === "loading"} label="Save Title" />
          </Field>

          {/* Service description */}
          <Field label="Service Description" hint="Short paragraph shown below the title on the service card" status={textStatus}>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setTextStatus(null); }}
              placeholder="Describe this service…" rows={4}
              className={inputCls + " resize-none leading-relaxed"} />
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/20 shrink-0">{text.length} chars</span>
              <SaveBtn onClick={saveText} disabled={!text.trim() || textStatus?.type === "loading"} label="Save Description" />
            </div>
          </Field>

        </div>
      )}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function AboutSectionEditor() {

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [mediaData,    setMediaData]    = useState(null); // raw API response

  // Intro video
  const [videoFile,    setVideoFile]    = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoStatus,  setVideoStatus]  = useState(null);
  const videoInputRef = useRef(null);

  // Intro title
  const [introTitle,  setIntroTitle]  = useState("");
  const [titleStatus, setTitleStatus] = useState(null);

  // Intro text
  const [introText,   setIntroText]   = useState("");
  const [textStatus,  setTextStatus]  = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed to load media (${res.status})`);
        const data = await res.json();
        setMediaData(data);

        const titleRecord = data.find(item => item.id === IDS.introTitle);
        const textRecord  = data.find(item => item.id === IDS.introText);
        const videoRecord = data.find(item => item.id === IDS.introVideo);

        if (titleRecord?.text) setIntroTitle(titleRecord.text);
        if (textRecord?.text)  setIntroText(textRecord.text);
        if (videoRecord?.url)  setVideoPreview(videoRecord.url);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, []);

  // ── Intro handlers ─────────────────────────────────────────────────────────
  function selectVideoFile(file) {
    setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); setVideoStatus(null);
  }

  async function saveVideo() {
    if (!videoFile) return;
    setVideoStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(IDS.introVideo, videoFile);
      if (updated?.url) setVideoPreview(updated.url);
      setVideoFile(null);
      setVideoStatus({ type: "success", message: "Video updated!" });
    } catch (err) { setVideoStatus({ type: "error", message: err.message }); }
  }

  async function saveTitle() {
    if (!introTitle.trim()) return;
    setTitleStatus({ type: "loading", message: "Saving…" });
    try {
      await patchMediaText(IDS.introTitle, introTitle.trim());
      setTitleStatus({ type: "success", message: "Title saved!" });
    } catch (err) { setTitleStatus({ type: "error", message: err.message }); }
  }

  async function saveText() {
    if (!introText.trim()) return;
    setTextStatus({ type: "loading", message: "Saving…" });
    try {
      await patchMediaText(IDS.introText, introText.trim());
      setTextStatus({ type: "success", message: "Text saved!" });
    } catch (err) { setTextStatus({ type: "error", message: err.message }); }
  }

  function makeDrop(onFilePicked) {
    return {
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFilePicked(f); },
    };
  }

  // ── Build initial data for each ServiceEditor from fetched media ───────────
  function getServiceInitialData(service) {
    if (!mediaData) return {};
    const { ids } = service;
    const titleRecord = mediaData.find(item => item.id === ids.title);
    const textRecord  = mediaData.find(item => item.id === ids.text);
    const coverRecord = mediaData.find(item => item.id === ids.cover);
    return {
      title:     titleRecord?.text || "",
      text:      textRecord?.text  || "",
      coverUrl:  coverRecord?.url  || null,
      coverType: coverRecord?.resource_type || null,
    };
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="w-full" style={{ aspectRatio: "16/9" }} />
          <Skeleton className="h-10 w-full sm:w-28" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" /><Skeleton className="h-12 w-full" /><Skeleton className="h-10 w-28" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" /><Skeleton className="h-28 w-full" /><Skeleton className="h-10 w-28 self-end" />
        </div>
        <div className="border-t border-white/[0.06]" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32 mb-2" />
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
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
        <button onClick={() => window.location.reload()} className="text-xs text-blue-400 underline underline-offset-2">Retry</button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">

      {/* ── 1. Intro Video ──────────────────────────────────────────────────── */}
      <Field label="Intro Video" hint="Shown in the About section · MP4 recommended · 16:9 aspect ratio" status={videoStatus}>
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden w-full`}
          style={{ aspectRatio: "16 / 9", borderColor: "rgba(255,255,255,0.1)" }}
          onClick={() => videoInputRef.current?.click()}
          {...makeDrop(selectVideoFile)}
        >
          {videoPreview ? (
            <div className="relative w-full h-full group">
              <video src={videoPreview} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white/70 text-xl">▶</div>
              </div>
              {videoStatus?.type === "loading" && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white/60 text-xs">Uploading…</span>
                </div>
              )}
              {videoStatus?.type !== "loading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white/80 text-xs tracking-wide">Click to change</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 h-full px-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/30">▶</div>
              <p className="text-sm text-white/50">Drop video here or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
              <p className="text-xs text-white/20">MP4, MOV, WEBM</p>
            </div>
          )}
        </div>
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) selectVideoFile(f); }} />
        <SaveBtn onClick={saveVideo} disabled={!videoFile || videoStatus?.type === "loading"} label="Save Video" />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 2. Intro Title ──────────────────────────────────────────────────── */}
      <Field label="Intro Title" hint="Exactly 6 words · 2nd and last word display in gold on the live site" status={titleStatus}>
        <input type="text" value={introTitle}
          onChange={(e) => {
            const val = e.target.value;
            const wordCount = val.trim() === "" ? 0 : val.trim().split(/\s+/).length;
            if (wordCount <= 6) { setIntroTitle(val); setTitleStatus(null); }
          }}
          placeholder="WE TELL THE STORY OF TIME."
          className={[inputCls,
            introTitle.trim().split(/\s+/).filter(Boolean).length === 6
              ? "border-emerald-500/40 focus:border-emerald-500/60"
              : "border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06]",
          ].join(" ")}
        />
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium tabular-nums ${introTitle.trim().split(/\s+/).filter(Boolean).length === 6 ? "text-emerald-400" : "text-white/30"}`}>
            {introTitle.trim() === "" ? 0 : introTitle.trim().split(/\s+/).length} / 6 words
          </span>
          {introTitle.trim().split(/\s+/).filter(Boolean).length !== 6 && (
            <span className="text-[11px] text-amber-400/70">← needs exactly 6 words</span>
          )}
        </div>
        {introTitle.trim() !== "" && (
          <div className="rounded-lg px-4 py-3 bg-black/30 border border-white/[0.06]">
            <p className="text-[11px] text-white/25 mb-1.5 tracking-widest uppercase">Preview</p>
            <p className="text-sm font-bold uppercase tracking-wide leading-snug">
              {introTitle.trim().split(/\s+/).slice(0, 6).map((word, idx, arr) => {
                const isGold = idx === 1 || idx === arr.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && " "}
                    {isGold
                      ? <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">{word}</span>
                      : <span className="text-white">{word}</span>}
                  </React.Fragment>
                );
              })}
            </p>
          </div>
        )}
        <SaveBtn onClick={saveTitle}
          disabled={!introTitle.trim() || titleStatus?.type === "loading" || introTitle.trim().split(/\s+/).filter(Boolean).length !== 6}
          label="Save Title" />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 3. Intro Text ───────────────────────────────────────────────────── */}
      <Field label="Intro Text" hint="Body paragraph shown below the title in the About section" status={textStatus}>
        <textarea value={introText} onChange={(e) => { setIntroText(e.target.value); setTextStatus(null); }}
          placeholder="We are a collective of visual storytellers…" rows={5}
          className={inputCls + " resize-none leading-relaxed"} />
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-white/20 shrink-0">{introText.length} chars</span>
          <SaveBtn onClick={saveText} disabled={!introText.trim() || textStatus?.type === "loading"} label="Save Text" />
        </div>
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── 4. Services Grid ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Services Grid</p>
          <p className="text-[11px] text-white/25 mt-0.5">Edit title, description and cover media for each service card</p>
        </div>
        <div className="flex flex-col gap-2">
          {SERVICES.map(service => (
            <ServiceEditor
              key={service.key}
              service={service}
              initialData={getServiceInitialData(service)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}