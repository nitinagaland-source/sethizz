// src/components/layout/BottomTabBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BottomTabBar: React.FC = () => {
  const { cartCount, wishlist } = useStore();

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: Package, label: 'Shop' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlist.length },
    { to: '/cart', icon: ShoppingBag, label: 'Cart', badge: cartCount },
    { to: '/account', icon: User, label: 'Account' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEEEF0] py-2 px-3 flex items-center justify-around">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-[#1E40AF] font-bold' : 'text-[#71717A] hover:text-[#0F0F14]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <tab.icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#1E40AF] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};
