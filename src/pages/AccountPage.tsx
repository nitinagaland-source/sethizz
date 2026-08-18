// src/pages/AccountPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Truck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '../utils/format';

export const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'support' | 'terms'>('orders');

  return (
    <div className="pb-24 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#71717A]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#0F0F14]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#0F0F14] font-semibold">Account</span>
      </nav>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEEF0] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#0F172A] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
          A
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-extrabold text-[#0F0F14]">Aarav Sharma</h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
            prakash@example.com · +91 98765 43210
          </p>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[11px] font-bold bg-[#D1FAE5] text-[#065F46] px-3 py-0.5 rounded-full">
              Verified Member
            </span>
            <span className="text-[11px] font-bold bg-[#DBEAFE] text-[#1E40AF] px-3 py-0.5 rounded-full">
              Club Tier: Platinum
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tab Navigator */}
        <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#EEEEF0] shadow-2xs space-y-1">
          {[
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'support', label: 'Help & Returns', icon: HelpCircle },
            { id: 'terms', label: 'Terms & Privacy', icon: ShieldCheck },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full p-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-[#DBEAFE] text-[#1E40AF]'
                    : 'text-[#52525B] hover:bg-[#F5F5F7] hover:text-[#0F0F14]'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-[#1E40AF]' : 'text-[#71717A]'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-[#0F0F14]">Order History & Live Tracking</h2>

              {/* Order Card 1 */}
              <div className="bg-white rounded-2xl p-6 border border-[#EEEEF0] shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EEEEF0]">
                  <div>
                    <span className="text-xs font-bold text-[#1E40AF]">Order #ORD-2026-94821</span>
                    <p className="text-xs text-[#71717A] mt-0.5">Placed on Aug 14, 2026</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#10B981] bg-[#D1FAE5] px-3 py-1 rounded-full">
                      <Truck size={13} /> In Transit (Out for Delivery)
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90&auto=format"
                    alt="Heavyweight Tee"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                    }}
                    className="w-16 h-16 rounded-xl object-contain bg-[#F0F7FF] p-1 border border-[#EEEEF0]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0F0F14]">Oversized Heavyweight Tee</p>
                    <p className="text-xs text-[#71717A]">Color: Black · Size: M · Qty: 1</p>
                    <p className="text-xs font-extrabold text-[#0F0F14] mt-1">{formatINR(1199)}</p>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 text-center text-[11px] font-bold text-[#52525B] mb-2">
                    <span className="text-[#10B981]">Confirmed</span>
                    <span className="text-[#10B981]">Packed</span>
                    <span className="text-[#10B981]">Shipped</span>
                    <span className="text-[#A1A1AA]">Delivered</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F5F5F7] overflow-hidden">
                    <div className="w-3/4 h-full bg-[#10B981] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="bg-white rounded-2xl p-6 border border-[#EEEEF0] shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EEEEF0]">
                  <div>
                    <span className="text-xs font-bold text-[#0F0F14]">Order #ORD-2026-38291</span>
                    <p className="text-xs text-[#71717A] mt-0.5">Placed on Jul 20, 2026</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#52525B] bg-[#F5F5F7] px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} className="text-[#10B981]" /> Delivered
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=90&auto=format"
                    alt="Hoodie"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                    }}
                    className="w-16 h-16 rounded-xl object-contain bg-[#F0F7FF] p-1 border border-[#EEEEF0]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0F0F14]">
                      Heavyweight French Terry Hoodie
                    </p>
                    <p className="text-xs text-[#71717A]">Color: Charcoal · Size: L · Qty: 1</p>
                    <p className="text-xs font-extrabold text-[#0F0F14] mt-1">{formatINR(2699)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#0F0F14]">Saved Delivery Addresses</h2>
                <button className="h-9 px-4 rounded-full bg-[#0F0F14] text-white text-xs font-bold hover:bg-[#27272A]">
                  + Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border-2 border-[#1E3A8A] relative shadow-xs">
                  <span className="absolute top-4 right-4 text-[10px] font-extrabold bg-[#DBEAFE] text-[#1E40AF] px-2 py-0.5 rounded-md">
                    DEFAULT
                  </span>
                  <p className="font-bold text-sm text-[#0F0F14]">Aarav Sharma (Home)</p>
                  <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                    Flat 402, Signature Palms, 12th Main<br />
                    Indiranagar, Near Metro Station<br />
                    Bangalore, Karnataka - 560038
                  </p>
                  <p className="text-xs font-mono text-[#71717A] mt-3">Phone: +91 98765 43210</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#EEEEF0] relative">
                  <p className="font-bold text-sm text-[#0F0F14]">Aarav Sharma (Work)</p>
                  <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                    Level 4, Tech Park Towers, Outer Ring Road<br />
                    Bellandur<br />
                    Bangalore, Karnataka - 560103
                  </p>
                  <p className="text-xs font-mono text-[#71717A] mt-3">Phone: +91 98765 43210</p>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT & RETURNS TAB */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-[#0F0F14]">
                Customer Support & Return Policy
              </h2>

              <div className="bg-white rounded-2xl p-6 border border-[#EEEEF0] space-y-4">
                <h3 className="font-bold text-sm text-[#0F0F14]">15-Day Return & Exchange Policy</h3>
                <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                  We stand by every stitch we make. If you are unhappy with the fit, color, or silhouette of any item, you can initiate a return or size exchange within 15 days of delivery.
                </p>
                <ul className="text-xs text-[#71717A] space-y-1.5 list-disc pl-4">
                  <li>Items must be unworn, unwashed, with all original tags attached.</li>
                  <li>Free door-step reverse courier pickup across all Indian metro pincodes.</li>
                  <li>Instant refund to your original payment method / UPI within 24 hours of warehouse check.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#F0F7FF] border border-[#BFDBFE] space-y-3">
                <h3 className="font-bold text-sm text-[#0F0F14]">Need Quick Assistance?</h3>
                <p className="text-xs text-[#52525B]">
                  Our support crew is available on WhatsApp and email from 9:00 AM to 9:00 PM IST.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-full bg-[#10B981] text-white text-xs font-bold inline-flex items-center gap-2"
                  >
                    WhatsApp Support <ExternalLink size={12} />
                  </a>
                  <a
                    href="mailto:hello@sethizzz.com"
                    className="h-10 px-5 rounded-full bg-white border border-[#E4E4E7] text-[#0F0F14] text-xs font-bold inline-flex items-center gap-2"
                  >
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TERMS & PRIVACY TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-[#0F0F14]">Terms of Service & Privacy</h2>

              <div className="bg-white rounded-2xl p-6 border border-[#EEEEF0] space-y-4 text-xs text-[#52525B] leading-relaxed">
                <p>
                  <strong>1. Privacy Policy:</strong> SETHIZZZ respects your personal data. We only use your shipping address and contact info to dispatch orders and send OTPs. We never sell your info to third-party telemarketers.
                </p>
                <p>
                  <strong>2. Payments:</strong> All debit/credit card and UPI transactions are encrypted and processed through certified RBI-compliant gateways (Razorpay).
                </p>
                <p>
                  <strong>3. Brand Origin & Delivery:</strong> SETHIZZZ is proudly founded and based out of Dimapur, Nagaland, fulfilling and delivering streetwear apparel across all Indian states and Union Territories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
