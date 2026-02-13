import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-zinc-900 pt-20 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    {/* Logo and Description */}
                    <div>
                        <h3 className="text-white text-2xl font-bold tracking-wider mb-4">
                            LOGO
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Let’s create and capture beautiful memories together through heartfelt wedding photography and cinematic storytelling designed to preserve your most meaningful moments.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wide">
                            Contact Info
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Mail className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                                <a
                                    href="mailto:blackngreymedia@gmail.com"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    blackngreymedia@gmail.com
                                </a>
                            </div>
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                                <a
                                    href="tel:+917758990489"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    +91 7758990489
                                </a>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                                <p className="text-gray-400">
                                    Pune, Maharashtra, India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Other Info */}
                    <div>
                        <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wide">
                            Other Info
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    Credit Disclaimer
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Follow Us */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © 2026 black-n-gray media. All rights reserved.
                        </p>
                        <div>
                            <h5 className="text-white text-sm font-bold mb-3 uppercase tracking-wide">
                                Follow Us
                            </h5>
                            <div className="flex space-x-4">
                                {[
                                    { name: 'blackngreymedia', url: 'https://www.instagram.com/blackngreymedia/' },
                                    { name: 'phere.stories', url: 'https://www.instagram.com/phere.stories/' },
                                    { name: 'Facebook', url: 'https://facebook.com/yourusername' },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                                    >
                                        {social.name}
                                    </a>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;