// src/components/admin/editors/WeddingGalleryEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { fetchGallery, createGalleryItem, uploadGalleryItem, patchGalleryItem, deleteGalleryItem } from "../../../services/galleryService";
import { GALLERY_SECTION_IDS } from "../../../config/api";

const SECTION_ID = GALLERY_SECTION_IDS.wedding; // 5
const PAGE_ID    = 1;
const SPAN_OPTIONS     = ["small", "large"];
const CATEGORY_OPTIONS = ["Teaser", "Ceremony", "Reception", "Portrait", "Details", "Other"];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1423] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-sm text-white/80 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs text-white/50 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Thumbnail ────────────────────────────────────────────────────────────────
function ItemThumb({ item }) {
  if (item.resource_type === "video") {
    return (
      <div className="relative w-full h-full bg-zinc-800 flex items-center justify-center">
        <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/60 text-lg bg-black/50 rounded-full w-8 h-8 flex items-center justify-center">▶</span>
        </div>
      </div>
    );
  }
  return <img src={item.url} alt={item.title} className="w-full h-full object-cover" />;
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function ItemModal({ item, onSave, onClose, saving }) {
  const isEdit = Boolean(item?.id);
  const fileInputRef = useRef(null);

  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(item?.url || null);
  const [title,     setTitle]     = useState(item?.title || "");
  const [category,  setCategory]  = useState(item?.category || "Ceremony");
  const [span,      setSpan]      = useState(item?.span || "small");
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? "");
  const [dragging,  setDragging]  = useState(false);

  const [fileError, setFileError] = useState("");

  function handleFile(f) {
    setFileError("");
    const isVideo = f.type.startsWith("video");
    const isImage = f.type.startsWith("image");
    const maxBytes = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    const maxLabel = isVideo ? "100 MB" : "10 MB";

    if (!isVideo && !isImage) {
      setFileError("Unsupported file type. Please upload an image or video.");
      return;
    }
    if (f.size > maxBytes) {
      setFileError(`File too large — ${isVideo ? "videos" : "images"} must be under ${maxLabel} (Cloudinary limit). Your file: ${(f.size / 1024 / 1024).toFixed(1)} MB`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleSubmit() {
    if (!isEdit && !file) return;
    onSave({
      file,
      fields: {
        page_id:    PAGE_ID,
        section_id: SECTION_ID,
        title:      title.trim(),
        category,
        span,
        sort_order: sortOrder !== "" ? Number(sortOrder) : undefined,
      },
      isEdit,
      id: item?.id,
    });
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";
  const labelCls = "text-xs font-semibold tracking-widest uppercase text-white/40 mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1423] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white/90">{isEdit ? "Edit Item" : "Add New Item"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors text-lg">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* File dropzone */}
          <div>
            <label className={labelCls}>
              {isEdit ? "Replace File (optional)" : "File *"}
            </label>
            <div
              className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden cursor-pointer ${
                dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
              }`}
              style={{ aspectRatio: "16/9" }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="w-full h-full relative">
                  {file?.type?.startsWith("video") || (!file && item?.resource_type === "video") ? (
                    <video src={preview} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white/70 text-xs tracking-wide">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-lg">↑</div>
                  <p className="text-sm text-white/40">Drop file or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
                  <p className="text-xs text-white/20">Image or Video</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
          {fileError && (
            <div className="flex items-start gap-2 mt-1.5 px-3 py-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/25">
              <span className="text-red-400 text-sm shrink-0 mt-px">⚠</span>
              <p className="text-xs text-red-300 leading-relaxed">{fileError}</p>
            </div>
          )}
          <div className="flex gap-3 mt-1">
            <span className="text-[11px] text-white/20">📷 Images: max 10 MB</span>
            <span className="text-[11px] text-white/20">🎬 Videos: max 100 MB</span>
          </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. The First Kiss" className={inputCls} />
          </div>

          {/* Category + Span row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className={inputCls + " cursor-pointer"}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c} className="bg-[#0f1423]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Span</label>
              <select value={span} onChange={e => setSpan(e.target.value)}
                className={inputCls + " cursor-pointer"}>
                {SPAN_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0f1423]">{s} {s === "large" ? "(2 cols)" : "(1 col)"}</option>)}
              </select>
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className={labelCls}>Sort Order <span className="text-white/20 normal-case tracking-normal font-normal">(optional)</span></label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
              placeholder="1, 2, 3…" className={inputCls} min="0" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="text-xs text-white/40 hover:text-white/70 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving || (!isEdit && !file) || Boolean(fileError)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-gradient-to-br from-blue-600 to-indigo-600
              shadow-[0_4px_14px_rgba(37,99,235,0.25)]
              hover:opacity-90 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isEdit ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function WeddingGalleryEditor() {
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState(null);
  const [globalStatus, setGlobalStatus] = useState(null);

  // Modal state
  const [modal,   setModal]   = useState(null);  // null | { mode: 'add' } | { mode: 'edit', item }
  const [saving,  setSaving]  = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  // Load
  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchGallery(SECTION_ID);
      setItems(data.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)));
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Save (add or edit) ────────────────────────────────────────────────────
  async function handleSave({ file, fields, isEdit, id }) {
    setSaving(true);
    setGlobalStatus({ type: "loading", message: isEdit ? "Saving…" : "Uploading…" });
    try {
      if (isEdit) {
        // Update metadata
        await patchGalleryItem(id, {
          title:      fields.title,
          category:   fields.category,
          span:       fields.span,
          sort_order: fields.sort_order,
        });
        // If a new file was selected, also replace the file
        if (file) await uploadGalleryItem(id, file);
      } else {
        await createGalleryItem(fields, file);
      }
      setGlobalStatus({ type: "success", message: isEdit ? "Item updated!" : "Item added!" });
      setModal(null);
      await load();
    } catch (err) {
      setGlobalStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    setDeleting(true);
    setGlobalStatus({ type: "loading", message: "Deleting…" });
    try {
      await deleteGalleryItem(id);
      setGlobalStatus({ type: "success", message: "Item deleted." });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setGlobalStatus({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
    }
  }

  const teaser  = items.find(i => i.category === "Teaser");
  const gallery = items.filter(i => i.category !== "Teaser");

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-32 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-9 w-24 bg-white/[0.04] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
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
    <>
      <div className="flex flex-col gap-6">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-white/30">{items.length} item{items.length !== 1 ? "s" : ""} · section_id {SECTION_ID}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill state={globalStatus} />
            <button
              onClick={() => setModal({ mode: "add" })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white
                bg-gradient-to-br from-blue-600 to-indigo-600
                shadow-[0_4px_14px_rgba(37,99,235,0.2)]
                hover:opacity-90 transition-all"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* ── Teaser section ──────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Teaser Video</p>
          {teaser ? (
            <div className="relative group rounded-xl overflow-hidden bg-zinc-900" style={{ aspectRatio: "16/9" }}>
              <ItemThumb item={teaser} />
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setModal({ mode: "edit", item: teaser })}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
                >Edit</button>
                <button
                  onClick={() => setDeleteTarget(teaser)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 text-xs font-semibold transition-all"
                >Delete</button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] text-white/50 bg-black/50 px-2 py-0.5 rounded-full tracking-wide uppercase">Teaser</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setModal({ mode: "add" })}
              className="rounded-xl border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2 py-10 cursor-pointer"
              style={{ aspectRatio: "16/9" }}
            >
              <span className="text-white/20 text-3xl">▶</span>
              <p className="text-white/30 text-sm">Add teaser video</p>
              <p className="text-white/15 text-xs">Set category to "Teaser"</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* ── Gallery grid ────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Gallery ({gallery.length})</p>
          {gallery.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No gallery items yet. Click "+ Add Item" to start.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map(item => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden bg-zinc-900 aspect-square">
                  <ItemThumb item={item} />

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2">
                    {/* Top — edit + delete */}
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setModal({ mode: "edit", item })}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 text-white text-[10px] font-semibold transition-all"
                      >Edit</button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 text-[10px] font-semibold transition-all"
                      >✕</button>
                    </div>
                    {/* Bottom — metadata */}
                    <div className="bg-black/50 rounded-lg px-2.5 py-1.5">
                      <p className="text-white/40 text-[10px] tracking-widest uppercase">{item.category}</p>
                      <p className="text-white text-xs font-medium truncate">{item.title}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[10px] text-white/30">span: {item.span}</span>
                        {item.sort_order != null && <span className="text-[10px] text-white/30">#{item.sort_order}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new tile */}
              <div
                onClick={() => setModal({ mode: "add" })}
                className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-white/20 text-2xl">+</span>
                <p className="text-white/25 text-xs">Add item</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Add / Edit modal ────────────────────────────────────────────────── */}
      {modal && (
        <ItemModal
          item={modal.item}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.title || deleteTarget.category}"? This cannot be undone.`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}