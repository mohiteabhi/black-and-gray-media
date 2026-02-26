import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

// FNB Media Data - Unsplash images
const fnbMedia = [
  {
    id: 1,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    category: 'Food',
    title: 'Culinary Artistry',
    span: 'large', // large = tall card
  },
  {
    id: 2,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    category: 'Fine Dining',
    title: 'Plated Perfection',
    span: 'normal',
  },
  {
    id: 3,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',
    category: 'Beverages',
    title: 'Liquid Gold',
    span: 'normal',
  },
  {
    id: 4,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    category: 'Food',
    title: 'Street Gourmet',
    span: 'normal',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80',
    category: 'Beverages',
    title: 'Morning Ritual',
    span: 'large',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',
    category: 'Fine Dining',
    title: 'The Art of Flavor',
    span: 'normal',
  },
  {
    id: 7,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',
    category: 'Bakery',
    title: 'Sweet Architecture',
    span: 'normal',
  },
  {
    id: 8,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
    category: 'Food',
    title: 'Garden on a Plate',
    span: 'normal',
  },
  {
    id: 9,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'Beverages',
    title: 'Cocktail Hour',
    span: 'large',
  },
  {
    id: 10,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=600&q=80',
    category: 'Fine Dining',
    title: 'Crimson Depths',
    span: 'normal',
  },
  {
    id: 11,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    category: 'Bakery',
    title: 'Dessert Dreams',
    span: 'normal',
  },
  {
    id: 12,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    category: 'Food',
    title: 'Mise en Place',
    span: 'normal',
  },
  {
    id: 13,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    category: 'Food',
    title: 'Fresh Harvest',
    span: 'large',
  },
  {
    id: 14,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
    category: 'Fine Dining',
    title: 'Twilight Table',
    span: 'normal',
  },
  {
    id: 15,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&q=80',
    category: 'Beverages',
    title: 'Pour & Pause',
    span: 'normal',
  },
  {
    id: 16,
    type: 'video',
    src: 'https://videos.pexels.com/video-files/3785079/3785079-uhd_2560_1440_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80',
    category: 'Behind the Scenes',
    title: 'The Making Of',
    span: 'normal',
  },
];

const categories = ['All', 'Food', 'Fine Dining', 'Beverages', 'Bakery', 'Behind the Scenes'];

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ item, allItems, onClose, onNav }) => {
  const currentIndex = allItems.findIndex(i => i.id === item.id);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <X size={28} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-4 md:left-8 z-10 text-white/60 hover:text-white transition-colors p-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ChevronLeft size={36} />
      </button>

      {/* Media */}
      <div
        className="relative max-w-5xl w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            src={item.src}
            controls
            autoPlay
            className="w-full max-h-[80vh] object-contain"
            style={{ borderRadius: '2px' }}
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className="w-full max-h-[80vh] object-contain"
            style={{ borderRadius: '2px' }}
          />
        )}

        {/* Caption */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <p style={{ color: '#C89968', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {item.category}
            </p>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 600, letterSpacing: '1px' }}>
              {item.title}
            </p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
            {currentIndex + 1} / {allItems.length}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        className="absolute right-4 md:right-8 z-10 text-white/60 hover:text-white transition-colors p-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ChevronRight size={36} />
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
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        gridRowEnd: item.span === 'large' ? 'span 2' : 'span 1',
        background: '#111',
      }}
    >
      {/* Image */}
      <img
        src={item.thumb}
        alt={item.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          minHeight: item.span === 'large' ? '480px' : '240px',
        }}
      />

      {/* Video badge */}
      {item.type === 'video' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(200,153,104,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}>
          <Play size={22} fill="white" color="white" style={{ marginLeft: '3px' }} />
        </div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        zIndex: 2,
      }} />

      {/* Text */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        zIndex: 3,
        transform: hovered ? 'translateY(0)' : 'translateY(12px)',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}>
        <p style={{ color: '#C89968', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {item.category}
        </p>
        <p style={{ color: 'white', fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>
          {item.title}
        </p>
      </div>

      {/* Gold corner accent on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40px',
        height: '2px',
        background: '#C89968',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 3,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '2px',
        height: '40px',
        background: '#C89968',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 3,
      }} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const FNBShowcase = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => setVisible(true));
    window.scrollTo(0, 0);
  }, []);

  const filtered = activeCategory === 'All'
    ? fnbMedia
    : fnbMedia.filter(i => i.category === activeCategory);

  const openLightbox = (item) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);

  const navigateLightbox = (dir) => {
    const idx = filtered.findIndex(i => i.id === lightboxItem.id);
    const next = (idx + dir + filtered.length) % filtered.length;
    setLightboxItem(filtered[next]);
  };

  const handleBack = () => {
    setVisible(false);
    setTimeout(onBack, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(200,153,104,0.15)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'rgba(255,255,255,0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C89968'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#C89968', fontSize: '10px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '3px' }}>
            Portfolio
          </div>
          <div style={{ color: 'white', fontSize: '15px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>
            FNB Photography
          </div>
        </div>

        <div style={{ width: '80px' }} /> {/* Spacer */}
      </header>

      {/* ── Hero Banner ── */}
      <div style={{
        position: 'relative',
        height: '40vh',
        minHeight: '280px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=90"
          alt="FNB Hero"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.35)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, black 100%)',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
          <p style={{
            color: '#C89968',
            fontSize: '11px',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            A visual feast
          </p>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 700,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            lineHeight: 1.05,
            margin: 0,
          }}>
            Food &<br />
            <span style={{ color: '#C89968' }}>Beverage</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            marginTop: '16px',
            letterSpacing: '1px',
          }}>
            {fnbMedia.length} works · Photography & Videography
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        display: 'flex',
        gap: '0',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '40px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeCategory === cat ? '#C89968' : 'rgba(255,255,255,0.4)',
              fontSize: '11px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderBottom: activeCategory === cat ? '1px solid #C89968' : '1px solid transparent',
              transition: 'all 0.25s ease',
              fontWeight: activeCategory === cat ? 600 : 400,
            }}
            onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Masonry Grid ── */}
      <div style={{
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gridAutoRows: '240px',
          gap: '6px',
        }}>
          {filtered.map((item) => (
            <GalleryCard key={item.id} item={item} onClick={openLightbox} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '80px 0', fontSize: '14px', letterSpacing: '2px' }}>
            NO WORKS IN THIS CATEGORY
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: 'center',
        padding: '60px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: '40px',
      }}>
        <p style={{ color: '#C89968', fontSize: '10px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Interested in working together?
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', letterSpacing: '1px' }}>
          Get in touch to discuss your next FNB project.
        </p>
        <button
          onClick={handleBack}
          style={{
            marginTop: '28px',
            background: 'none',
            border: '1px solid rgba(200,153,104,0.5)',
            color: '#C89968',
            padding: '12px 36px',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C89968'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#C89968'; }}
        >
          Return to Services
        </button>
      </div>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          allItems={filtered}
          onClose={closeLightbox}
          onNav={navigateLightbox}
        />
      )}
    </div>
  );
};

export default FNBShowcase;