import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Award, Lightbulb, Briefcase, Send, Instagram, Youtube, Facebook, Globe, Twitter } from 'lucide-react';

const stats = [
    { number: '23', label: 'AWARDS', icon: Award },
    { number: '17', label: 'EXHIBITIONS', icon: Lightbulb },
    { number: '87', label: 'PROJECTS', icon: Briefcase },
];

const socialLinks = [
    { icon: Youtube,    href: '#' },
    { icon: Twitter,    href: '#' },
    { icon: Instagram,  href: '#' },
    { icon: Globe,  href: '#' },
    { icon: Facebook,   href: '#' },
];

const ContactPage = () => {
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
                                    blackngreymedia@gmail.com
                                </a>
                            </div>

                            <div>
                                <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-2">Phone Us</p>
                                <a href="tel:+917758990489"
                                   className="text-white/80 hover:text-[#C89968] transition-colors text-sm border-b border-white/20 hover:border-[#C89968] pb-0.5">
                                    +91 7758990489
                                </a>
                            </div>

                            <div>
                                <p className="text-white/50 tracking-[0.3em] text-xs uppercase mb-2">Visit Us</p>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Pune, Maharashtra, India
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