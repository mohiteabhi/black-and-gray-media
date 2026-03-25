// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import API_CONFIG, { MEDIA_IDS } from '../config/api';
import brandLogo from '@/assets/brands/black-n-gray.png';

const FOOTER_ID = MEDIA_IDS.footer.content;

// Fallback values shown while loading or if API has no data
const FALLBACK = {
  tagline: "Let's create and capture beautiful memories together through heartfelt wedding photography and cinematic storytelling designed to preserve your most meaningful moments.",
  email:   "blackngreymedia@gmail.com",
  phone:   "+91 7758990489",
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
      tagline:  obj?.tagline  || FALLBACK.tagline,
      email:    contact?.email       || FALLBACK.email,
      phone:    contact?.phoneNumber || FALLBACK.phone,
      location: contact?.location    || FALLBACK.location,
    };
  } catch (_) {
    return FALLBACK;
  }
}

const Footer = () => {
  const [logoSrc,   setLogoSrc]   = useState(brandLogo);
  const [logoError, setLogoError] = useState(false);
  const [tagline,   setTagline]   = useState(FALLBACK.tagline);
  const [email,     setEmail]     = useState(FALLBACK.email);
  const [phone,     setPhone]     = useState(FALLBACK.phone);
  const [location,  setLocation]  = useState(FALLBACK.location);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        const data = await res.json();

        // Logo
        const logoRecord = data.find(item => item.id === MEDIA_IDS.global.logo);
        if (logoRecord?.url) setLogoSrc(logoRecord.url);

        // Footer content
        const footerRecord = data.find(item => item.id === FOOTER_ID);
        if (footerRecord?.text) {
          const parsed = safeParseFooter(footerRecord.text);
          setTagline(parsed.tagline);
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
    <footer id="contact" className="bg-zinc-900 pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Logo and Tagline */}
          <div>
            <div className="flex items-center mb-4">
              {!logoError ? (
                <img src={logoSrc} alt="Black N Gray"
                  onError={() => setLogoError(true)}
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              ) : (
                <span className="text-2xl font-bold tracking-wider text-white">BLACK N GRAY</span>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed">{tagline}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wide">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                <a href={`mailto:${email}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 break-all">
                  {email}
                </a>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300">
                  {phone}
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-400">{location}</p>
              </div>
            </div>
          </div>

          {/* Other Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wide">Other Info</h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy",    href: "#" },
                { label: "Terms & Conditions", href: "#" },
                { label: "Credit Disclaimer",  href: "#" },
                { label: "Contact Us",         href: "#contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-gray-400 hover:text-white transition-colors duration-300">{label}</a>
                </li>
              ))}
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
              <h5 className="text-white text-sm font-bold mb-3 uppercase tracking-wide">Follow Us</h5>
              <div className="flex space-x-4">
                {[
                  { name: 'blackngreymedia', url: 'https://www.instagram.com/blackngreymedia/' },
                  { name: 'phere.stories',   url: 'https://www.instagram.com/phere.stories/' },
                  { name: 'Facebook',        url: 'https://facebook.com/yourusername' },
                ].map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
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