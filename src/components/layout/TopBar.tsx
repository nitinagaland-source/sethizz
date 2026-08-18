// src/components/layout/TopBar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, wishlist, searchQuery, setSearchQuery } = useStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-[60px] sm:h-[72px] bg-[#0A1128] sm:bg-white/95 backdrop-blur-md border-b border-white/10 sm:border-[#EEEEF0] px-4 md:px-8 flex items-center justify-between gap-4 transition-colors">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white sm:text-[#0F0F14] transition-colors group-hover:text-[#60A5FA] sm:group-hover:text-[#1E40AF]">
              SETHIZZZ
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] sm:bg-[#1E3A8A]" />
          </Link>
        </div>

        {/* Middle: Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md relative items-center"
        >
          <Search size={16} className="absolute left-4 text-[#A1A1AA] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, categories, fits..."
            className="w-full h-10 pl-11 pr-10 rounded-full bg-[#F5F5F7] text-sm text-[#0F0F14] placeholder-[#A1A1AA] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A] border border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#A1A1AA] hover:text-[#0F0F14]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile search trigger */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 sm:text-[#52525B] sm:hover:bg-[#F5F5F7] transition-colors"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 sm:text-[#52525B] sm:hover:bg-[#F5F5F7] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={19} className={wishlist.length > 0 ? 'fill-[#EF4444] text-[#EF4444]' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 sm:text-[#52525B] sm:hover:bg-[#F5F5F7] transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-[#38BDF8] sm:bg-[#1E3A8A] text-[#0A1128] sm:text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Account (desktop) */}
          <Link
            to="/account"
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-[#52525B] hover:bg-[#F5F5F7] transition-colors"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* Mobile Search Modal Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F0F14]/40 backdrop-blur-xs flex flex-col p-4 md:hidden">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-[#EEEEF0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#0F0F14]">Search SETHIZZZ</span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] hover:bg-[#F5F5F7]"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tees, hoodies, jackets..."
                className="flex-1 h-11 px-4 rounded-xl bg-[#F5F5F7] text-sm text-[#0F0F14] outline-none border border-[#E4E4E7] focus:border-[#1E3A8A]"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#1E3A8A] text-white text-sm font-bold shadow-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
