// src/data/mockData.ts

export interface Color {
  id: string;
  name: string;
  hex: string;
  images: string[];
  sizes: string[];
  stock: Record<string, number>;
}

export interface Review {
  id: string;
  author: string;
  city?: string;
  verified: boolean;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: 'tees' | 'hoodies' | 'jackets' | 'bottoms' | 'caps' | 'bags';
  categoryLabel: string;
  price: number;
  salePrice?: number;
  shortDescription: string;
  description: string;
  colors: Color[];
  details: {
    fabric: string;
    weight: string;
    fit: string;
    modelWears: string;
  };
  rating: number;
  reviewCount: number;
  reviews: Review[];
  isNew?: boolean;
  isBestseller?: boolean;
  isDeal?: boolean;
}

export interface Category {
  id: 'tees' | 'hoodies' | 'jackets' | 'bottoms' | 'caps' | 'bags';
  name: string;
  image: string;
  itemCount: number;
}

export const categories: Category[] = [
  {
    id: 'tees',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=85',
    itemCount: 42,
  },
  {
    id: 'hoodies',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=85',
    itemCount: 28,
  },
  {
    id: 'jackets',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=85',
    itemCount: 35,
  },
  {
    id: 'bottoms',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=85',
    itemCount: 19,
  },
  {
    id: 'caps',
    name: 'Wearables',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=85',
    itemCount: 15,
  },
];

export const products: Product[] = [
  {
    id: 'p_deal_sneaker',
    slug: 'nike-air-max-270-white',
    sku: 'NIKE-AM-270',
    name: 'Nike Air Max 270',
    category: 'bottoms',
    categoryLabel: "Men's Shoes",
    price: 4399,
    salePrice: 3499,
    shortDescription: 'Max Air 270 unit delivers unrivaled, all-day comfort with breathable engineered mesh.',
    description: 'The Nike Air Max 270 is inspired by two icons of big Air: the Air Max 180 and Air Max 93. It features Nike’s biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.',
    colors: [
      {
        id: 'white',
        name: 'Triple White',
        hex: '#F8FAFC',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=85',
        ],
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        stock: { 'UK 7': 12, 'UK 8': 20, 'UK 9': 15, 'UK 10': 8, 'UK 11': 6 },
      },
    ],
    details: {
      fabric: 'Engineered Mesh & Foam Air Sole',
      weight: 'Lightweight Performance',
      fit: 'True to size',
      modelWears: 'UK 9',
    },
    rating: 4.9,
    reviewCount: 240,
    reviews: [
      {
        id: 'r_s1',
        author: 'Karan V.',
        city: 'Mumbai',
        verified: true,
        rating: 5,
        title: 'Unbelievable cushioning',
        body: 'Extremely lightweight and the air bubble feels great on long walks.',
        date: 'Aug 14, 2026',
      },
    ],
    isDeal: true,
    isBestseller: true,
  },
  {
    id: 'p_deal_camera',
    slug: 'sony-alpha-a6400-mirrorless',
    sku: 'SONY-A6400-BLK',
    name: 'Sony Alpha a6400',
    category: 'hoodies',
    categoryLabel: 'Mirrorless Camera',
    price: 29999,
    salePrice: 24999,
    shortDescription: '24.2MP APS-C sensor with 0.02s Real-time Eye AF and 4K HDR movie recording.',
    description: 'Lightweight, compact and sturdily built, the α6400 is packed with impressive capabilities and features. With super-fast AF and highly precise subject tracking, it’s ideal for capturing fast-paced action.',
    colors: [
      {
        id: 'black',
        name: 'Matte Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=85',
        ],
        sizes: ['Body Only', '16-50mm Kit'],
        stock: { 'Body Only': 8, '16-50mm Kit': 14 },
      },
    ],
    details: {
      fabric: 'Magnesium Alloy Chassis',
      weight: '403g Body',
      fit: 'Compact Mirrorless Body',
      modelWears: '16-50mm Power Zoom Lens',
    },
    rating: 4.9,
    reviewCount: 182,
    reviews: [
      {
        id: 'r_c1',
        author: 'Arjun S.',
        city: 'Bangalore',
        verified: true,
        rating: 5,
        title: 'Real-time eye autofocus is magic',
        body: 'Best travel and vlog camera for creators.',
        date: 'Aug 11, 2026',
      },
    ],
    isDeal: true,
    isBestseller: true,
  },
  {
    id: 'p_deal_perfume',
    slug: 'tom-ford-neroli-portofino',
    sku: 'TF-NEROLI-50ML',
    name: 'Tom Ford Neroli',
    category: 'bottoms',
    categoryLabel: 'Eau de Parfum 50ml',
    price: 5499,
    salePrice: 3899,
    shortDescription: 'Vibrant citrus oils, floral notes and amber undertones to leave a splashy yet substantive impression.',
    description: 'To Tom Ford, this scent perfectly captures the cool breezes, sparkling clear water, and lush foliage of the Italian Riviera. His reinvention of a classic eau de cologne features crisp citrus oils.',
    colors: [
      {
        id: 'azure',
        name: 'Riviera Azure',
        hex: '#0284C7',
        images: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=85',
        ],
        sizes: ['50ml', '100ml'],
        stock: { '50ml': 18, '100ml': 9 },
      },
    ],
    details: {
      fabric: 'Artisanal Italian Glass Bottle',
      weight: '50ml Concentrated Parfum',
      fit: 'Signature Spray Atomizer',
      modelWears: '50ml',
    },
    rating: 4.8,
    reviewCount: 96,
    reviews: [
      {
        id: 'r_p1',
        author: 'Meera K.',
        city: 'Delhi',
        verified: true,
        rating: 5,
        title: 'Summer in a bottle',
        body: 'Fresh neroli and citrus that lasts all day in humidity.',
        date: 'Aug 05, 2026',
      },
    ],
    isDeal: true,
  },
  {
    id: 'p_deal_watch',
    slug: 'apple-watch-series-9-midnight',
    sku: 'APPL-W9-MID',
    name: 'Apple Watch Series 9',
    category: 'hoodies',
    categoryLabel: 'GPS 45mm',
    price: 13999,
    salePrice: 9999,
    shortDescription: 'S9 SiP chip with Double Tap gesture, brighter display, and precision on-device Siri.',
    description: 'Smarter. Brighter. Mightier. Powerful new sensors give you deep health insights, while the innovative Double Tap gesture lets you answer calls without touching the screen.',
    colors: [
      {
        id: 'midnight',
        name: 'Midnight',
        hex: '#0F172A',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=85',
        ],
        sizes: ['41mm', '45mm'],
        stock: { '41mm': 20, '45mm': 18 },
      },
    ],
    details: {
      fabric: '100% Recycled Aluminum & Ion-X Glass',
      weight: '38.7g',
      fit: 'Sport Band (S/M & M/L)',
      modelWears: '45mm Midnight',
    },
    rating: 4.9,
    reviewCount: 310,
    reviews: [
      {
        id: 'r_w1',
        author: 'Rishi T.',
        city: 'Hyderabad',
        verified: true,
        rating: 5,
        title: 'Double tap gesture is fantastic',
        body: 'Smooth performance and battery lasts full 1.5 days.',
        date: 'Jul 29, 2026',
      },
    ],
    isDeal: true,
    isBestseller: true,
  },
  {
    id: 'p001',
    slug: 'oversized-heavyweight-tee-black',
    sku: 'EKTA-TEE-001',
    name: 'Oversized Heavyweight Tee',
    category: 'tees',
    categoryLabel: 'T-Shirts',
    price: 1499,
    salePrice: 1199,
    shortDescription: 'Heavyweight 260 GSM combed cotton. Boxy oversized fit with reinforced ribbed collar. Made in Tirupur.',
    description: 'The everyday tee, built properly. Engineered with 260 GSM single jersey combed cotton, our oversized tee balances breathability and structure. Pre-shrunk fabric prevents washing distortion while double-needle stitching throughout guarantees long-term durability.',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        stock: { XS: 12, S: 20, M: 25, L: 22, XL: 15, XXL: 8 },
      },
      {
        id: 'cream',
        name: 'Cream',
        hex: '#F5EFE0',
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 15, M: 18, L: 20, XL: 10 },
      },
    ],
    details: {
      fabric: '100% combed cotton, 260 GSM',
      weight: 'Heavyweight',
      fit: 'Boxy oversized — true to size',
      modelWears: 'Size M, height 5\'11"',
    },
    rating: 4.8,
    reviewCount: 128,
    reviews: [
      {
        id: 'r1',
        author: 'Aarav K.',
        city: 'Mumbai',
        verified: true,
        rating: 5,
        title: 'Everything a heavyweight tee should be',
        body: 'The fit is exactly what the photos show. No collar sagging after 4 washes. Third order in two months.',
        date: 'Aug 12, 2026',
      },
    ],
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'p002',
    slug: 'french-terry-hoodie-charcoal',
    sku: 'EKTA-HD-002',
    name: 'Heavyweight French Terry Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 3299,
    salePrice: 2699,
    shortDescription: '450 GSM diagonal loop French terry. Double-layered hood without drawstring clutter. Designed in Dimapur, Nagaland.',
    description: 'Engineered for chilly mornings and air-conditioned work desks. Cut from high-density 450 GSM French terry that softens with every wash without losing its structured silhouette.',
    colors: [
      {
        id: 'charcoal',
        name: 'Charcoal',
        hex: '#27272A',
        images: [
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: { S: 10, M: 18, L: 20, XL: 12, XXL: 5 },
      },
    ],
    details: {
      fabric: '100% Cotton French Terry, 450 GSM',
      weight: 'Super Heavyweight',
      fit: 'Relaxed street fit',
      modelWears: 'Size L, height 6\'0"',
    },
    rating: 4.9,
    reviewCount: 94,
    reviews: [
      {
        id: 'r4',
        author: 'Kabir N.',
        city: 'Pune',
        verified: true,
        rating: 5,
        title: 'Warmest hoodie I own',
        body: 'The 450 GSM is no joke. The hood stays structured and upright without looking slouchy.',
        date: 'Aug 10, 2026',
      },
    ],
    isBestseller: true,
    isNew: true,
  },
  {
    id: 'p003',
    slug: 'minimal-chore-jacket-navy',
    sku: 'EKTA-JK-003',
    name: 'Canvas Chore Work Jacket',
    category: 'jackets',
    categoryLabel: 'Jackets',
    price: 3999,
    salePrice: 3199,
    shortDescription: '12oz washed cotton duck canvas with horn buttons and three drop-in utility pockets.',
    description: 'Rooted in traditional utilitarian workwear, updated for modern day. Garment-dyed for a broken-in feel straight out of the box with reinforced elbow stitching.',
    colors: [
      {
        id: 'navy',
        name: 'Navy',
        hex: '#1E293B',
        images: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 8, M: 12, L: 10, XL: 6 },
      },
      {
        id: 'black',
        name: 'Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['M', 'L', 'XL'],
        stock: { M: 10, L: 14, XL: 8 },
      },
    ],
    details: {
      fabric: '100% Cotton Duck Canvas, 12 oz',
      weight: 'Mid-Heavy',
      fit: 'Regular Box Fit',
      modelWears: 'Size M, height 5\'10"',
    },
    rating: 4.7,
    reviewCount: 56,
    reviews: [
      {
        id: 'r5',
        author: 'Vikram D.',
        city: 'Hyderabad',
        verified: true,
        rating: 5,
        title: 'Outstanding build quality',
        body: 'Heavy canvas that cuts the wind perfectly. Buttons are sewn tight.',
        date: 'Aug 02, 2026',
      },
    ],
    isNew: true,
    isDeal: true,
  },
  {
    id: 'p004',
    slug: 'wide-leg-pleated-trouser-olive',
    sku: 'EKTA-PNT-004',
    name: 'Wide Leg Pleated Trouser',
    category: 'bottoms',
    categoryLabel: 'Pants & Shorts',
    price: 2499,
    salePrice: 1999,
    shortDescription: 'High-waisted double pleated trouser with hidden elastic waistband adjustment.',
    description: 'Tailored drape meets sweatpant ease. Built from cotton-twill blend with twin front pleats that fall straight to the ankle.',
    colors: [
      {
        id: 'olive',
        name: 'Olive',
        hex: '#4D5645',
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 14, M: 20, L: 18, XL: 8 },
      },
    ],
    details: {
      fabric: '98% Cotton Twill, 2% Elastane',
      weight: 'Midweight 280 GSM',
      fit: 'Relaxed Wide Straight',
      modelWears: 'Size 32 (M), height 6\'0"',
    },
    rating: 4.8,
    reviewCount: 72,
    reviews: [
      {
        id: 'r6',
        author: 'Arjun V.',
        city: 'Chennai',
        verified: true,
        rating: 5,
        title: 'Perfect drape',
        body: 'The twin pleats sit cleanly. Highly recommend getting your normal waist size.',
        date: 'Jul 22, 2026',
      },
    ],
    isDeal: true,
  },
  {
    id: 'p005',
    slug: 'unstructured-twill-cap-black',
    sku: 'EKTA-CAP-005',
    name: 'Unstructured 6-Panel Twill Cap',
    category: 'caps',
    categoryLabel: 'Caps',
    price: 999,
    salePrice: 799,
    shortDescription: 'Low profile 6-panel washed cotton cap with brass metal buckle slider.',
    description: 'Clean crown with subtle curve brim. Garment-washed cotton twill with an embroidered minimalist eyelet finish.',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['ONE SIZE'],
        stock: { 'ONE SIZE': 45 },
      },
    ],
    details: {
      fabric: '100% Washed Cotton Twill',
      weight: 'Lightweight',
      fit: 'Adjustable Strap (54–61cm)',
      modelWears: 'One Size Fits All',
    },
    rating: 4.9,
    reviewCount: 88,
    reviews: [
      {
        id: 'r7',
        author: 'Sameer P.',
        city: 'Ahmedabad',
        verified: true,
        rating: 5,
        title: 'Deep fit, clean brass hardware',
        body: 'Doesn’t sit too high on the head like generic dad caps. Very solid.',
        date: 'Jul 15, 2026',
      },
    ],
    isBestseller: true,
  },
  {
    id: 'p006',
    slug: 'heavy-canvas-tote-bag-cream',
    sku: 'EKTA-BAG-006',
    name: 'Heavy Duty 16oz Utility Tote',
    category: 'bags',
    categoryLabel: 'Bags',
    price: 1799,
    salePrice: 1399,
    shortDescription: 'Reinforced 16oz cotton canvas tote with interior laptop sleeve and key clip.',
    description: 'Built to haul work essentials, groceries, or gym gear. Features thick cotton webbing handles and a zipped inner security pocket.',
    colors: [
      {
        id: 'cream',
        name: 'Cream',
        hex: '#F5EFE0',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['ONE SIZE'],
        stock: { 'ONE SIZE': 30 },
      },
    ],
    details: {
      fabric: '100% Unbleached 16oz Canvas',
      weight: 'Heavyweight',
      fit: 'Dimensions: 42cm x 38cm x 12cm',
      modelWears: 'One Size',
    },
    rating: 4.8,
    reviewCount: 41,
    reviews: [
      {
        id: 'r8',
        author: 'Divya M.',
        city: 'Kolkata',
        verified: true,
        rating: 5,
        title: 'Fits a 16 inch MacBook easily',
        body: 'The strap drop length is generous so it doesn’t bunch up under your shoulder.',
        date: 'Jun 30, 2026',
      },
    ],
    isNew: true,
  },
  {
    id: 'p007',
    slug: 'boxy-pocket-tee-olive',
    sku: 'EKTA-TEE-007',
    name: 'Relaxed Chest Pocket Tee',
    category: 'tees',
    categoryLabel: 'T-Shirts',
    price: 1399,
    salePrice: 1099,
    shortDescription: '240 GSM single jersey with single chest spade pocket and drop shoulder.',
    description: 'Clean pocket placement, wide neck ribbing, and soft pre-washed hand feel.',
    colors: [
      {
        id: 'olive',
        name: 'Olive',
        hex: '#4D5645',
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 10, M: 22, L: 18, XL: 12 },
      },
    ],
    details: {
      fabric: '100% Combed Cotton, 240 GSM',
      weight: 'Mid-Heavy',
      fit: 'Relaxed Drop Shoulder',
      modelWears: 'Size M, height 5\'11"',
    },
    rating: 4.6,
    reviewCount: 38,
    reviews: [
      {
        id: 'r9',
        author: 'Rohan G.',
        city: 'Mumbai',
        verified: true,
        rating: 5,
        title: 'Pocket holds sunglasses without sagging',
        body: 'Very well structured pocket stitching. Love the olive shade.',
        date: 'Jun 18, 2026',
      },
    ],
    isNew: true,
  },
  {
    id: 'p008',
    slug: 'zip-through-fleece-jacket-black',
    sku: 'EKTA-JK-008',
    name: 'Thermal Sherpa Fleece Jacket',
    category: 'jackets',
    categoryLabel: 'Jackets',
    price: 3499,
    salePrice: 2899,
    shortDescription: 'High-pile 360 GSM polar fleece with storm collar and YKK zipper hardware.',
    description: 'High-pile insulation with soft mesh lining on interior. Elasticated binding cuffs seal in heat.',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['M', 'L', 'XL'],
        stock: { M: 15, L: 20, XL: 9 },
      },
    ],
    details: {
      fabric: '100% Recycled Polyester High-Pile Fleece',
      weight: 'Heavyweight',
      fit: 'Regular Layering Fit',
      modelWears: 'Size L, height 6\'1"',
    },
    rating: 4.8,
    reviewCount: 65,
    reviews: [
      {
        id: 'r10',
        author: 'Tanmay B.',
        city: 'Bangalore',
        verified: true,
        rating: 5,
        title: 'Super soft inside and out',
        body: 'Zippers are smooth YKK Vislon. Keeps you warm during cold Bangalore mornings.',
        date: 'Jun 12, 2026',
      },
    ],
    isBestseller: true,
  },
  {
    id: 'p009',
    slug: 'heavyweight-crewneck-sweatshirt-heather',
    sku: 'EKTA-SW-009',
    name: 'Classic Crewneck Sweatshirt',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 2799,
    salePrice: 2299,
    shortDescription: '400 GSM brushed fleece crewneck with classic V-insert rib neck.',
    description: 'Clean neckline and chunky 2x2 ribbing at hem and cuffs for long-lasting fit retention.',
    colors: [
      {
        id: 'cream',
        name: 'Cream',
        hex: '#F5EFE0',
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 12, M: 16, L: 14, XL: 7 },
      },
    ],
    details: {
      fabric: '100% Combed Cotton Brushed Fleece, 400 GSM',
      weight: 'Heavyweight',
      fit: 'Relaxed Fit',
      modelWears: 'Size M, height 5\'11"',
    },
    rating: 4.7,
    reviewCount: 33,
    reviews: [
      {
        id: 'r11',
        author: 'Aditya S.',
        city: 'Delhi',
        verified: true,
        rating: 5,
        title: 'Perfect minimal sweatshirt',
        body: 'No annoying chest logo, just solid heavy fabric that holds its shape.',
        date: 'May 29, 2026',
      },
    ],
    isNew: true,
  },
  {
    id: 'p010',
    slug: 'nylon-cargo-shorts-black',
    sku: 'EKTA-SHT-010',
    name: 'Water-Repellent Cargo Shorts',
    category: 'bottoms',
    categoryLabel: 'Pants & Shorts',
    price: 1899,
    salePrice: 1499,
    shortDescription: 'Taslan nylon ripstop with quick-dry finish and integrated webbing belt.',
    description: 'Ultralight yet rip-resistant. Features two cargo flap pockets and an elasticated waistband with clip buckle.',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#0F0F14',
        images: [
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 10, M: 20, L: 15, XL: 6 },
      },
    ],
    details: {
      fabric: '100% Taslan Nylon Ripstop',
      weight: 'Lightweight 140 GSM',
      fit: '6-inch Inseam Above-the-Knee',
      modelWears: 'Size M, height 5\'10"',
    },
    rating: 4.8,
    reviewCount: 47,
    reviews: [
      {
        id: 'r12',
        author: 'Manish R.',
        city: 'Goa',
        verified: true,
        rating: 5,
        title: 'Dries super fast',
        body: 'Took them on a beach trip, dried within 20 mins in the sun.',
        date: 'May 14, 2026',
      },
    ],
  },
  {
    id: 'p011',
    slug: 'heavyweight-waffle-long-sleeve-rust',
    sku: 'EKTA-LS-011',
    name: 'Thermal Waffle Knit Long Sleeve',
    category: 'tees',
    categoryLabel: 'T-Shirts',
    price: 1799,
    salePrice: 1399,
    shortDescription: '300 GSM thermal honeycomb waffle knit with ribbed cuffs.',
    description: 'Substantial waffle texture traps warm air while letting skin breathe. Pre-washed to maintain its boxy fit.',
    colors: [
      {
        id: 'rust',
        name: 'Rust',
        hex: '#B85C3C',
        images: [
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: { S: 8, M: 14, L: 12, XL: 5 },
      },
    ],
    details: {
      fabric: '100% Combed Cotton Waffle Knit, 300 GSM',
      weight: 'Heavyweight',
      fit: 'Relaxed Fit',
      modelWears: 'Size M, height 5\'11"',
    },
    rating: 4.9,
    reviewCount: 52,
    reviews: [
      {
        id: 'r13',
        author: 'Nikhil P.',
        city: 'Pune',
        verified: true,
        rating: 5,
        title: 'Deep texture and great color',
        body: 'The rust color looks even better in person. Thick cuffs keep sleeves in place.',
        date: 'Apr 28, 2026',
      },
    ],
    isNew: true,
  },
  {
    id: 'p012',
    slug: 'cotton-corduroy-cap-rust',
    sku: 'EKTA-CAP-012',
    name: '8-Wale Corduroy Strapback Cap',
    category: 'caps',
    categoryLabel: 'Caps',
    price: 1199,
    salePrice: 899,
    shortDescription: 'Vintage 8-wale plush cotton corduroy with genuine leather strap back.',
    description: 'Chunky corduroy texture with unstructured crown and antique metal slider.',
    colors: [
      {
        id: 'rust',
        name: 'Rust',
        hex: '#B85C3C',
        images: [
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&auto=format&fit=crop&q=85',
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=85',
        ],
        sizes: ['ONE SIZE'],
        stock: { 'ONE SIZE': 25 },
      },
    ],
    details: {
      fabric: '100% Cotton 8-Wale Corduroy',
      weight: 'Plush',
      fit: 'Adjustable Leather Strap',
      modelWears: 'One Size Fits All',
    },
    rating: 4.8,
    reviewCount: 39,
    reviews: [
      {
        id: 'r14',
        author: 'Kunal T.',
        city: 'Bangalore',
        verified: true,
        rating: 5,
        title: 'Great chunky cord fabric',
        body: 'The leather strap feels very premium for the price. Highly recommended.',
        date: 'Apr 11, 2026',
      },
    ],
  },
];

export const homeTestimonials = [
  {
    id: 't1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Incredible fit and fabric!',
    body: 'The heavyweight tee is exactly what I was looking for. No thin see-through fabric here. Third order in two months.',
    author: 'Aarav K.',
    city: 'Mumbai',
  },
  {
    id: 't2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Fits like it should',
    body: 'Ordered the oversized hoodie in charcoal. Fits exactly like the size chart says. The boxy drape is top tier.',
    author: 'Priya S.',
    city: 'Bangalore',
  },
  {
    id: 't3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Fast delivery, great quality',
    body: 'Reached Delhi in 3 days. Packaging was clean and plastic-free. Fabric weight is real and substantial.',
    author: 'Ravi M.',
    city: 'Delhi',
  },
];
