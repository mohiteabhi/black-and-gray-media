import React, { createContext, useContext, useState, useCallback } from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  // Persist token in localStorage so the session survives page refresh
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });
 
  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
 
    // Adjust these fields to match your actual API response shape
    const authToken = data.token || data.access_token || data.accessToken;
    const userData = data.user || { username };
 
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
 
    setToken(authToken);
    setUser(userData);
 
    return data;
  }, []);
 
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }, []);
 
  const isAuthenticated = Boolean(token);
 
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
// Custom hook for easy consumption
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
 
export default AuthContext;