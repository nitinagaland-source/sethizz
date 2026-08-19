// src/admin/components/AdminTopBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ExternalLink, Search } from 'lucide-react';

const TITLE_MAP: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/reviews': 'Reviews',
  '/admin/coupons': 'Coupons',
  '/admin/inventory': 'Inventory',
  '/admin/analytics': 'Analytics',
  '/admin/content': 'Site Content',
  '/admin/settings': 'Settings',
};

export const AdminTopBar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  let title = TITLE_MAP[pathname] || 'Admin';
  if (pathname.startsWith('/admin/products/') && !TITLE_MAP[pathname]) title = 'Edit Product';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-[#EEEEF0] flex items-center px-4 sm:px-6 gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-lg hover:bg-[#F7F7F9] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-bold text-[#0F0F14] tracking-tight">{title}</h1>
      </div>

      <Link
        to="/"
        target="_blank"
        rel="noopener"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-[#4A4A55] hover:bg-[#F7F7F9] transition-colors"
      >
        View site <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </header>
  );
};
