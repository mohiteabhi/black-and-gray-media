const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
 
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
    },
    media: {
      uploadMedia: (id) => `${API_BASE_URL}/media/${id}/upload`,
      patch:  (id) => `${API_BASE_URL}/media/${id}`,
      list:   `${API_BASE_URL}/media`,
    },
  },
};

// Media IDs — one source of truth for all section editors
export const MEDIA_IDS = {
  home: {
    hero: {
      image: 1,  // heroImage
      text:  2,  // heroTeamText
    },
  },
  global: {
    logo: 6,     // brand logo used in Navbar
  },
};

export default API_CONFIG;