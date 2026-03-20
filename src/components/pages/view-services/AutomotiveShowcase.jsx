// src/components/pages/view-services/AutomotiveShowcase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Zap, Play, Volume2, VolumeX } from 'lucide-react';
import { fetchGallery } from '../../../services/galleryService';
import { GALLERY_SECTION_IDS } from '../../../config/api';

const SECTION_ID = GALLERY_SECTION_IDS.automotive; // 7

// ── Theme tokens ──────────────────────────────────────────────────────────────
const BG         = '#000000';
const BG_CARD    = '#0d0d0d';
const ACCENT     = '#B0B0B0';
const ACCENT_DIM = 'rgba(176,176,176,0.18)';
const TEXT       = '#F0F0F0';
const TEXT_DIM   = 'rgba(240,240,240,0.35)';

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' };

// ── Teaser Video ──────────────────────────────────────────────────────────────
const TeaserVideo = ({ url }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true);

  useEffect(() => { setPlaying(false); setMuted(true); }, [url]);
  if (!url) return null;

  const handlePlay = () => { if (videoRef.current) { videoRef.current.play(); setPlaying(true); } };
  const toggleMute = (e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !muted; setMuted(m => !m); } };

  return (
    <div style={{ padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 28, height: 1, background: ACCENT }} />
        <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>MOTION REEL</p>
        <div style={{ flex: 1, height: 1, background: ACCENT_DIM }} />
      </div>
      {/* Video */}
      <div onClick={!playing ? handlePlay : undefined}
        style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 2, background: BG_CARD, aspectRatio: '16 / 7', cursor: playing ? 'default' : 'pointer' }}>
        <video ref={videoRef} src={url} muted playsInline loop
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {!playing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.56)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            {/* Diagonal scan line */}
            <div style={{ position: 'absolute', top: 0, left: '-20%', width: '140%', height: 1, background: `linear-gradient(to right, transparent, ${ACCENT_DIM}, transparent)`, transform: 'rotate(-2deg)' }} />
            <div style={{ width: 62, height: 62, borderRadius: '50%', border: `2px solid rgba(176,176,176,0.6)`, background: 'rgba(176,176,176,0.08)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={24} fill={ACCENT} color={ACCENT} style={{ marginLeft: 4 }} />
            </div>
            <p style={{ color: 'rgba(240,240,240,0.65)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>Watch the Reel</p>
          </div>
        )}
        {playing && (
          <button onClick={toggleMute} style={{ ...iconBtn, position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: `1px solid ${ACCENT_DIM}`, borderRadius: '50%', width: 36, height: 36 }}>
            {muted ? <VolumeX size={14} color="rgba(200,200,200,0.6)" /> : <Volume2 size={14} color={ACCENT} />}
          </button>
        )}
        {/* Chrome bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${ACCENT}, transparent)`, pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const idx = allItems.findIndex(i => i.id === item.id);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item]);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtn, position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
        <X size={22} color="rgba(200,200,200,0.5)" />
      </button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtn, position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronLeft size={30} color="rgba(200,200,200,0.45)" />
      </button>
      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960 }}>
        {item.resource_type === 'video'
          ? <video src={item.url} controls autoPlay style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
          : <img src={item.url} alt={item.title} style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
        }
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: TEXT, fontSize: 16, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(200,200,200,0.22)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNav(1); }} style={{ ...iconBtn, position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronRight size={30} color="rgba(200,200,200,0.45)" />
      </button>
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onClick(item)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1', background: BG_CARD }}>
      {item.resource_type === 'video' ? (
        <>
          <video src={item.url} muted playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.5) saturate(0.6)' : 'brightness(0.82) saturate(0.85)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', background: `rgba(176,176,176,0.7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <Play size={16} fill="white" color="white" style={{ marginLeft: 2 }} />
          </div>
        </>
      ) : (
        <img src={item.url} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.5) saturate(0.6)' : 'brightness(0.82) saturate(0.85)' }} />
      )}
      {/* Silver scan-line sweep */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', zIndex: 3 }} />
      {/* Dark gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 55%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease', zIndex: 2 }} />
      {/* Zap icon */}
      <div style={{ position: 'absolute', top: 10, right: 10, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', zIndex: 3 }}>
        <Zap size={14} color={ACCENT} fill={ACCENT} />
      </div>
      {/* Text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', transform: hovered ? 'translateY(0)' : 'translateY(10px)', opacity: hovered ? 1 : 0, transition: 'all 0.3s ease', zIndex: 3 }}>
        <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>{item.category}</p>
        <p style={{ color: TEXT, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{item.title}</p>
      </div>
      {/* Chrome bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: hovered ? '100%' : '0%', height: 2, background: `linear-gradient(to right, ${ACCENT}, #666)`, transition: 'width 0.4s ease', zIndex: 3 }} />
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const GallerySkeleton = () => (
  <div className="auto-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ background: BG_CARD, gridRowEnd: i === 0 || i === 4 ? 'span 2' : 'span 1', animation: 'autoPulse 1.5s ease-in-out infinite', opacity: 0.5 }} />
    ))}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AutomotiveShowcase = ({ onBack }) => {
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem,   setLightboxItem]   = useState(null);
  const [visible,        setVisible]        = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    window.scrollTo(0, 0);
    fetchGallery(SECTION_ID)
      .then(data => { setItems(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  const teaser           = items.find(i => i.category === 'Teaser' && i.resource_type === 'video');
  const gallery          = items.filter(i => i.category !== 'Teaser').sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  const categoryOptions  = ['All', ...new Set(gallery.map(i => i.category))];
  const filtered         = activeCategory === 'All' ? gallery : gallery.filter(i => i.category === activeCategory);
  const openLightbox     = (item) => setLightboxItem(item);
  const closeLightbox    = ()     => setLightboxItem(null);
  const navigateLightbox = (dir)  => {
    const idx = filtered.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx + dir + filtered.length) % filtered.length]);
  };
  const handleBack = () => { setVisible(false); setTimeout(onBack, 400); };

  return (
    <div style={{ minHeight: '100vh', background: BG, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: `1px solid ${ACCENT_DIM}`, height: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 16px' }}>
        <button onClick={handleBack} style={{ ...iconBtn, justifyContent: 'flex-start', gap: 8, color: 'rgba(200,200,200,0.5)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,200,200,0.5)'}>
          <ArrowLeft size={15} /><span>Back</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: ACCENT, fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>Portfolio</p>
          <p style={{ color: TEXT, fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Automotive</p>
        </div>
        <div />
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 380px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {teaser
          ? <video src={teaser.url} muted playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.2) saturate(0)' }} />
          : <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, ${BG} 100%)` }} />
        <div style={{ position: 'absolute', top: 0, left: '-20%', width: '140%', height: 1, background: `linear-gradient(to right, transparent, ${ACCENT_DIM}, transparent)`, transform: 'rotate(-3deg)', zIndex: 2 }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px', zIndex: 3 }}>
          <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px' }}>Machine. Art. Motion.</p>
          <h1 style={{ color: TEXT, fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 900, letterSpacing: 'clamp(3px, 1.5vw, 12px)', textTransform: 'uppercase', lineHeight: 1.05, margin: '0 0 12px' }}>
            Auto<span style={{ color: ACCENT }}>motive</span>
          </h1>
          <p style={{ color: TEXT_DIM, fontSize: 11, letterSpacing: '1px', margin: 0 }}>
            {loading ? '—' : `${gallery.length} works · Precision Photography`}
          </p>
        </div>
      </div>

      {/* Teaser */}
      <TeaserVideo url={teaser?.url} />

      {/* Gallery label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: ACCENT }} />
        <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>MACHINE ARCHIVE (N)</p>
        <div style={{ flex: 1, height: 1, background: ACCENT_DIM }} />
      </div>

      {/* Category filter */}
      {!loading && !error && (
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: `1px solid ${ACCENT_DIM}`, scrollbarWidth: 'none', gap: 2 }}>
          {categoryOptions.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? ACCENT : 'rgba(200,200,200,0.3)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 14px', borderBottom: activeCategory === cat ? `1px solid ${ACCENT}` : '1px solid transparent', fontWeight: activeCategory === cat ? 700 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: '14px', maxWidth: 1400, margin: '0 auto' }}>
        {loading && <GallerySkeleton />}
        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'rgba(176,176,176,0.5)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>Failed to load gallery</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: 'none', border: `1px solid ${ACCENT_DIM}`, color: ACCENT, padding: '7px 20px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <div className="auto-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
            {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(200,200,200,0.18)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>No works in this category</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: `1px solid ${ACCENT_DIM}`, marginTop: 28 }}>
        <p style={{ color: ACCENT, fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Engineered for impact</p>
        <p style={{ color: TEXT_DIM, fontSize: 12, margin: 0 }}>Let's shoot your machine the way it deserves.</p>
        <button onClick={handleBack}
          style={{ marginTop: 22, background: 'none', border: `1px solid rgba(176,176,176,0.35)`, color: ACCENT, padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = BG; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = ACCENT; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .auto-grid { grid-template-columns: repeat(2, 1fr) !important; }
        @media (min-width: 600px)  { .auto-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .auto-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        div::-webkit-scrollbar { display: none; }
        @keyframes autoPulse { 0%,100%{opacity:0.5} 50%{opacity:0.2} }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default AutomotiveShowcase;