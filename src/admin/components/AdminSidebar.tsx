// src/admin/components/AdminSidebar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Star, Ticket,
  BarChart3, LayoutTemplate, Settings, LogOut, ChevronLeft, ChevronRight, Boxes,
} from 'lucide-react';
import { signOut } from '../../lib/auth';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
  { to: '/admin/content', label: 'Site Content', icon: LayoutTemplate, adminOnly: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
];

export const AdminSidebar: React.FC<{ mobileOpen: boolean; onMobileClose: () => void }> = ({
  mobileOpen, onMobileClose,
}) => {
  const { isAdmin, admin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/admin/login');
  }

  const items = NAV.filter((n) => !n.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onMobileClose} />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-[#EEEEF0] flex flex-col transition-all duration-300',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[248px]',
          mobileOpen ? 'w-[248px] translate-x-0' : 'w-[248px] -translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-[#EEEEF0]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center text-white font-black">
            S
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-black text-[#0F0F14] tracking-tight text-sm">SETHIZZZ</div>
              <div className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold">Admin</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onMobileClose}
                    className={({ isActive }) => [
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-[#7C3AED]/10 to-[#F97316]/5 text-[#7C3AED]'
                        : 'text-[#4A4A55] hover:bg-[#F7F7F9] hover:text-[#0F0F14]',
                    ].join(' ')}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#7C3AED]' : ''}`} strokeWidth={2} />
                        {!collapsed && <span>{item.label}</span>}
                        {!collapsed && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / user */}
        <div className="border-t border-[#EEEEF0] p-3 space-y-1">
          {!collapsed && admin && (
            <div className="px-3 py-2 rounded-lg bg-[#F7F7F9] mb-1">
              <div className="text-xs font-bold text-[#0F0F14] truncate">{admin.name || 'Admin'}</div>
              <div className="text-[10px] text-[#6B6B76] uppercase tracking-wider">{admin.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex w-full items-center justify-center py-2 rounded-xl text-[#6B6B76] hover:bg-[#F7F7F9] transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
