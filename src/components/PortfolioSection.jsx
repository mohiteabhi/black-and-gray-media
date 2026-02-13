import React, { useState } from 'react';
import { galleryImages } from '../mockData';

const categories = ['all', 'portrait', 'abstract', 'wedding', 'nature'];

const PortfolioSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getCuratedImages = () => {
    const imagesPerCategory = 3; // Adjust this number as needed
    const curatedImages = [];
    
    // Get images from each category
    categories.slice(1).forEach(category => {
      const categoryImages = galleryImages
        .filter(img => img.category === category)
        .slice(0, imagesPerCategory);
      curatedImages.push(...categoryImages);
    });
    
    return curatedImages;
  };

  const filteredImages =
    activeCategory === 'all'
      ? getCuratedImages()
      : galleryImages.filter((img) => img.category === activeCategory);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  return (
    <section id="portfolio" className="bg-black py-20">
      <div className="container mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            // <button
            //   key={category}
            //   onClick={() => handleCategoryChange(category)}
            //   className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 ${
            //     activeCategory === category
            //       ? 'text-white border-b-2 border-white'
            //       : 'text-gray-500 hover:text-gray-300'
            //   }`}
            // >
            //   {category}
            // </button>
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative px-6 py-2 text-sm tracking-widest uppercase transition-colors duration-200 ${
                activeCategory === category
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {category}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
                  activeCategory === category
                    ? 'w-full opacity-100'
                    : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ${
                index % 7 === 0 || index % 7 === 5
                  ? 'sm:row-span-2'
                  : ''
              } ${
                isTransitioning
                  ? 'opacity-0 scale-95'
                  : 'opacity-100 scale-100'
              }`}
              style={{
                transitionDelay: isTransitioning ? '0ms' : `${index * 30}ms`,
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-sm uppercase tracking-wider">
                  {image.category}
                </p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;