import React, { useState, useEffect } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['HOME', 'ABOUT', 'SERVICES', 'PORTFOLIO', 'CONTACT'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wider text-white">
            LOGO
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {menuItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white text-sm font-medium tracking-wide hover:text-gray-300 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Book Now Button */}
          <div className="hidden lg:block">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-2"
            >
              <Send className="w-4 h-4 mr-2" />
              BOOK NOW
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white text-sm font-medium tracking-wide hover:text-gray-300 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                BOOK NOW
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;