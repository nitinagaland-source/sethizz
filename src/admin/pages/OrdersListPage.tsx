// src/admin/pages/OrdersListPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, Timestamp, arrayUnion, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Order, OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, XCircle, RotateCcw, Eye, X, ChevronDown, Download, Loader2, Search } from 'lucide-react';

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Packed', value: 'packed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-zinc-100 text-zinc-600',
};

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

export const OrdersListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [tracking, setTracking] = useState('');
  const [courier, setCourier] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'all' || o.orderStatus === activeTab;
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.guestEmail?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setUpdating(true);
    await updateDoc(doc(db, 'orders', order.id), {
      orderStatus: status,
      timeline: arrayUnion({ status, at: Timestamp.now(), by: 'admin', note: adminNote || '' }),
      updatedAt: Timestamp.now(),
    });
    setUpdating(false);
    if (selected?.id === order.id) setSelected({ ...selected, orderStatus: status });
  };

  const saveTracking = async () => {
    if (!selected) return;
    setUpdating(true);
    await updateDoc(doc(db, 'orders', selected.id), {
      trackingNumber: tracking, courier,
      updatedAt: Timestamp.now(),
    });
    setUpdating(false);
  };

  const exportCSV = () => {
    const rows = [['Order #', 'Customer', 'Email', 'Total', 'Status', 'Date']];
    filtered.forEach(o => rows.push([
      o.orderNumber || o.id,
      o.shippingAddress?.name || '',
      o.guestEmail || o.shippingAddress?.email || '',
      `Rs.${o.total}`,
      o.orderStatus,
      o.createdAt ? new Date((o.createdAt as any).seconds ? (o.createdAt as any).toDate() : o.createdAt).toLocaleDateString('en-IN') : '',
    ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click();
  };

  const openOrder = (o: Order) => {
    setSelected(o);
    setTracking(o.trackingNumber || '');
    setCourier(o.courier || '');
    setAdminNote(o.adminNotes || '');
  };

  const totalRevenue = orders.filter(o => o.orderStatus === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{orders.length} orders · Rs.{totalRevenue.toLocaleString('en-IN')} delivered revenue</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUS_TABS.slice(1).map(tab => {
          const count = orders.filter(o => o.orderStatus === tab.value).length;
          return (
            <div key={tab.value} className={`rounded-xl border p-3 cursor-pointer ${activeTab === tab.value ? 'border-[#7C3AED] bg-purple-50' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`} onClick={() => setActiveTab(tab.value)}>
              <p className="text-xs text-zinc-500 font-medium">{tab.label}</p>
              <p className="text-xl font-bold text-zinc-800 mt-0.5">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === tab.value ? 'bg-[#7C3AED] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search order # or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-800">{o.orderNumber || o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-800">{o.shippingAddress?.name || 'Guest'}</p>
                    <p className="text-xs text-zinc-400">{o.guestEmail || o.shippingAddress?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-800">Rs.{(o.total || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.orderStatus] || 'bg-zinc-100 text-zinc-600'}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {o.createdAt ? new Date((o.createdAt as any).seconds ? (o.createdAt as any).toDate() : o.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openOrder(o)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-zinc-900">Order {selected.orderNumber || selected.id.slice(0, 8)}</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-zinc-100"><X size={16} /></button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                    <button key={s} onClick={() => updateStatus(selected, s)} disabled={updating || selected.orderStatus === s}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all disabled:opacity-50 ${selected.orderStatus === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase">Tracking</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Courier</label>
                    <input className={inputCls} value={courier} onChange={e => setCourier(e.target.value)} placeholder="Delhivery, DTDC..." />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Tracking #</label>
                    <input className={inputCls} value={tracking} onChange={e => setTracking(e.target.value)} placeholder="AWB123..." />
                  </div>
                </div>
                <button onClick={saveTracking} disabled={updating} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 disabled:opacity-60">
                  {updating ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />} Save Tracking
                </button>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-zinc-200" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.color} · {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-800">Rs.{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Shipping Address</p>
                <div className="p-3 rounded-xl bg-zinc-50 text-sm text-zinc-700 space-y-0.5">
                  <p className="font-semibold">{selected.shippingAddress?.name}</p>
                  <p>{selected.shippingAddress?.line1}</p>
                  {selected.shippingAddress?.line2 && <p>{selected.shippingAddress.line2}</p>}
                  <p>{selected.shippingAddress?.city}, {selected.shippingAddress?.state} {selected.shippingAddress?.pincode}</p>
                  <p className="text-zinc-500">{selected.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Payment</p>
                <div className="p-3 rounded-xl bg-zinc-50 text-sm space-y-1.5">
                  <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>Rs.{(selected.subtotal || 0).toLocaleString('en-IN')}</span></div>
                  {selected.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-Rs.{selected.discount.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between text-zinc-600"><span>Shipping</span><span>{selected.shipping === 0 ? 'Free' : `Rs.${selected.shipping}`}</span></div>
                  <div className="flex justify-between font-bold text-zinc-800 border-t border-zinc-200 pt-1.5"><span>Total</span><span>Rs.{(selected.total || 0).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs text-zinc-500 pt-1">
                    <span>{selected.paymentMethod?.toUpperCase()}</span>
                    <span className={selected.paymentStatus === 'paid' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>{selected.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {selected.timeline?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Timeline</p>
                  <div className="space-y-2">
                    {[...selected.timeline].reverse().map((t, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold capitalize text-zinc-800">{t.status}</span>
                          {t.note && <span className="text-zinc-500"> · {t.note}</span>}
                          <p className="text-xs text-zinc-400">{t.at ? new Date((t.at as any).seconds ? (t.at as any).toDate() : t.at).toLocaleString('en-IN') : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
