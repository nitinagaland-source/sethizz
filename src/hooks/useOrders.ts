// src/hooks/useOrders.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Order, OrderStatus } from '../types';

export function useOrders(opts?: { userId?: string; status?: OrderStatus; limit?: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    if (opts?.userId) {
      q = query(collection(db, 'orders'), where('userId', '==', opts.userId), orderBy('createdAt', 'desc'));
    } else if (opts?.status) {
      q = query(collection(db, 'orders'), where('orderStatus', '==', opts.status), orderBy('createdAt', 'desc'));
    }

    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
      if (opts?.limit) list = list.slice(0, opts.limit);
      setOrders(list);
      setLoading(false);
    }, (err) => { console.error('[useOrders]', err); setLoading(false); });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts?.userId, opts?.status, opts?.limit]);

  return { orders, loading };
}
