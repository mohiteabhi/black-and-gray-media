// Mock data for the photography portfolio
import weddingImg from "./assets/serviceGrid/service_grid_weeding.png";
import studioImg from "./assets/serviceGrid/service_grid_studio.png";
import productVid from "./assets/serviceGrid/services_product.mp4";
import servicesVid from "./assets/serviceGrid/services_video.mp4";

export const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1544124094-8aea0374da93",
    category: "portrait",
    alt: "Portrait Photography"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1606143412458-acc5f86de897",
    category: "portrait",
    alt: "Fashion Portrait"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1544954617-f5c6b0d16164",
    category: "nature",
    alt: "Landscape Photography"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1624711517157-25991163e537",
    category: "portrait",
    alt: "Colorful Portrait"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1563170446-9c3c0622d8a9",
    category: "portrait",
    alt: "Beauty Portrait"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1534218238612-bace67b05bf2",
    category: "nature",
    alt: "Aerial Landscape"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1565660467558-2cc40ad3066b",
    category: "abstract",
    alt: "Abstract Composition"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1533091090875-1ff4acc497dd",
    category: "wedding",
    alt: "Wedding Rings"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1604430456280-43f652c497aa",
    category: "nature",
    alt: "Mountain River"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914",
    category: "wedding",
    alt: "Wedding Couple"
  },
  {
    id: 11,
    url: "https://images.pexels.com/photos/27523299/pexels-photo-27523299.jpeg",
    category: "portrait",
    alt: "Professional Headshot"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72",
    category: "abstract",
    alt: "Camera Equipment"
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1573676048035-9c2a72b6a12a",
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
    url: "https://images.pexels.com/photos/27919272/pexels-photo-27919272.jpeg",
    category: "portrait",
    alt: "Elegant Portrait"
  },
  {
    id: 16,
    url: "https://images.unsplash.com/flagged/photo-1552981941-424aac2b4311",
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
    url: "https://images.pexels.com/photos/949224/pexels-photo-949224.jpeg",
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
    url: "https://images.unsplash.com/photo-1715596802669-fe644878f21b",
    category: "abstract",
    alt: "Scenic Composition"
  }
];

export const services = [
  {
    id: 1,
    title: "Wedding Session",
    description: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    icon: "rings",
    image: weddingImg
  },
  {
    id: 2,
    title: "Studio Shooting",
    description: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    icon: "camera",
    image: studioImg
  },
  {
    id: 3,
    title: "Product Shoot",
    description: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    icon: "shopping-bag",
    video: productVid
  },
  {
    id: 4,
    title: "Video Shooting",
    description: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    icon: "video",
    video: servicesVid
  }
];

export const testimonials = [
  {
    id: 1,
    text: "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
    author: "George Atkinson",
    company: "Envato"
  },
  {
    id: 2,
    text: "Cras mattis consectetur purus sit amet fermentum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    author: "George Atkinson",
    company: "Envato"
  },
  {
    id: 3,
    text: "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
    author: "George Atkinson",
    company: "Envato"
  }
];

export const stats = [
  { label: "Awards", value: 12 },
  { label: "Exhibitions", value: 25 },
  { label: "Projects", value: 150 }
];

export const partnerLogos = [
  "https://via.placeholder.com/120x60/333/999?text=Logo+1",
  "https://via.placeholder.com/120x60/333/999?text=Logo+2",
  "https://via.placeholder.com/120x60/333/999?text=Logo+3",
  "https://via.placeholder.com/120x60/333/999?text=Logo+4",
  "https://via.placeholder.com/120x60/333/999?text=Logo+5",
  "https://via.placeholder.com/120x60/333/999?text=Logo+6"
];