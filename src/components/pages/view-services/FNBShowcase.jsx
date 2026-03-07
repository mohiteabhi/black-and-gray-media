import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';

// ─── FNB Media Data ────────────────────────────────────────────────────────────
const fnbMedia = [
  { id: 1,  type: 'image', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',  category: 'Food',              title: 'Culinary Artistry',  span: 'large'  },
  { id: 2,  type: 'image', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',  category: 'Fine Dining',       title: 'Plated Perfection',  span: 'normal' },
  { id: 3,  type: 'image', src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',  category: 'Beverages',         title: 'Liquid Gold',        span: 'normal' },
  { id: 4,  type: 'image', src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',  category: 'Food',              title: 'Street Gourmet',     span: 'normal' },
  { id: 5,  type: 'image', src: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80',  category: 'Beverages',         title: 'Morning Ritual',     span: 'large'  },
  { id: 6,  type: 'image', src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',  category: 'Fine Dining',       title: 'The Art of Flavor',  span: 'normal' },
  { id: 7,  type: 'image', src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',  category: 'Bakery',            title: 'Sweet Architecture', span: 'normal' },
  { id: 8,  type: 'image', src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',  category: 'Food',              title: 'Garden on a Plate',  span: 'normal' },
  { id: 9,  type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',  category: 'Beverages',         title: 'Cocktail Hour',      span: 'large'  },
  { id: 10, type: 'image', src: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=600&q=80',  category: 'Fine Dining',       title: 'Crimson Depths',     span: 'normal' },
  { id: 11, type: 'image', src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',  category: 'Bakery',            title: 'Dessert Dreams',     span: 'normal' },
  { id: 12, type: 'image', src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',  category: 'Food',              title: 'Mise en Place',      span: 'normal' },
  { id: 13, type: 'image', src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',  category: 'Food',              title: 'Fresh Harvest',      span: 'large'  },
  { id: 14, type: 'image', src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',  category: 'Fine Dining',       title: 'Twilight Table',     span: 'normal' },
  { id: 15, type: 'image', src: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=90',  thumb: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&q=80',  category: 'Beverages',         title: 'Pour & Pause',       span: 'normal' },
  { id: 16, type: 'video', src: 'https://videos.pexels.com/video-files/3785079/3785079-uhd_2560_1440_25fps.mp4', thumb: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80', category: 'Behind the Scenes', title: 'The Making Of',      span: 'normal' },
];

const categories = ['All', 'Food', 'Fine Dining', 'Beverages', 'Bakery', 'Behind the Scenes'];

const TEASER_VIDEO  = 'https://videos.pexels.com/video-files/3843440/3843440-uhd_2560_1440_30fps.mp4';
const TEASER_POSTER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80';

const iconBtnBase = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const idx = allItems.findIndex(i => i.id === item.id);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft')  onNav(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{ ...iconBtnBase, position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
        <X size={22} color="rgba(255,255,255,0.65)" />
      </button>

      {/* Prev */}
      <button onClick={e => { e.stopPropagation(); onNav(-1); }}
        style={{ ...iconBtnBase, position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronLeft size={30} color="rgba(255,255,255,0.55)" />
      </button>

      {/* Media */}
      <div onClick={e => e.stopPropagation()} style={{ width: '92vw', maxWidth: 960, padding: '0 4px' }}>
        {item.type === 'video'
          ? <video src={item.src} controls autoPlay style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block', borderRadius: 2 }} />
          : <img src={item.src} alt={item.title} style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block', borderRadius: 2 }} />
        }
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>{item.title}</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0 }}>{idx + 1} / {allItems.length}</p>
        </div>
      </div>

      {/* Next */}
      <button onClick={e => { e.stopPropagation(); onNav(1); }}
        style={{ ...iconBtnBase, position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: 10 }}>
        <ChevronRight size={30} color="rgba(255,255,255,0.55)" />
      </button>
    </div>
  );
};

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
        gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1',
        background: '#111',
      }}
    >
      <img
        src={item.thumb} alt={item.title}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {item.type === 'video' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 46, height: 46, borderRadius: '50%',
          background: 'rgba(200,153,104,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
        }}>
          <Play size={18} fill="white" color="white" style={{ marginLeft: 3 }} />
        </div>
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease', zIndex: 2,
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px',
        transform: hovered ? 'translateY(0)' : 'translateY(10px)',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)', zIndex: 3,
      }}>
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.category}</p>
        <p style={{ color: '#fff', fontSize: 12, fontWeight: 600, margin: 0 }}>{item.title}</p>
      </div>

      {/* Gold corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 2,  background: '#C89968', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 2,  height: 28, background: '#C89968', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3 }} />
    </div>
  );
};

// ─── Teaser Video Section ─────────────────────────────────────────────────────
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
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 28, height: 1, background: '#C89968' }} />
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Teaser Reel</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Video */}
      <div
        onClick={!playing ? handlePlay : undefined}
        style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          borderRadius: 2, background: '#0a0a0a',
          aspectRatio: '16 / 7',
          cursor: playing ? 'default' : 'pointer',
        }}
      >
        <video
          ref={videoRef}
          src={TEASER_VIDEO}
          poster={TEASER_POSTER}
          muted playsInline loop
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Pre-play overlay */}
        {!playing && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{
              width: 62, height: 62, borderRadius: '50%',
              border: '2px solid rgba(200,153,104,0.75)',
              background: 'rgba(200,153,104,0.12)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={24} fill="#C89968" color="#C89968" style={{ marginLeft: 4 }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
              Watch the Reel
            </p>
          </div>
        )}

        {/* Mute toggle */}
        {playing && (
          <button onClick={toggleMute} style={{
            ...iconBtnBase,
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.48)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '50%',
            width: 36, height: 36,
          }}>
            {muted
              ? <VolumeX size={14} color="rgba(255,255,255,0.65)" />
              : <Volume2  size={14} color="#C89968" />
            }
          </button>
        )}

        {/* Gold base accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #C89968, transparent)' }} />
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const FNBShowcase = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem,   setLightboxItem]   = useState(null);
  const [visible,        setVisible]        = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    window.scrollTo(0, 0);
  }, []);

  const filtered        = activeCategory === 'All' ? fnbMedia : fnbMedia.filter(i => i.category === activeCategory);
  const openLightbox    = (item) => setLightboxItem(item);
  const closeLightbox   = ()     => setLightboxItem(null);
  const navigateLightbox = (dir) => {
    const idx  = filtered.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(filtered[(idx + dir + filtered.length) % filtered.length]);
  };
  const handleBack = () => { setVisible(false); setTimeout(onBack, 400); };

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
    }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.93)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(200,153,104,0.15)',
        height: 58,
        /* Use grid: left | center | right so title is always truly centred */
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 14px',
      }}>
        {/* Left — Back */}
        <button
          onClick={handleBack}
          style={{
            ...iconBtnBase, justifyContent: 'flex-start', gap: 8,
            color: 'rgba(255,255,255,0.65)',
            fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C89968'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
        >
          <ArrowLeft size={15} />
          <span style={{ display: 'inline' }}>Back</span>
        </button>

        {/* Centre — Title */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#C89968', fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 2px' }}>
            Portfolio
          </p>
          <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
            FNB Photography
          </p>
        </div>

        {/* Right — spacer */}
        <div />
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: 'relative',
        height: 'clamp(200px, 40vw, 360px)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=90"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, black 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
          <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '5px', textTransform: 'uppercase', margin: '0 0 10px' }}>
            A visual feast
          </p>
          <h1 style={{
            color: '#fff',
            fontSize: 'clamp(26px, 6.5vw, 66px)',
            fontWeight: 700,
            letterSpacing: 'clamp(2px, 1vw, 7px)',
            textTransform: 'uppercase',
            lineHeight: 1.12,
            margin: '0 0 12px',
          }}>
            Food &amp; <span style={{ color: '#C89968' }}>Beverage</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '1px', margin: 0 }}>
            {fnbMedia.length} works · Photography &amp; Videography
          </p>
        </div>
      </div>

      {/* ── TEASER VIDEO ── */}
      <TeaserVideo />

      {/* ── GALLERY LABEL ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '36px 14px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ width: 28, height: 1, background: '#C89968' }} />
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Gallery</p>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ── FILTER BAR (horizontally scrollable on mobile) ── */}
      <div style={{
        display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        padding: '20px 14px 14px',
        maxWidth: 1400, margin: '0 auto',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        gap: 2,
      }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeCategory === cat ? '#C89968' : 'rgba(255,255,255,0.38)',
            fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase',
            padding: '7px 12px',
            borderBottom: activeCategory === cat ? '1px solid #C89968' : '1px solid transparent',
            fontWeight: activeCategory === cat ? 600 : 400,
            transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── GALLERY GRID ── */}
      <div style={{ padding: '14px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="fnb-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'clamp(130px, 26vw, 230px)',
          gap: 4,
        }}>
          {filtered.map(item => (
            <GalleryCard key={item.id} item={item} onClick={openLightbox} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.22)', padding: '60px 0', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>
            No works in this category
          </p>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: 'center', padding: '52px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 28 }}>
        <p style={{ color: '#C89968', fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Interested in working together?
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
          Get in touch to discuss your next FNB project.
        </p>
        <button
          onClick={handleBack}
          style={{
            marginTop: 22, background: 'none',
            border: '1px solid rgba(200,153,104,0.5)',
            color: '#C89968', padding: '10px 30px',
            fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C89968'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none';    e.currentTarget.style.color = '#C89968'; }}
        >
          Return to Services
        </button>
      </div>

      {/* ── RESPONSIVE CSS ── */}
      <style>{`
        .fnb-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 600px)  { .fnb-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .fnb-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        /* hide scrollbars on filter bar */
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── LIGHTBOX ── */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} allItems={filtered} onClose={closeLightbox} onNav={navigateLightbox} />
      )}
    </div>
  );
};

export default FNBShowcase;