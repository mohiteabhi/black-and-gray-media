import React, { useState, useEffect } from "react";
import { patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const FOOTER_ID   = MEDIA_IDS.footer.content; // 23
const TAGLINE_MAX = 220;
const EMAIL_MAX   = 80;
const PHONE_MAX   = 20;
const LOCATION_MAX = 60;

// ── Helpers ───────────────────────────────────────────────────────────────────
function safeParseFooter(raw) {
  try {
    let str = raw.trim();
    if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
    let parsed = JSON.parse(str);
    while (typeof parsed === "string") parsed = JSON.parse(parsed);
    const obj = Array.isArray(parsed) ? parsed[0] : parsed;
    const contact = Array.isArray(obj?.contact) ? obj.contact[0] : obj?.contact ?? {};
    return {
      tagline:  obj?.tagline             ?? "",
      email:    contact?.email           ?? "",
      phone:    contact?.phoneNumber     ?? "",
      location: contact?.location        ?? "",
    };
  } catch (_) { return { tagline: "", email: "", phone: "", location: "" }; }
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

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-white/50">{label}</p>
        {hint && <p className="text-[11px] text-white/25 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      {children}
    </div>
  );
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

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

// ── Main editor ───────────────────────────────────────────────────────────────
export default function FooterEditor() {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [saveStatus,   setSaveStatus]   = useState(null);

  const [tagline,  setTagline]  = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [location, setLocation] = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setFetchLoading(true);
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = await res.json();
        const record = data.find(item => item.id === FOOTER_ID);
        if (record?.text) {
          const parsed = safeParseFooter(record.text);
          setTagline(parsed.tagline);
          setEmail(parsed.email);
          setPhone(parsed.phone);
          setLocation(parsed.location);
        }
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────
  const errors = {
    tagline:  tagline.length  > TAGLINE_MAX,
    email:    email.length    > EMAIL_MAX    || (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())),
    phone:    phone.length    > PHONE_MAX,
    location: location.length > LOCATION_MAX,
  };
  const hasErrors   = Object.values(errors).some(Boolean);
  const hasEmpty    = !tagline.trim() || !email.trim() || !phone.trim() || !location.trim();

  // ── Save ───────────────────────────────────────────────────────────────────
  async function saveAll() {
    if (hasErrors || hasEmpty) return;
    setSaveStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify([{
        tagline: tagline.trim(),
        contact: [{
          email:       email.trim(),
          phoneNumber: phone.trim(),
          location:    location.trim(),
        }],
      }]);
      await patchMediaText(FOOTER_ID, payload);
      setSaveStatus({ type: "success", message: "Footer saved!" });
    } catch (err) {
      setSaveStatus({ type: "error", message: err.message });
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-24 w-full" />
        <div className="border-t border-white/[0.06]" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
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

  return (
    <div className="flex flex-col gap-8">

      {/* ── Tagline ────────────────────────────────────────────────────────── */}
      <Field label="Brand Tagline" hint={`Short description shown below the logo · max ${TAGLINE_MAX} chars`}>
        <textarea
          value={tagline}
          onChange={e => { setTagline(e.target.value); setSaveStatus(null); }}
          placeholder="Let's create and capture beautiful memories together…"
          rows={4}
          className={[inputCls, "resize-none leading-relaxed",
            errors.tagline ? "border-red-500/50 focus:border-red-500/60" : ""
          ].join(" ")}
        />
        <div className="flex items-center justify-between">
          <CharCount value={tagline} max={TAGLINE_MAX} />
          {errors.tagline && <span className="text-xs text-red-400">Too long</span>}
        </div>
      </Field>

      <div className="border-t border-white/[0.06]" />

      {/* ── Contact Info ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Contact Info</p>
          <p className="text-[11px] text-white/25 mt-0.5">Shown in the footer Contact Info column</p>
        </div>

        {/* Email */}
        <Field label="Email Address" hint={`max ${EMAIL_MAX} chars`}>
          <input type="email" value={email}
            onChange={e => { setEmail(e.target.value); setSaveStatus(null); }}
            placeholder="yourmail@example.com"
            className={[inputCls, errors.email ? "border-red-500/50 focus:border-red-500/60" : ""].join(" ")}
          />
          <div className="flex items-center justify-between">
            <CharCount value={email} max={EMAIL_MAX} />
            {email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
              <span className="text-xs text-red-400">Invalid email format</span>
            )}
          </div>
        </Field>

        {/* Phone */}
        <Field label="Phone Number" hint={`Include country code · max ${PHONE_MAX} chars`}>
          <input type="tel" value={phone}
            onChange={e => { setPhone(e.target.value); setSaveStatus(null); }}
            placeholder="+91 9876543210"
            className={[inputCls, errors.phone ? "border-red-500/50 focus:border-red-500/60" : ""].join(" ")}
          />
          <div className="flex items-center justify-between">
            <CharCount value={phone} max={PHONE_MAX} />
            {errors.phone && <span className="text-xs text-red-400">Too long</span>}
          </div>
        </Field>

        {/* Location */}
        <Field label="Location" hint={`City, State, Country · max ${LOCATION_MAX} chars`}>
          <input type="text" value={location}
            onChange={e => { setLocation(e.target.value); setSaveStatus(null); }}
            placeholder="Pune, Maharashtra, India"
            className={[inputCls, errors.location ? "border-red-500/50 focus:border-red-500/60" : ""].join(" ")}
          />
          <div className="flex items-center justify-between">
            <CharCount value={location} max={LOCATION_MAX} />
            {errors.location && <span className="text-xs text-red-400">Too long</span>}
          </div>
        </Field>
      </div>

      {/* ── Live preview ───────────────────────────────────────────────────── */}
      {(tagline || email || phone || location) && (
        <div className="rounded-xl border border-white/[0.06] bg-black/20 px-5 py-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/20 mb-1">Preview</p>
          {tagline && <p className="text-xs text-white/50 leading-relaxed italic">{tagline}</p>}
          <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
            {email    && <p className="text-xs text-white/40">✉ {email}</p>}
            {phone    && <p className="text-xs text-white/40">📞 {phone}</p>}
            {location && <p className="text-xs text-white/40">📍 {location}</p>}
          </div>
        </div>
      )}

      {/* ── Save ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <StatusPill state={saveStatus} />
        <button onClick={saveAll}
          disabled={saveStatus?.type === "loading" || hasErrors || hasEmpty}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
            bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.25)]
            hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {saveStatus?.type === "loading" && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Save Footer
        </button>
      </div>

    </div>
  );
}