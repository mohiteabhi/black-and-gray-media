import API_CONFIG from "../config/api";

/** Read the stored JWT — set by AuthContext on login */
function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Not authenticated. Please log in again.");
  return { Authorization: `Bearer ${token}` };
}

/**
 * Upload a file and update the media record in one request.
 * PATCH /media/:id/upload  (multipart/form-data)
 *
 * Backend handles: delete old Cloudinary asset → upload new one → update DB.
 * Returns the updated media record.
 */
export async function uploadMedia(id, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(API_CONFIG.endpoints.media.uploadMedia(id), {
    method: "PATCH",
    headers: {
      // Do NOT set Content-Type manually — browser sets it with the correct
      // multipart boundary automatically when body is FormData.
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    const raw = await res.text();
    console.error("[uploadMedia] server error:", raw);
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (_) {}
    throw new Error(parsed?.message || raw || `Upload failed (${res.status}).`);
  }

  return res.json(); // updated media record { id, url, public_id, resource_type, ... }
}

/**
 * Patch a media record with new text content.
 * PATCH /media/:id  { text }
 */
export async function patchMediaText(id, text) {
  const res = await fetch(API_CONFIG.endpoints.media.patch(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to update text (${res.status}).`);
  }

  return res.json();
}