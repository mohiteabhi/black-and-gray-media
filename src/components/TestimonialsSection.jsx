import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials } from '../mockData';

const TestimonialsSection = () => {
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;