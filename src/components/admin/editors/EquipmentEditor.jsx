// src/components/admin/editors/EquipmentEditor.jsx
// Edit: section header, description, and items for each gear category.
// eqName (category names) are fixed — only items within each category are editable.

import React, { useState, useEffect } from "react";
import { patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { MEDIA_IDS } from "../../../config/api";

const EQ_ID      = MEDIA_IDS.aboutPage.equipment; // 25
const HEADER_MAX = 60;
const DESC_MAX   = 300;
const ITEM_MAX   = 80;

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

function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`} />;
}

function CharCount({ value, max }) {
  const len = value.length;
  return (
    <span className={`text-xs tabular-nums ${len > max ? "text-red-400" : len > max * 0.85 ? "text-amber-400/70" : "text-white/20"}`}>
      {len} / {max}
    </span>
  );
}

const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

export default function EquipmentEditor() {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [saveStatus,   setSaveStatus]   = useState(null);

  const [header, setHeader] = useState("");
  const [desc,   setDesc]   = useState("");
  const [gears,  setGears]  = useState([]); // [{ eqName, items: string[] }]

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        const record = data.find(i => i.id === EQ_ID);
        if (record?.text) {
          const obj = safeParse(record.text, {});
          if (obj.header)               setHeader(obj.header);
          if (obj.desc)                 setDesc(obj.desc);
          if (Array.isArray(obj.gears)) setGears(obj.gears.map(g => ({ eqName: g.eqName, items: [...g.items] })));
        }
      } catch (err) { setFetchError(err.message); }
      finally { setFetchLoading(false); }
    }
    load();
  }, []);

  function updateItem(gearIdx, itemIdx, value) {
    setGears(prev => {
      const next = prev.map(g => ({ ...g, items: [...g.items] }));
      next[gearIdx].items[itemIdx] = value;
      return next;
    });
    setSaveStatus(null);
  }

  function addItem(gearIdx) {
    setGears(prev => {
      const next = prev.map(g => ({ ...g, items: [...g.items] }));
      next[gearIdx].items.push("");
      return next;
    });
    setSaveStatus(null);
  }

  function removeItem(gearIdx, itemIdx) {
    setGears(prev => {
      const next = prev.map(g => ({ ...g, items: [...g.items] }));
      next[gearIdx].items.splice(itemIdx, 1);
      return next;
    });
    setSaveStatus(null);
  }

  const hasErrors =
    header.length > HEADER_MAX ||
    desc.length   > DESC_MAX   ||
    gears.some(g => g.items.some(item => item.length > ITEM_MAX));

  const hasEmpty =
    !header.trim() || !desc.trim() ||
    gears.some(g => g.items.some(item => !item.trim()));

  async function saveAll() {
    if (hasErrors || hasEmpty) return;
    setSaveStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify([{ header: header.trim(), desc: desc.trim(), gears }]);
      await patchMediaText(EQ_ID, payload);
      setSaveStatus({ type: "success", message: "Equipment saved!" });
    } catch (err) { setSaveStatus({ type: "error", message: err.message }); }
  }

  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="border-t border-white/[0.06]" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-3 w-36" />
            {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}
          </div>
        ))}
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

      {/* ── Section Header & Description ──────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Section Info</p>
          <p className="text-[11px] text-white/25 mt-0.5">Heading and description shown at the top of the equipment section</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Section Heading</label>
          <input type="text" value={header} onChange={e => { setHeader(e.target.value); setSaveStatus(null); }}
            placeholder="My Equipment" className={inputCls} />
          <CharCount value={header} max={HEADER_MAX} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Description</label>
          <textarea value={desc} onChange={e => { setDesc(e.target.value); setSaveStatus(null); }}
            placeholder="Here you can find the list of my equipment…"
            rows={4} className={inputCls + " resize-none leading-relaxed"} />
          <CharCount value={desc} max={DESC_MAX} />
        </div>
      </div>

      <div className="border-t border-white/[0.06]" />

      {/* ── Gear Categories ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Gear Items</p>
          <p className="text-[11px] text-white/25 mt-0.5">Category names are fixed · edit, add or remove items within each category</p>
        </div>

        {gears.map((gear, gearIdx) => (
          <div key={gearIdx} className="rounded-xl border border-white/[0.07] overflow-hidden">
            {/* Category header — fixed name, not editable */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <span className="text-white/20 text-xs">📷</span>
              <span className="text-sm font-semibold text-white/70">{gear.eqName}</span>
              <span className="ml-1 text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md">fixed</span>
              <span className="ml-auto text-[11px] text-white/25">{gear.items.length} item{gear.items.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Items list */}
            <div className="flex flex-col gap-2 p-4">
              {gear.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-2">
                  <span className="text-white/20 text-xs shrink-0">⊙</span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateItem(gearIdx, itemIdx, e.target.value)}
                    placeholder="Equipment name"
                    className={[inputCls, "py-2 flex-1",
                      item.length > ITEM_MAX ? "border-red-500/50" : ""
                    ].join(" ")}
                  />
                  {gear.items.length > 1 && (
                    <button onClick={() => removeItem(gearIdx, itemIdx)}
                      className="shrink-0 text-white/20 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded hover:bg-red-500/10">
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {/* Add item */}
              <button onClick={() => addItem(gearIdx)}
                className="mt-1 self-start text-xs text-blue-400/70 hover:text-blue-400 transition-colors flex items-center gap-1">
                <span>+</span> Add item
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Save ──────────────────────────────────────────────────────────── */}
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
          Save Equipment
        </button>
      </div>

    </div>
  );
}