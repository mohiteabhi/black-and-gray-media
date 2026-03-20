// src/components/PortfolioSection.jsx
import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../services/galleryService';
import { GALLERY_SECTION_IDS } from '../config/api';

const SECTION_ID = GALLERY_SECTION_IDS.portfolio; // 3

const PortfolioSection = () => {
  const [items,            setItems]            = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [activeCategory,   setActiveCategory]   = useState('all');
  const [isTransitioning,  setIsTransitioning]  = useState(false);

  useEffect(() => {
    fetchGallery(SECTION_ID)
      .then(data => {
        setItems(data.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)));
        setLoading(false);
      })
      .catch(err => { console.error("Error fetching portfolio:", err); setLoading(false); });
  }, []);

  // Build dynamic category list from API data
  const gallery    = items.filter(i => i.category !== 'Teaser');
  const categories = ['all', ...new Set(gallery.map(i => i.category?.toLowerCase()))];

  // Curated "all" view — up to 3 per category, matching original behaviour
  const getCuratedImages = () => {
    const perCat = 3;
    const result = [];
    [...new Set(gallery.map(i => i.category?.toLowerCase()))].forEach(cat => {
      gallery.filter(i => i.category?.toLowerCase() === cat).slice(0, perCat).forEach(i => result.push(i));
    });
    return result;
  };

  const filteredImages =
    activeCategory === 'all'
      ? getCuratedImages()
      : gallery.filter(i => i.category?.toLowerCase() === activeCategory);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="portfolio" className="bg-black py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 rounded bg-white/[0.06] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`bg-zinc-900 animate-pulse ${i % 7 === 0 || i % 7 === 5 ? 'sm:row-span-2' : ''}`}
                style={{ minHeight: 200 }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="bg-black py-20">
      <div className="container mx-auto px-6">

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative px-6 py-2 text-sm tracking-widest uppercase transition-colors duration-200 ${
                activeCategory === category ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {category}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
                activeCategory === category ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`} />
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ${
                index % 7 === 0 || index % 7 === 5 ? 'sm:row-span-2' : ''
              } ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              style={{ transitionDelay: isTransitioning ? '0ms' : `${index * 30}ms`, minHeight: 200 }}
            >
              {item.resource_type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  muted autoPlay loop playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              )}
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <p className="text-center text-gray-600 text-sm tracking-widest uppercase py-20">
            No works in this category
          </p>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;