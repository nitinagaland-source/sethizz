// src/admin/pages/ReviewsPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Review } from '../../types';
import { Star, CheckCircle2, XCircle, Trash2, Loader2, Search } from 'lucide-react';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const approve = async (id: string) => {
    setActing(id);
    await updateDoc(doc(db, 'reviews', id), { approved: true });
    setActing(null);
  };

  const reject = async (id: string) => {
    setActing(id);
    await updateDoc(doc(db, 'reviews', id), { approved: false });
    setActing(null);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    setActing(id);
    await deleteDoc(doc(db, 'reviews', id));
    setActing(null);
  };

  const filtered = reviews.filter(r => {
    const matchTab = tab === 'all' || (tab === 'pending' && !r.approved && r.approved !== false) ||
      (tab === 'approved' && r.approved === true) || (tab === 'rejected' && r.approved === false);
    const matchSearch = !search || r.author?.toLowerCase().includes(search.toLowerCase()) ||
      r.title?.toLowerCase().includes(search.toLowerCase()) || r.productId?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pendingCount = reviews.filter(r => r.approved !== true && r.approved !== false).length;
  const approvedCount = reviews.filter(r => r.approved === true).length;
  const rejectedCount = reviews.filter(r => r.approved === false).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Reviews</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{reviews.length} total · {pendingCount} pending · {approvedCount} approved · {rejectedCount} rejected</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {([{ label: 'All', value: 'all' }, { label: `Pending (${pendingCount})`, value: 'pending' }, { label: 'Approved', value: 'approved' }, { label: 'Rejected', value: 'rejected' }] as {label: string; value: Tab}[]).map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${tab === t.value ? 'bg-[#7C3AED] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-zinc-800">{r.author}</span>
                    {r.city && <span className="text-xs text-zinc-400">{r.city}</span>}
                    {r.verified && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">✓ Verified</span>}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${r.approved === true ? 'bg-emerald-100 text-emerald-700' : r.approved === false ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.approved === true ? 'Approved' : r.approved === false ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />)}
                  </div>
                  <p className="font-semibold text-zinc-800 text-sm mb-1">{r.title}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{r.body}</p>
                  <p className="text-xs text-zinc-400 mt-2">Product: {r.productId} · {r.createdAt ? new Date((r.createdAt as any).seconds ? (r.createdAt as any).toDate() : r.createdAt).toLocaleDateString('en-IN') : ''}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {r.approved !== true && (
                    <button onClick={() => approve(r.id)} disabled={acting === r.id} title="Approve"
                      className="flex items-center gap-1 h-8 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 disabled:opacity-60">
                      {acting === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={13} />} Approve
                    </button>
                  )}
                  {r.approved !== false && (
                    <button onClick={() => reject(r.id)} disabled={acting === r.id} title="Reject"
                      className="flex items-center gap-1 h-8 px-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-60">
                      <XCircle size={13} /> Reject
                    </button>
                  )}
                  <button onClick={() => remove(r.id)} disabled={acting === r.id} title="Delete"
                    className="h-8 px-2 rounded-lg border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">No reviews found</div>
          )}
        </div>
      )}
    </div>
  );
};
