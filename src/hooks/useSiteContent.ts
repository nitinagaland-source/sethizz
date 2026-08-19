// src/hooks/useSiteContent.ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FooterContent, HomeContent, StoreSettings } from '../types';

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'home'), (snap) => {
      setContent(snap.exists() ? (snap.data() as HomeContent) : null);
      setLoading(false);
    });
    return unsub;
  }, []);
  return { content, loading };
}

export function useFooterContent() {
  const [content, setContent] = useState<FooterContent | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'footer'), (snap) => {
      setContent(snap.exists() ? (snap.data() as FooterContent) : null);
    });
    return unsub;
  }, []);
  return content;
}

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'settings'), (snap) => {
      setSettings(snap.exists() ? (snap.data() as StoreSettings) : null);
    });
    return unsub;
  }, []);
  return settings;
}
