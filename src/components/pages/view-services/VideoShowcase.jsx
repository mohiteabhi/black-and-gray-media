import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Film } from 'lucide-react';

const videoMedia = [
  { id: 1,  type: 'image', src: 'https://images.unsplash.com/photo-1540655037529-dec987208707?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1540655037529-dec987208707?w=600&q=80', category: 'Cinematic',  title: 'The Director\'s Cut',  span: 'large' },
  { id: 2,  type: 'image', src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', category: 'Behind BTS',  title: 'On Set',               span: 'normal' },
  { id: 3,  type: 'image', src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80', category: 'Cinematic',  title: 'Frame Perfect',        span: 'normal' },
  { id: 4,  type: 'image', src: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=600&q=80', category: 'Events',     title: 'Live Energy',          span: 'normal' },
  { id: 5,  type: 'image', src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', category: 'Cinematic',  title: 'Cinematic Light',      span: 'large' },
  { id: 6,  type: 'image', src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', category: 'Behind BTS',  title: 'The Lens',             span: 'normal' },
  { id: 7,  type: 'image', src: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&q=80', category: 'Wedding',    title: 'Vows in Motion',       span: 'normal' },
  { id: 8,  type: 'image', src: 'https://images.unsplash.com/photo-1551818176-60579e574b91?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1551818176-60579e574b91?w=600&q=80', category: 'Events',     title: 'Stage Presence',       span: 'normal' },
  { id: 9,  type: 'image', src: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&q=80', category: 'Cinematic',  title: 'Golden Frame',         span: 'large' },
  { id: 10, type: 'image', src: 'https://images.unsplash.com/photo-1559038465-e0ca2910c074?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1559038465-e0ca2910c074?w=600&q=80', category: 'Behind BTS',  title: 'Rig Setup',            span: 'normal' },
  { id: 11, type: 'image', src: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&q=80', category: 'Events',     title: 'Crowd & Camera',       span: 'normal' },
  { id: 12, type: 'image', src: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=600&q=80', category: 'Wedding',    title: 'First Look',           span: 'normal' },
  { id: 13, type: 'image', src: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=600&q=80', category: 'Cinematic',  title: 'Depth of Field',       span: 'large' },
  { id: 14, type: 'image', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', category: 'Behind BTS',  title: 'Edit Suite',           span: 'normal' },
  { id: 15, type: 'image', src: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&q=80', category: 'Wedding',    title: 'Slow Motion Kiss',     span: 'normal' },
];

const categories = ['All', 'Cinematic', 'Events', 'Wedding', 'Behind BTS'];

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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,2,0,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ ...iconBtn, position: 'absolute', top: 14, right: 14, zIndex: 10 }}><X size={22} color="rgba(255,180,60,0.5)" /></button>
      <button onClick={e => { e.stopPropagation(); onNav(-1); }} style={{ ...iconBtn, position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: 10 }}><ChevronLeft size={30} color="rgba(255,180,60,0.45)" /></button>
      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960 }}>
        {item.type === 'video'
          ? <video src={item.src} controls autoPlay style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
          : <img src={item.src} alt={item.title} style={{ width: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block' }} />
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
      <img src={item.thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)', filter: hovered ? 'brightness(0.5) sepia(0.2)' : 'brightness(0.82)' }} />

      {/* Film grain overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")', opacity: hovered ? 0.6 : 0.3, zIndex: 1, transition: 'opacity 0.3s' }} />

      {/* Play icon for video items */}
      {item.type === 'video' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(232,160,32,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
          <Play size={18} fill="white" color="white" style={{ marginLeft: 3 }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,3,0,0.94) 0%, transparent 55%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease', zIndex: 2 }} />

      {/* Film icon */}
      <div style={{ position: 'absolute', top: 10, right: 10, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', zIndex: 3 }}>
        <Film size={14} color="#E8A020" />
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', transform: hovered ? 'translateY(0)' : 'translateY(10px)', opacity: hovered ? 1 : 0, transition: 'all 0.32s ease', zIndex: 3 }}>
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>{item.category}</p>
        <p style={{ color: '#FFF8F0', fontSize: 12, fontWeight: 500, margin: 0 }}>{item.title}</p>
      </div>

      {/* Amber bottom bar that grows on hover */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: hovered ? '100%' : '0%', height: 2, background: 'linear-gradient(to right, #E8A020, #FF6B00)', transition: 'width 0.45s ease', zIndex: 3 }} />

      {/* Frame corners */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 2, background: '#E8A020', opacity: hovered ? 0.8 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 20, background: '#E8A020', opacity: hovered ? 0.8 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const VideoShowcase = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); window.scrollTo(0, 0); }, []);

  const filtered = activeCategory === 'All' ? videoMedia : videoMedia.filter(i => i.category === activeCategory);
  const openLightbox = (item) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);
  const navigateLightbox = (dir) => {
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
          <p style={{ color: '#FFF8F0', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Video Shooting</p>
        </div>
        <div />
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(200px, 40vw, 380px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800&q=90" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.22) sepia(0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,3,0,0.15) 0%, #060300 100%)' }} />

        {/* Film sprocket holes decoration */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 2 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 10, height: 8, borderRadius: 2, background: 'rgba(232,160,32,0.25)', border: '1px solid rgba(232,160,32,0.15)' }} />)}
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 2 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 10, height: 8, borderRadius: 2, background: 'rgba(232,160,32,0.25)', border: '1px solid rgba(232,160,32,0.15)' }} />)}
        </div>

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 50px', zIndex: 3 }}>
          <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px' }}>Frame by Frame</p>
          <h1 style={{ color: '#FFF8F0', fontSize: 'clamp(26px, 6.5vw, 66px)', fontWeight: 800, letterSpacing: 'clamp(2px, 1.2vw, 8px)', textTransform: 'uppercase', lineHeight: 1.1, margin: '0 0 12px' }}>
            Video <span style={{ color: '#E8A020' }}>Stories</span>
          </h1>
          <p style={{ color: 'rgba(255,200,100,0.3)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>{videoMedia.length} works · Cinematic Production</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 14px 14px', maxWidth: 1400, margin: '0 auto', borderBottom: '1px solid rgba(232,160,32,0.1)', scrollbarWidth: 'none', gap: 2 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#E8A020' : 'rgba(255,200,100,0.28)', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 14px', borderBottom: activeCategory === cat ? '1px solid #E8A020' : '1px solid transparent', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '14px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'clamp(130px, 26vw, 230px)', gap: 4 }}>
          {filtered.map(item => <GalleryCard key={item.id} item={item} onClick={openLightbox} />)}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,200,100,0.18)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>No works in this category</p>}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(232,160,32,0.1)', marginTop: 28 }}>
        <p style={{ color: '#E8A020', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>Let's bring your vision to life</p>
        <p style={{ color: 'rgba(255,200,100,0.32)', fontSize: 12, margin: 0 }}>Cinematic storytelling for your brand, wedding, and beyond.</p>
        <button onClick={handleBack} style={{ marginTop: 22, background: 'none', border: '1px solid rgba(232,160,32,0.4)', color: '#E8A020', padding: '10px 30px', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8A020'; e.currentTarget.style.color = '#060300'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#E8A020'; }}>
          Return to Services
        </button>
      </div>

      <style>{`
        .video-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 600px)  { .video-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .video-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {lightboxItem && <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />}
    </div>
  );
};

export default VideoShowcase;
