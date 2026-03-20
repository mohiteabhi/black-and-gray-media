// src/components/AboutSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Camera, ShoppingBag, Video, ArrowRight, Utensils, Car } from 'lucide-react';
import { services as mockServices } from '../mockData';
import API_CONFIG from "@/config/api";

import FNBShowcase        from './pages/view-services/FNBShowcase';
import WeddingShowcase    from './pages/view-services/WeddingShowcase';
import AutomotiveShowcase from './pages/view-services/AutomotiveShowcase';
import InfluenserShowcase      from './pages/view-services/InfluenserShowcase';

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

// ── API key map — links each mockData service (by icon) to its 3 API records ──
// titleKey → text field for service name
// textKey  → text field for description
// coverKey → url field for background image/video
const SERVICE_API_MAP = {
    'shopping-bag': { titleKey: 'weedingServiceTitle',     textKey: 'weedingServiceText',     coverKey: 'weedingSerCover'     },
    'utensils':     { titleKey: 'fnbServiceTitle',         textKey: 'fnbServiceText',         coverKey: 'fnbSerCover'         },
    'car':          { titleKey: 'autoServiceTitle',        textKey: 'autoServiceText',        coverKey: 'autoSerCover'        },
    'video':        { titleKey: 'influencerServiceTitle',  textKey: 'influencerServiceText',  coverKey: 'influencerSerCover'  },
};

// ── Gold gradient span ────────────────────────────────────────────────────────
const Gold = ({ children }) => (
    <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">
        {children}
    </span>
);

function StyledTitle({ text, className = "" }) {
    if (!text) return null;
    const words = text.trim().split(/\s+/).slice(0, 6);
    const total = words.length;

    function renderWord(word, idx, keyPrefix) {
        const isGold = idx === 1 || idx === total - 1;
        return (
            <React.Fragment key={`${keyPrefix}-${idx}`}>
                {idx > 0 && " "}
                {isGold ? <Gold>{word}</Gold> : word}
            </React.Fragment>
        );
    }

    const line1Words = words.slice(0, 3);
    const line2Words = words.slice(3);

    return (
        <h2 className={className}>
            <span className="block text-center">{line1Words.map((w, i) => renderWord(w, i, "l1"))}</span>
            {line2Words.length > 0 && (
                <span className="block text-center mt-1">{line2Words.map((w, i) => renderWord(w, i + 3, "l2"))}</span>
            )}
        </h2>
    );
}

function StyledDescription({ text, mobile = false }) {
    if (!text) return null;
    if (mobile) {
        return <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto drop-shadow-lg">{text}</p>;
    }
    const words = text.split(" ");
    const lines = [];
    let current = "";
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length > 38 && current) { lines.push(current); current = word; }
        else { current = candidate; }
    }
    if (current) lines.push(current);
    return (
        <p className="text-[#A8A8A8] text-base leading-relaxed drop-shadow-lg">
            {lines.map((line, i) => (
                <React.Fragment key={i}>{line}{i < lines.length - 1 && <br />}</React.Fragment>
            ))}
        </p>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const AboutSection = () => {
    const videoRef       = useRef(null);
    const mobileVideoRef = useRef(null);

    const [activeShowcase, setActiveShowcase] = useState(null);
    const [introVideo,     setIntroVideo]     = useState("");
    const [introTitle,     setIntroTitle]     = useState("");
    const [introSubText,   setIntroSubText]   = useState("");

    // Start with mockData as the initial value so the grid renders immediately
    // while the API fetch is in flight — API data overlays on top once loaded
    const [mergedServices, setMergedServices] = useState(mockServices);

    useEffect(() => {
        if (videoRef.current)       videoRef.current.playbackRate = 0.6;
        if (mobileVideoRef.current) mobileVideoRef.current.playbackRate = 0.6;

        const fetchData = async () => {
            try {
                const res  = await fetch(API_CONFIG.endpoints.media.list);
                const data = await res.json();

                // ── Intro section ──────────────────────────────────────────
                const introVid  = data.find(item => item.media_title === "introVid");
                const titleItem = data.find(item => item.media_title === "introTitle");
                const textItem  = data.find(item => item.media_title === "introSubText");

                if (introVid?.url)   setIntroVideo(introVid.url);
                if (titleItem?.text) setIntroTitle(titleItem.text);
                if (textItem?.text)  setIntroSubText(textItem.text);

                // ── Services grid — merge API data over mockData ───────────
                // For each service, look up its 3 API records by media_title.
                // Only override a field if the API returned a non-null/non-empty value.
                // Falls back to mockData value if API record is null — so nothing
                // breaks while content is still being uploaded in the CMS.
                const updated = mockServices.map(service => {
                    const keys = SERVICE_API_MAP[service.icon];
                    if (!keys) return service; // no mapping defined → keep mockData as-is

                    const titleRecord = data.find(item => item.media_title === keys.titleKey);
                    const textRecord  = data.find(item => item.media_title === keys.textKey);
                    const coverRecord = data.find(item => item.media_title === keys.coverKey);

                    // Determine cover type — API record has resource_type: 'image' | 'video'
                    const coverUrl  = coverRecord?.url  || null;
                    const coverType = coverRecord?.resource_type || null;

                    return {
                        ...service,
                        // Text overrides
                        title:       titleRecord?.text || service.title,
                        description: textRecord?.text  || service.description,
                        // Cover override — set image or video based on resource_type,
                        // clear the other so only one is active at a time
                        image: coverUrl && coverType === 'image' ? coverUrl
                             : coverUrl && coverType === 'video' ? null        // has video → clear image
                             : service.image,                                  // no cover yet → keep mockData
                        video: coverUrl && coverType === 'video' ? coverUrl
                             : coverUrl && coverType === 'image' ? null        // has image → clear video
                             : service.video,                                  // no cover yet → keep mockData
                    };
                });

                setMergedServices(updated);
            } catch (err) {
                console.error("Error fetching about data:", err);
                // On error, mergedServices stays as mockData — grid still renders
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
            <section id="about" className="min-h-screen bg-black mb-8">

                {/* ── Mobile Layout ── */}
                <div className="lg:hidden">
                    <div className="relative min-h-screen bg-black flex items-end pb-20 justify-center">
                        <video ref={mobileVideoRef} className="absolute inset-0 w-full h-full object-cover"
                            src={introVideo} autoPlay muted loop playsInline />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative z-10 text-center px-6">
                            <StyledTitle text={introTitle}
                                className="text-white text-3xl sm:text-4xl font-bold mb-6 leading-tight uppercase drop-shadow-2xl" />
                            <StyledDescription text={introSubText} mobile />
                        </div>
                    </div>

                    <div className="bg-black py-8 px-6">
                        <div id="services" className="space-y-4">
                            {mergedServices.map((service) => {
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
                        <div className="relative z-10 w-full flex flex-col items-center text-center px-10 pt-16">
                            <StyledTitle text={introTitle}
                                className="text-white text-5xl lg:text-4xl font-bold mb-8 leading-tight uppercase text-center drop-shadow-2xl" />
                            <StyledDescription text={introSubText} />
                        </div>
                        <div className="absolute inset-0 bg-black/30 z-0" />
                        <video ref={videoRef}
                            className="absolute inset-x-0 top-16 bottom-0 w-full h-full object-contain object-bottom"
                            src={introVideo} autoPlay muted loop playsInline />
                    </div>

                    <div className="bg-black py-16 px-8 lg:px-12">
                        <div id="services" className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            {mergedServices.map((service) => {
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

export default AboutSection;