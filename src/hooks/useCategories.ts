// src/hooks/useCategories.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Category } from '../types';

export function useCategories(opts?: { includeInactive?: boolean }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = opts?.includeInactive
      ? query(collection(db, 'categories'), orderBy('order', 'asc'))
      : query(collection(db, 'categories'), where('isActive', '==', true), orderBy('order', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) })));
      setLoading(false);
    }, (err) => { console.error('[useCategories]', err); setLoading(false); });
    return unsub;
  }, [opts?.includeInactive]);

  return { categories, loading };
}
