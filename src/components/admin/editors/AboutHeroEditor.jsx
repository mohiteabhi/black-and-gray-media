// src/components/admin/editors/AboutHeroEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadMedia, patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const IDS = MEDIA_IDS.aboutPage;

const NAME_MAX    = 40;
const ROLE_MAX    = 40;
const ABOUT_MAX   = 600;
const WORDSBYMAX  = 30;

function safeParse(raw, fallback) {
  try {
    let str = raw?.trim() || "";
    if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
    let parsed = JSON.parse(str);
    while (typeof parsed === "string") parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed[0] : parsed;
  } catch (_) { return fallback; }
}

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
    <div className="flex flex-col gap-2">
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
        hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
      {label}
    </button>
  );
}

function CharCount({ value, max }) {
  const len = value.length;
  return (
    <span className={`text-xs tabular-nums ${len > max ? "text-red-400" : len > max * 0.85 ? "text-amber-400/70" : "text-white/20"}`}>
      {len} / {max}
    </span>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

export default function AboutHeroEditor() {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);

  // Pic
  const [picFile,    setPicFile]    = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [picStatus,  setPicStatus]  = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const fileInputRef = useRef(null);

  // Text fields
  const [name,       setName]       = useState("");
  const [role,       setRole]       = useState("");
  const [aboutMe,    setAboutMe]    = useState("");
  const [wordsBy,    setWordsBy]    = useState("");
  const [textStatus, setTextStatus] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();

        const picRecord    = data.find(i => i.id === IDS.pic);
        const myselfRecord = data.find(i => i.id === IDS.myself);

        if (picRecord?.url) setPicPreview(picRecord.url);
        if (myselfRecord?.text) {
          const obj = safeParse(myselfRecord.text, {});
          if (obj.name)    setName(obj.name);
          if (obj.role)    setRole(obj.role);
          if (obj.aboutMe) setAboutMe(obj.aboutMe);
          if (obj.wordsBy) setWordsBy(obj.wordsBy);
        }
      } catch (err) { setFetchError(err.message); }
      finally { setFetchLoading(false); }
    }
    load();
  }, []);

  function selectPic(file) {
    setPicFile(file); setPicPreview(URL.createObjectURL(file)); setPicStatus(null);
  }

  async function savePic() {
    if (!picFile) return;
    setPicStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadMedia(IDS.pic, picFile);
      if (updated?.url) setPicPreview(updated.url);
      setPicFile(null);
      setPicStatus({ type: "success", message: "Photo updated!" });
    } catch (err) { setPicStatus({ type: "error", message: err.message }); }
  }

  async function saveText() {
    if (!name.trim() || !aboutMe.trim()) return;
    if (name.length > NAME_MAX || role.length > ROLE_MAX || aboutMe.length > ABOUT_MAX || wordsBy.length > WORDSBYMAX) return;
    setTextStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify([{ name: name.trim(), role: role.trim(), aboutMe: aboutMe.trim(), wordsBy: wordsBy.trim() }]);
      await patchMediaText(IDS.myself, payload);
      setTextStatus({ type: "success", message: "Content saved!" });
    } catch (err) { setTextStatus({ type: "error", message: err.message }); }
  }

  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3"><Skeleton className="h-3 w-28" /><Skeleton className="w-full" style={{ aspectRatio: "3/4", maxWidth: 260 }} /><Skeleton className="h-10 w-28" /></div>
        <div className="border-t border-white/[0.06]" />
        {[...Array(4)].map((_, i) => <div key={i} className="flex flex-col gap-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-12 w-full" /></div>)}
        <Skeleton className="h-10 w-28 self-end" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-2xl">⚠</span><p className="text-sm text-red-400">{fetchError}</p>
        <button onClick={() => window.location.reload()} className="text-xs text-blue-400 underline underline-offset-2">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Photographer Photo ──────────────────────────────────────────────── */}
      <Field label="Photographer Photo" hint="Portrait image shown in the About page hero · tall portrait preferred" status={picStatus}>
        <div className="w-full max-w-[240px]">
          <div
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"}`}
            style={{ aspectRatio: "3/4" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) selectPic(f); }}
          >
            {picPreview ? (
              <div className="relative w-full h-full group">
                <img src={picPreview} alt="Photographer" className="w-full h-full object-cover" />
                {picStatus?.type !== "loading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white/80 text-xs">Click to change</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-lg">↑</div>
                <p className="text-sm text-white/40">Drop or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
                <p className="text-xs text-white/20">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files[0]; if (f) selectPic(f); e.target.value = ""; }} />
        <SaveBtn onClick={savePic} disabled={!picFile || picStatus?.type === "loading"} label="Save Photo" />
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── Text Content ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Hero Content</p>
            <p className="text-[11px] text-white/25 mt-0.5">Name, role, bio and signature shown in the About page hero</p>
          </div>
          <StatusPill state={textStatus} />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Full Name <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">— last word renders in accent colour</span></label>
          <input type="text" value={name} onChange={e => { setName(e.target.value); setTextStatus(null); }}
            placeholder="Prajwal Chavan" className={inputCls} />
          <CharCount value={name} max={NAME_MAX} />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Role / Title</label>
          <input type="text" value={role} onChange={e => { setRole(e.target.value); setTextStatus(null); }}
            placeholder="Photographer" className={inputCls} />
          <CharCount value={role} max={ROLE_MAX} />
        </div>

        {/* About Me */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">About Me</label>
          <textarea value={aboutMe} onChange={e => { setAboutMe(e.target.value); setTextStatus(null); }}
            placeholder="I'm a freelance photographer based in Pune…"
            rows={6} className={inputCls + " resize-none leading-relaxed"} />
          <CharCount value={aboutMe} max={ABOUT_MAX} />
        </div>

        {/* Words By */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Signature <span className="text-[10px] text-white/20 normal-case tracking-normal font-normal">— shown in italic below the bio</span></label>
          <input type="text" value={wordsBy} onChange={e => { setWordsBy(e.target.value); setTextStatus(null); }}
            placeholder="PajjuChavan" className={inputCls} />
          <CharCount value={wordsBy} max={WORDSBYMAX} />
        </div>

        <SaveBtn onClick={saveText}
          disabled={!name.trim() || !aboutMe.trim() || textStatus?.type === "loading" ||
            name.length > NAME_MAX || role.length > ROLE_MAX || aboutMe.length > ABOUT_MAX || wordsBy.length > WORDSBYMAX}
          label="Save Content" />
      </div>

    </div>
  );
}