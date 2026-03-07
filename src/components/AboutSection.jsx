import React, { useState } from 'react';
import { Heart, Camera, ShoppingBag, Video, ArrowRight, Utensils, Car } from 'lucide-react';
import { services } from '../mockData';
import heroVideo from '../assets/story_of_time_1.mp4';
import { useRef, useEffect } from 'react';
import FNBShowcase from './pages/view-services/FNBShowcase';

const iconMap = {
    rings: Heart,
    camera: Camera,
    'shopping-bag': ShoppingBag,
    video: Video,
    utensils: Utensils,
    car: Car
};

const AboutSection = () => {
    const videoRef = useRef(null);
    const mobileVideoRef = useRef(null);
    const [showFNB, setShowFNB] = useState(false);

    useEffect(() => {
        if (videoRef.current)       videoRef.current.playbackRate = 0.6;
        if (mobileVideoRef.current) mobileVideoRef.current.playbackRate = 0.6;
    }, []);

    const isFNB = (service) =>
        service.icon === 'utensils' ||
        service.title?.toLowerCase().includes('fnb') ||
        service.title?.toLowerCase().includes('food') ||
        service.title?.toLowerCase().includes('f&b');

    const ServiceLink = ({ service }) => {
        if (isFNB(service)) {
            return (
                <button
                    onClick={() => setShowFNB(true)}
                    className="text-white text-xs tracking-widest uppercase inline-flex items-center hover:text-gray-300 transition-colors duration-300 border-b border-white pb-1 self-start bg-transparent cursor-pointer"
                    style={{ fontFamily: 'inherit' }}
                >
                    VIEW SERVICE
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
            );
        }
        return (
            <a
                href="#portfolio"
                className="text-white text-xs tracking-widest uppercase inline-flex items-center hover:text-gray-300 transition-colors duration-300 border-b border-white pb-1 self-start"
            >
                VIEW SERVICE
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
        );
    };

    return (
        <>
            <section id="about" className="min-h-screen bg-black mb-8">

                {/* ── Mobile Layout ── */}
                <div className="lg:hidden">
                    <div className="relative min-h-screen bg-black flex items-end pb-20 justify-center">
                        <video
                            ref={mobileVideoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            src={heroVideo}
                            autoPlay muted loop playsInline
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative z-10 text-center px-6">
                            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-6 leading-tight uppercase drop-shadow-2xl">
                                <span className="block">WE TELL THE <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">STORY</span> OF</span>
                                <span className="block mt-2">THE <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">TIME.</span></span>
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto drop-shadow-lg">
                                A professional landscape, still-life, and architectural photographer. I would love to share my experience with you.
                            </p>
                        </div>
                    </div>

                    <div className="bg-black py-8 px-6">
                        <div id="services" className="space-y-4">
                            {services.map((service) => {
                                const IconComponent = iconMap[service.icon];
                                return (
                                    <div key={service.id} className="relative bg-zinc-900 p-8 flex flex-col hover:bg-zinc-800 transition-all duration-300 group overflow-hidden min-h-[300px]">
                                        {service.video ? (
                                            <video className="absolute inset-0 w-full h-full object-cover" src={service.video} autoPlay muted loop playsInline />
                                        ) : service.image ? (
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />
                                        ) : null}
                                        <div className="absolute inset-0 bg-black/70" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-6">
                                                <IconComponent className="w-10 h-10 text-white" strokeWidth={1.2} />
                                            </div>
                                            <h3 className="text-white text-xl font-bold mb-4 uppercase tracking-wider">{service.title}</h3>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                                            <ServiceLink service={service} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Desktop Layout ── */}
                <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
                    <div className="relative overflow-hidden bg-black flex items-start">
                        <div className="relative z-10 text-center pl-20 pr-30 pt-16 max-w-xl translate-x-28">
                            <h2 className="text-white text-5xl lg:text-4xl font-bold mb-8 leading-tight uppercase text-center drop-shadow-2xl">
                                <span className="block">WE TELL THE <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">STORY</span> OF</span>
                                <span className="block">
                                    <span className="translate-x-12">THE <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">TIME.</span></span>
                                </span>
                            </h2>
                            <p className="text-[#A8A8A8] text-base leading-relaxed drop-shadow-lg">
                                A professional landscape, still-life, and<br />
                                architectural photographer. I would<br />
                                love to share my experience with you.
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-black/30 z-0" />
                        <video
                            ref={videoRef}
                            className="absolute inset-x-0 top-16 bottom-0 w-full h-full object-contain object-bottom"
                            src={heroVideo}
                            autoPlay muted loop playsInline
                        />
                    </div>

                    <div className="bg-black py-16 px-8 lg:px-12">
                        <div id="services" className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            {services.map((service) => {
                                const IconComponent = iconMap[service.icon];
                                return (
                                    <div key={service.id} className="relative bg-zinc-900 p-10 flex flex-col hover:bg-zinc-800 transition-all duration-300 group overflow-hidden">
                                        {service.video ? (
                                            <video className="absolute inset-0 w-full h-full object-cover" src={service.video} autoPlay muted loop playsInline />
                                        ) : service.image ? (
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />
                                        ) : null}
                                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-300" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-8">
                                                <IconComponent className="w-10 h-10 text-white" strokeWidth={1.2} />
                                            </div>
                                            <h3 className="text-white text-2xl font-bold mb-6 uppercase tracking-wider">{service.title}</h3>
                                            <p className="text-gray-300 text-sm mb-8 leading-relaxed flex-grow">{service.description}</p>
                                            <ServiceLink service={service} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </section>

            {/*
             * FNBShowcase sits OUTSIDE the section, rendered as a fixed full-screen
             * overlay. The landing page stays mounted underneath — no scroll fighting,
             * no page replacement, no body lock needed.
             */}
            {showFNB && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 9999,
                    overflowY: 'auto',
                    background: '#000',
                }}>
                    <FNBShowcase onBack={() => setShowFNB(false)} />
                </div>
            )}
        </>
    );
};

export default AboutSection;