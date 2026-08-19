// src/hooks/useStorefrontData.ts
// Compatibility hook — returns Firestore data in the SAME shape as mockData.ts,
// with fallback to mockData if Firestore is empty (before you've seeded).
//
// Use in storefront pages like this:
//
//   Before:
//     import { products, categories, homeTestimonials } from '../data/mockData';
//
//   After:
//     import { useStorefrontData } from '../hooks/useStorefrontData';
//     ...inside component:
//     const { products, categories, homeTestimonials } = useStorefrontData();
//
// Everything else stays exactly the same.

import { useProducts } from './useProducts';
import { useCategories } from './useCategories';
import { useHomeContent } from './useSiteContent';
import {
  products as mockProducts,
  categories as mockCategories,
  homeTestimonials as mockTestimonials,
} from '../data/mockData';
import type { Product as MockProduct, Category as MockCategory } from '../data/mockData';

/**
 * Convert Firestore Product (with `variants` and `flags`) back to the
 * legacy shape (with `colors` and top-level isNew/isBestseller/isDeal)
 * that existing storefront components consume.
 */
function toLegacyProduct(p: any): MockProduct {
  return {
    id: p.id, slug: p.slug, sku: p.sku, name: p.name,
    category: p.category, categoryLabel: p.categoryLabel,
    price: p.price, salePrice: p.salePrice,
    shortDescription: p.shortDescription, description: p.description,
    colors: (p.variants || []).map((v: any) => ({
      id: v.colorId, name: v.colorName, hex: v.colorHex,
      images: v.images || [],
      sizes: (v.sizes || []).map((s: any) => s.name),
      stock: Object.fromEntries((v.sizes || []).map((s: any) => [s.name, s.stock])),
    })),
    details: p.details,
    rating: p.rating, reviewCount: p.reviewCount,
    reviews: p.reviews || [],
    isNew: p.flags?.isNew,
    isBestseller: p.flags?.isBestseller,
    isDeal: p.flags?.isDeal,
  } as MockProduct;
}

function toLegacyCategory(c: any): MockCategory {
  return {
    id: c.id, name: c.name, image: c.image, itemCount: c.itemCount ?? 0,
  } as MockCategory;
}

export function useStorefrontData() {
  const { products: fbProducts, loading: pLoading } = useProducts();
  const { categories: fbCategories, loading: cLoading } = useCategories();
  const { content: home } = useHomeContent();

  // Fall back to mockData if Firestore is still empty (pre-seed)
  const products = !pLoading && fbProducts.length > 0
    ? fbProducts.map(toLegacyProduct)
    : mockProducts;

  const categories = !cLoading && fbCategories.length > 0
    ? fbCategories.map(toLegacyCategory)
    : mockCategories;

  const homeTestimonials = home?.testimonials?.length
    ? home.testimonials.map((t) => ({ name: t.name, city: t.city, rating: t.rating, title: t.title, body: t.body }))
    : mockTestimonials;

  return { products, categories, homeTestimonials, loading: pLoading || cLoading };
}
