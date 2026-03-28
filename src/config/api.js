// src/config/api.js
// Centralized API configuration — all base URLs and endpoint paths live here

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
    },
    media: {
      uploadMedia: (id) => `${API_BASE_URL}/media/${id}/upload`,  // PATCH /:id/upload — upload file + update record in one shot
      patch: (id) => `${API_BASE_URL}/media/${id}`,         // PATCH /:id        — update text fields
      list: `${API_BASE_URL}/media`,                  // GET  /media       — fetch all media
    },
    gallery: {
      list: (section_id) => `${API_BASE_URL}/gallery?section_id=${section_id}`,
      create: `${API_BASE_URL}/gallery`,
      upload: (id) => `${API_BASE_URL}/gallery/${id}/upload`,
      patch: (id) => `${API_BASE_URL}/gallery/${id}`,
      delete: (id) => `${API_BASE_URL}/gallery/${id}`,
    },
  },
};

// Gallery section IDs
export const GALLERY_SECTION_IDS = {
  wedding: 5,
  fnb: 6,
  automotive: 7,
  influenser: 8,
  portfolio: 3,
  team: 14
};

// Media IDs — one source of truth for all section editors
export const MEDIA_IDS = {
  home: {
    hero: {
      image: 1,  // heroImage
      text: 2,  // heroTeamText
    },
  },
  about: {
    intro: {
      title: 3,  // introTitle
      text: 4,  // introText
      video: 5,  // introVideo
    },
    services: {
      wedding: { title: 7, text: 8, cover: 9 },
      fnb: { title: 10, text: 11, cover: 12 },
      automotive: { title: 13, text: 14, cover: 15 },
      influencer: { title: 16, text: 17, cover: 18 },
    },
  },
  global: {
    logo: 6,     // brand logo used in Navbar
  },
  testimonials: {
    section: 19, // testimonialSection — JSON array of reviews
  },
  cta: {
    text: 20,  // ctaText  — JSON { heading, text }
    bg: 21,  // ctaBG    — background image/video url
  },
  footer: {
    content: 22,  // footerContent — JSON { tagline, contact: [{ email, phoneNumber, location }] }
  },
  aboutPage: {
    myself:    23,  // aboutMyself — JSON [{ name, role, aboutMe, wordsBy }]
    pic:       24,  // myPic      — photographer image url
    equipment: 25,  // myGears    — JSON [{ header, desc, gears: [{ eqName, items[] }] }]
    myTeam:    26,  // myTeam     — JSON [{ id, name, role }] — id matches gallery record id
  }
};

export default API_CONFIG;