// src/components/pages/view-services/FNBShowcase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { fetchGallery } from '../../../services/galleryService';
import { GALLERY_SECTION_IDS } from '../../../config/api';

const SECTION_ID = GALLERY_SECTION_IDS.fnb; // 6

const iconBtnBase = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const idx = allItems.findIndex(i => i.id === item.id);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft')  onNav(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item]);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtnBase, position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
        <X size={22} color="rgba(255,255,255,0.65)" />
      </button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtnBase, position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronLeft size={30} color="rgba(255,255,255,0.55)" />
      </button>
      <div onClick={e => e.stopPropagation()} style={{ width: '92vw', maxWidth: 960, padding: '0 4px' }}>
        {item.resource_type === 'video'
          ? <video src={item.url} controls autoPlay style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block', borderRadius: 2 }} />
          : <img src={item.url} alt={item.title} style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block', borderRadius: 2 }} />
        }
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNav(1); }} style={{ ...iconBtnBase, position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronRight size={30} color="rgba(255,255,255,0.55)" />
      </button>
    </div>
  );
};

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onClick(item)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1', background: '#111' }}>
      {item.resource_type === 'video' ? (
        <video src={item.url} muted playsInline preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
      ) : (
        <img src={item.url} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
      )}
      {item.resource_type === 'video' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(200,153,104,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
          <Play size={18} fill="white" color="white" style={{ marginLeft: 3 }} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px', transform: hovered ? 'translateY(0)' : 'translateY(10px)', opacity: hovered ? 1 : 0, transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)', zIndex: 3 }}>
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
        <p style={{ color: '#fff', fontSize: 12, fontWeight: 600, margin: 0 }}>{item.title}</p>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 2,  background: '#C89968', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 2,  height: 28, background: '#C89968', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
    </div>
  );
};

// ─── Teaser Video ─────────────────────────────────────────────────────────────
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 28, height: 1, background: '#C89968' }} />
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Teaser Reel</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <div onClick={!playing ? handlePlay : undefined}
        style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 2, background: '#0a0a0a', aspectRatio: '16 / 7', cursor: playing ? 'default' : 'pointer' }}>
        <video ref={videoRef} src={url} muted playsInline loop
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {!playing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', border: '2px solid rgba(200,153,104,0.75)', background: 'rgba(200,153,104,0.12)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={24} fill="#C89968" color="#C89968" style={{ marginLeft: 4 }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>Watch the Reel</p>
          </div>
        )}
        {playing && (
          <button onClick={toggleMute} style={{ ...iconBtnBase, position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '50%', width: 36, height: 36 }}>
            {muted ? <VolumeX size={14} color="rgba(255,255,255,0.65)" /> : <Volume2 size={14} color="#C89968" />}
          </button>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #C89968, transparent)' }} />
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const GallerySkeleton = () => (
  <div className="fnb-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ background: '#1a1a1a', gridRowEnd: i === 0 || i === 4 ? 'span 2' : 'span 1', animation: 'fnbPulse 1.5s ease-in-out infinite', opacity: 0.4 }} />
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const FNBShowcase = ({ onBack }) => {
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

  const teaser  = items.find(i => i.category === 'Teaser' && i.resource_type === 'video');
  const gallery = items.filter(i => i.category !== 'Teaser').sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
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
    <div style={{ minHeight: '100vh', background: '#000', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(200,153,104,0.15)', height: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 14px' }}>
        <button onClick={handleBack} style={{ ...iconBtnBase, justifyContent: 'flex-start', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#C89968'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
          <ArrowLeft size={15} /><span>Back</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#C89968', fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>Portfolio</p>
          <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>FNB Photography</p>
        </div>
        <div />
      </header>

      {/* Hero banner */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 360px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {teaser
          ? <video src={teaser.url} muted playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28)' }} />
          : <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, black 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
          <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '5px', textTransform: 'uppercase', margin: '0 0 10px' }}>A visual feast</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 700, letterSpacing: 'clamp(2px, 1vw, 7px)', textTransform: 'uppercase', lineHeight: 1.12, margin: '0 0 12px' }}>
            Food &amp; <span style={{ color: '#C89968' }}>Beverage</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>
            {loading ? '—' : `${gallery.length} works · Photography & Videography`}
          </p>
        </div>
      </div>

      {/* Teaser */}
      <TeaserVideo url={teaser?.url} />

      {/* Gallery label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: '#C89968' }} />
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Gallery</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Category filter */}
      {!loading && !error && (
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none', gap: 2 }}>
          {categoryOptions.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#C89968' : 'rgba(255,255,255,0.38)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 12px', borderBottom: activeCategory === cat ? '1px solid #C89968' : '1px solid transparent', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
            <p style={{ color: 'rgba(200,153,104,0.6)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>Failed to load gallery</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: 'none', border: '1px solid rgba(200,153,104,0.3)', color: '#C89968', padding: '7px 20px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <div className="fnb-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
            {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.22)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>No works in this category</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 28 }}>
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Interested in working together?</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Get in touch to discuss your next FNB project.</p>
        <button onClick={handleBack}
          style={{ marginTop: 22, background: 'none', border: '1px solid rgba(200,153,104,0.5)', color: '#C89968', padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C89968'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#C89968'; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .fnb-grid { grid-template-columns: repeat(2, 1fr) !important; }
        @media (min-width: 600px)  { .fnb-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .fnb-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        div::-webkit-scrollbar { display: none; }
        @keyframes fnbPulse { 0%,100%{opacity:0.4} 50%{opacity:0.15} }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default FNBShowcase;