const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
 
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
    },
  },
};
 
export default API_CONFIG;