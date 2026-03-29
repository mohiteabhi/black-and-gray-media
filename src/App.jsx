import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import ServicesPage from "./components/pages/ServicesPage";
import PortfolioPage from "./components/pages/PortfolioPage";
import ContactPage from "./components/pages/ContactPage";
import NotFoundPage from "./components/pages/NotFoundPage";

import LoginPage from "./components/pages/LoginPage";
import DashboardPage from "./components/pages/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Admin / auth routes — no shared layout ── */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ── Public routes — with shared Navbar + Footer ── */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;