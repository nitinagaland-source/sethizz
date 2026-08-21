// src/admin/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Order, Customer } from '../../types';
import { TrendingUp, ShoppingBag, Users, Tag, Loader2, IndianRupee } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly';

const toDate = (ts: any): Date => ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);

export const AnalyticsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('monthly');

  useEffect(() => {
    let done = 0;
    const checkDone = () => { if (++done === 2) setLoading(false); };
    const u1 = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))); checkDone();
    });
    const u2 = onSnapshot(collection(db, 'users'), snap => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer))); checkDone();
    });
    return () => { u1(); u2(); };
  }, []);

  const paid = orders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = paid.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = paid.length ? Math.round(totalRevenue / paid.length) : 0;

  // Orders by status
  const byStatus = ['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map(s => ({
    status: s, count: orders.filter(o => o.orderStatus === s).length,
  }));

  // Revenue by period
  const getKey = (date: Date, p: Period) => {
    if (p === 'daily') return date.toLocaleDateString('en-IN');
    if (p === 'weekly') {
      const d = new Date(date); d.setDate(d.getDate() - d.getDay());
      return `Week of ${d.toLocaleDateString('en-IN')}`;
    }
    return `${date.toLocaleString('en-IN', { month: 'short' })} ${date.getFullYear()}`;
  };

  const revenueMap = new Map<string, number>();
  paid.forEach(o => {
    if (!o.createdAt) return;
    const k = getKey(toDate(o.createdAt), period);
    revenueMap.set(k, (revenueMap.get(k) || 0) + (o.total || 0));
  });
  const revenueData = Array.from(revenueMap.entries()).slice(0, 12).reverse();

  // Top products
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
  paid.forEach(o => o.items?.forEach(item => {
    const existing = productMap.get(item.productId) || { name: item.name, qty: 0, revenue: 0 };
    productMap.set(item.productId, { name: item.name, qty: existing.qty + item.quantity, revenue: existing.revenue + item.price * item.quantity });
  }));
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Coupon usage
  const couponMap = new Map<string, { count: number; revenue: number }>();
  paid.forEach(o => { if (o.coupon?.code) { const e = couponMap.get(o.coupon.code) || { count: 0, revenue: 0 }; couponMap.set(o.coupon.code, { count: e.count + 1, revenue: e.revenue + (o.total || 0) }); } });
  const couponData = Array.from(couponMap.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 5);

  // Signup trend (last 6 months)
  const signupMap = new Map<string, number>();
  customers.forEach(c => {
    if (!c.createdAt) return;
    const k = getKey(toDate(c.createdAt), 'monthly');
    signupMap.set(k, (signupMap.get(k) || 0) + 1);
  });

  const STATUS_COLORS: Record<string, string> = {
    confirmed: '#3B82F6', packed: '#F59E0B', shipped: '#8B5CF6',
    delivered: '#10B981', cancelled: '#EF4444',
  };

  const maxRevenue = Math.max(...revenueData.map(([, v]) => v), 1);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Store performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `Rs.${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
          { label: 'Avg Order Value', value: `Rs.${avgOrder.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
          { label: 'Customers', value: customers.length, icon: Users, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-zinc-200 p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-zinc-800">Revenue Over Time</h2>
          <div className="flex gap-1">
            {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${period === p ? 'bg-[#7C3AED] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        {revenueData.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">No paid orders yet</p>
        ) : (
          <div className="space-y-2">
            {revenueData.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-32 flex-shrink-0 text-right">{k}</span>
                <div className="flex-1 bg-zinc-100 rounded-full h-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full flex items-center px-2 transition-all"
                    style={{ width: `${Math.max(2, (v / maxRevenue) * 100)}%` }}>
                    <span className="text-xs text-white font-bold whitespace-nowrap">Rs.{v.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-zinc-800 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {byStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[status] }} />
                <span className="text-sm capitalize text-zinc-700 flex-1">{status}</span>
                <span className="text-sm font-bold text-zinc-800">{count}</span>
                <div className="w-24 bg-zinc-100 rounded-full h-2">
                  <div className="h-full rounded-full" style={{ width: `${totalOrders ? (count / totalOrders) * 100 : 0}%`, backgroundColor: STATUS_COLORS[status] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-zinc-800 mb-4">Top Products</h2>
          {topProducts.length === 0 ? <p className="text-sm text-zinc-400">No sales data yet</p> : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 truncate">{p.name}</p>
                    <p className="text-xs text-zinc-400">{p.qty} units</p>
                  </div>
                  <span className="text-sm font-bold text-zinc-800">Rs.{p.revenue.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coupon Usage */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-zinc-800 mb-4">Top Coupons Used</h2>
          {couponData.length === 0 ? <p className="text-sm text-zinc-400">No coupons used yet</p> : (
            <div className="space-y-3">
              {couponData.map(([code, data]) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-lg">{code}</span>
                  <span className="text-sm text-zinc-600 flex-1">{data.count} uses</span>
                  <span className="text-sm font-semibold text-zinc-800">Rs.{data.revenue.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signup Trend */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-zinc-800 mb-4">Customer Signups (Monthly)</h2>
          {signupMap.size === 0 ? <p className="text-sm text-zinc-400">No signups yet</p> : (
            <div className="space-y-2">
              {Array.from(signupMap.entries()).slice(0, 6).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-28 flex-shrink-0">{k}</span>
                  <div className="flex-1 bg-zinc-100 rounded-full h-5">
                    <div className="h-full bg-blue-400 rounded-full flex items-center px-2"
                      style={{ width: `${Math.max(8, (v / Math.max(...signupMap.values())) * 100)}%` }}>
                      <span className="text-xs text-white font-bold">{v}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
