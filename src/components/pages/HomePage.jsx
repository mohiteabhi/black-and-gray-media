import React from "react";
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import AboutSection from "../AboutSection";
// import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "../PortfolioSection";
import TestimonialsSection from "../TestimonialsSection";
// import PartnersSection from "./components/PartnersSection";
import StatsSection from "../StatsSection";
import CTASection from "../CTASection";

function HomePage() {
    return (
    <div className="App">
        <HeroSection />
        <AboutSection />
        {/* <ServicesSection /> */}
        <PortfolioSection />
        <TestimonialsSection />
        {/* <PartnersSection /> */}
        <StatsSection />
        <CTASection/>
    </div>
    );

}
export default HomePage;