// src/components/pages/view-services/WeddingShowcase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, Play, Volume2, VolumeX } from 'lucide-react';
import { fetchGallery } from '../../../services/galleryService';
import { GALLERY_SECTION_IDS } from '../../../config/api';

const SECTION_ID = GALLERY_SECTION_IDS.wedding; // 5

// shared
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' };

// ── Teaser Video ──────────────────────────────────────────────────────────────
const TeaserVideo = ({ url }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true);

  // Reset play state if url changes
  useEffect(() => { setPlaying(false); setMuted(true); }, [url]);

  const handlePlay = () => {
    if (videoRef.current) { videoRef.current.play(); setPlaying(true); }
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) { videoRef.current.muted = !muted; setMuted(m => !m); }
  };

  if (!url) return null;

  return (
    <div style={{ padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 28, height: 1, background: '#D4A090' }} />
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>A Glimpse of Forever</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,160,144,0.12)' }} />
      </div>

      {/* Video container */}
      <div
        onClick={!playing ? handlePlay : undefined}
        style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          borderRadius: 2, background: '#100806',
          aspectRatio: '16 / 7',
          cursor: playing ? 'default' : 'pointer',
        }}
      >
        <video
          ref={videoRef}
          src={url}
          muted playsInline loop
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Pre-play overlay */}
        {!playing && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(13,6,4,0.55)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{
              width: 62, height: 62, borderRadius: '50%',
              border: '1.5px solid rgba(212,160,144,0.7)',
              background: 'rgba(212,160,144,0.1)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={22} fill="#D4A090" color="#D4A090" style={{ marginLeft: 4 }} />
            </div>
            <p style={{ color: 'rgba(255,240,230,0.65)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, fontStyle: 'italic' }}>
              Watch the Reel
            </p>
          </div>
        )}

        {/* Mute toggle */}
        {playing && (
          <button
            onClick={toggleMute}
            style={{
              background: 'rgba(13,6,4,0.5)', border: '1px solid rgba(212,160,144,0.2)',
              borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
              position: 'absolute', bottom: 12, right: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            {muted ? <VolumeX size={14} color="rgba(255,240,230,0.6)" /> : <Volume2 size={14} color="#D4A090" />}
          </button>
        )}

        {/* Blush bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #D4A090, transparent)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const idx = allItems.findIndex(i => i.id === item.id);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowRight')  onNav(1);
      if (e.key === 'ArrowLeft')   onNav(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item]);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,6,4,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtn, position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
        <X size={22} color="rgba(255,240,230,0.6)" />
      </button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtn, position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronLeft size={30} color="rgba(255,240,230,0.5)" />
      </button>

      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960 }}>
        {item.resource_type === 'video' ? (
          <video src={item.url} controls autoPlay style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
        ) : (
          <img src={item.url} alt={item.title} style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
        )}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: '#FFF5F0', fontSize: 16, fontWeight: 500, margin: 0, fontStyle: 'italic' }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(255,240,230,0.25)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>

      <button onClick={e => { e.stopPropagation(); onNav(1); }} style={{ ...iconBtn, position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronRight size={30} color="rgba(255,240,230,0.5)" />
      </button>
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        background: '#1a1210',
        breakInside: 'avoid',
        marginBottom: 4,
      }}
    >
      {item.resource_type === 'video' ? (
        <>
          <video
            src={item.url}
            muted playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.75)' : 'brightness(0.9)' }}
          />
          {/* Play badge for videos */}
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(13,6,4,0.6)', border: '1px solid rgba(212,160,144,0.3)', borderRadius: 20, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, zIndex: 2 }}>
            <Play size={9} fill="#D4A090" color="#D4A090" />
            <span style={{ color: '#D4A090', fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase' }}>Video</span>
          </div>
        </>
      ) : (
        <img
          src={item.url}
          alt={item.title}
          style={{ width: '100%', height: 'auto', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.75)' : 'brightness(0.9)' }}
        />
      )}

      {/* Soft vignette on hover */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,8,4,0.9) 0%, transparent 60%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease', zIndex: 2 }} />

      {/* Heart icon */}
      <div style={{ position: 'absolute', top: 12, right: 12, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }}>
        <Heart size={16} color="#D4A090" fill="#D4A090" />
      </div>

      {/* Text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', transform: hovered ? 'translateY(0)' : 'translateY(8px)', opacity: hovered ? 1 : 0, transition: 'all 0.35s ease', zIndex: 3 }}>
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>{item.category}</p>
        <p style={{ color: '#FFF5F0', fontSize: 13, fontWeight: 400, fontStyle: 'italic', margin: 0 }}>{item.title}</p>
      </div>

      {/* Blush corner accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(to right, #D4A090, transparent)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
    </div>
  );
};

// ── Skeleton grid ─────────────────────────────────────────────────────────────
const GallerySkeleton = () => (
  <div className="wedding-grid">
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ background: '#1a1210', height: i % 3 === 0 ? 320 : 220, marginBottom: 4, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.4, breakInside: 'avoid' }} />
    ))}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const WeddingShowcase = ({ onBack }) => {
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

  // Separate teaser from gallery items
  const teaser  = items.find(i => i.category === 'Teaser' && i.resource_type === 'video');
  const gallery = items
    .filter(i => i.category !== 'Teaser')
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  // Dynamic categories derived from actual data
  const categoryOptions = ['All', ...new Set(gallery.map(i => i.category))];

  const filtered = activeCategory === 'All'
    ? gallery
    : gallery.filter(i => i.category === activeCategory);

  const openLightbox    = (item) => setLightboxItem(item);
  const closeLightbox   = ()     => setLightboxItem(null);
  const navigateLightbox = (dir) => {
    const idx = filtered.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx + dir + filtered.length) % filtered.length]);
  };
  const handleBack = () => { setVisible(false); setTimeout(onBack, 400); };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0805', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>

      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(13,8,5,0.94)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(212,160,144,0.2)', height: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 16px' }}>
        <button onClick={handleBack}
          style={{ ...iconBtn, justifyContent: 'flex-start', gap: 8, color: 'rgba(255,240,230,0.55)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#D4A090'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,240,230,0.55)'}>
          <ArrowLeft size={15} /><span>Back</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#D4A090', fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>Portfolio</p>
          <p style={{ color: '#FFF5F0', fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Wedding Shoot</p>
        </div>
        <div />
      </header>

      {/* ── Hero banner ── */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 380px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Use the teaser's first frame as hero poster if available, else solid colour */}
        {teaser ? (
          <video src={teaser.url} muted playsInline preload="metadata"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) sepia(0.3)' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#160a07' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,8,5,0.1) 0%, #0d0805 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
          <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px' }}>Forever Moments</p>
          <h1 style={{ color: '#FFF5F0', fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 300, letterSpacing: 'clamp(4px, 1.5vw, 12px)', textTransform: 'uppercase', lineHeight: 1.12, margin: '0 0 12px', fontStyle: 'italic' }}>
            Wedding <span style={{ color: '#D4A090', fontStyle: 'normal', fontWeight: 700 }}>Stories</span>
          </h1>
          <p style={{ color: 'rgba(255,240,230,0.38)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>
            {loading ? '—' : `${gallery.length} works · Love Documented`}
          </p>
        </div>
      </div>

      {/* ── Teaser video ── */}
      <TeaserVideo url={teaser?.url} />

      {/* ── Gallery label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: '#D4A090' }} />
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Moments Captured</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,160,144,0.1)' }} />
      </div>

      {/* ── Category filter (dynamic from API data) ── */}
      {!loading && !error && (
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: '1px solid rgba(212,160,144,0.1)', scrollbarWidth: 'none', gap: 2 }}>
          {categoryOptions.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#D4A090' : 'rgba(255,240,230,0.35)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 14px', borderBottom: activeCategory === cat ? '1px solid #D4A090' : '1px solid transparent', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ padding: '14px', maxWidth: 1400, margin: '0 auto' }}>
        {loading && <GallerySkeleton />}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'rgba(212,160,144,0.6)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Failed to load gallery
            </p>
            <button onClick={() => window.location.reload()}
              style={{ marginTop: 12, background: 'none', border: '1px solid rgba(212,160,144,0.3)', color: '#D4A090', padding: '7px 20px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="wedding-grid">
            {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,240,230,0.2)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>
            No works in this category
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(212,160,144,0.1)', marginTop: 28 }}>
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Ready to preserve your love story?</p>
        <p style={{ color: 'rgba(255,240,230,0.38)', fontSize: 12, margin: 0 }}>Let's create timeless memories together.</p>
        <button onClick={handleBack}
          style={{ marginTop: 22, background: 'none', border: '1px solid rgba(212,160,144,0.4)', color: '#D4A090', padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D4A090'; e.currentTarget.style.color = '#0d0805'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#D4A090'; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .wedding-grid { columns: 2; column-gap: 4px; }
        @media (min-width: 600px)  { .wedding-grid { columns: 3; } }
        @media (min-width: 1024px) { .wedding-grid { columns: 4; } }
        .wedding-grid > * { display: block; width: 100%; }
        div::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.15} }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default WeddingShowcase;