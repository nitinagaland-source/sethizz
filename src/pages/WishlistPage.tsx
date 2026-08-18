// src/pages/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ArrowRight, Trash2 } from 'lucide-react';
import { products } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/products/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="pb-24 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#71717A]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#0F0F14]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#0F0F14] font-semibold">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex items-baseline justify-between pb-4 border-b border-[#EEEEF0]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F0F14]">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            onClick={() => {
              wishlist.forEach((id) => toggleWishlist(id));
            }}
            className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1"
          >
            <Trash2 size={13} /> Clear Wishlist
          </button>
        )}
      </div>

      {/* Content */}
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} showDiscount />
          ))}
        </div>
      ) : (
        <div className="py-20 max-w-md mx-auto text-center space-y-5 bg-white rounded-3xl p-10 border border-[#EEEEF0]">
          <div className="w-16 h-16 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F0F14]">Your wishlist is empty</h3>
            <p className="text-sm text-[#71717A] mt-1">
              Tap the heart on any product to save it here for later.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#0F0F14] text-white text-sm font-semibold hover:bg-[#27272A] transition-colors"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};
