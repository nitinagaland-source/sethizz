// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Heart, ShoppingCart, Tag, HelpCircle, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SidebarItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { cartCount, wishlist } = useStore();

  const navItems: SidebarItem[] = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: Package, label: 'Shop' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlist.length },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { to: '/shop?filter=deals', icon: Tag, label: 'Deals' },
    { to: '/account#support', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[72px] bg-white border-r border-[#EEEEF0] flex-col items-center py-6 z-40">
      {/* Brand logo icon badge */}
      <NavLink
        to="/"
        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex items-center justify-center text-white font-extrabold text-lg shadow-[0_8px_20px_-4px_rgba(30,58,138,0.5)] mb-8 transition-transform hover:scale-105"
        title="SETHIZZZ Home"
      >
        S
      </NavLink>

      {/* Main navigation icons */}
      <nav className="flex-1 flex flex-col items-center gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1E40AF]'
                  : 'text-[#71717A] hover:bg-[#F5F5F7] hover:text-[#0F0F14]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />

                {/* Badge if any */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E40AF] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}

                {/* Floating tooltip on hover */}
                <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#0F0F14] text-white text-xs font-semibold whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md z-50">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Account icon bottom */}
      <div className="pt-4 border-t border-[#EEEEF0] w-full flex justify-center">
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[#EFF6FF] text-[#1E40AF]'
                : 'text-[#71717A] hover:bg-[#F5F5F7] hover:text-[#0F0F14]'
            }`
          }
        >
          <User size={20} />
          <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#0F0F14] text-white text-xs font-semibold whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md z-50">
            Account
          </span>
        </NavLink>
      </div>
    </aside>
  );
};
