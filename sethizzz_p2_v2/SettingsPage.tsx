// src/admin/pages/SettingsPage.tsx
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, updateDoc, deleteDoc, query, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { StoreSettings } from '../../types';
import { Save, Loader2, CheckCircle2, Truck, Percent, Phone, Bell, CreditCard, Users, Plus, Trash2, Eye, EyeOff, Shield } from 'lucide-react';

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const labelCls = "block text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1.5";

const DEFAULT: StoreSettings = {
  shipping: { freeShippingThreshold: 1499, standardRate: 0, priorityRate: 199, codFee: 49, standardEtaDays: '4-7 business days', priorityEtaDays: '2-3 business days' },
  tax: { gstPercent: 18, taxInclusive: true },
  contact: { email: 'hello@sethizzz.com', phone: '', whatsapp: '' },
  notifications: { emailOrderConfirmation: true, whatsappOrderConfirmation: false, emailLowStockAlert: true, lowStockThreshold: 5 },
  currency: 'INR', currencySymbol: '₹',
};

type Section = 'shipping' | 'tax' | 'contact' | 'notifications' | 'payment' | 'admins';

function SectionCard({ title, icon, section, saving, saved, onSave, children }: {
  title: string; icon: React.ReactNode; section: Section;
  saving: Section | null; saved: Section | null; onSave: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[#7C3AED]">{icon}</div>
          <h2 className="font-semibold text-zinc-800">{title}</h2>
        </div>
        {section !== 'admins' && (
          <button onClick={onSave} disabled={saving === section} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-60 transition-all">
            {saving === section ? <Loader2 size={14} className="animate-spin" /> : saved === section ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saving === section ? 'Saving...' : saved === section ? 'Saved!' : 'Save'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Section | null>(null);
  const [saved, setSaved] = useState<Section | null>(null);
  const [razorpayTestKey, setRazorpayTestKey] = useState('');
  const [razorpayLiveKey, setRazorpayLiveKey] = useState('');
  const [razorpayMode, setRazorpayMode] = useState<'test' | 'live'>('test');
  const [showKeys, setShowKeys] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'staff'>('staff');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removingAdmin, setRemovingAdmin] = useState<string | null>(null);

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'site_content', 'settings'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({ ...DEFAULT, ...data });
        setRazorpayTestKey(data.razorpayTestKey || '');
        setRazorpayLiveKey(data.razorpayLiveKey || '');
        setRazorpayMode(data.razorpayMode || 'test');
      }
      setLoading(false);
    });
    const unsub2 = onSnapshot(collection(db, 'admins'), snap => {
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const saveSection = async (section: Section) => {
    setSaving(section);
    const data: any = { ...settings };
    if (section === 'payment') {
      data.razorpayTestKey = razorpayTestKey;
      data.razorpayLiveKey = razorpayLiveKey;
      data.razorpayMode = razorpayMode;
    }
    await setDoc(doc(db, 'site_content', 'settings'), data, { merge: true });
    setSaving(null); setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  const upd = (path: string[], value: any) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAddingAdmin(true);
    await addDoc(collection(db, 'admins'), {
      email: newAdminEmail.trim(),
      name: newAdminName.trim() || newAdminEmail.split('@')[0],
      role: newAdminRole,
      createdAt: Timestamp.now(),
    });
    setNewAdminEmail(''); setNewAdminName(''); setNewAdminRole('staff'); setAddingAdmin(false);
  };

  const removeAdmin = async (id: string) => {
    if (!confirm('Remove this admin? They will lose access immediately.')) return;
    setRemovingAdmin(id);
    await deleteDoc(doc(db, 'admins', id));
    setRemovingAdmin(null);
  };

  const updateAdminRole = async (id: string, role: string) => {
    await updateDoc(doc(db, 'admins', id), { role });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Store-wide configuration — changes take effect immediately</p>
      </div>

      {/* Shipping */}
      <SectionCard title="Shipping" icon={<Truck size={16} />} section="shipping" saving={saving} saved={saved} onSave={() => saveSection('shipping')}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Free Shipping Above (Rs.)</label><input className={inputCls} type="number" value={settings.shipping.freeShippingThreshold} onChange={e => upd(['shipping', 'freeShippingThreshold'], Number(e.target.value))} /></div>
          <div><label className={labelCls}>Standard Rate (Rs.) — 0 = Free</label><input className={inputCls} type="number" value={settings.shipping.standardRate} onChange={e => upd(['shipping', 'standardRate'], Number(e.target.value))} /></div>
          <div><label className={labelCls}>Priority Rate (Rs.)</label><input className={inputCls} type="number" value={settings.shipping.priorityRate} onChange={e => upd(['shipping', 'priorityRate'], Number(e.target.value))} /></div>
          <div><label className={labelCls}>COD Fee (Rs.)</label><input className={inputCls} type="number" value={settings.shipping.codFee} onChange={e => upd(['shipping', 'codFee'], Number(e.target.value))} /></div>
          <div><label className={labelCls}>Standard ETA</label><input className={inputCls} value={settings.shipping.standardEtaDays} onChange={e => upd(['shipping', 'standardEtaDays'], e.target.value)} placeholder="4-7 business days" /></div>
          <div><label className={labelCls}>Priority ETA</label><input className={inputCls} value={settings.shipping.priorityEtaDays} onChange={e => upd(['shipping', 'priorityEtaDays'], e.target.value)} placeholder="2-3 business days" /></div>
        </div>
      </SectionCard>

      {/* Tax */}
      <SectionCard title="Tax (GST)" icon={<Percent size={16} />} section="tax" saving={saving} saved={saved} onSave={() => saveSection('tax')}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>GST Percent (%)</label><input className={inputCls} type="number" value={settings.tax.gstPercent} onChange={e => upd(['tax', 'gstPercent'], Number(e.target.value))} /></div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.tax.taxInclusive} onChange={e => upd(['tax', 'taxInclusive'], e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
              <span className="text-sm font-medium text-zinc-700">Prices include GST</span>
            </label>
          </div>
        </div>
        <p className="text-xs text-zinc-400">If inclusive, product prices shown are tax-included. If exclusive, GST is added at checkout.</p>
      </SectionCard>

      {/* Contact */}
      <SectionCard title="Contact & Support" icon={<Phone size={16} />} section="contact" saving={saving} saved={saved} onSave={() => saveSection('contact')}>
        <div className="space-y-3">
          <div><label className={labelCls}>Support Email</label><input className={inputCls} type="email" value={settings.contact.email} onChange={e => upd(['contact', 'email'], e.target.value)} placeholder="hello@sethizzz.com" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.contact.phone} onChange={e => upd(['contact', 'phone'], e.target.value)} placeholder="+91 9999999999" /></div>
            <div><label className={labelCls}>WhatsApp</label><input className={inputCls} value={settings.contact.whatsapp} onChange={e => upd(['contact', 'whatsapp'], e.target.value)} placeholder="+91 9999999999" /></div>
          </div>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" icon={<Bell size={16} />} section="notifications" saving={saving} saved={saved} onSave={() => saveSection('notifications')}>
        <div className="space-y-4">
          {[
            { key: 'emailOrderConfirmation', label: 'Email order confirmation to customer' },
            { key: 'whatsappOrderConfirmation', label: 'WhatsApp order confirmation to customer' },
            { key: 'emailLowStockAlert', label: 'Email low-stock alerts to admin' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={(settings.notifications as any)[key]} onChange={e => upd(['notifications', key], e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
              <span className="text-sm text-zinc-700">{label}</span>
            </label>
          ))}
          <div className="flex items-center gap-4">
            <div style={{ maxWidth: 140 }}><label className={labelCls}>Low Stock Threshold</label><input className={inputCls} type="number" value={settings.notifications.lowStockThreshold} onChange={e => upd(['notifications', 'lowStockThreshold'], Number(e.target.value))} /></div>
          </div>
        </div>
      </SectionCard>

      {/* Razorpay */}
      <SectionCard title="Payment — Razorpay" icon={<CreditCard size={16} />} section="payment" saving={saving} saved={saved} onSave={() => saveSection('payment')}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-700">Mode:</span>
            <div className="flex gap-2">
              {(['test', 'live'] as const).map(m => (
                <button key={m} onClick={() => setRazorpayMode(m)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${razorpayMode === m ? (m === 'live' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white') : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>{m}</button>
              ))}
            </div>
            {razorpayMode === 'live' && <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">● LIVE — Real payments active</span>}
            {razorpayMode === 'test' && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">⚠ TEST MODE</span>}
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Test Key ID (rzp_test_...)</label>
              <div className="relative">
                <input className={inputCls} type={showKeys ? 'text' : 'password'} value={razorpayTestKey} onChange={e => setRazorpayTestKey(e.target.value)} placeholder="rzp_test_xxxxxxxxxx" />
                <button onClick={() => setShowKeys(!showKeys)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">{showKeys ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Live Key ID (rzp_live_...)</label>
              <div className="relative">
                <input className={inputCls} type={showKeys ? 'text' : 'password'} value={razorpayLiveKey} onChange={e => setRazorpayLiveKey(e.target.value)} placeholder="rzp_live_xxxxxxxxxx" />
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-400">Never share your secret key. Only store the Key ID here — configure the Secret in Vercel environment variables.</p>
        </div>
      </SectionCard>

      {/* Admin Users */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#7C3AED]" />
          <h2 className="font-semibold text-zinc-800">Admin Users</h2>
        </div>
        <p className="text-xs text-zinc-400">Manage who has access to this admin panel. Changes take effect on next login.</p>

        {/* Add Admin */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
          <p className="text-xs font-semibold text-zinc-600 uppercase">Invite New Admin</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-zinc-500 mb-1 block">Name</label><input className={inputCls} value={newAdminName} onChange={e => setNewAdminName(e.target.value)} placeholder="Full name" /></div>
            <div><label className="text-xs text-zinc-500 mb-1 block">Email</label><input className={inputCls} type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="admin@sethizzz.com" /></div>
          </div>
          <div className="flex items-center gap-3">
            <select className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none" value={newAdminRole} onChange={e => setNewAdminRole(e.target.value as any)}>
              <option value="admin">Admin — full access</option>
              <option value="staff">Staff — limited access</option>
            </select>
            <button onClick={addAdmin} disabled={addingAdmin || !newAdminEmail.trim()} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold disabled:opacity-60 hover:bg-[#6D28D9]">
              {addingAdmin ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
            </button>
          </div>
        </div>

        {/* Admin List */}
        <div className="space-y-2">
          {admins.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold text-sm flex-shrink-0">
                {a.name?.[0]?.toUpperCase() || a.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-800">{a.name}</p>
                <p className="text-xs text-zinc-400">{a.email}</p>
              </div>
              <select value={a.role} onChange={e => updateAdminRole(a.id, e.target.value)} className="h-7 px-2 text-xs rounded-lg border border-zinc-200 focus:outline-none">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              <button onClick={() => removeAdmin(a.id)} disabled={removingAdmin === a.id} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 disabled:opacity-60">
                {removingAdmin === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
          {admins.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No admins added yet</p>}
        </div>
      </div>
    </div>
  );
};
