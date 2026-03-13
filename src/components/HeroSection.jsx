import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
// import heroImage from "@/assets/hero-img-d.jpg";
import herobackup from "@/assets/hero-img-d.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [heroImage, setHeroImage] = useState(herobackup);
  const [heroTeamText, setHeroTeamText] = useState("A creative team of photographers (and filmmakers) capturing portraits, brands, and places. We'd love to create something meaningful with you.");
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const res = await fetch("http://localhost:3000/media");
        const data = await res.json();

        const hero = data.find(item => item.media_title === "heroImage");
        const heroText = data.find(item => item.media_title === "heroTeamText");

        if (heroText) {
          setHeroTeamText(heroText.text);
          console.log(heroText.text);
        }

        if (hero) {
          setHeroImage(hero.url);
        }
      } catch (err) {
        console.error("Error fetching hero image:", err);
      }
    };

    fetchHeroImage();
  }, []);
  return (
    <section id="home" className="min-h-screen bg-black mb-8">
      {/* Mobile Layout - Image Background with Overlay Text */}
      {/* <div className="lg:hidden relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 flex items-end min-h-screen px-6 pb-16">
          <div className="w-full">
            <p className="text-gray-300 text-xs tracking-widest mb-3 uppercase">
              Hello
            </p>
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              WE'RE <span className="text-gray-400">BLACK N GREY MEDIA</span>
            </h1>
            <p className="text-gray-200 text-sm mb-6 leading-relaxed">
              A creative team of photographers (and filmmakers) capturing portraits, brands, and places. We'd love to create something meaningful with you.
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-5 text-sm tracking-wide"
            >
              <Send className="w-4 h-4 mr-2" />
              CONTACT ME
            </Button>
          </div>
        </div>
      </div> */}
      {/* Mobile Layout - Image Background with Overlay Text */}
      <div className="lg:hidden relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="w-full text-center">
            <p className="text-gray-300 text-xs tracking-widest mb-3 uppercase">
              Hello
            </p>
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              WE'RE{" "}
              <span style={{ color: "#848484" }}>BLACK</span>
              <span style={{ color: "#ffffff" }}> N </span>
              <span style={{ color: "#9ca3af" }}> GREY</span>
              {" "}MEDIA
            </h1>
            <p className="text-gray-200 text-sm mb-6 leading-relaxed max-w-md mx-auto">
              {heroTeamText}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/contact")}
              className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-5 text-sm tracking-wide"
            >
              <Send className="w-4 h-4 mr-2" />
              CONTACT ME
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Image */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center justify-center px-16 py-20">
          <div className="max-w-xl">
            <p className="text-gray-400 text-sm tracking-widest mb-4 uppercase">
              Hello
            </p>
            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              WE'RE{" "}
              <span style={{ color: "#848484" }}>BLACK</span>
              <span style={{ color: "#ffffff" }}> N </span>
              <span style={{ color: "#9ca3af" }}> GREY</span>
              {" "}MEDIA
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {heroTeamText}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/contact")}
              className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm tracking-wide"
            >
              <Send className="w-4 h-4 mr-2" />
              CONTACT ME
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;