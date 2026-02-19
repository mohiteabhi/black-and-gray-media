import React from 'react';
import { Camera, Video, Heart, ShoppingBag, ArrowRight, Quote, Award, Lightbulb, Briefcase } from 'lucide-react';
import { services } from '../../mockData';
import StatsSection from "../StatsSection";
import { brands } from '../../mockData';
import { features } from '../../mockData';
import servicebg from "@/assets/servicePage.png";

const iconMap = {
    rings: Heart,
    camera: Camera,
    "shopping-bag": ShoppingBag,
    video: Video,
};

const ServicesPage = () => {

    return (
        <div className="bg-[#0a0a0a] min-h-screen">

            {/* ✅ Hero Section — full-screen with fixed parallax background */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

                {/* Fixed parallax background image — feathers/dark foliage from Unsplash */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${servicebg})`,
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center top',
                    }}
                />

                {/* Dark overlay — heavy at bottom so service cards blend in naturally */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />

                {/* Hero Text */}
                <div className="relative z-10 text-center px-6 mb-0 -translate-y-12">
                    <h1 className="text-7xl md:text-8xl font-bold text-white tracking-wide mb-4 leading-tight">
                        OUR{' '}
                        <span className="bg-gradient-to-r from-[#cfd9df] to-[#e2ebf0] bg-clip-text text-transparent">
                            SERVICES
                        </span>
                    </h1>
                    <p className="text-white/60 tracking-[0.4em] text-sm uppercase">What We Do</p>
                </div>

                {/* Scroll-down arrow */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-px h-14 bg-gradient-to-b from-white/0 to-white/40 mx-auto mb-2" />
                    <div className="w-4 h-4 border-r-2 border-b-2 border-white/40 rotate-45 mx-auto" />
                </div>
            </section>

            {/* Services Grid — starts right after hero, bg-black so it naturally covers the fixed bg */}
            <section className="relative z-10 bg-black pt-4 pb-20">
                <div className="max-w-7xl mx-auto px-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => {
                            const IconComponent = iconMap[service.icon];
                            return (
                                <div
                                    key={service.id}
                                    className="relative bg-zinc-900 p-10 flex flex-col hover:bg-zinc-800 transition-all duration-300 group overflow-hidden min-h-[360px]"
                                >
                                    {/* Background Video or Image */}
                                    {service.video ? (
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover"
                                            src={service.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : service.image ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${service.image})` }}
                                        />
                                    ) : null}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-300" />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-8">
                                            {IconComponent && (
                                                <IconComponent
                                                    className="w-10 h-10 text-white"
                                                    strokeWidth={1.2}
                                                />
                                            )}
                                        </div>

                                        <h3 className="text-white text-2xl font-bold mb-6 uppercase tracking-wider">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-300 text-sm mb-8 leading-relaxed flex-grow">
                                            {service.description}
                                        </p>

                                        <a
                                            href="#portfolio"
                                            className="text-white text-xs tracking-widest uppercase inline-flex items-center hover:text-gray-300 transition-colors duration-300 border-b border-white pb-1 self-start"
                                        >
                                            VIEW SERVICE
                                            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section with Image */}
            <section className="relative z-10 py-20 bg-black">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-12">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                                        {feature.number}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">{feature.title}</h4>
                                        <p className="text-white/60 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-l from-black to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                            <img
                                src="https://images.unsplash.com/photo-1759701788724-df6b41660b96"
                                alt="Professional Photography"
                                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="relative z-10 py-20 bg-zinc-900">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                        {brands.map((brand, idx) => (
                            <a
                                key={idx}
                                href={brand.workLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative overflow-hidden group cursor-pointer block h-36"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${brand.brandImage})` }}
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300" />
                                <div className="absolute inset-0 border border-white/10 group-hover:border-white/40 transition-all duration-300" />
                                <div className="relative z-10 h-full flex items-center justify-center p-4">
                                    <p className="text-white/70 group-hover:text-white font-semibold tracking-wider transition-colors duration-300 text-center text-sm uppercase leading-tight">
                                        {brand.brandName}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection />
        </div>
    );
};

export default ServicesPage;