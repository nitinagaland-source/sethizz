// src/admin/pages/OrdersListPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, Timestamp, arrayUnion, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Order, OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, XCircle, Eye, X, Download, Loader2, Search, Printer, RotateCcw, StickyNote, ChevronDown } from 'lucide-react';

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Packed', value: 'packed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700', packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700', returned: 'bg-zinc-100 text-zinc-600',
};

const toDate = (ts: any) => ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);

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
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('packed');
  const [bulkActing, setBulkActing] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
      o.guestEmail?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(search);
    const matchDate = (!dateFrom || toDate(o.createdAt) >= new Date(dateFrom)) &&
      (!dateTo || toDate(o.createdAt) <= new Date(dateTo + 'T23:59:59'));
    return matchTab && matchSearch && matchDate;
  });

  const updateStatus = async (order: Order, status: OrderStatus, note?: string) => {
    setUpdating(true);
    await updateDoc(doc(db, 'orders', order.id), {
      orderStatus: status,
      timeline: arrayUnion({ status, at: Timestamp.now(), by: 'admin', note: note || '' }),
      updatedAt: Timestamp.now(),
    });
    setUpdating(false);
    if (selected?.id === order.id) setSelected({ ...selected, orderStatus: status });
  };

  const markRefunded = async (order: Order) => {
    if (!confirm('Mark this order as refunded? This cannot be undone.')) return;
    setUpdating(true);
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'refunded',
      timeline: arrayUnion({ status: 'refunded', at: Timestamp.now(), by: 'admin', note: 'Marked as refunded by admin' }),
      updatedAt: Timestamp.now(),
    });
    setUpdating(false);
  };

  const saveTracking = async () => {
    if (!selected) return;
    setUpdating(true);
    await updateDoc(doc(db, 'orders', selected.id), {
      trackingNumber: tracking, courier,
      timeline: arrayUnion({ status: 'shipped', at: Timestamp.now(), by: 'admin', note: `Tracking: ${courier} ${tracking}` }),
      updatedAt: Timestamp.now(),
    });
    if (selected.orderStatus === 'confirmed' || selected.orderStatus === 'packed') {
      await updateDoc(doc(db, 'orders', selected.id), { orderStatus: 'shipped' });
    }
    setUpdating(false);
  };

  const saveNote = async () => {
    if (!selected || !adminNote.trim()) return;
    setUpdating(true);
    await updateDoc(doc(db, 'orders', selected.id), { adminNotes: adminNote, updatedAt: Timestamp.now() });
    setUpdating(false);
  };

  const bulkUpdateStatus = async () => {
    if (!bulkSelected.size) return;
    setBulkActing(true);
    await Promise.all(Array.from(bulkSelected).map(id =>
      updateDoc(doc(db, 'orders', id), {
        orderStatus: bulkStatus,
        timeline: arrayUnion({ status: bulkStatus, at: Timestamp.now(), by: 'admin', note: 'Bulk update' }),
        updatedAt: Timestamp.now(),
      })
    ));
    setBulkSelected(new Set()); setBulkActing(false);
  };

  const exportCSV = () => {
    const rows = [['Order #', 'Customer', 'Email', 'Phone', 'City', 'State', 'Total', 'Discount', 'Items', 'Status', 'Payment', 'Tracking', 'Date']];
    filtered.forEach(o => rows.push([
      o.orderNumber || o.id,
      o.shippingAddress?.name || '',
      o.guestEmail || o.shippingAddress?.email || '',
      o.shippingAddress?.phone || '',
      o.shippingAddress?.city || '',
      o.shippingAddress?.state || '',
      `Rs.${o.total || 0}`,
      `Rs.${o.discount || 0}`,
      String(o.items?.length || 0),
      o.orderStatus,
      o.paymentStatus,
      o.trackingNumber || '',
      o.createdAt ? toDate(o.createdAt).toLocaleDateString('en-IN') : '',
    ]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const printInvoice = (order: Order) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice - ${order.orderNumber || order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a1a; max-width: 700px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; border-bottom: 2px solid #7C3AED; padding-bottom: 16px; }
        .brand { font-size: 24px; font-weight: 900; color: #7C3AED; }
        h2 { margin: 0 0 4px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f4f4f8; text-align: left; padding: 8px 12px; font-size: 12px; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
        .total-row { font-weight: bold; font-size: 15px; }
        .footer { margin-top: 32px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 16px; }
        @media print { button { display: none; } }
      </style></head><body>
      <div class="header">
        <div><div class="brand">SETHIZZZ</div><div style="font-size:12px;color:#888">Dimapur, Nagaland · hello@sethizzz.com</div></div>
        <div style="text-align:right"><h2>INVOICE</h2><div style="font-size:13px;color:#666">Order: ${order.orderNumber || order.id}</div><div style="font-size:12px;color:#888">${order.createdAt ? toDate(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
        <div><h3 style="font-size:13px;color:#888;margin-bottom:8px">BILL TO</h3>
          <div><strong>${order.shippingAddress?.name || ''}</strong><br>
          ${order.shippingAddress?.line1 || ''}<br>
          ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.pincode || ''}<br>
          ${order.shippingAddress?.phone || ''}<br>
          ${order.guestEmail || ''}</div>
        </div>
        <div><h3 style="font-size:13px;color:#888;margin-bottom:8px">PAYMENT</h3>
          <div>Method: ${order.paymentMethod?.toUpperCase() || ''}<br>
          Status: <strong>${order.paymentStatus || ''}</strong><br>
          ${order.razorpayPaymentId ? `Razorpay ID: ${order.razorpayPaymentId}` : ''}
          ${order.trackingNumber ? `<br>Tracking: ${order.courier || ''} ${order.trackingNumber}` : ''}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>Color / Size</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
        <tbody>
          ${order.items?.map(item => `<tr><td>${item.name}</td><td>${item.color} / ${item.size}</td><td style="text-align:right">${item.quantity}</td><td style="text-align:right">Rs.${item.price.toLocaleString('en-IN')}</td><td style="text-align:right">Rs.${(item.price * item.quantity).toLocaleString('en-IN')}</td></tr>`).join('') || ''}
          <tr><td colspan="4" style="text-align:right;font-size:12px;color:#888">Subtotal</td><td style="text-align:right">Rs.${(order.subtotal || 0).toLocaleString('en-IN')}</td></tr>
          ${order.discount ? `<tr><td colspan="4" style="text-align:right;color:#16a34a">Discount ${order.coupon?.code ? `(${order.coupon.code})` : ''}</td><td style="text-align:right;color:#16a34a">-Rs.${order.discount.toLocaleString('en-IN')}</td></tr>` : ''}
          <tr><td colspan="4" style="text-align:right;font-size:12px;color:#888">Shipping</td><td style="text-align:right">${order.shipping === 0 ? 'FREE' : `Rs.${order.shipping}`}</td></tr>
          <tr class="total-row"><td colspan="4" style="text-align:right">TOTAL</td><td style="text-align:right;color:#7C3AED">Rs.${(order.total || 0).toLocaleString('en-IN')}</td></tr>
        </tbody>
      </table>
      <div class="footer">Thank you for shopping with SETHIZZZ. For any queries, contact hello@sethizzz.com</div>
      <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#7C3AED;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px">Print / Save as PDF</button>
      </body></html>
    `);
    win.document.close();
  };

  const openOrder = (o: Order) => {
    setSelected(o); setTracking(o.trackingNumber || ''); setCourier(o.courier || ''); setAdminNote(o.adminNotes || '');
  };

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0);
  const allFilteredSelected = filtered.length > 0 && filtered.every(o => bulkSelected.has(o.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{orders.length} orders · Rs.{totalRevenue.toLocaleString('en-IN')} revenue</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Bulk Actions */}
      {bulkSelected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl">
          <span className="text-sm font-semibold text-[#7C3AED]">{bulkSelected.size} selected</span>
          <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value as OrderStatus)} className="h-8 px-2 text-xs rounded-lg border border-zinc-200 focus:outline-none">
            {(['confirmed','packed','shipped','delivered','cancelled'] as OrderStatus[]).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <button onClick={bulkUpdateStatus} disabled={bulkActing} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold disabled:opacity-60">
            {bulkActing ? <Loader2 size={12} className="animate-spin" /> : null} Update Status
          </button>
          <button onClick={() => setBulkSelected(new Set())} className="ml-auto text-zinc-400 hover:text-zinc-600"><X size={14} /></button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUS_TABS.slice(1).map(tab => {
          const count = orders.filter(o => o.orderStatus === tab.value).length;
          return (
            <div key={tab.value} className={`rounded-xl border p-3 cursor-pointer transition-all ${activeTab === tab.value ? 'border-[#7C3AED] bg-purple-50' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`} onClick={() => setActiveTab(tab.value)}>
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
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search order, customer, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none text-zinc-600" title="From date" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none text-zinc-600" title="To date" />
        {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-xs text-zinc-400 hover:text-zinc-600"><X size={14} /></button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allFilteredSelected} onChange={() => allFilteredSelected ? setBulkSelected(new Set()) : setBulkSelected(new Set(filtered.map(o => o.id)))} className="w-3.5 h-3.5 accent-[#7C3AED]" />
                </th>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(o => (
                <tr key={o.id} className={`transition-colors ${bulkSelected.has(o.id) ? 'bg-purple-50/50' : 'hover:bg-zinc-50'}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={bulkSelected.has(o.id)} onChange={() => { const n = new Set(bulkSelected); n.has(o.id) ? n.delete(o.id) : n.add(o.id); setBulkSelected(n); }} className="w-3.5 h-3.5 accent-[#7C3AED]" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-800">{o.orderNumber || o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-800">{o.shippingAddress?.name || 'Guest'}</p>
                    <p className="text-xs text-zinc-400">{o.shippingAddress?.city}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-800">Rs.{(o.total || 0).toLocaleString('en-IN')}</p>
                    <p className={`text-xs font-medium ${o.paymentStatus === 'paid' ? 'text-emerald-600' : o.paymentStatus === 'refunded' ? 'text-red-500' : 'text-amber-600'}`}>{o.paymentStatus}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.orderStatus] || 'bg-zinc-100 text-zinc-600'}`}>{o.orderStatus}</span>
                    {o.trackingNumber && <p className="text-xs text-zinc-400 mt-0.5">🚚 {o.courier}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{o.createdAt ? toDate(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openOrder(o)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800" title="View Detail"><Eye size={14} /></button>
                      <button onClick={() => printInvoice(o)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800" title="Print Invoice"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelected(null)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-zinc-900">#{selected.orderNumber || selected.id.slice(0, 8)}</h2>
                <p className="text-xs text-zinc-500">
                  {selected.createdAt ? toDate(selected.createdAt).toLocaleString('en-IN') : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => printInvoice(selected)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
                  <Printer size={13} /> Invoice
                </button>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-zinc-100"><X size={16} /></button>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Status Update */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                    <button key={s} onClick={() => updateStatus(selected, s)} disabled={updating || selected.orderStatus === s}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all disabled:opacity-50 ${selected.orderStatus === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {selected.paymentStatus !== 'refunded' && (
                  <button onClick={() => markRefunded(selected)} disabled={updating} className="mt-2 flex items-center gap-1.5 h-7 px-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-60">
                    <RotateCcw size={12} /> Mark as Refunded
                  </button>
                )}
                {selected.paymentStatus === 'refunded' && (
                  <p className="mt-2 text-xs text-red-500 font-semibold">✓ Refunded</p>
                )}
              </div>

              {/* Tracking */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase">Shipping & Tracking</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Courier</label>
                    <input className="w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" value={courier} onChange={e => setCourier(e.target.value)} placeholder="Delhivery, DTDC, Ekart..." />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Tracking Number</label>
                    <input className="w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="AWB / Consignment #" />
                  </div>
                </div>
                <button onClick={saveTracking} disabled={updating || (!tracking && !courier)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 disabled:opacity-60">
                  {updating ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />} Save Tracking
                </button>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase">Admin Notes</p>
                <textarea className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none" rows={3}
                  value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Internal notes about this order..." />
                <button onClick={saveNote} disabled={updating || !adminNote.trim()} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 disabled:opacity-60">
                  <StickyNote size={12} /> Save Note
                </button>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Order Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-zinc-200 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.color} · {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-800 flex-shrink-0">Rs.{(item.price * item.quantity).toLocaleString('en-IN')}</p>
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
                  {selected.shippingAddress?.landmark && <p className="text-zinc-500">Near: {selected.shippingAddress.landmark}</p>}
                  <p>{selected.shippingAddress?.city}, {selected.shippingAddress?.state} – {selected.shippingAddress?.pincode}</p>
                  <p className="text-zinc-500 font-medium">{selected.shippingAddress?.phone}</p>
                  {selected.guestEmail && <p className="text-zinc-500">{selected.guestEmail}</p>}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Payment Summary</p>
                <div className="p-3 rounded-xl bg-zinc-50 text-sm space-y-2">
                  <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>Rs.{(selected.subtotal || 0).toLocaleString('en-IN')}</span></div>
                  {selected.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount {selected.coupon?.code ? `(${selected.coupon.code})` : ''}</span>
                      <span>-Rs.{selected.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600"><span>Shipping</span><span>{selected.shipping === 0 ? 'Free' : `Rs.${selected.shipping}`}</span></div>
                  {selected.tax > 0 && <div className="flex justify-between text-zinc-600"><span>Tax (GST)</span><span>Rs.{selected.tax.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between font-bold text-zinc-800 border-t border-zinc-200 pt-2"><span>TOTAL</span><span className="text-[#7C3AED]">Rs.{(selected.total || 0).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs text-zinc-500 pt-1">
                    <span>{selected.paymentMethod?.toUpperCase()}</span>
                    <span className={`font-semibold ${selected.paymentStatus === 'paid' ? 'text-emerald-600' : selected.paymentStatus === 'refunded' ? 'text-red-500' : 'text-amber-600'}`}>{selected.paymentStatus?.toUpperCase()}</span>
                  </div>
                  {selected.razorpayPaymentId && <p className="text-xs text-zinc-400 font-mono">{selected.razorpayPaymentId}</p>}
                </div>
              </div>

              {/* Timeline */}
              {selected.timeline?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase mb-3">Order Timeline</p>
                  <div className="relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-zinc-200" />
                    <div className="space-y-4">
                      {[...selected.timeline].reverse().map((t, i) => (
                        <div key={i} className="flex items-start gap-4 pl-8 relative">
                          <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 border-[#7C3AED] bg-white top-0.5" />
                          <div>
                            <span className="font-semibold capitalize text-zinc-800 text-sm">{t.status}</span>
                            {t.note && <span className="text-zinc-500 text-xs"> · {t.note}</span>}
                            <p className="text-xs text-zinc-400 mt-0.5">{t.at ? toDate(t.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}{t.by ? ` · by ${t.by}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
