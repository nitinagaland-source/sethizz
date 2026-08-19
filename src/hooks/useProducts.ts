// src/hooks/useProducts.ts
import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, query, where, orderBy, doc, getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product } from '../types';

/**
 * Live list of all active products (for storefront).
 * If `includeInactive` is true, returns everything (for admin).
 */
export function useProducts(opts?: { includeInactive?: boolean; category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    if (!opts?.includeInactive) {
      q = query(collection(db, 'products'), where('flags.isActive', '==', true), orderBy('createdAt', 'desc'));
    }
    if (opts?.category) {
      q = query(collection(db, 'products'), where('category', '==', opts.category), orderBy('createdAt', 'desc'));
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) })));
        setLoading(false);
      },
      (err) => { console.error('[useProducts]', err); setLoading(false); }
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts?.includeInactive, opts?.category]);

  return { products, loading };
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const q = query(collection(db, 'products'), where('slug', '==', slug));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) { setProduct(null); setLoading(false); return; }
      const d = snap.docs[0];
      setProduct({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
      setLoading(false);
    });
    return unsub;
  }, [slug]);

  return { product, loading };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, 'id'>) };
}
