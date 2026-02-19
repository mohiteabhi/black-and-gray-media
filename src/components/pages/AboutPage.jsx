import React from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
import { Camera, Lightbulb, Award, Briefcase, Flag } from 'lucide-react';
import pc from "../../assets/team/pc.jpg";
import { equipment } from '../../mockData';
import { team } from '../../mockData';
import { useNavigate } from "react-router-dom";
import CTASection from '../CTASection';

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={pc}
                alt="Joshua Bell"
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Content */}
            <div className="text-white space-y-6">
              <h1 className="text-6xl font-bold tracking-wide text-white">
                <span className="text-[#D2C1AF]">PRAJWAL</span> CHAVAN
              </h1>
              <h5 className="text-lg tracking-[0.3em] text-white/60">PHOTOGRAPHER</h5>
              <p className="text-white/70 leading-relaxed text-lg">
                I'm a freelance photographer based in Pune who specializes in capturing moments across all types of photography. I love turning ideas into beautiful images, and I’m here to help you do the same. Whether it’s portraits, weddings, events, products, or creative shoots, are you searching for a photographer who is passionate, reliable, and creative? I am that photographer!
              </p>
              <p className="text-white/50 italic font-serif text-xl">- PajjuChavan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="pt-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white tracking-wide mb-4">MY EQUIPMENTS</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Here you can find the list of my equipment. The choice of camera depends on the photoshoot type, location, timing, and a lot more. If you have any questions about my equipment, don't hesitate to ask.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: Camera Bodies + Flashes and Lights */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-8 shadow-xl shadow-white/30">
              <h3 className="text-xl font-bold text-white tracking-wider mb-8">
                CAMERA BODIES
              </h3>
              <ul className="space-y-4 mb-12">
                {equipment.cameraBodies.map((item, idx) => (
                  <li key={idx} className="text-white/70 flex items-center gap-3">
                    <span className="text-white/50">⊙</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-white tracking-wider mb-8 mt-8">
                FLASHES AND LIGHTS
              </h3>
              <ul className="space-y-4">
                {equipment.flashesAndLights.map((item, idx) => (
                  <li key={idx} className="text-white/70 flex items-center gap-3">
                    <span className="text-white/50">⊙</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Camera Lenses */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-8 shadow-xl shadow-white/30">
              <h3 className="text-xl font-bold text-white tracking-wider mb-8">
                CAMERA LENSES
              </h3>
              <ul className="space-y-4">
                {equipment.cameraLenses.map((item, idx) => (
                  <li key={idx} className="text-white/70 flex items-center gap-3">
                    <span className="text-white/50">⊙</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white tracking-wide">OUR AMAZING TEAM</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-96 object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2 tracking-wide">{member.name}</h4>
                <p className="text-white/50 tracking-wider text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default AboutPage;