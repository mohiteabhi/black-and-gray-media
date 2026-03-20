import API_CONFIG from "../config/api";
 
function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Not authenticated. Please log in again.");
  return { Authorization: `Bearer ${token}` };
}
 
/** GET /gallery?section_id=N  — public, no auth needed */
export async function fetchGallery(sectionId) {
  const res = await fetch(API_CONFIG.endpoints.gallery.list(sectionId));
  if (!res.ok) throw new Error(`Failed to fetch gallery (${res.status})`);
  return res.json();
}
 
/**
 * POST /gallery  (multipart/form-data)
 * Fields: file, page_id, section_id, category, title, span, sort_order
 */
export async function createGalleryItem(fields, file) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") formData.append(k, v);
  });
 
  const res = await fetch(API_CONFIG.endpoints.gallery.create, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: formData,
  });
 
  if (!res.ok) {
    const raw = await res.text();
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (_) {}
    throw new Error(parsed?.message || raw || `Create failed (${res.status})`);
  }
  return res.json();
}
 
/**
 * PATCH /gallery/:id/upload  (multipart/form-data) — replace file
 */
export async function uploadGalleryItem(id, file) {
  const formData = new FormData();
  formData.append("file", file);
 
  const res = await fetch(API_CONFIG.endpoints.gallery.upload(id), {
    method: "PATCH",
    headers: { ...getAuthHeader() },
    body: formData,
  });
 
  if (!res.ok) {
    const raw = await res.text();
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (_) {}
    throw new Error(parsed?.message || raw || `Upload failed (${res.status})`);
  }
  return res.json();
}
 
/**
 * PATCH /gallery/:id  (JSON) — update metadata: title, category, span, sort_order
 */
export async function patchGalleryItem(id, fields) {
  const res = await fetch(API_CONFIG.endpoints.gallery.patch(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(fields),
  });
 
  if (!res.ok) {
    const raw = await res.text();
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (_) {}
    throw new Error(parsed?.message || raw || `Patch failed (${res.status})`);
  }
  return res.json();
}
 
/** DELETE /gallery/:id */
export async function deleteGalleryItem(id) {
  const res = await fetch(API_CONFIG.endpoints.gallery.delete(id), {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
 
  if (!res.ok) {
    const raw = await res.text();
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (_) {}
    throw new Error(parsed?.message || raw || `Delete failed (${res.status})`);
  }
  return true;
}