// src/types/index.ts
// Shared types used by both storefront and admin panel.

import type { Timestamp } from 'firebase/firestore';

/* ============================================================
 * PRODUCTS & CATEGORIES
 * ============================================================ */

export interface Category {
  id: string;              // slug — e.g. "tees", "hoodies"
  name: string;            // display name — e.g. "T-Shirts"
  description?: string;
  image: string;           // Firebase Storage URL
  order: number;           // for sort order in nav/shop
  isActive: boolean;
  itemCount?: number;      // denormalized, updated by seeder/admin
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface ProductSize {
  name: string;            // "S", "M", "L", "XL", "ONE SIZE"
  stock: number;
  sku?: string;
}

export interface ProductVariant {
  colorId: string;         // "black", "cream", etc
  colorName: string;       // "Black"
  colorHex: string;        // "#0F0F14"
  images: string[];        // Firebase Storage URLs
  sizes: ProductSize[];
}

export interface ProductDetails {
  fabric: string;
  weight: string;
  fit: string;
  modelWears: string;
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductFlags {
  isNew: boolean;
  isBestseller: boolean;
  isDeal: boolean;
  isActive: boolean;       // if false, hidden from storefront
}

export interface Product {
  id: string;
  slug: string;            // URL-safe, unique
  sku: string;
  name: string;
  category: string;        // Category.id
  categoryLabel: string;   // Snapshot of category name for display
  price: number;           // in paise? no — full rupees, e.g. 1199
  salePrice?: number;
  shortDescription: string;
  description: string;
  variants: ProductVariant[];
  details: ProductDetails;
  rating: number;
  reviewCount: number;
  flags: ProductFlags;
  seo?: ProductSEO;
  order?: number;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/* ============================================================
 * REVIEWS
 * ============================================================ */

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  author: string;
  city?: string;
  rating: number;          // 1-5
  title: string;
  body: string;
  verified: boolean;
  approved: boolean;
  createdAt?: Timestamp | Date;
}

/* ============================================================
 * ORDERS
 * ============================================================ */

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type ShippingTier = 'standard' | 'priority';

export interface Address {
  name: string;
  email?: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus | PaymentStatus | 'created';
  at: Timestamp | Date;
  note?: string;
  by?: string;             // admin uid who made change
}

export interface Order {
  id: string;
  orderNumber: string;     // "ORD-2026-94821"
  userId?: string | null;  // null for guest
  guestEmail?: string;

  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;

  coupon?: { code: string; discount: number } | null;

  shippingAddress: Address;
  billingAddress?: Address;

  shippingTier: ShippingTier;
  trackingNumber?: string;
  courier?: string;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  timeline: OrderTimelineEntry[];
  adminNotes?: string;

  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/* ============================================================
 * CUSTOMERS & ADMINS
 * ============================================================ */

export interface Customer {
  id: string;              // Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[];      // productIds
  clubTier?: string;       // "Platinum", "Gold", etc
  verifiedMember?: boolean;
  createdAt?: Timestamp | Date;
  lastLogin?: Timestamp | Date;
}

export type AdminRole = 'admin' | 'staff';

export interface Admin {
  id: string;              // same as Firebase Auth UID
  email: string;
  name: string;
  role: AdminRole;
  createdAt?: Timestamp | Date;
  lastLogin?: Timestamp | Date;
}

/* ============================================================
 * COUPONS
 * ============================================================ */

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: string;              // same as code, uppercase
  code: string;            // uppercase, e.g. "SAVE10"
  discountType: CouponType;
  discountValue: number;   // percent (10) or rupees (500)
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  validFrom?: Timestamp | Date;
  validUntil?: Timestamp | Date;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt?: Timestamp | Date;
}

/* ============================================================
 * SITE CONTENT (admin-editable pages)
 * ============================================================ */

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  tertiaryCta?: { label: string; href: string };
}

export interface DealBannerContent {
  title: string;
  endsAt: Timestamp | Date | string; // ISO string acceptable
  viewAllLink: string;
  featuredProductIds: string[];      // deals to show
}

export interface SpecialOfferContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface CarouselContent {
  eyebrow: string;
  title: string;
  productIds: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  avatar?: string;
}

export interface NewsletterContent {
  title: string;
  body: string;
  couponCode: string;
  footerTitle: string;
  footerBody: string;
}

export interface FooterLink { label: string; href: string; }
export interface FooterContent {
  about: string;
  hqLocation: string;
  shopLinks: FooterLink[];
  helpLinks: FooterLink[];
  socialLinks: FooterLink[];
  contactEmail: string;
  copyright: string;
}

export interface HomeContent {
  hero: HeroContent;
  dealBanner: DealBannerContent;
  specialOffer: SpecialOfferContent;
  carousel: CarouselContent;
  testimonials: Testimonial[];
  newsletter: NewsletterContent;
}

export interface FAQ { id: string; question: string; answer: string; order: number; }

/* ============================================================
 * SETTINGS
 * ============================================================ */

export interface ShippingSettings {
  freeShippingThreshold: number;   // e.g. 1499
  standardRate: number;            // 0 for free
  priorityRate: number;            // 199
  codFee: number;                  // 49
  standardEtaDays: string;         // "4-7 business days"
  priorityEtaDays: string;         // "2-3 business days"
}

export interface TaxSettings {
  gstPercent: number;              // 18
  taxInclusive: boolean;           // true = prices include tax
}

export interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
}

export interface NotificationSettings {
  emailOrderConfirmation: boolean;
  whatsappOrderConfirmation: boolean;
  emailLowStockAlert: boolean;
  lowStockThreshold: number;
}

export interface StoreSettings {
  shipping: ShippingSettings;
  tax: TaxSettings;
  contact: ContactSettings;
  notifications: NotificationSettings;
  currency: 'INR';
  currencySymbol: '₹';
}
