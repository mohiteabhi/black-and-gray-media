import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Award, Lightbulb, Briefcase, Send, Instagram, Youtube, Facebook, Globe, Twitter } from 'lucide-react';
import API_CONFIG, { MEDIA_IDS } from '../../config/api';

const FOOTER_ID = MEDIA_IDS.footer.content;

const FALLBACK = {
    tagline: "Let's create and capture beautiful memories together through heartfelt wedding photography and cinematic storytelling designed to preserve your most meaningful moments.",
    email: "blackngreymedia@gmail.com",
    phone: "+91 7758990489",
    location: "Pune, Maharashtra, India",
};

function safeParseFooter(raw) {
    try {
        let str = raw.trim();
        if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
        let parsed = JSON.parse(str);
        while (typeof parsed === "string") parsed = JSON.parse(parsed);
        const obj = Array.isArray(parsed) ? parsed[0] : parsed;
        const contact = Array.isArray(obj?.contact) ? obj.contact[0] : obj?.contact ?? {};
        return {
            email: contact?.email || FALLBACK.email,
            phone: contact?.phoneNumber || FALLBACK.phone,
            location: contact?.location || FALLBACK.location,
        };
    } catch (_) {
        return FALLBACK;
    }
}

const stats = [
    { number: '23', label: 'AWARDS', icon: Award },
    { number: '17', label: 'EXHIBITIONS', icon: Lightbulb },
    { number: '87', label: 'PROJECTS', icon: Briefcase },
];

const socialLinks = [
    { icon: Youtube, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Globe, href: '#' },
    { icon: Facebook, href: '#' },
];

const ContactPage = () => {
    const [email, setEmail] = useState(FALLBACK.email);
    const [phone, setPhone] = useState(FALLBACK.phone);
    const [location, setLocation] = useState(FALLBACK.location);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '',
        email: '', phone: '',
        location: '', date: '',
        subject: '', details: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

      useEffect(() => {
        async function fetchFooterData() {
          try {
            const res  = await fetch(API_CONFIG.endpoints.media.list);
            const data = await res.json();
    
    
            // Footer content
            const footerRecord = data.find(item => item.id === FOOTER_ID);
            if (footerRecord) {
              const parsed = safeParseFooter(footerRecord.text);
              setEmail(parsed.email);
              setPhone(parsed.phone);
              setLocation(parsed.location);
            }
          } catch (err) {
            console.warn("Could not fetch footer data, using fallback.", err);
          }
        }
        fetchFooterData();
      }, []);

    return (
        <div className="bg-[#0a0a0a] min-h-screen font-sans">

            {/* ─── HERO ─────────────────────────────────────────── */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Parallax bg */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80)`,
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center top',
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />

                {/* Text */}
                <div className="relative z-10 text-center px-6 pt-20">
                    <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wide mb-4 leading-tight">
                        CONTACT{' '}
                        <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">
                            US
                        </span>
                    </h1>
                    <p className="text-white/60 tracking-[0.4em] text-sm uppercase">
                        We'd Love To Hear What You Think
                    </p>
                </div>

                {/* Scroll arrow */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
                    <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/40" />
                    <div className="w-3 h-3 border-r-2 border-b-2 border-white/40 rotate-45" />
                </div>
            </section>

            {/* ─── CONTACT FORM + INFO ──────────────────────────── */}
            <section className="relative z-10 bg-black py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-[280px_1fr] gap-16">

                        {/* LEFT — contact info */}
                        <div className="space-y-10">
                            <div>
                                <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-2">Email Us</p>
                                <a href="mailto:blackngreymedia@gmail.com"
                                    className="text-white/80 hover:text-[#C89968] transition-colors text-sm border-b border-white/20 hover:border-[#C89968] pb-0.5">
                                    {email}
                                </a>
                            </div>

                            <div>
                                <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-2">Phone Us</p>
                                <a href="tel:+917758990489"
                                    className="text-white/80 hover:text-[#C89968] transition-colors text-sm border-b border-white/20 hover:border-[#C89968] pb-0.5">
                                    {phone}
                                </a>
                            </div>

                            <div>
                                <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-2">Visit Us</p>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {location}
                                </p>
                            </div>

                            {/* Social icons */}
                            <div className="flex gap-3 pt-2">
                                {socialLinks.map(({ icon: Icon, href }, idx) => (
                                    <a
                                        key={idx}
                                        href={href}
                                        className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-all duration-300 group"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — form */}
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-wide mb-10 uppercase">
                                Let's{' '}
                                <span className="bg-gradient-to-r from-[#C89968] to-[#D4A574] bg-clip-text text-transparent">
                                    Work
                                </span>{' '}
                                Together
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Row 1 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            First Name <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            Last Name <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            Email Address <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            Phone Number <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                        />
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            Location <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                            Date <span className="text-[#C89968]">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                        Subject <span className="text-[#C89968]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20"
                                    />
                                </div>

                                {/* Details */}
                                <div>
                                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                                        Details <span className="text-[#C89968]">*</span>
                                    </label>
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        rows={6}
                                        required
                                        className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#C89968]/60 transition-colors placeholder-white/20 resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full border border-white/30 text-white text-xs tracking-[0.3em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-3 group"
                                >
                                    Submit Button
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ContactPage;