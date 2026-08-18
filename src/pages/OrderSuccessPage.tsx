// src/pages/OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { formatINR } from '../utils/format';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // Retrieve stored order snapshot or fallback
  const orderSnapshot = React.useMemo(() => {
    try {
      const saved = sessionStorage.getItem('last_order');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      orderId: orderId || 'ORD-2026-45832',
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      contact: { email: 'prakash@example.com', mobile: '9876543210' },
      address: {
        name: 'Aarav Sharma',
        line1: 'Flat 402, Signature Palms, 12th Main',
        line2: 'Indiranagar',
        pincode: '560038',
        city: 'Bangalore',
        state: 'Karnataka',
      },
      paymentMethod: 'UPI (GPay)',
      items: [
        {
          id: '1',
          name: 'Oversized Heavyweight Tee',
          color: 'Black',
          size: 'M',
          price: 1199,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90&auto=format',
        },
      ],
      total: 1199,
    };
  }, [orderId]);

  // Trigger confetti burst on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#3B82F6', '#FB923C', '#10B981'],
      });
    } catch {}
  }, []);

  // Delivery date estimate (3 days from today)
  const deliveryEstimate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="py-10 max-w-2xl mx-auto space-y-8">
      {/* Animated Checkmark & Headline */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#10B981] to-[#34D399] text-white flex items-center justify-center mx-auto shadow-[0_12px_30px_rgba(16,185,129,0.35)]"
        >
          <Check size={40} className="stroke-[3]" />
        </motion.div>

        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} /> Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F0F14]">
            Thank you, {orderSnapshot.address.name.split(' ')[0]}!
          </h1>
          <p className="text-sm font-mono text-[#71717A] mt-1">
            Order #{orderSnapshot.orderId}
          </p>
          <p className="text-[15px] text-[#52525B] mt-2">
            Your package is being prepared at our Dimapur, Nagaland hub and will arrive by{' '}
            <strong className="text-[#0F0F14]">{deliveryEstimate}</strong>.
          </p>
        </div>
      </div>

      {/* Order Summary Receipt Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEEF0] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEF0]">
          <span className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#52525B]">
            Order Details
          </span>
          <span className="text-xs text-[#71717A]">{orderSnapshot.date}</span>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          {orderSnapshot.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                }}
                className="w-16 h-16 rounded-xl object-contain bg-[#F0F7FF] p-1 border border-[#EEEEF0]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0F0F14] truncate">{item.name}</p>
                <p className="text-xs text-[#71717A] mt-0.5">
                  Color: {item.color} · Size: {item.size} · Qty: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-[#0F0F14]">
                {formatINR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping & Payment Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EEEEF0] text-xs">
          <div className="p-4 rounded-xl bg-[#F5F5F7] space-y-1">
            <p className="font-bold text-[#0F0F14] flex items-center gap-1.5">
              <MapPin size={14} className="text-[#1E40AF]" /> Shipping Address
            </p>
            <p className="text-[#52525B] font-semibold">{orderSnapshot.address.name}</p>
            <p className="text-[#71717A] leading-relaxed">
              {orderSnapshot.address.line1}, {orderSnapshot.address.line2}
              <br />
              {orderSnapshot.address.city}, {orderSnapshot.address.state} -{' '}
              {orderSnapshot.address.pincode}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F5F7] space-y-1">
            <p className="font-bold text-[#0F0F14] flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#1E40AF]" /> Payment & Delivery
            </p>
            <p className="text-[#52525B]">
              Method: <strong>{orderSnapshot.paymentMethod}</strong>
            </p>
            <p className="text-[#52525B]">
              Total Paid: <strong className="text-[#0F0F14] text-sm">{formatINR(orderSnapshot.total)}</strong>
            </p>
            <p className="text-[#10B981] font-semibold flex items-center gap-1 mt-1">
              <Calendar size={12} /> Expected by {deliveryEstimate}
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Tracking CTA */}
      <div className="p-5 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#065F46]">
              Track your package live on WhatsApp
            </p>
            <p className="text-xs text-[#047857]">
              Get real-time dispatch alerts and courier agent numbers.
            </p>
          </div>
        </div>

        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 px-5 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#059669] transition-colors flex-shrink-0"
        >
          Chat on WhatsApp <ArrowRight size={14} />
        </a>
      </div>

      {/* CTAs */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Link
          to="/shop"
          className="h-13 px-8 rounded-full bg-[#0F0F14] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#27272A] transition-colors shadow-md"
        >
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};
