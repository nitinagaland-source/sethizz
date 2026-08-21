// src/admin/pages/SettingsPage.tsx
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { StoreSettings } from '../../types';
import { Save, Loader2, CheckCircle2, Truck, Percent, Phone, Bell } from 'lucide-react';

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const labelCls = "block text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1.5";

const DEFAULT: StoreSettings = {
  shipping: { freeShippingThreshold: 1499, standardRate: 0, priorityRate: 199, codFee: 49, standardEtaDays: '4-7 business days', priorityEtaDays: '2-3 business days' },
  tax: { gstPercent: 18, taxInclusive: true },
  contact: { email: 'hello@sethizzz.com', phone: '', whatsapp: '' },
  notifications: { emailOrderConfirmation: true, whatsappOrderConfirmation: false, emailLowStockAlert: true, lowStockThreshold: 5 },
  currency: 'INR', currencySymbol: '₹',
};

function SaveBtn({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={saving} className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-60 transition-all">
      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
    </button>
  );
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'settings'), snap => {
      if (snap.exists()) setSettings({ ...DEFAULT, ...snap.data() as StoreSettings });
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveSection = async (section: string) => {
    setSaving(section);
    await setDoc(doc(db, 'site_content', 'settings'), settings, { merge: true });
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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Store-wide configuration</p>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#7C3AED]" />
            <h2 className="font-semibold text-zinc-800">Shipping</h2>
          </div>
          <SaveBtn saving={saving === 'shipping'} saved={saved === 'shipping'} onClick={() => saveSection('shipping')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Free Shipping Threshold (Rs.)</label>
            <input className={inputCls} type="number" value={settings.shipping.freeShippingThreshold} onChange={e => upd(['shipping', 'freeShippingThreshold'], Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Standard Rate (Rs.)</label>
            <input className={inputCls} type="number" value={settings.shipping.standardRate} onChange={e => upd(['shipping', 'standardRate'], Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Priority Rate (Rs.)</label>
            <input className={inputCls} type="number" value={settings.shipping.priorityRate} onChange={e => upd(['shipping', 'priorityRate'], Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>COD Fee (Rs.)</label>
            <input className={inputCls} type="number" value={settings.shipping.codFee} onChange={e => upd(['shipping', 'codFee'], Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Standard ETA</label>
            <input className={inputCls} value={settings.shipping.standardEtaDays} onChange={e => upd(['shipping', 'standardEtaDays'], e.target.value)} placeholder="4-7 business days" />
          </div>
          <div>
            <label className={labelCls}>Priority ETA</label>
            <input className={inputCls} value={settings.shipping.priorityEtaDays} onChange={e => upd(['shipping', 'priorityEtaDays'], e.target.value)} placeholder="2-3 business days" />
          </div>
        </div>
      </div>

      {/* Tax */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent size={16} className="text-[#7C3AED]" />
            <h2 className="font-semibold text-zinc-800">Tax (GST)</h2>
          </div>
          <SaveBtn saving={saving === 'tax'} saved={saved === 'tax'} onClick={() => saveSection('tax')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>GST Percent (%)</label>
            <input className={inputCls} type="number" value={settings.tax.gstPercent} onChange={e => upd(['tax', 'gstPercent'], Number(e.target.value))} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.tax.taxInclusive} onChange={e => upd(['tax', 'taxInclusive'], e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
              <span className="text-sm font-medium text-zinc-700">Prices include GST</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[#7C3AED]" />
            <h2 className="font-semibold text-zinc-800">Contact</h2>
          </div>
          <SaveBtn saving={saving === 'contact'} saved={saved === 'contact'} onClick={() => saveSection('contact')} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>Support Email</label>
            <input className={inputCls} type="email" value={settings.contact.email} onChange={e => upd(['contact', 'email'], e.target.value)} placeholder="hello@sethizzz.com" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={settings.contact.phone} onChange={e => upd(['contact', 'phone'], e.target.value)} placeholder="+91 9999999999" />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input className={inputCls} value={settings.contact.whatsapp} onChange={e => upd(['contact', 'whatsapp'], e.target.value)} placeholder="+91 9999999999" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#7C3AED]" />
            <h2 className="font-semibold text-zinc-800">Notifications</h2>
          </div>
          <SaveBtn saving={saving === 'notifications'} saved={saved === 'notifications'} onClick={() => saveSection('notifications')} />
        </div>
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
          <div>
            <label className={labelCls}>Low Stock Threshold (units)</label>
            <input className={inputCls} type="number" value={settings.notifications.lowStockThreshold} onChange={e => upd(['notifications', 'lowStockThreshold'], Number(e.target.value))} style={{ maxWidth: 120 }} />
          </div>
        </div>
      </div>
    </div>
  );
};
