// src/components/pages/view-services/VideoShowcase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Film, Volume2, VolumeX } from 'lucide-react';
import { fetchGallery } from '../../../services/galleryService';
import { GALLERY_SECTION_IDS } from '../../../config/api';

const SECTION_ID = GALLERY_SECTION_IDS.influenser; // 8

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
        <div style={{ width: 28, height: 1, background: '#E8A020' }} />
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Featured Reel</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(232,160,32,0.12)' }} />
      </div>

      {/* Video */}
      <div onClick={!playing ? handlePlay : undefined}
        style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 2, background: '#0a0500', aspectRatio: '16 / 7', cursor: playing ? 'default' : 'pointer' }}>
        <video ref={videoRef} src={url} muted playsInline loop
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

        {/* Film grain overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")', opacity: 0.4, zIndex: 1, pointerEvents: 'none' }} />

        {!playing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,3,0,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, zIndex: 2 }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', border: '2px solid rgba(232,160,32,0.7)', background: 'rgba(232,160,32,0.1)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={24} fill="#E8A020" color="#E8A020" style={{ marginLeft: 4 }} />
            </div>
            <p style={{ color: 'rgba(255,200,100,0.65)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>Watch the Reel</p>
          </div>
        )}

        {playing && (
          <button onClick={toggleMute} style={{ ...iconBtn, position: 'absolute', bottom: 12, right: 12, background: 'rgba(6,3,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: '50%', width: 36, height: 36, zIndex: 3 }}>
            {muted ? <VolumeX size={14} color="rgba(255,200,100,0.6)" /> : <Volume2 size={14} color="#E8A020" />}
          </button>
        )}

        {/* Amber bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #E8A020, #FF6B00, transparent)', pointerEvents: 'none', zIndex: 3 }} />
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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,2,0,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtn, position: 'absolute', top: 14, right: 14, zIndex: 10 }}><X size={22} color="rgba(255,180,60,0.5)" /></button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtn, position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}><ChevronLeft size={30} color="rgba(255,180,60,0.45)" /></button>
      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960 }}>
        {item.resource_type === 'video'
          ? <video src={item.url} controls autoPlay style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
          : <img src={item.url} alt={item.title} style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
        }
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: '#FFF8F0', fontSize: 16, fontWeight: 600, letterSpacing: '1px', margin: 0 }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(255,180,60,0.2)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNav(1); }} style={{ ...iconBtn, position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}><ChevronRight size={30} color="rgba(255,180,60,0.45)" /></button>
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onClick(item)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1', background: '#0a0500' }}>

      {item.resource_type === 'video' ? (
        <>
          <video src={item.url} muted playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.5) sepia(0.2)' : 'brightness(0.82)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(232,160,32,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <Play size={18} fill="white" color="white" style={{ marginLeft: 3 }} />
          </div>
        </>
      ) : (
        <img src={item.url} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.5) sepia(0.2)' : 'brightness(0.82)' }} />
      )}

      {/* Film grain */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")', opacity: hovered ? 0.6 : 0.3, zIndex: 1, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,3,0,0.94) 0%, transparent 55%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 10, right: 10, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', zIndex: 3 }}>
        <Film size={14} color="#E8A020" />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', transform: hovered ? 'translateY(0)' : 'translateY(10px)', opacity: hovered ? 1 : 0, transition: 'all 0.32s ease', zIndex: 3 }}>
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>{item.category}</p>
        <p style={{ color: '#FFF8F0', fontSize: 12, fontWeight: 500, margin: 0 }}>{item.title}</p>
      </div>
      {/* Amber growing bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: hovered ? '100%' : '0%', height: 2, background: 'linear-gradient(to right, #E8A020, #FF6B00)', transition: 'width 0.45s ease', zIndex: 3 }} />
      {/* Frame corners */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 2, background: '#E8A020', opacity: hovered ? 0.8 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 20, background: '#E8A020', opacity: hovered ? 0.8 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const GallerySkeleton = () => (
  <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ background: '#0a0500', gridRowEnd: i === 0 || i === 4 ? 'span 2' : 'span 1', animation: 'vidPulse 1.5s ease-in-out infinite', opacity: 0.4 }} />
    ))}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const InfluenserShowcase = ({ onBack }) => {
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
    <div style={{ minHeight: '100vh', background: '#060300', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(6,3,0,0.95)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(232,160,32,0.18)', height: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 16px' }}>
        <button onClick={handleBack} style={{ ...iconBtn, justifyContent: 'flex-start', gap: 8, color: 'rgba(255,200,100,0.45)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#E8A020'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,200,100,0.45)'}>
          <ArrowLeft size={15} /><span>Back</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#E8A020', fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>Portfolio</p>
          <p style={{ color: '#FFF8F0', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Influencer & Branding</p>
        </div>
        <div />
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 380px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {teaser
          ? <video src={teaser.url} muted playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.22) sepia(0.4)' }} />
          : <div style={{ position: 'absolute', inset: 0, background: '#0a0500' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,3,0,0.15) 0%, #060300 100%)' }} />

        {/* Film sprocket holes */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 2 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 10, height: 8, borderRadius: 2, background: 'rgba(232,160,32,0.25)', border: '1px solid rgba(232,160,32,0.15)' }} />)}
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 2 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 10, height: 8, borderRadius: 2, background: 'rgba(232,160,32,0.25)', border: '1px solid rgba(232,160,32,0.15)' }} />)}
        </div>

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 50px', zIndex: 3 }}>
          <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px' }}>Frame by Frame</p>
          <h1 style={{ color: '#FFF8F0', fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 800, letterSpacing: 'clamp(2px, 1.2vw, 8px)', textTransform: 'uppercase', lineHeight: 1.1, margin: '0 0 12px' }}>
            Influencer <span style={{ color: '#E8A020' }}>Stories</span>
          </h1>
          <p style={{ color: 'rgba(255,200,100,0.3)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>
            {loading ? '—' : `${gallery.length} works · Cinematic Production`}
          </p>
        </div>
      </div>

      {/* Teaser */}
      <TeaserVideo url={teaser?.url} />

      {/* Gallery label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: '#E8A020' }} />
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>The Reel</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(232,160,32,0.1)' }} />
      </div>

      {/* Category filter */}
      {!loading && !error && (
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: '1px solid rgba(232,160,32,0.1)', scrollbarWidth: 'none', gap: 2 }}>
          {categoryOptions.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#E8A020' : 'rgba(255,200,100,0.28)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 14px', borderBottom: activeCategory === cat ? '1px solid #E8A020' : '1px solid transparent', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
            <p style={{ color: 'rgba(232,160,32,0.5)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>Failed to load gallery</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: 'none', border: '1px solid rgba(232,160,32,0.3)', color: '#E8A020', padding: '7px 20px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
            {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,200,100,0.18)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>No works in this category</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(232,160,32,0.1)', marginTop: 28 }}>
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Let's bring your vision to life</p>
        <p style={{ color: 'rgba(255,200,100,0.32)', fontSize: 12, margin: 0 }}>Cinematic storytelling for your brand, influence, and beyond.</p>
        <button onClick={handleBack}
          style={{ marginTop: 22, background: 'none', border: '1px solid rgba(232,160,32,0.4)', color: '#E8A020', padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8A020'; e.currentTarget.style.color = '#060300'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#E8A020'; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .video-grid { grid-template-columns: repeat(2, 1fr) !important; }
        @media (min-width: 600px)  { .video-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .video-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        div::-webkit-scrollbar { display: none; }
        @keyframes vidPulse { 0%,100%{opacity:0.4} 50%{opacity:0.15} }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default InfluenserShowcase;