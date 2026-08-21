// src/admin/pages/CustomersPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Customer, Order } from '../../types';
import { Search, User, Heart, Loader2, Ban, RotateCcw, X, ShoppingBag, MapPin, Mail, Phone, Download, Eye } from 'lucide-react';

const TIERS = ['', 'Bronze', 'Silver', 'Gold', 'Platinum'];
const tierColor: Record<string, string> = {
  Bronze: 'bg-orange-100 text-orange-700', Silver: 'bg-zinc-200 text-zinc-700',
  Gold: 'bg-yellow-100 text-yellow-700', Platinum: 'bg-purple-100 text-purple-700',
};

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [banFilter, setBanFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    let done = 0;
    const check = () => { if (++done === 2) setLoading(false); };
    const u1 = onSnapshot(collection(db, 'users'), snap => { setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer))); check(); });
    const u2 = onSnapshot(collection(db, 'orders'), snap => { setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))); check(); });
    return () => { u1(); u2(); };
  }, []);

  const updateTier = async (id: string, tier: string) => {
    setActing(id);
    await updateDoc(doc(db, 'users', id), { clubTier: tier || null });
    setActing(null);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, clubTier: tier } : null);
  };

  const toggleBan = async (c: Customer) => {
    setActing(c.id);
    await updateDoc(doc(db, 'users', c.id), { banned: !(c as any).banned });
    setActing(null);
  };

  const customerOrders = (customerId: string) => orders.filter(o => o.userId === customerId);
  const customerRevenue = (customerId: string) => customerOrders(customerId).filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0);

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search);
    const matchTier = !tierFilter || c.clubTier === tierFilter;
    const matchBan = banFilter === 'all' || (banFilter === 'banned' && (c as any).banned) || (banFilter === 'active' && !(c as any).banned);
    return matchSearch && matchTier && matchBan;
  });

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Phone', 'Club Tier', 'Orders', 'Revenue', 'Wishlist', 'Joined']];
    filtered.forEach(c => rows.push([
      c.name || '', c.email || '', c.phone || '', c.clubTier || '',
      String(customerOrders(c.id).length), `Rs.${customerRevenue(c.id)}`,
      String(c.wishlist?.length || 0),
      c.createdAt ? new Date((c.createdAt as any).seconds ? (c.createdAt as any).toDate() : c.createdAt).toLocaleDateString('en-IN') : '',
    ]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'customers.csv'; a.click();
  };

  const toDate = (ts: any) => ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Customers</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{customers.length} registered · {customers.filter(c => (c as any).banned).length} banned</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          {TIERS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none" value={banFilter} onChange={e => setBanFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {['Customer', 'Contact', 'Club Tier', 'Orders', 'Revenue', 'Wishlist', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(c => {
                const cOrders = customerOrders(c.id);
                const cRevenue = customerRevenue(c.id);
                return (
                  <tr key={c.id} className={`transition-colors ${(c as any).banned ? 'bg-red-50/40' : 'hover:bg-zinc-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.avatar ? <img src={c.avatar} className="w-8 h-8 rounded-full object-cover border border-zinc-200 flex-shrink-0" alt="" /> :
                          <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-[#7C3AED]">{(c.name || c.email || 'U')[0].toUpperCase()}</span></div>}
                        <div>
                          <p className="font-medium text-zinc-800">{c.name || 'Unnamed'}</p>
                          {(c as any).banned && <p className="text-xs text-red-500 font-semibold">Banned</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-700 text-xs">{c.email}</p>
                      {c.phone && <p className="text-xs text-zinc-400">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {c.clubTier && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tierColor[c.clubTier] || ''}`}>{c.clubTier}</span>}
                        <select value={c.clubTier || ''} onChange={e => updateTier(c.id, e.target.value)} disabled={acting === c.id}
                          className="h-7 px-2 text-xs rounded-lg border border-zinc-200 focus:outline-none disabled:opacity-60">
                          <option value="">No tier</option>
                          {TIERS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{cOrders.length}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{cRevenue > 0 ? `Rs.${cRevenue.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-zinc-500 text-xs"><Heart size={11} /> {c.wishlist?.length || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {c.createdAt ? toDate(c.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800" title="View Profile"><Eye size={14} /></button>
                        <button onClick={() => toggleBan(c)} disabled={acting === c.id}
                          className={`flex items-center gap-1 h-7 px-2 rounded-lg text-xs font-semibold disabled:opacity-60 transition-all ${(c as any).banned ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                          {acting === c.id ? <Loader2 size={11} className="animate-spin" /> : (c as any).banned ? <RotateCcw size={11} /> : <Ban size={11} />}
                          {(c as any).banned ? 'Restore' : 'Ban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                  {customers.length === 0 ? 'No customers yet — they\'ll appear here once people sign up on the storefront.' : 'No customers match your search.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-zinc-900">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-zinc-100"><X size={16} /></button>
            </div>
            <div className="flex-1 p-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                {selected.avatar ? <img src={selected.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200" alt="" /> :
                  <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center"><span className="text-2xl font-black text-[#7C3AED]">{(selected.name || selected.email || 'U')[0].toUpperCase()}</span></div>}
                <div>
                  <h3 className="font-bold text-zinc-800 text-lg">{selected.name || 'Unnamed'}</h3>
                  <p className="text-sm text-zinc-500">{selected.email}</p>
                  {selected.clubTier && <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tierColor[selected.clubTier] || ''}`}>{selected.clubTier} Member</span>}
                  {(selected as any).banned && <span className="inline-block mt-1 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Banned</span>}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xl font-black text-zinc-800">{customerOrders(selected.id).length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Orders</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xl font-black text-zinc-800">{customerRevenue(selected.id) > 0 ? `₹${(customerRevenue(selected.id)/1000).toFixed(1)}k` : '₹0'}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Revenue</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xl font-black text-zinc-800">{selected.wishlist?.length || 0}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Wishlist</p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Contact</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-700"><Mail size={14} className="text-zinc-400" />{selected.email}</div>
                  {selected.phone && <div className="flex items-center gap-2 text-zinc-700"><Phone size={14} className="text-zinc-400" />{selected.phone}</div>}
                  {selected.createdAt && <div className="flex items-center gap-2 text-zinc-500 text-xs"><User size={12} className="text-zinc-400" />Joined {toDate(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                </div>
              </div>

              {/* Club Tier */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Club Tier</p>
                <select value={selected.clubTier || ''} onChange={e => updateTier(selected.id, e.target.value)} className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none w-full">
                  <option value="">No tier</option>
                  {TIERS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Addresses */}
              {selected.addresses?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Saved Addresses</p>
                  <div className="space-y-2">
                    {selected.addresses.map((addr, i) => (
                      <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-sm">
                        <p className="font-semibold text-zinc-800">{addr.name}</p>
                        <p className="text-zinc-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-zinc-600">{addr.city}, {addr.state} – {addr.pincode}</p>
                        <p className="text-zinc-500 text-xs">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Order History ({customerOrders(selected.id).length})</p>
                {customerOrders(selected.id).length === 0 ? (
                  <p className="text-sm text-zinc-400">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders(selected.id).slice(0, 10).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold font-mono text-zinc-800">{o.orderNumber || o.id.slice(0, 8)}</p>
                          <p className="text-xs text-zinc-400">{o.items?.length || 0} items · {o.createdAt ? toDate(o.createdAt).toLocaleDateString('en-IN') : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-800">Rs.{(o.total || 0).toLocaleString('en-IN')}</p>
                          <span className={`text-xs font-semibold capitalize px-1.5 py-0.5 rounded-full ${o.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : o.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{o.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Account Actions</p>
                <button onClick={() => toggleBan(selected)} disabled={acting === selected.id}
                  className={`flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold w-full justify-center disabled:opacity-60 ${(selected as any).banned ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                  {acting === selected.id ? <Loader2 size={14} className="animate-spin" /> : (selected as any).banned ? <><RotateCcw size={14} /> Restore Account</> : <><Ban size={14} /> Ban Account</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
