// src/admin/pages/CustomersPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Customer } from '../../types';
import { Search, User, ShoppingBag, Heart, Loader2, ChevronDown, Ban, RotateCcw } from 'lucide-react';

const TIERS = ['', 'Bronze', 'Silver', 'Gold', 'Platinum'];

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateTier = async (id: string, tier: string) => {
    setActing(id);
    await updateDoc(doc(db, 'users', id), { clubTier: tier || null });
    setActing(null);
  };

  const toggleBan = async (c: Customer) => {
    setActing(c.id);
    await updateDoc(doc(db, 'users', c.id), { banned: !(c as any).banned });
    setActing(null);
  };

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search);
    const matchTier = !tierFilter || c.clubTier === tierFilter;
    return matchSearch && matchTier;
  });

  const tierColor: Record<string, string> = {
    Bronze: 'bg-orange-100 text-orange-700', Silver: 'bg-zinc-100 text-zinc-700',
    Gold: 'bg-yellow-100 text-yellow-700', Platinum: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Customers</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{customers.length} registered customers</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          {TIERS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {['Customer', 'Contact', 'Club Tier', 'Wishlist', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors ${(c as any).banned ? 'bg-red-50/50' : 'hover:bg-zinc-50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.avatar ? <img src={c.avatar} className="w-8 h-8 rounded-full object-cover border border-zinc-200" alt="" /> : <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"><User size={14} className="text-zinc-400" /></div>}
                      <div>
                        <p className="font-medium text-zinc-800">{c.name || 'Unnamed'}</p>
                        {(c as any).banned && <p className="text-xs text-red-500 font-semibold">Banned</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-700">{c.email}</p>
                    {c.phone && <p className="text-xs text-zinc-400">{c.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.clubTier && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tierColor[c.clubTier] || 'bg-zinc-100 text-zinc-600'}`}>{c.clubTier}</span>}
                      <select
                        value={c.clubTier || ''}
                        onChange={e => updateTier(c.id, e.target.value)}
                        disabled={acting === c.id}
                        className="h-7 px-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/30 disabled:opacity-60"
                      >
                        <option value="">No tier</option>
                        {TIERS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-zinc-500 text-xs">
                      <Heart size={12} /> {c.wishlist?.length || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {c.createdAt ? new Date((c.createdAt as any).seconds ? (c.createdAt as any).toDate() : c.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleBan(c)} disabled={acting === c.id}
                      className={`flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 ${(c as any).banned ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                      {acting === c.id ? <Loader2 size={11} className="animate-spin" /> : (c as any).banned ? <><RotateCcw size={11} /> Restore</> : <><Ban size={11} /> Ban</>}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
