import React from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import heroImage from "@/assets/hero-img-pc-c.png";


const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen bg-black">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Image */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            // style={{
            //   backgroundImage:
            //     'url(https://images.unsplash.com/photo-1627961888164-b79f406b245b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzAxODYzOTJ8MA&ixlib=rb-4.1.0&q=85)',
            // }}
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
        <div className="flex items-center justify-center px-8 lg:px-16 py-20">
          <div className="max-w-xl">
            <p className="text-gray-400 text-sm tracking-widest mb-4 uppercase">
              Hello
            </p>
            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              WE’RE <span className="text-gray-400">BLACK N GREY MEDIA</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              A creative team of photographers (and filmmakers) capturing portraits, brands, and places. We’d love to create something meaningful with you.
            </p>
            <Button
              variant="outline"
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