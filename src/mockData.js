// Mock data for the photography portfolio
import weddingImg from "./assets/serviceGrid/service_grid_weeding.png";
import studioImg from "./assets/serviceGrid/service_grid_studio.png";
import productVid from "./assets/serviceGrid/services_product.mp4";
import servicesVid from "./assets/serviceGrid/services_video.mp4";
import portrait1 from "./assets/portfolio/portrait_1.jpg";
import portrait2 from "./assets/portfolio/portrait_2.jpg";
import portrait3 from "./assets/portfolio/portrait_3.jpg";
import portrait4 from "./assets/portfolio/portrait_4.png";
import portrait5 from "./assets/portfolio/portrait_5.png";
import portrait6a from "./assets/portfolio/portrait_6a.webp"; //weeding
import portrait6b from "./assets/portfolio/portrait_6b.jpg";
import abstract1 from "./assets/portfolio/abstract_1.jpg";
import abstract5 from "./assets/portfolio/abstract_5.jpg";
import abstract3 from "./assets/portfolio/abstract_3.jpg";
import abstract4 from "./assets/portfolio/abstract_4.jpg";
import weeding1 from "./assets/portfolio/weeding_1.jpg";
import weeding2 from "./assets/portfolio/weeding_2.jpg";
import weeding3 from "./assets/portfolio/weeding_3.webp";
import weeding4 from "./assets/portfolio/weeding_4.webp";
import weeding5 from "./assets/portfolio/weeding_5.jpg";
import nature1 from "./assets/portfolio/nature_1.jpg";
import nature2 from "./assets/portfolio/nature_2.jpg";
import nature3 from "./assets/portfolio/nature_3.jpg";
import pc from "./assets/team/pc.jpg";
import pc1 from "./assets/team/pc1.jpg";
import pc2 from "./assets/team/pc2.jpg";
import mc from "./assets/brands/mc.jpg";

export const galleryImages = [
  {
    id: 1,
    url: portrait1,
    category: "portrait",
    alt: "Portrait Photography"
  },
  {
    id: 2,
    url: portrait2,
    category: "portrait",
    alt: "Fashion Portrait"
  },
  {
    id: 3,
    url: nature1,
    category: "nature",
    alt: "Landscape Photography"
  },
  {
    id: 4,
    url: portrait3,
    category: "portrait",
    alt: "Colorful Portrait"
  },
  {
    id: 5,
    url: portrait4,
    category: "portrait",
    alt: "Beauty Portrait"
  },
  {
    id: 6,
    url: nature2,
    category: "nature",
    alt: "Aerial Landscape"
  },
  {
    id: 7,
    url: abstract1,
    category: "abstract",
    alt: "Abstract Composition"
  },
  {
    id: 8,
    url: weeding1,
    category: "wedding",
    alt: "Wedding Rings"
  },
  {
    id: 9,
    url: nature3,
    category: "nature",
    alt: "Mountain River"
  },
  {
    id: 10,
    url: portrait6a,
    category: "wedding",
    alt: "Wedding Couple"
  },
  {
    id: 11,
    url: portrait5,
    category: "portrait",
    alt: "Professional Headshot"
  },
  {
    id: 12,
    url: abstract5,
    category: "abstract",
    alt: "Camera Equipment"
  },
  {
    id: 13,
    url: weeding2,
    category: "wedding",
    alt: "Wedding Photography"
  },
  {
    id: 14,
    url: "https://images.unsplash.com/photo-1605025169915-987049301f31",
    category: "nature",
    alt: "Waterfall Scene"
  },
  {
    id: 15,
    url: abstract4,
    category: "portrait",
    alt: "Elegant Portrait"
  },
  {
    id: 16,
    url: weeding3,
    category: "wedding",
    alt: "Romantic Couple"
  },
  {
    id: 17,
    url: "https://images.pexels.com/photos/34314126/pexels-photo-34314126.jpeg",
    category: "nature",
    alt: "Mountain Landscape"
  },
  {
    id: 18,
    url: weeding4,
    category: "wedding",
    alt: "Lakeside Wedding"
  },
  {
    id: 19,
    url: "https://images.pexels.com/photos/28297918/pexels-photo-28297918.jpeg",
    category: "nature",
    alt: "Scenic Nature"
  },
  {
    id: 20,
    url: abstract3,
    category: "abstract",
    alt: "Scenic Composition"
  },
  {
    id: 21,
    url: portrait6b,
    category: "portrait",
    alt: "Scenic Composition"
  },
  {
    id: 22,
    url: weeding5,
    category: "wedding",
    alt: "Wedding Photography"
  }
];

export const equipment = {
  cameraBodies: [
    'Sony A7 III',
    'Canon Mark IV',
    'Nikon Z5'
  ],
  flashesAndLights: [
    'Canon ST-E3 Speedlite',
    'Stella Pro 5000 video light',
    'Canon 600 EX II-RT Speedlites'
  ],
  cameraLenses: [
    'Sony 28-135mm f4 G OSS',
    'Sony 100-400mm f4.5-5.6 GM OSS',
    'Sony 200-600mm f5.6-6.3 G OSS',
    'Sony 28mm f2.0',
    'Sony 50mm f1.4 ZA Planar T',
    'DX Fisheye-Nikkor 10.5mm f/2.8G ED',
    'AF-S Zoom-Nikkor 17-35mm f/2.8D IF-ED',
    'Canon 100mm macro',
    'Canon 70-200mm f/4.0',
    'Canon 28mm f/1.8'
  ]
};

export const team = [
  {
    name: 'PC',
    role: 'role',
    image: pc
  },
  {
    name: 'PC',
    role: 'role',
    image: pc1
  },
  {
    name: 'PC',
    role: 'role',
    image: pc2
  }
];

export const services = [
  {
    id: 1,
    title: "FNB (Food & Beverages)",
    description: "Professional food and beverage photography capturing appetizing textures, vibrant colors, and styled compositions. Ideal for restaurants, cafes, menus, advertisements, and brand promotions with high-resolution quality.",
    icon: "utensils",
    video: productVid
  },
  {
    id: 2,
    title: "Automotive",
    description:
      "Professional automotive photography highlighting design, performance, and fine details. Perfect for car brands, dealerships, advertisements, and promotional campaigns with dynamic lighting and high-resolution clarity.",
    icon: "car",
    video: servicesVid,
  },
  {
    id: 3,
    title: "Product Shoot",
    description: "High-quality product photography designed for e-commerce, social media marketing, and brand promotion with clean backgrounds and precise lighting.",
    icon: "shopping-bag",
    image: weddingImg
  },
  {
    id: 4,
    title: "Video Shooting",
    description: "Cinematic videography services for weddings, events, and brands with smooth transitions, creative direction, and professional post-production editing.",
    icon: "video",
    video: servicesVid
  }
];

export const testimonials = [
  {
    id: 1,
    text: "Your photography beautifully captures the soul of our nation. Through your lens, you have preserved moments that inspire, connect, and celebrate our rich heritage. Your dedication and creativity reflect the true spirit of India. Keep shining and continue telling powerful stories through your art.",
    author: "Narendra Modi",
    company: "India"
  },
  {
    id: 2,
    text: "I’ve seen a lot of photography, a lot and this is absolutely incredible. Truly tremendous work. The detail, the colors, the energy - it’s fantastic. You have a great eye, maybe one of the best I’ve seen. Keep doing what you’re doing. Very impressive.",
    author: "Doland Trump",
    company: "US"
  },
  {
    id: 3,
    text: "Your work through the lens reflects truth and sincerity. Photography is not merely about capturing images, but about capturing the spirit of humanity. If your art serves society and awakens compassion in people’s hearts, then it is truly meaningful. Continue your work with humility and dedication.",
    author: "GandhiJI",
    company: "India"
  }
];

export const stats = [
  { label: "Awards", value: 12 },
  { label: "Exhibitions", value: 25 },
  { label: "Happy Clients", value: 1000 }
];

export const partnerLogos = [
  "https://via.placeholder.com/120x60/333/999?text=Logo+1",
  "https://via.placeholder.com/120x60/333/999?text=Logo+2",
  "https://via.placeholder.com/120x60/333/999?text=Logo+3",
  "https://via.placeholder.com/120x60/333/999?text=Logo+4",
  "https://via.placeholder.com/120x60/333/999?text=Logo+5",
  "https://via.placeholder.com/120x60/333/999?text=Logo+6"
];

export const features = [
  {
    number: '1.',
    title: 'Extensive Equipment',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus nisl vitae magna pulvinar laoreet.'
  },
  {
    number: '2.',
    title: 'Extensive Equipment',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus nisl vitae magna pulvinar laoreet.'
  },
  {
    number: '3.',
    title: 'Professional Editing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus nisl vitae magna pulvinar laoreet.'
  },
  {
    number: '4.',
    title: 'Fine Retouching',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus nisl vitae magna pulvinar laoreet.'
  }
];

export const brands = [
  {
    brandName: "Manchester United",
    brandImage: mc,
    workLink: "https://www.manutd.com"
  },
  {
    brandName: "Gamma",
    brandImage: "https://www.instagram.com/gamma_wine_and_dine/?hl=en",
    workLink: "https://unsplash.com"
  },
  {
    brandName: "Nick & Joan",
    brandImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    workLink: "https://unsplash.com"
  },
  {
    brandName: "Hudston Smith",
    brandImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
    workLink: "https://unsplash.com"
  },
  {
    brandName: "Andreas",
    brandImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    workLink: "https://unsplash.com"
  },
  {
    brandName: "Paul Studio",
    brandImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80",
    workLink: "https://unsplash.com"
  }
];