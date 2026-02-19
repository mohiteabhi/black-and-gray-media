import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import ServicesPage from "./components/pages/ServicesPage";
import PortfolioPage from "./components/pages/PortfolioPage";
import ContactPage from "./components/pages/ContactPage";

function App() {
  return (
    <Router>
      <Navbar /> {/* Always visible */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <CTASection/>
      <Footer/>
    </Router>

  );
}

export default App;