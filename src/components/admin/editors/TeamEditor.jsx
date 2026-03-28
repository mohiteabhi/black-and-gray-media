// src/components/admin/editors/TeamEditor.jsx
// About Page — Team Section editor.
//
// Data sources:
//   Gallery section_id=14  → one record per member, holds the portrait photo.
//   Media id=26 (myTeam)   → text field stores JSON [{ id, name, role }, …]
//                             where `id` matches the gallery record id.
//
// Actions:
//   • Add member    → POST /gallery (create slot) + PATCH /media/26 (add entry)
//   • Delete member → DELETE /gallery/:id + PATCH /media/26 (remove entry)
//   • Upload photo  → PATCH /gallery/:id/upload
//   • Edit name/role→ PATCH /media/26 { text: JSON }

import React, { useState, useEffect, useRef } from "react";
import {
  fetchGallery,
  createGalleryItem,
  uploadGalleryItem,
  deleteGalleryItem,
} from "../../../services/galleryService";
import { patchMediaText } from "../../../services/mediaService";
import API_CONFIG, { GALLERY_SECTION_IDS, MEDIA_IDS } from "../../../config/api";

const TEAM_SECTION_ID = GALLERY_SECTION_IDS.team;  // 14
const TEAM_MEDIA_ID   = MEDIA_IDS.aboutPage.myTeam; // 26
const PAGE_ID         = 2; // about page

const NAME_MAX = 50;
const ROLE_MAX = 50;

// ── Helpers ────────────────────────────────────────────────────────────────────

function safeParse(raw, fallback) {
  try {
    let str = raw?.trim() || "";
    if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
    let parsed = JSON.parse(str);
    while (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed;
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

// ── Confirm modal ──────────────────────────────────────────────────────────────
function ConfirmModal({ memberName, onConfirm, onCancel, busy }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1423] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-sm font-semibold text-white/90 mb-1">Remove team member?</p>
        <p className="text-xs text-white/40 mb-6">
          <span className="text-white/70">"{memberName || "This member"}"</span> will be permanently deleted — their photo and info will be removed. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-xs text-white/50 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all disabled:opacity-50"
          >
            {busy && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete Member
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-white/20 bg-white/[0.04] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none transition-all";

// ── MemberCard ─────────────────────────────────────────────────────────────────
function MemberCard({ member, onImageSaved, onTextChange, onDeleteRequest }) {
  const fileInputRef = useRef(null);
  const [dragging,   setDragging]   = useState(false);
  const [picFile,    setPicFile]    = useState(null);
  const [picPreview, setPicPreview] = useState(member.url || null);
  const [imgStatus,  setImgStatus]  = useState(null);

  // Sync preview when parent updates url (e.g. after reload)
  useEffect(() => {
    if (member.url && !picFile) setPicPreview(member.url);
  }, [member.url]);

  function selectFile(file) {
    if (!file.type.startsWith("image/")) {
      setImgStatus({ type: "error", message: "Please select an image file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImgStatus({ type: "error", message: "Image must be under 10 MB." });
      return;
    }
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setImgStatus(null);
  }

  async function savePhoto() {
    if (!picFile) return;
    setImgStatus({ type: "loading", message: "Uploading…" });
    try {
      const updated = await uploadGalleryItem(member.galleryId, picFile);
      if (updated?.url) setPicPreview(updated.url);
      setPicFile(null);
      setImgStatus({ type: "success", message: "Photo saved!" });
      onImageSaved(member.galleryId, updated?.url);
    } catch (err) {
      setImgStatus({ type: "error", message: err.message });
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.02]">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[11px] font-bold tracking-widest uppercase text-white/30">
          Member {member.memberIndex + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/20 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
            id: {member.galleryId}
          </span>
          {/* Delete trigger */}
          <button
            onClick={() => onDeleteRequest(member)}
            title="Remove this member"
            className="w-6 h-6 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* ── Photo uploader ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Photo</label>
            <StatusPill state={imgStatus} />
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer ${
              dragging ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 hover:border-white/25 bg-white/[0.02]"
            }`}
            style={{ aspectRatio: "3/4", maxWidth: 160 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
          >
            {picPreview ? (
              <div className="relative w-full h-full group">
                <img src={picPreview} alt={member.name} className="w-full h-full object-cover" />
                {imgStatus?.type !== "loading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white/80 text-[10px]">Click to change</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30">↑</div>
                <p className="text-xs text-white/40">Drop or <span className="text-blue-400 underline underline-offset-2">browse</span></p>
                <p className="text-[10px] text-white/20">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files[0]; if (f) selectFile(f); e.target.value = ""; }}
          />

          {picFile && (
            <button
              onClick={savePhoto}
              disabled={imgStatus?.type === "loading"}
              className="self-start px-4 py-1.5 rounded-lg text-xs font-semibold text-white
                bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.2)]
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {imgStatus?.type === "loading" && (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save Photo
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* ── Name ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Name</label>
          <input
            type="text"
            value={member.name}
            onChange={e => onTextChange(member.galleryId, "name", e.target.value)}
            placeholder="Full name"
            className={inputCls}
          />
          <CharCount value={member.name} max={NAME_MAX} />
        </div>

        {/* ── Role ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Role</label>
          <input
            type="text"
            value={member.role}
            onChange={e => onTextChange(member.galleryId, "role", e.target.value)}
            placeholder="e.g. Photographer"
            className={inputCls}
          />
          <CharCount value={member.role} max={ROLE_MAX} />
        </div>
      </div>
    </div>
  );
}

// ── Main editor ────────────────────────────────────────────────────────────────
export default function TeamEditor() {
  const [fetchLoading,  setFetchLoading]  = useState(true);
  const [fetchError,    setFetchError]    = useState(null);
  const [saveStatus,    setSaveStatus]    = useState(null);
  const [addStatus,     setAddStatus]     = useState(null);   // for "Add Member" button
  const [deleteTarget,  setDeleteTarget]  = useState(null);   // member being deleted
  const [deleteBusy,    setDeleteBusy]    = useState(false);

  // members: [{ galleryId, memberIndex, url, name, role }]
  const [members, setMembers] = useState([]);

  useEffect(() => { load(); }, []);

  // ── Load ────────────────────────────────────────────────────────────────────
  async function load() {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const [galleryItems, mediaList] = await Promise.all([
        fetchGallery(TEAM_SECTION_ID),
        fetch(API_CONFIG.endpoints.media.list).then(r => {
          if (!r.ok) throw new Error(`Media fetch failed (${r.status})`);
          return r.json();
        }),
      ]);

      const teamRecord = mediaList.find(i => i.id === TEAM_MEDIA_ID);
      const teamText   = safeParse(teamRecord?.text, []);
      const textMap    = {};
      if (Array.isArray(teamText)) {
        teamText.forEach(m => { textMap[String(m.id)] = { name: m.name || "", role: m.role || "" }; });
      }

      const sorted = [...galleryItems].sort((a, b) =>
        (a.sort_order ?? a.id) - (b.sort_order ?? b.id)
      );

      const built = sorted.map((item, idx) => {
        const info = textMap[String(item.id)] || {};
        return {
          galleryId:   item.id,
          memberIndex: idx,
          url:         item.url || null,
          name:        info.name || "",
          role:        info.role || "",
        };
      });

      setMembers(built);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setFetchLoading(false);
    }
  }

  // ── Add member ──────────────────────────────────────────────────────────────
  async function handleAddMember() {
    setAddStatus({ type: "loading", message: "Adding member…" });
    try {
      const nextIndex = members.length + 1;
      const title     = `member${nextIndex}`;

      // 1. Create a gallery slot (no file yet — server creates a record without media)
      const newItem = await createGalleryItem(
        { page_id: PAGE_ID, section_id: TEAM_SECTION_ID, category: "Team", title, sort_order: nextIndex },
        // createGalleryItem requires a file argument; send a tiny transparent pixel as placeholder
        new File(
          [Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="), c => c.charCodeAt(0))],
          "placeholder.png",
          { type: "image/png" }
        )
      );

      // 2. Build the updated media text array with the new member entry
      const updatedMembers = [
        ...members.map(m => ({ id: String(m.galleryId), name: m.name.trim(), role: m.role.trim() })),
        { id: String(newItem.id), name: "", role: "" },
      ];
      await patchMediaText(TEAM_MEDIA_ID, JSON.stringify(updatedMembers));

      setAddStatus({ type: "success", message: "Member added!" });
      setTimeout(() => setAddStatus(null), 2500);
      await load();
    } catch (err) {
      setAddStatus({ type: "error", message: err.message });
    }
  }

  // ── Delete member ───────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      // 1. Delete gallery record (also removes Cloudinary asset if any)
      await deleteGalleryItem(deleteTarget.galleryId);

      // 2. Remove entry from media text and save
      const remaining = members
        .filter(m => m.galleryId !== deleteTarget.galleryId)
        .map(m => ({ id: String(m.galleryId), name: m.name.trim(), role: m.role.trim() }));
      await patchMediaText(TEAM_MEDIA_ID, JSON.stringify(remaining));

      setDeleteTarget(null);
      setSaveStatus({ type: "success", message: "Member deleted." });
      setTimeout(() => setSaveStatus(null), 2500);
      await load();
    } catch (err) {
      setSaveStatus({ type: "error", message: err.message });
      setDeleteTarget(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  // ── Text field changes ───────────────────────────────────────────────────────
  function handleTextChange(galleryId, field, value) {
    setMembers(prev => prev.map(m => m.galleryId === galleryId ? { ...m, [field]: value } : m));
    setSaveStatus(null);
  }

  function handleImageSaved(galleryId, newUrl) {
    if (newUrl) {
      setMembers(prev => prev.map(m => m.galleryId === galleryId ? { ...m, url: newUrl } : m));
    }
  }

  // ── Save all names & roles ───────────────────────────────────────────────────
  const hasErrors = members.some(m => m.name.length > NAME_MAX || m.role.length > ROLE_MAX);
  const hasEmpty  = members.some(m => !m.name.trim() || !m.role.trim());

  async function saveAllText() {
    if (hasErrors || hasEmpty) return;
    setSaveStatus({ type: "loading", message: "Saving…" });
    try {
      const payload = JSON.stringify(
        members.map(m => ({ id: String(m.galleryId), name: m.name.trim(), role: m.role.trim() }))
      );
      await patchMediaText(TEAM_MEDIA_ID, payload);
      setSaveStatus({ type: "success", message: "Team info saved!" });
    } catch (err) {
      setSaveStatus({ type: "error", message: err.message });
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-3 w-40 mb-1" />
          <Skeleton className="h-3 w-60" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.06]">
              <Skeleton className="h-3 w-20" />
              <Skeleton style={{ aspectRatio: "3/4", maxWidth: 160 }} />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-2xl">⚠</span>
        <p className="text-sm text-red-400">{fetchError}</p>
        <button onClick={load} className="text-xs text-blue-400 underline underline-offset-2">Retry</button>
      </div>
    );
  }

  // ── Editor ────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-8">

        {/* ── Top bar: header + Add button ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Team Members</p>
            <p className="text-[11px] text-white/25 mt-0.5">
              Upload a portrait, then set each member's name &amp; role.
              Photos live in gallery (section_id {TEAM_SECTION_ID}) · text in media id {TEAM_MEDIA_ID}.
            </p>
          </div>

          {/* Add Member button */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              onClick={handleAddMember}
              disabled={addStatus?.type === "loading"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white
                bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_4px_14px_rgba(16,185,129,0.2)]
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {addStatus?.type === "loading" ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>+</span>
              )}
              Add Member
            </button>
            {addStatus && addStatus.type !== "loading" && (
              <StatusPill state={addStatus} />
            )}
          </div>
        </div>

        {/* ── Member cards ── */}
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-white/[0.07] text-center">
            <span className="text-3xl text-white/10">👥</span>
            <p className="text-sm text-white/25">No team members yet.</p>
            <p className="text-xs text-white/15">Click "+ Add Member" above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {members.map(member => (
              <MemberCard
                key={member.galleryId}
                member={member}
                onImageSaved={handleImageSaved}
                onTextChange={handleTextChange}
                onDeleteRequest={setDeleteTarget}
              />
            ))}
          </div>
        )}

        {/* ── Save names & roles ── */}
        {members.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex flex-col gap-0.5">
              <StatusPill state={saveStatus} />
              {hasEmpty && !hasErrors && (
                <p className="text-[11px] text-amber-400/60 mt-1">All name and role fields must be filled in.</p>
              )}
              {hasErrors && (
                <p className="text-[11px] text-red-400/70 mt-1">Some fields exceed the character limit.</p>
              )}
            </div>
            <button
              onClick={saveAllText}
              disabled={saveStatus?.type === "loading" || hasErrors || hasEmpty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
                bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_14px_rgba(37,99,235,0.25)]
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saveStatus?.type === "loading" && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save Names &amp; Roles
            </button>
          </div>
        )}

      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <ConfirmModal
          memberName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={deleteBusy}
        />
      )}
    </>
  );
}
