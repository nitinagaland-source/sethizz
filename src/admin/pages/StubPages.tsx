// src/admin/pages/StubPages.tsx
// Placeholder pages for admin sections built out in Phase 2.
import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';

export const OrdersListPage = () => (
  <PlaceholderPage
    title="Orders"
    description="Every checkout will land here. For now the dashboard shows the latest, and full order management ships in Phase 2."
    plannedFeatures={[
      'Filter by status (confirmed, packed, shipped, delivered, cancelled)',
      'Detail view with items, address, payment, timeline',
      'Update status + add tracking number',
      'Print / download invoice PDF',
      'Refund workflow (mark as refunded)',
      'Bulk actions and CSV export',
    ]}
  />
);

export const CustomersPage = () => (
  <PlaceholderPage
    title="Customers"
    description="Once customer signups + checkout are wired to Firebase, this page will show every registered customer."
    plannedFeatures={[
      'List with search, filter by club tier',
      'Detail: profile, order history, addresses, wishlist',
      'Manual club tier assignment',
      'Ban / restore account',
    ]}
  />
);

export const ReviewsPage = () => (
  <PlaceholderPage
    title="Reviews"
    description="Moderate customer reviews for each product."
    plannedFeatures={[
      'List all reviews, filter by approved / pending / product',
      'Approve, reject, delete',
      'Reply to reviews',
      'Verified purchase badge auto-set from orders',
    ]}
  />
);

export const CouponsPage = () => (
  <PlaceholderPage
    title="Coupons"
    description="Full coupon editor. Right now, the 4 default coupons (SAVE10, WELCOME15, SETHI20, FIRSTDROP) are seeded and active."
    plannedFeatures={[
      'Create / edit / disable codes',
      'Percent or fixed-amount discount',
      'Min-order, max-discount, per-user + total usage limits',
      'Date range (valid from / until)',
      'Restrict to categories or specific products',
      'Usage stats + top-used codes',
    ]}
  />
);

export const InventoryPage = () => (
  <PlaceholderPage
    title="Inventory"
    description="Central view of every variant's stock across all products, plus low-stock alerts."
    plannedFeatures={[
      'One row per (product, color, size) with stock count',
      'Inline edit for quick restocks',
      'Filter: low-stock only, sold-out, restocked recently',
      'Bulk edit via CSV import/export',
      'Stock movement history log',
    ]}
  />
);

export const AnalyticsPage = () => (
  <PlaceholderPage
    title="Analytics"
    description="Full storefront analytics — revenue, orders, funnel, and top performers. For running Meta Ads properly."
    plannedFeatures={[
      'Revenue over time (daily / weekly / monthly)',
      'Orders by status',
      'Top products & top categories',
      'Conversion funnel: view → add-to-cart → checkout → purchase',
      'Signup trend',
      'Coupon usage breakdown',
      'Traffic sources (once you wire GA)',
    ]}
  />
);

export const SiteContentPage = () => (
  <PlaceholderPage
    title="Site Content"
    description="Edit everything on the storefront — hero, deal banner, carousels, testimonials, footer, FAQs, brand text."
    plannedFeatures={[
      'Hero banner: title, subtitle, image, CTAs',
      'Deal banner: title + countdown target date + featured products',
      'Explore Categories tabs (Women/Men)',
      'Silhouette carousel: which products to feature',
      'Special Offer card',
      'Testimonials: add / edit / delete',
      'Newsletter title + coupon code',
      'Footer: shop links, help links, social, copyright, contact',
      'FAQs on product detail page',
    ]}
  />
);

export const SettingsPage = () => (
  <PlaceholderPage
    title="Settings"
    description="Store-wide settings that affect checkout and site behavior."
    plannedFeatures={[
      'Shipping: free-shipping threshold, standard rate, priority rate, COD fee',
      'Tax: GST percentage, inclusive / exclusive',
      'Contact: email, phone, WhatsApp number',
      'Notifications: enable/disable email + WhatsApp order confirmations',
      'Payment: Razorpay key ID (test/live toggle)',
      'Admin users: invite new admins/staff, remove access',
    ]}
  />
);
