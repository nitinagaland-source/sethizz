// src/admin/pages/CouponsPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, setDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Coupon, CouponType } from '../../types';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, Loader2, Tag, TrendingUp } from 'lucide-react';

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const labelCls = "block text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1";

const EMPTY: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'> = {
  code: '', discountType: 'percent', discountValue: 10,
  minOrder: 0, maxDiscount: 0, usageLimit: 0, perUserLimit: 1,
  validFrom: '', validUntil: '', isActive: true,
  applicableCategories: [], applicableProducts: [],
};

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'coupons'), snap => {
      setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrder: c.minOrder || 0, maxDiscount: c.maxDiscount || 0,
      usageLimit: c.usageLimit || 0, perUserLimit: c.perUserLimit || 1,
      validFrom: c.validFrom ? new Date((c.validFrom as any).seconds ? (c.validFrom as any).toDate() : c.validFrom).toISOString().slice(0, 10) : '',
      validUntil: c.validUntil ? new Date((c.validUntil as any).seconds ? (c.validUntil as any).toDate() : c.validUntil).toISOString().slice(0, 10) : '',
      isActive: c.isActive, applicableCategories: c.applicableCategories || [], applicableProducts: c.applicableProducts || [],
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.code.trim() || !form.discountValue) return;
    setSaving(true);
    const code = form.code.toUpperCase().trim();
    const data: any = {
      code, discountType: form.discountType, discountValue: Number(form.discountValue),
      isActive: form.isActive, usedCount: editing?.usedCount || 0,
    };
    if (form.minOrder) data.minOrder = Number(form.minOrder);
    if (form.maxDiscount) data.maxDiscount = Number(form.maxDiscount);
    if (form.usageLimit) data.usageLimit = Number(form.usageLimit);
    if (form.perUserLimit) data.perUserLimit = Number(form.perUserLimit);
    if (form.validFrom) data.validFrom = Timestamp.fromDate(new Date(form.validFrom));
    if (form.validUntil) data.validUntil = Timestamp.fromDate(new Date(form.validUntil));
    if (!editing) data.createdAt = Timestamp.now();
    await setDoc(doc(db, 'coupons', code), data, { merge: true });
    setSaving(false); setShowModal(false);
  };

  const toggleActive = async (c: Coupon) => {
    await updateDoc(doc(db, 'coupons', c.id), { isActive: !c.isActive });
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    setDeleting(id);
    await deleteDoc(doc(db, 'coupons', id));
    setDeleting(null);
  };

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Coupons</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total · {coupons.filter(c => c.isActive).length} active</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-all">
          <Plus size={15} /> New Coupon
        </button>
      </div>

      <input className={inputCls} placeholder="Search coupon codes..." value={search} onChange={e => setSearch(e.target.value)} />

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {['Code', 'Discount', 'Min Order', 'Limits', 'Valid Until', 'Used', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-zinc-800">{c.code}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <Tag size={11} />
                      {c.discountType === 'percent' ? `${c.discountValue}%` : `Rs.${c.discountValue}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.minOrder ? `Rs.${c.minOrder}` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-600 text-xs">
                    {c.usageLimit ? `${c.usedCount}/${c.usageLimit} total` : `${c.usedCount} used`}
                    {c.perUserLimit ? ` · ${c.perUserLimit}/user` : ''}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 text-xs">
                    {c.validUntil ? new Date((c.validUntil as any).seconds ? (c.validUntil as any).toDate() : c.validUntil).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-zinc-600 text-xs"><TrendingUp size={12} />{c.usedCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c)} className="flex items-center gap-1 text-xs font-semibold">
                      {c.isActive
                        ? <><ToggleRight size={18} className="text-emerald-500" /><span className="text-emerald-600">Active</span></>
                        : <><ToggleLeft size={18} className="text-zinc-400" /><span className="text-zinc-400">Off</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"><Edit2 size={14} /></button>
                      <button onClick={() => deleteCoupon(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500">
                        {deleting === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400 text-sm">No coupons found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-zinc-900">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-zinc-100"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Code *</label>
                  <input className={inputCls} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="SAVE10" disabled={!!editing} />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value as CouponType }))}>
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Discount Value *</label>
                  <input className={inputCls} type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className={labelCls}>Min Order (Rs.)</label>
                  <input className={inputCls} type="number" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: Number(e.target.value) }))} placeholder="0 = no min" />
                </div>
                <div>
                  <label className={labelCls}>Max Discount (Rs.)</label>
                  <input className={inputCls} type="number" value={form.maxDiscount} onChange={e => setForm(p => ({ ...p, maxDiscount: Number(e.target.value) }))} placeholder="0 = no cap" />
                </div>
                <div>
                  <label className={labelCls}>Total Usage Limit</label>
                  <input className={inputCls} type="number" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: Number(e.target.value) }))} placeholder="0 = unlimited" />
                </div>
                <div>
                  <label className={labelCls}>Per User Limit</label>
                  <input className={inputCls} type="number" value={form.perUserLimit} onChange={e => setForm(p => ({ ...p, perUserLimit: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className={labelCls}>Valid From</label>
                  <input className={inputCls} type="date" value={form.validFrom as string} onChange={e => setForm(p => ({ ...p, validFrom: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Valid Until</label>
                  <input className={inputCls} type="date" value={form.validUntil as string} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-[#7C3AED]" />
                <span className="text-sm font-medium text-zinc-700">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100">
              <button onClick={() => setShowModal(false)} className="h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
