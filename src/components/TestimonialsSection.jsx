import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import API_CONFIG, { MEDIA_IDS } from '../config/api';

const MEDIA_ID = MEDIA_IDS.testimonials.section; // 19

// Skeleton card
function SkeletonCard() {
  return (
    <div className="bg-zinc-800 p-8 rounded-lg animate-pulse">
      <div className="w-10 h-10 bg-zinc-700 rounded mb-6" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-zinc-700 rounded w-full" />
        <div className="h-3 bg-zinc-700 rounded w-5/6" />
        <div className="h-3 bg-zinc-700 rounded w-4/6" />
      </div>
      <div className="border-t border-zinc-700 pt-6 space-y-2">
        <div className="h-3 bg-zinc-700 rounded w-1/3" />
        <div className="h-3 bg-zinc-700 rounded w-1/4" />
      </div>
    </div>
  );
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res  = await fetch(API_CONFIG.endpoints.media.list);
        const data = await res.json();
        const record = data.find(item => item.id === MEDIA_ID);

        if (record?.text) {
          // Parse the stored JSON string
          // Backend may store the JSON wrapped in single quotes — strip them before parsing
          const raw    = record.text.trim();
          const clean  = raw.startsWith("'") && raw.endsWith("'") ? raw.slice(1, -1) : raw;
          const parsed = JSON.parse(clean);
          // Map API fields → component fields
          setTestimonials(parsed.map(t => ({
            id:      t.id,
            author:  t.client,
            company: t["client location"],
            text:    t["client review"],
          })));
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="bg-zinc-900 py-20">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm tracking-widest mb-4 uppercase">
            Latest Testimonials
          </p>
          <h2 className="text-white text-4xl lg:text-5xl font-bold">
            WHAT OUR <span className="text-gray-400">CLIENTS SAYS</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            : testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-zinc-800 p-8 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                >
                  <Quote className="w-10 h-10 text-white mb-6" />
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-white font-bold uppercase text-sm tracking-wide">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))
          }
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;