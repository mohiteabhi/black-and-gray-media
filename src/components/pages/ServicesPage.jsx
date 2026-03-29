// src/components/pages/ServicesPage.jsx
import React, { useState, useEffect } from 'react';
import { Camera, Video, Heart, ShoppingBag, ArrowRight, Utensils, Car } from 'lucide-react';
import { services as mockServices, features as mockFeatures } from '../../mockData';
import StatsSection from "../StatsSection";
import { brands } from '../../mockData';
import servicebg from "@/assets/servicePage.png";
import API_CONFIG, { MEDIA_IDS } from "@/config/api";

import FNBShowcase        from './view-services/FNBShowcase';
import WeddingShowcase    from './view-services/WeddingShowcase';
import AutomotiveShowcase from './view-services/AutomotiveShowcase';
import InfluenserShowcase from './view-services/InfluenserShowcase';

// ── Same icon + showcase maps as AboutSection ────────────────────────────────
const iconMap = {
    rings:          Heart,
    camera:         Camera,
    'shopping-bag': ShoppingBag,
    video:          Video,
    utensils:       Utensils,
    car:            Car,
};

const showcaseMap = {
    utensils:       'fnb',
    'shopping-bag': 'wedding',
    car:            'automotive',
    video:          'video',
};

// ── Same API key map as AboutSection ─────────────────────────────────────────
const SERVICE_API_MAP = {
    'shopping-bag': { titleKey: 'weedingServiceTitle', textKey: 'weedingServiceText', coverKey: 'weedingSerCover'    },
    'utensils':     { titleKey: 'fnbServiceTitle',     textKey: 'fnbServiceText',     coverKey: 'fnbSerCover'        },
    'car':          { titleKey: 'autoServiceTitle',    textKey: 'autoServiceText',    coverKey: 'autoSerCover'       },
    'video':        { titleKey: 'influencerServiceTitle', textKey: 'influencerServiceText', coverKey: 'influencerSerCover' },
};

const ServicesPage = () => {
    const [mergedServices, setMergedServices] = useState(mockServices);
    const [activeShowcase, setActiveShowcase] = useState(null);
    const [features, setFeatures]             = useState(mockFeatures);
    const [featureImage, setFeatureImage]      = useState(null);

    // ── Parse JSON safely ────────────────────────────────────────────────────
    function safeParse(raw, fallback) {
        try {
            let str = raw?.trim() || "";
            if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
            let parsed = JSON.parse(str);
            while (typeof parsed === "string") parsed = JSON.parse(parsed);
            return parsed;
        } catch (_) { return fallback; }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res  = await fetch(API_CONFIG.endpoints.media.list);
                const data = await res.json();

                const updated = mockServices.map(service => {
                    const keys = SERVICE_API_MAP[service.icon];
                    if (!keys) return service;

                    const titleRecord = data.find(item => item.media_title === keys.titleKey);
                    const textRecord  = data.find(item => item.media_title === keys.textKey);
                    const coverRecord = data.find(item => item.media_title === keys.coverKey);

                    const coverUrl  = coverRecord?.url  || null;
                    const coverType = coverRecord?.resource_type || null;

                    return {
                        ...service,
                        title:       titleRecord?.text || service.title,
                        description: textRecord?.text  || service.description,
                        image: coverUrl && coverType === 'image' ? coverUrl
                             : coverUrl && coverType === 'video' ? null
                             : service.image,
                        video: coverUrl && coverType === 'video' ? coverUrl
                             : coverUrl && coverType === 'image' ? null
                             : service.video,
                    };
                });

                setMergedServices(updated);

                // ── Features list (media_id 27) ─────────────────────────────────
                const featRecord = data.find(i => i.id === MEDIA_IDS.services.featuresText);
                const parsedFeatures = safeParse(featRecord?.text, null);
                if (Array.isArray(parsedFeatures) && parsedFeatures.length > 0) {
                    setFeatures(parsedFeatures);
                }

                // ── Feature image (media_id 28) ─────────────────────────────────
                const imgRecord = data.find(i => i.id === MEDIA_IDS.services.featureImage);
                if (imgRecord?.url) setFeatureImage(imgRecord.url);

            } catch (err) {
                console.error("Error fetching services data:", err);
            }
        };
        fetchData();
    }, []);


    const openShowcase  = (key) => setActiveShowcase(key);
    const closeShowcase = ()    => setActiveShowcase(null);

    const ServiceLink = ({ service }) => {
        const key = showcaseMap[service.icon];
        if (key) {
            return (
                <button onClick={() => openShowcase(key)}
                    className="text-white text-xs tracking-widest uppercase inline-flex items-center hover:text-gray-300 transition-colors duration-300 border-b border-white pb-1 self-start bg-transparent cursor-pointer"
                    style={{ fontFamily: 'inherit' }}>
                    VIEW SERVICE
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
            );
        }
        return (
            <a href="#portfolio"
                className="text-white text-xs tracking-widest uppercase inline-flex items-center hover:text-gray-300 transition-colors duration-300 border-b border-white pb-1 self-start">
                VIEW SERVICE
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
        );
    };

    return (
        <>
            <div className="bg-[#0a0a0a] min-h-screen">

                {/* ── Hero Section ── */}
                <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${servicebg})`, backgroundAttachment: 'fixed', backgroundPosition: 'center top' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
                    <div className="relative z-10 text-center px-6 mb-0 -translate-y-12">
                        <h1 className="text-7xl md:text-8xl font-bold text-white tracking-wide mb-4 leading-tight">
                            OUR{' '}
                            <span className="bg-gradient-to-r from-[#cfd9df] to-[#e2ebf0] bg-clip-text text-transparent">
                                SERVICES
                            </span>
                        </h1>
                        <p className="text-white/60 tracking-[0.4em] text-sm uppercase">What We Do</p>
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                        <div className="w-px h-14 bg-gradient-to-b from-white/0 to-white/40 mx-auto mb-2" />
                        <div className="w-4 h-4 border-r-2 border-b-2 border-white/40 rotate-45 mx-auto" />
                    </div>
                </section>

                {/* ── Services Grid — dynamic, same as AboutSection ── */}
                <section className="relative z-10 bg-black pt-4 pb-20">
                    <div className="max-w-7xl mx-auto px-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mergedServices.map((service) => {
                                const IconComponent = iconMap[service.icon];
                                return (
                                    <div key={service.id}
                                        className="relative bg-zinc-900 p-10 flex flex-col hover:bg-zinc-800 transition-all duration-300 group overflow-hidden min-h-[360px]">
                                        {service.video ? (
                                            <video className="absolute inset-0 w-full h-full object-cover"
                                                src={service.video} autoPlay muted loop playsInline />
                                        ) : service.image ? (
                                            <div className="absolute inset-0 bg-cover bg-center"
                                                style={{ backgroundImage: `url(${service.image})` }} />
                                        ) : null}
                                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-300" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-8">
                                                {IconComponent && <IconComponent className="w-10 h-10 text-white" strokeWidth={1.2} />}
                                            </div>
                                            <h3 className="text-white text-2xl font-bold mb-6 uppercase tracking-wider">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm mb-8 leading-relaxed flex-grow">
                                                {service.description}
                                            </p>
                                            <ServiceLink service={service} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Features Section ── */}
                <section className="relative z-10 py-20 bg-black">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-12">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                                            {idx + 1}.
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">
                                                {feature.featureName || feature.title}
                                            </h4>
                                            <p className="text-white/60 leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-l from-black to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                                <img
                                    src={featureImage || "https://images.unsplash.com/photo-1759701788724-df6b41660b96"}
                                    alt="Professional Photography"
                                    className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Brands Section ── */}
                <section className="relative z-10 py-20 bg-zinc-900">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                            {brands.map((brand, idx) => (
                                <a key={idx} href={brand.workLink} target="_blank" rel="noopener noreferrer"
                                    className="relative overflow-hidden group cursor-pointer block h-36">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${brand.brandImage})` }} />
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

                {/* ── Stats Section ── */}
                <StatsSection />

            </div>

            {/* ── Showcase overlays — same as AboutSection ── */}
            {activeShowcase === 'fnb' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#000' }}>
                    <FNBShowcase onBack={closeShowcase} />
                </div>
            )}
            {activeShowcase === 'wedding' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#0d0805' }}>
                    <WeddingShowcase onBack={closeShowcase} />
                </div>
            )}
            {activeShowcase === 'automotive' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#020408' }}>
                    <AutomotiveShowcase onBack={closeShowcase} />
                </div>
            )}
            {activeShowcase === 'video' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#060300' }}>
                    <InfluenserShowcase onBack={closeShowcase} />
                </div>
            )}
        </>
    );
};

export default ServicesPage;