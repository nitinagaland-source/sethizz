// src/pages/CartPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Sparkles,
  Truck,
  RotateCcw,
  Shield,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartCount,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const freeShippingThreshold = 1499;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 99;

  const discountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const total = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCouponCode = (code: string) => {
    const res = applyCoupon(code);
    setCouponMessage({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    handleApplyCouponCode(couponInput);
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-6 px-4">
        <div className="w-20 h-20 rounded-3xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag size={32} strokeWidth={1.75} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-zinc-950 tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
            Explore our drops of heavyweight t-shirts, French terry hoodies, and structured essentials.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full theme-flow-btn font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
        >
          Explore Collection <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
      {/* Breadcrumb */}
      <nav
        className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-zinc-900 transition-colors uppercase tracking-wider text-[10.5px] sm:text-[11px]">
          Home
        </Link>
        <ChevronRight size={11} className="text-zinc-300 flex-shrink-0" />
        <Link to="/shop" className="hover:text-zinc-900 transition-colors uppercase tracking-wider text-[10.5px] sm:text-[11px]">
          Shop
        </Link>
        <ChevronRight size={11} className="text-zinc-300 flex-shrink-0" />
        <span className="text-zinc-950 font-bold uppercase tracking-wider text-[10.5px] sm:text-[11px]">Shopping Bag</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Shopping Bag
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-zinc-100 text-zinc-800 rounded-full border border-zinc-200/70">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 text-white shadow-xs border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <Truck size={16} className={isFreeShipping ? 'text-emerald-400' : 'text-zinc-300'} />
            <span className="font-semibold text-zinc-100 text-xs sm:text-[13px]">
              {isFreeShipping
                ? 'Unlocked: FREE Priority Air Delivery across India!'
                : `Add ${formatINR(amountNeededForFreeShipping)} more to qualify for FREE Air Shipping`}
            </span>
          </div>
          <span className="font-bold text-zinc-300 font-mono text-xs">
            {Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zinc-200 via-white to-emerald-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Line items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 flex gap-4 sm:gap-5 items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-zinc-300 transition-colors"
              >
                {/* Product Thumbnail */}
                <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                    }}
                    className="w-18 h-20 sm:w-20 sm:h-24 rounded-xl object-cover bg-zinc-100 border border-zinc-200/80 shadow-2xs"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-xs sm:text-sm font-bold text-zinc-950 hover:text-zinc-700 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
                      title="Remove item"
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                      Color: <strong className="text-zinc-950">{item.color}</strong>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                      Size: <strong className="text-zinc-950">{item.size}</strong>
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-zinc-200 rounded-full bg-zinc-50/90 h-8 px-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-full flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded-full cursor-pointer transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-zinc-950">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-full flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded-full cursor-pointer transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-extrabold text-zinc-950">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10.5px] text-zinc-400 block font-normal">
                          {formatINR(item.price)} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Link
              to="/shop"
              className="text-xs font-bold text-zinc-900 hover:text-zinc-600 transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* 3 Reassurance Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900">100% Genuine Apparel</p>
                <p className="text-[10.5px] text-zinc-500">240 GSM Combed Cotton</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2.5">
              <RotateCcw size={16} className="text-zinc-700 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900">15-Day Free Returns</p>
                <p className="text-[10.5px] text-zinc-500">Doorstep pickup pan-India</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2.5">
              <Truck size={16} className="text-zinc-700 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900">Express Air Cargo</p>
                <p className="text-[10.5px] text-zinc-500">2-4 days metro dispatch</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-950">Order Summary</h3>

            {/* Coupon input + Quick Apply Chips */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Promo & Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-800">
                      {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. SAVE10 or SETHI20"
                      className="flex-1 h-11 px-3.5 rounded-xl border border-zinc-200 text-xs font-semibold uppercase tracking-wider outline-none focus:border-black focus:ring-1 focus:ring-black/10 bg-zinc-50/50 hover:bg-white"
                    />
                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl theme-flow-btn text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Quick-apply chips */}
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-[10.5px] text-zinc-400 font-medium">Quick apply:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyCouponCode('SAVE10')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer border border-zinc-200"
                    >
                      SAVE10 (10% off)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCouponCode('SETHI20')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer border border-zinc-200"
                    >
                      SETHI20 (20% off)
                    </button>
                  </div>
                </>
              )}

              {couponMessage && (
                <p
                  className={`text-xs mt-1.5 font-medium ${
                    couponMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-zinc-950">{formatINR(cartSubtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Estimated Shipping</span>
                <span
                  className={`font-semibold ${
                    shippingFee === 0 ? 'text-emerald-600' : 'text-zinc-950'
                  }`}
                >
                  {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>GST (18% inclusive)</span>
                <span className="font-mono">{formatINR(Math.round(cartSubtotal * 0.18))}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-zinc-100 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-extrabold text-zinc-950">Total Amount</span>
                <p className="text-[10.5px] text-zinc-400">Inclusive of all taxes & duties</p>
              </div>
              <span className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                {formatINR(total)}
              </span>
            </div>

            {/* Proceed to Checkout CTA */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full h-12 rounded-full theme-flow-btn text-xs font-bold tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              PROCEED TO CHECKOUT <ArrowRight size={15} />
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>256-Bit SSL Encrypted & Verified Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
