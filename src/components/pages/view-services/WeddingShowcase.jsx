import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, Play, Volume2, VolumeX } from 'lucide-react';

const WEDDING_TEASER_VIDEO  = 'https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4';
const WEDDING_TEASER_POSTER = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80';

// ── Teaser Video ──────────────────────────────────────────────────────────────
const TeaserVideo = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true);

  const handlePlay = () => {
    if (videoRef.current) { videoRef.current.play(); setPlaying(true); }
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) { videoRef.current.muted = !muted; setMuted(m => !m); }
  };

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
          src={WEDDING_TEASER_VIDEO}
          poster={WEDDING_TEASER_POSTER}
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
            {muted
              ? <VolumeX size={14} color="rgba(255,240,230,0.6)" />
              : <Volume2  size={14} color="#D4A090" />
            }
          </button>
        )}

        {/* Blush bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #D4A090, transparent)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

const weddingMedia = [
  { id: 1,  type: 'image', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Ceremony',   title: 'The First Kiss',       span: 'large' },
  { id: 2,  type: 'image', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80', category: 'Portrait',   title: 'Golden Hour',          span: 'normal' },
  { id: 3,  type: 'image', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', category: 'Details',    title: 'Bloom & Lace',         span: 'normal' },
  { id: 4,  type: 'image', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', category: 'Portrait',   title: 'Hand in Hand',         span: 'normal' },
  { id: 5,  type: 'image', src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', category: 'Details',    title: 'Floral Dreams',        span: 'large' },
  { id: 6,  type: 'image', src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&q=80', category: 'Ceremony',   title: 'Sacred Vows',          span: 'normal' },
  { id: 7,  type: 'image', src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80', category: 'Reception',  title: 'Table of Love',        span: 'normal' },
  { id: 8,  type: 'image', src: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&q=80', category: 'Portrait',   title: 'Stolen Glance',        span: 'normal' },
  { id: 9,  type: 'image', src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80', category: 'Details',    title: 'The Ring',             span: 'large' },
  { id: 10, type: 'image', src: 'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=600&q=80', category: 'Ceremony',   title: 'Aisle of Light',       span: 'normal' },
  { id: 11, type: 'image', src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', category: 'Reception',  title: 'First Dance',          span: 'normal' },
  { id: 12, type: 'image', src: 'https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=600&q=80', category: 'Details',    title: 'Bouquet',              span: 'normal' },
  { id: 13, type: 'image', src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', category: 'Portrait',   title: 'Timeless',             span: 'large' },
  { id: 14, type: 'image', src: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80', category: 'Reception',  title: 'Candlelight',          span: 'normal' },
  { id: 15, type: 'image', src: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=600&q=80', category: 'Ceremony',   title: 'Together Forever',     span: 'normal' },
];

const categories = ['All', 'Ceremony', 'Portrait', 'Details', 'Reception'];

// shared
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' };

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const idx = allItems.findIndex(i => i.id === item.id);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item]);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,6,4,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtn, position: 'absolute', top: 14, right: 14, zIndex: 10 }}><X size={22} color="rgba(255,240,230,0.6)" /></button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtn, position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}><ChevronLeft size={30} color="rgba(255,240,230,0.5)" /></button>
      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960 }}>
        <img src={item.src} alt={item.title} style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: '#FFF5F0', fontSize: 16, fontWeight: 500, margin: 0, fontStyle: 'italic' }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(255,240,230,0.25)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNav(1); }} style={{ ...iconBtn, position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}><ChevronRight size={30} color="rgba(255,240,230,0.5)" /></button>
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
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1', background: '#1a1210' }}
    >
      <img src={item.thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.75)' : 'brightness(0.9)' }} />

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

// ── Main ──────────────────────────────────────────────────────────────────────
const WeddingShowcase = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); window.scrollTo(0, 0); }, []);

  const filtered = activeCategory === 'All' ? weddingMedia : weddingMedia.filter(i => i.category === activeCategory);
  const openLightbox = (item) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);
  const navigateLightbox = (dir) => {
    const idx = filtered.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx + dir + filtered.length) % filtered.length]);
  };
  const handleBack = () => { setVisible(false); setTimeout(onBack, 400); };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0805', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(13,8,5,0.94)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(212,160,144,0.2)', height: 58, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 16px' }}>
        <button onClick={handleBack} style={{ ...iconBtn, justifyContent: 'flex-start', gap: 8, color: 'rgba(255,240,230,0.55)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#D4A090'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,240,230,0.55)'}>
          <ArrowLeft size={15} /><span>Back</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#D4A090', fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>Portfolio</p>
          <p style={{ color: '#FFF5F0', fontSize: 12, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Wedding Shoot</p>
        </div>
        <div />
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 380px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) sepia(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,8,5,0.1) 0%, #0d0805 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
          <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px' }}>Forever Moments</p>
          <h1 style={{ color: '#FFF5F0', fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 300, letterSpacing: 'clamp(4px, 1.5vw, 12px)', textTransform: 'uppercase', lineHeight: 1.12, margin: '0 0 12px', fontStyle: 'italic' }}>
            Wedding <span style={{ color: '#D4A090', fontStyle: 'normal', fontWeight: 700 }}>Stories</span>
          </h1>
          <p style={{ color: 'rgba(255,240,230,0.38)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>{weddingMedia.length} works · Love Documented</p>
        </div>
      </div>

      {/* Teaser Video */}
      <TeaserVideo />

      {/* Gallery label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: '#D4A090' }} />
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Moments Captured</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,160,144,0.1)' }} />
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: '1px solid rgba(212,160,144,0.1)', scrollbarWidth: 'none', gap: 2 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#D4A090' : 'rgba(255,240,230,0.35)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 14px', borderBottom: activeCategory === cat ? '1px solid #D4A090' : '1px solid transparent', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '14px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="wedding-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
          {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,240,230,0.2)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>No works in this category</p>}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(212,160,144,0.1)', marginTop: 28 }}>
        <p style={{ color: '#D4A090', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Ready to preserve your love story?</p>
        <p style={{ color: 'rgba(255,240,230,0.38)', fontSize: 12, margin: 0 }}>Let's create timeless memories together.</p>
        <button onClick={handleBack} style={{ marginTop: 22, background: 'none', border: '1px solid rgba(212,160,144,0.4)', color: '#D4A090', padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D4A090'; e.currentTarget.style.color = '#0d0805'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#D4A090'; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .wedding-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 600px)  { .wedding-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .wedding-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default WeddingShowcase;