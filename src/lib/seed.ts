// src/lib/seed.ts
// One-time seeder. Run with: bun run seed  (or npm run seed)
// Reads mockData.ts and populates Firestore.
// Also creates the initial admin doc from VITE_BOOTSTRAP_ADMIN_EMAIL.
//
// PREREQUISITE: You must have already created your Firebase Auth user
// (email/password) in the Firebase Console BEFORE running this script,
// so the admin UID can be discovered.

import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, collection, getDocs, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import * as readline from 'readline/promises';
import { products as mockProducts, categories as mockCategories, homeTestimonials } from '../data/mockData';
import type { Category, Product, HomeContent, FooterContent, StoreSettings, Coupon } from '../types';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function ask(q: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = await rl.question(q);
  rl.close();
  return a.trim();
}

async function seed() {
  console.log('\n🌱 SETHIZZZ Seeder\n');

  // ---------- Sign in bootstrap admin ----------
  const email = process.env.VITE_BOOTSTRAP_ADMIN_EMAIL;
  if (!email) throw new Error('VITE_BOOTSTRAP_ADMIN_EMAIL missing in .env.local');
  console.log(`Signing in as bootstrap admin: ${email}`);
  const password = await ask('Enter password for that account: ');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  console.log(`✅ Signed in. UID: ${cred.user.uid}\n`);

  // ---------- Create admin doc ----------
  console.log('Creating admin doc...');
  await setDoc(doc(db, 'admins', cred.user.uid), {
    email, name: 'Prakash', role: 'admin', createdAt: serverTimestamp(),
  });
  console.log('✅ Admin doc created (role: admin)\n');

  // ---------- Categories ----------
  const catData: Array<Omit<Category, 'createdAt' | 'updatedAt'>> = [
    { id: 'tees', name: 'Heavyweight Tees', description: '260 GSM structured combed cotton tees.', image: mockCategories[0].image, order: 1, isActive: true, itemCount: 0 },
    { id: 'hoodies', name: 'French Terry Hoodies', description: '450 GSM heavy knit hoodies.', image: mockCategories[1].image, order: 2, isActive: true, itemCount: 0 },
    { id: 'jackets', name: 'Canvas Jackets', description: 'Triple-stitched 12oz duck canvas.', image: mockCategories[2].image, order: 3, isActive: true, itemCount: 0 },
    { id: 'bottoms', name: 'Pants & Shorts', description: 'Wide leg pleated trousers, cotton shorts.', image: mockCategories[3].image, order: 4, isActive: true, itemCount: 0 },
    { id: 'caps', name: 'Caps & Accessories', description: '6-panel structured caps and add-ons.', image: mockCategories[4].image, order: 5, isActive: true, itemCount: 0 },
    { id: 'bags', name: 'Bags', description: '16oz utility totes and carry-alls.', image: mockCategories[0].image, order: 6, isActive: true, itemCount: 0 },
  ];

  console.log('Seeding categories...');
  const catBatch = writeBatch(db);
  catData.forEach((c) => {
    catBatch.set(doc(db, 'categories', c.id), { ...c, createdAt: serverTimestamp() });
  });
  await catBatch.commit();
  console.log(`✅ ${catData.length} categories seeded\n`);

  // ---------- Products ----------
  console.log('Seeding products...');
  const prodBatch = writeBatch(db);
  const counts: Record<string, number> = {};
  mockProducts.forEach((p) => {
    const variants = p.colors.map((c) => ({
      colorId: c.id, colorName: c.name, colorHex: c.hex,
      images: c.images,
      sizes: c.sizes.map((s) => ({ name: s, stock: c.stock[s] ?? 0, sku: `${p.sku}-${c.id}-${s}` })),
    }));
    const doc_: Omit<Product, 'createdAt' | 'updatedAt'> = {
      id: p.id, slug: p.slug, sku: p.sku, name: p.name,
      category: p.category, categoryLabel: p.categoryLabel,
      price: p.price, salePrice: p.salePrice,
      shortDescription: p.shortDescription, description: p.description,
      variants, details: p.details, rating: p.rating, reviewCount: p.reviewCount,
      flags: {
        isNew: !!p.isNew, isBestseller: !!p.isBestseller, isDeal: !!p.isDeal, isActive: true,
      },
      order: 0,
    };
    prodBatch.set(doc(db, 'products', p.id), { ...doc_, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

    // Reviews as subdocs
    p.reviews.forEach((r) => {
      prodBatch.set(doc(db, 'reviews', `${p.id}_${r.id}`), {
        productId: p.id, author: r.author, city: r.city || '',
        rating: r.rating, title: r.title, body: r.body,
        verified: r.verified, approved: true, createdAt: new Date(r.date),
      });
    });
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  await prodBatch.commit();
  console.log(`✅ ${mockProducts.length} products seeded\n`);

  // ---------- Update category counts ----------
  const countBatch = writeBatch(db);
  Object.entries(counts).forEach(([catId, n]) => {
    countBatch.set(doc(db, 'categories', catId), { itemCount: n }, { merge: true });
  });
  await countBatch.commit();

  // ---------- Site content: home ----------
  console.log('Seeding site content...');
  const home: HomeContent = {
    hero: {
      eyebrow: 'NEW COLLECTION', title: 'Elevated Everyday.',
      subtitle: 'Timeless style. Modern essentials.',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1400&auto=format&fit=crop&q=85',
      primaryCta: { label: 'Shop Collection', href: '/shop' },
      secondaryCta: { label: 'New Arrivals', href: '/shop?filter=new' },
      tertiaryCta: { label: 'Watch Story', href: '#' },
    },
    dealBanner: {
      title: 'Deals of the Day',
      endsAt: new Date(Date.now() + 12 * 3600 * 1000 + 44 * 60 * 1000).toISOString(),
      viewAllLink: '/shop?filter=deals',
      featuredProductIds: mockProducts.filter((p) => p.isDeal).slice(0, 4).map((p) => p.id),
    },
    specialOffer: {
      eyebrow: 'SPECIAL OFFER', title: 'Up to 50% Off',
      subtitle: 'On select heavyweight tees, French terry hoodies, and jackets. Limited quantities only!',
      ctaText: 'Shop the Sale', ctaLink: '/shop?filter=deals',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=85',
    },
    carousel: {
      eyebrow: '3D LOOKBOOK ARCHIVE', title: 'Explore The Silhouette',
      productIds: mockProducts.slice(0, 5).map((p) => p.id),
    },
    testimonials: homeTestimonials.map((t, i) => ({ id: `t${i}`, ...t })),
    newsletter: {
      title: 'Join the SETHIZZZ Club',
      body: 'Get 10% off your first order with code SAVE10, plus early access to limited edition seasonal drops.',
      couponCode: 'SAVE10',
      footerTitle: 'Join the SETHIZZZ Inner Circle',
      footerBody: 'Early drop notifications, private archive sales, and zero-spam editorial updates.',
    },
  };
  await setDoc(doc(db, 'site_content', 'home'), home);

  // ---------- Site content: footer ----------
  const footer: FooterContent = {
    about: 'Heavyweight everyday apparel, crafted and curated with high-density materials, double-needle seams, and structured silhouettes. Based out of Dimapur, Nagaland.',
    hqLocation: 'HQ: Dimapur, Nagaland · Pan-India Delivery',
    shopLinks: [
      { label: 'Heavyweight Tees', href: '/shop/tees' },
      { label: 'French Terry Hoodies', href: '/shop/hoodies' },
      { label: 'Canvas Jackets', href: '/shop/jackets' },
      { label: 'Pants & Shorts', href: '/shop/bottoms' },
      { label: 'Caps & Accessories', href: '/shop/caps' },
      { label: 'Deals of the Day 🔥', href: '/shop?filter=deals' },
    ],
    helpLinks: [
      { label: 'Track Your Order', href: '/account' },
      { label: '15-Day Return Policy', href: '#' },
      { label: 'Shipping Rates & Timelines', href: '#' },
      { label: 'Size Guide & Fabric Care', href: '#' },
      { label: 'WhatsApp Support (24/7)', href: '#' },
    ],
    socialLinks: [
      { label: 'Instagram ↗', href: 'https://instagram.com/sethizzz' },
      { label: 'Twitter / X ↗', href: '#' },
      { label: 'YouTube ↗', href: '#' },
    ],
    contactEmail: 'hello@sethizzz.com',
    copyright: `© ${new Date().getFullYear()} SETHIZZZ Apparel. All rights reserved. Made in India.`,
  };
  await setDoc(doc(db, 'site_content', 'footer'), footer);

  // ---------- Settings ----------
  const settings: StoreSettings = {
    shipping: {
      freeShippingThreshold: 1499, standardRate: 0, priorityRate: 199, codFee: 49,
      standardEtaDays: '4-7 business days', priorityEtaDays: '2-3 business days',
    },
    tax: { gstPercent: 18, taxInclusive: true },
    contact: { email: 'hello@sethizzz.com', phone: '+91 9876543210', whatsapp: '+91 9876543210' },
    notifications: {
      emailOrderConfirmation: false, whatsappOrderConfirmation: false,
      emailLowStockAlert: false, lowStockThreshold: 5,
    },
    currency: 'INR', currencySymbol: '₹',
  };
  await setDoc(doc(db, 'site_content', 'settings'), settings);
  console.log('✅ Site content + settings seeded\n');

  // ---------- Coupons ----------
  console.log('Seeding coupons...');
  const coupons: Array<Omit<Coupon, 'createdAt'>> = [
    { id: 'SAVE10', code: 'SAVE10', discountType: 'percent', discountValue: 10, minOrder: 0, usedCount: 0, isActive: true },
    { id: 'WELCOME15', code: 'WELCOME15', discountType: 'percent', discountValue: 15, minOrder: 1500, usedCount: 0, isActive: true },
    { id: 'SETHI20', code: 'SETHI20', discountType: 'percent', discountValue: 20, minOrder: 2500, usedCount: 0, isActive: true },
    { id: 'FIRSTDROP', code: 'FIRSTDROP', discountType: 'percent', discountValue: 10, minOrder: 0, usedCount: 0, isActive: true },
  ];
  const couponBatch = writeBatch(db);
  coupons.forEach((c) => couponBatch.set(doc(db, 'coupons', c.id), { ...c, createdAt: serverTimestamp() }));
  await couponBatch.commit();
  console.log(`✅ ${coupons.length} coupons seeded\n`);

  console.log('🎉 All done. Visit /admin/login to sign in.\n');
  process.exit(0);
}

seed().catch((err) => { console.error('❌ Seeder failed:', err); process.exit(1); });
