// src/components/CTASection.jsx
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import API_CONFIG, { MEDIA_IDS } from '../config/api';

const CTA_TEXT_ID = MEDIA_IDS.cta.text; // 21
const CTA_BG_ID   = MEDIA_IDS.cta.bg;   // 22

// Fallback content shown while loading or if API has no data yet
const FALLBACK = {
  heading: "CAPTURING THE MOMENTS THAT CAPTIVATE YOUR HEART",
  text:    "Professional wedding photography and cinematic videography services capturing heartfelt moments, timeless emotions, and authentic stories with creative storytelling and high-resolution visuals.",
  bg:      null,
};

const CTASection = () => {
  const navigate = useNavigate();
  const [heading, setHeading] = useState(FALLBACK.heading);
  const [text,    setText]    = useState(FALLBACK.text);
  const [bgUrl,   setBgUrl]   = useState(FALLBACK.bg);

  useEffect(() => {
    async function fetchCTA() {
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        const data = await res.json();

        // ── Text / heading (id 21) ─────────────────────────────────────────
        const textRecord = data.find(item => item.id === CTA_TEXT_ID);
        if (textRecord?.text) {
          try {
            // Strip wrapping single quotes if present
            let raw = textRecord.text.trim();
            if (raw.startsWith("'") && raw.endsWith("'")) raw = raw.slice(1, -1);

            // Recursively parse until we get a plain object (handles double-encoded JSON)
            let parsed = JSON.parse(raw);
            while (typeof parsed === "string") parsed = JSON.parse(parsed);

            const obj = Array.isArray(parsed) ? parsed[0] : parsed;

            // Validate obj.heading is a plain string, not another JSON blob
            if (obj?.heading && typeof obj.heading === "string" && !obj.heading.trim().startsWith("[")) {
              setHeading(obj.heading);
            }
            if (obj?.text && typeof obj.text === "string" && !obj.text.trim().startsWith("[")) {
              setText(obj.text);
            }
          } catch (_) {
            // Not JSON — leave fallback values in place
          }
        }

        // ── Background image (id 22) ───────────────────────────────────────
        const bgRecord = data.find(item => item.id === CTA_BG_ID);
        if (bgRecord?.url) setBgUrl(bgRecord.url);

      } catch (err) {
        console.error("Error fetching CTA data:", err);
      }
    }
    fetchCTA();
  }, []);

  // Highlight 2nd word and last word in rose — works for any text the admin types
  function renderHeading(raw) {
    if (!raw || !raw.trim()) return null;
    const words = raw.trim().split(" ").filter(Boolean);
    if (words.length < 2) return <>{raw}</>;
    const total = words.length;
    return (
      <>
        {words.map((word, i) => {
          const isRose = i === 1 || i === total - 1;
          return (
            <span key={i}>
              {i > 0 && " "}
              {isRose
                ? <span className="text-rose-400 drop-shadow-2xl">{word}</span>
                : word}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <section
      className="relative py-32 text-center overflow-hidden"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundColor: !bgUrl ? '#111' : undefined,
        backgroundSize:    'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-6">
        <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-2xl">
          {renderHeading(heading)}
        </h2>
        <p className="text-white text-lg mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
          {text}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/contact')}
          className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm tracking-wide"
        >
          <Send className="w-4 h-4 mr-2" />
          GET IN TOUCH
        </Button>
      </div>
    </section>
  );
};

export default CTASection;