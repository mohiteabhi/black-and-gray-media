import React from 'react';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-6 text-center text-white relative z-10 pt-20">
          <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm p-8 rounded-lg">
            <h1 className="text-5xl font-bold mb-6">JOSHUA BELL</h1>
            <h5 className="text-xl tracking-widest mb-6 uppercase text-gray-200">Photographer</h5>
            <p className="text-lg leading-relaxed mb-4">
              I'm a freelance photographer based in London who specializes in people and portrait photography. I love putting ideas into beautiful pictures, and I want to help you do the same. Are you searching for a photographer who is passionate, caring, and creative? I am that photographer!
            </p>
            <p className="text-gray-300 italic">- Joshuabell</p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">MY EQUIPMENTS</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Here you can find the list of my equipment. The choice of camera depends on the photoshoot type, location, timing, and a lot more. If you have any questions about my equipment, don't hesitate to ask.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Camera Bodies */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Camera Bodies</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony A7 III
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon Mark IV
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Nikon Z5
                </li>
              </ul>
            </div>

            {/* Flashes and Lights */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Flashes and Lights</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon ST-E3 Speedlite
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Stella Pro 5000 video light
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon 600 EX II-RT Speedlites
                </li>
              </ul>
            </div>

            {/* Camera Lenses */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Camera Lenses</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony 28-135mm f4 G OSS
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony 100-400mm f4.5-5.6 GM OSS
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony 200-600mm f5.6-6.3 G OSS
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony 28mm f2.0
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Sony 50mm f1.4 ZA Planar T
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  DX Fisheye-Nikkor 10.5mm f/2.8G ED
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  AF-S Zoom-Nikkor 17-35mm f/2.8D IF-ED
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon 100mm macro
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon 70-200mm f/4.0
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Canon 28mm f/1.8
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special Moments Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            TODAY'S SPECIAL MOMENTS. TOMORROWS PRICELESS TREASURES.
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas faucibus mollis interdum.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">OUR AMAZING TEAM</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'SEAN WINTER', role: 'SHUTTER', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
              { name: 'SEAN WINTER', role: 'FUSION', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
              { name: 'SEAN WINTER', role: 'SCENE', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-gray-600 text-sm tracking-wider uppercase">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default AboutPage;
