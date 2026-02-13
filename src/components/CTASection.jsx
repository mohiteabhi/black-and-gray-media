import React from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import ctaImg from "@/assets/cta-cover-a.jpg"

const CTASection = () => {
  return (
    <section 
      className="bg-black py-20 relative min-h-[500px]" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${ctaImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center 65%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-2xl">
          CAPTURING THE <span className="text-rose-400 drop-shadow-2xl">MOMENTS</span> THAT CAPTIVATE YOUR <span className="text-rose-400 drop-shadow-2xl">HEART</span>
        </h2>
        <p className="text-white text-lg mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
          Professional wedding photography and cinematic videography services capturing heartfelt moments, timeless emotions, and authentic stories with creative storytelling and high-resolution visuals.
        </p>
        <Button
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm tracking-wide shadow-xl"
        >
          <Send className="w-4 h-4 mr-2" />
          BOOK NOW
        </Button>
      </div>
    </section>
  );
};

export default CTASection;