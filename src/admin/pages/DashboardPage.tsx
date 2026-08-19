// src/admin/pages/DashboardPage.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useCategories } from '../../hooks/useCategories';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const DashboardPage: React.FC = () => {
  const { products } = useProducts({ includeInactive: true });
  const { categories } = useCategories({ includeInactive: true });
  const { orders, loading: ordersLoading } = useOrders({ limit: 8 });

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid' || o.paymentMethod === 'cod');
    const revenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStock: Array<{ name: string; slug: string; color: string; size: string; stock: number }> = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        v.sizes.forEach((s) => {
          if (s.stock < 5) lowStock.push({ name: p.name, slug: p.slug, color: v.colorName, size: s.name, stock: s.stock });
        });
      });
    });
    return { revenue, ordersCount: orders.length, productsCount: products.length, lowStock };
  }, [products, orders]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#6B6B76]">Welcome back. Here's what's happening in your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue (recent)" value={inr(stats.revenue)} icon={IndianRupee} accent="green" />
        <StatCard label="Recent orders" value={stats.ordersCount} icon={ShoppingCart} accent="purple" />
        <StatCard label="Active products" value={stats.productsCount} icon={Package} accent="orange" />
        <StatCard label="Categories" value={categories.length} icon={Star} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-[#EEEEF0] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0F0F14]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              View all →
            </Link>
          </div>
          {ordersLoading ? (
            <div className="text-sm text-[#6B6B76] py-8 text-center">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-[#6B6B76] py-8 text-center">
              No orders yet. Once customers checkout, they'll appear here.
            </div>
          ) : (
            <div className="divide-y divide-[#EEEEF0]">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F7F9] flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-[#6B6B76]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#0F0F14] truncate">{o.orderNumber}</div>
                    <div className="text-xs text-[#6B6B76] truncate">
                      {o.items.length} item{o.items.length > 1 ? 's' : ''} · {o.shippingAddress.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#0F0F14]">{inr(o.total)}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${
                      o.orderStatus === 'delivered' ? 'text-emerald-600' :
                      o.orderStatus === 'cancelled' ? 'text-red-600' :
                      'text-[#7C3AED]'
                    }`}>{o.orderStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white border border-[#EEEEF0] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-[#0F0F14]">Low Stock</h2>
          </div>
          {stats.lowStock.length === 0 ? (
            <div className="text-sm text-[#6B6B76] py-6 text-center">Everything's fully stocked. 🎉</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats.lowStock.slice(0, 10).map((s, i) => (
                <Link
                  key={i}
                  to={`/admin/products?search=${encodeURIComponent(s.name)}`}
                  className="block p-2.5 rounded-xl bg-[#F7F7F9] hover:bg-[#EEEEF0] transition-colors"
                >
                  <div className="text-sm font-semibold text-[#0F0F14] truncate">{s.name}</div>
                  <div className="text-xs text-[#6B6B76]">
                    {s.color} · Size {s.size} · <span className="text-red-600 font-bold">{s.stock} left</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to: '/admin/products/new', label: 'Add Product', icon: Package },
          { to: '/admin/categories', label: 'Manage Categories', icon: Star },
          { to: '/admin/orders', label: 'View Orders', icon: ShoppingCart },
          { to: '/admin/content', label: 'Edit Homepage', icon: TrendingUp },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className="bg-white border border-[#EEEEF0] rounded-2xl p-4 hover:border-[#7C3AED] hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-sm font-semibold text-[#0F0F14]">{a.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
