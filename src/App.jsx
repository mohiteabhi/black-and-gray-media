import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
// import ServicesSection from "./components/ServicesSection";
// import PortfolioSection from "./components/PortfolioSection";
// import TestimonialsSection from "./components/TestimonialsSection";
// import PartnersSection from "./components/PartnersSection";
// import StatsSection from "./components/StatsSection";
// import CTASection from "./components/CTASection";
// import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <AboutSection />
      {/* <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <PartnersSection />
      <StatsSection />
      <CTASection />
      <Footer /> */}
    </div>
  );
}

export default App;