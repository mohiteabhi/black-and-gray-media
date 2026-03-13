// src/components/ProtectedRoute.jsx
// Wraps any route that requires authentication.
// Unauthenticated users are redirected to /admin/login.

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
 
  if (!isAuthenticated) {
    // Pass current location as `from` so LoginPage can redirect back after auth.
    // `replace` ensures /admin/dashboard is not duplicated in the history stack.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
 
  return children;
}
 
export default ProtectedRoute;