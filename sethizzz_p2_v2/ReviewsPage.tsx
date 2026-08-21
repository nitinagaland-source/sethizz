// src/admin/pages/ReviewsPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Review } from '../../types';
import { Star, CheckCircle2, XCircle, Trash2, Loader2, Search, Edit2, Save, X, MessageSquare, ChevronDown, ChevronUp, Filter } from 'lucide-react';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [acting, setActing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Review>>({});
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkActing, setBulkActing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const uniqueProducts = Array.from(new Set(reviews.map(r => r.productId)));

  const approve = async (id: string) => { setActing(id); await updateDoc(doc(db, 'reviews', id), { approved: true }); setActing(null); };
  const reject = async (id: string) => { setActing(id); await updateDoc(doc(db, 'reviews', id), { approved: false }); setActing(null); };
  const remove = async (id: string) => { if (!confirm('Delete this review permanently?')) return; setActing(id); await deleteDoc(doc(db, 'reviews', id)); setActing(null); };

  const startEdit = (r: Review) => { setEditing(r.id); setEditForm({ title: r.title, body: r.body, rating: r.rating, author: r.author, city: r.city }); };
  const saveEdit = async (id: string) => {
    setActing(id);
    await updateDoc(doc(db, 'reviews', id), { ...editForm, updatedAt: Timestamp.now() });
    setEditing(null); setActing(null);
  };

  const saveReply = async (id: string) => {
    if (!replyText.trim()) return;
    setActing(id);
    await updateDoc(doc(db, 'reviews', id), { adminReply: replyText, adminReplyAt: Timestamp.now() });
    setReplyText(''); setReplyingTo(null); setActing(null);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulkApprove = async () => {
    setBulkActing(true);
    await Promise.all(Array.from(selected).map(id => updateDoc(doc(db, 'reviews', id), { approved: true })));
    setSelected(new Set()); setBulkActing(false);
  };
  const bulkReject = async () => {
    setBulkActing(true);
    await Promise.all(Array.from(selected).map(id => updateDoc(doc(db, 'reviews', id), { approved: false })));
    setSelected(new Set()); setBulkActing(false);
  };
  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} reviews permanently?`)) return;
    setBulkActing(true);
    await Promise.all(Array.from(selected).map(id => deleteDoc(doc(db, 'reviews', id))));
    setSelected(new Set()); setBulkActing(false);
  };

  const pendingCount = reviews.filter(r => r.approved === undefined || r.approved === null).length;
  const approvedCount = reviews.filter(r => r.approved === true).length;
  const rejectedCount = reviews.filter(r => r.approved === false).length;

  const filtered = reviews.filter(r => {
    const matchTab = tab === 'all' ||
      (tab === 'pending' && (r.approved === undefined || r.approved === null)) ||
      (tab === 'approved' && r.approved === true) ||
      (tab === 'rejected' && r.approved === false);
    const matchSearch = !search || r.author?.toLowerCase().includes(search.toLowerCase()) || r.title?.toLowerCase().includes(search.toLowerCase()) || r.body?.toLowerCase().includes(search.toLowerCase());
    const matchProduct = !productFilter || r.productId === productFilter;
    return matchTab && matchSearch && matchProduct;
  });

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Reviews</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{reviews.length} total · {pendingCount} pending · {approvedCount} approved · {rejectedCount} rejected</p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl">
          <span className="text-sm font-semibold text-[#7C3AED]">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button onClick={bulkApprove} disabled={bulkActing} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 disabled:opacity-60">
              <CheckCircle2 size={13} /> Approve All
            </button>
            <button onClick={bulkReject} disabled={bulkActing} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 disabled:opacity-60">
              <XCircle size={13} /> Reject All
            </button>
            <button onClick={bulkDelete} disabled={bulkActing} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 disabled:opacity-60">
              {bulkActing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete All
            </button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-zinc-400 hover:text-zinc-600"><X size={14} /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 flex-wrap">
          {([
            { label: `All (${reviews.length})`, value: 'all' },
            { label: `Pending (${pendingCount})`, value: 'pending' },
            { label: `Approved (${approvedCount})`, value: 'approved' },
            { label: `Rejected (${rejectedCount})`, value: 'rejected' },
          ] as {label: string; value: Tab}[]).map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${tab === t.value ? 'bg-[#7C3AED] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none max-w-[180px]" value={productFilter} onChange={e => setProductFilter(e.target.value)}>
          <option value="">All Products</option>
          {uniqueProducts.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <>
          {/* Select all */}
          {filtered.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer px-1">
              <input type="checkbox" checked={allSelected} onChange={() => allSelected ? setSelected(new Set()) : setSelected(new Set(filtered.map(r => r.id)))} className="w-3.5 h-3.5 accent-[#7C3AED]" />
              Select all {filtered.length} visible
            </label>
          )}

          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className={`bg-white rounded-2xl border transition-all ${selected.has(r.id) ? 'border-[#7C3AED] shadow-sm' : 'border-zinc-200'}`}>
                {/* Review Header */}
                <div className="flex items-start gap-3 p-5">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 accent-[#7C3AED] mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editing === r.id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Author</label>
                            <input className={inputCls} value={editForm.author || ''} onChange={e => setEditForm(p => ({...p, author: e.target.value}))} />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 mb-1 block">City</label>
                            <input className={inputCls} value={editForm.city || ''} onChange={e => setEditForm(p => ({...p, city: e.target.value}))} />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Rating</label>
                            <select className={inputCls} value={editForm.rating} onChange={e => setEditForm(p => ({...p, rating: Number(e.target.value)}))}>
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Review Title</label>
                            <input className={inputCls} value={editForm.title || ''} onChange={e => setEditForm(p => ({...p, title: e.target.value}))} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Review Body</label>
                          <textarea className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none" rows={3} value={editForm.body || ''} onChange={e => setEditForm(p => ({...p, body: e.target.value}))} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(r.id)} disabled={acting === r.id} className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold disabled:opacity-60">
                            {acting === r.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Changes
                          </button>
                          <button onClick={() => setEditing(null)} className="h-8 px-3 rounded-lg border border-zinc-200 text-xs text-zinc-600">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-semibold text-zinc-800">{r.author}</span>
                          {r.city && <span className="text-xs text-zinc-400">{r.city}</span>}
                          {r.verified && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">✓ Verified Purchase</span>}
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${r.approved === true ? 'bg-emerald-100 text-emerald-700' : r.approved === false ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.approved === true ? 'Approved' : r.approved === false ? 'Rejected' : 'Pending'}
                          </span>
                          <span className="text-xs text-zinc-400 ml-auto">{r.productId}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= (r.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />)}
                          <span className="text-xs text-zinc-500 ml-1">{r.rating}/5</span>
                        </div>
                        <p className="font-semibold text-zinc-800 text-sm mb-1">{r.title}</p>
                        <p className="text-sm text-zinc-600 leading-relaxed">{r.body}</p>
                        {(r as any).adminReply && (
                          <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-xs font-semibold text-purple-700 mb-1">Admin Reply</p>
                            <p className="text-sm text-zinc-700">{(r as any).adminReply}</p>
                          </div>
                        )}
                        <p className="text-xs text-zinc-400 mt-2">
                          {r.createdAt ? new Date((r.createdAt as any).seconds ? (r.createdAt as any).toDate() : r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {editing !== r.id && (
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {r.approved !== true && (
                        <button onClick={() => approve(r.id)} disabled={acting === r.id} title="Approve"
                          className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 disabled:opacity-60">
                          <CheckCircle2 size={12} /> Approve
                        </button>
                      )}
                      {r.approved !== false && (
                        <button onClick={() => reject(r.id)} disabled={acting === r.id} title="Reject"
                          className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-60">
                          <XCircle size={12} /> Reject
                        </button>
                      )}
                      <button onClick={() => startEdit(r)} title="Edit"
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-zinc-50 text-zinc-600 text-xs font-semibold hover:bg-zinc-100">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => { setReplyingTo(replyingTo === r.id ? null : r.id); setReplyText((r as any).adminReply || ''); }} title="Reply"
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100">
                        <MessageSquare size={12} /> Reply
                      </button>
                      <button onClick={() => remove(r.id)} disabled={acting === r.id} title="Delete"
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 disabled:opacity-60">
                        {acting === r.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Reply Box */}
                {replyingTo === r.id && (
                  <div className="px-5 pb-5 border-t border-zinc-100 pt-4 space-y-2">
                    <p className="text-xs font-semibold text-zinc-600">Admin Reply</p>
                    <textarea className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none" rows={3}
                      value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply to this review..." />
                    <div className="flex gap-2">
                      <button onClick={() => saveReply(r.id)} disabled={acting === r.id || !replyText.trim()}
                        className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold disabled:opacity-60">
                        {acting === r.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Post Reply
                      </button>
                      <button onClick={() => setReplyingTo(null)} className="h-8 px-3 rounded-lg border border-zinc-200 text-xs text-zinc-600">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
                <p className="text-zinc-400 text-sm">No reviews in this category</p>
                {tab === 'pending' && reviews.length > 0 && <p className="text-zinc-300 text-xs mt-1">All reviews have been moderated. Click "All" to view them.</p>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
