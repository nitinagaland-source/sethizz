// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  ShieldCheck,
  Lock,
  ChevronRight,
  Sparkles,
  Check,
  CheckCircle2,
  Truck,
  ArrowRight,
  Info,
  MapPin,
  Mail,
  Phone,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';
import {
  GPayLogo,
  PhonePeLogo,
  PaytmLogo,
  UpiLogo,
  VisaLogo,
  MastercardLogo,
  RuPayLogo,
  AmexLogo,
  TOP_BANKS,
} from '../components/checkout/PaymentLogos';

type PaymentTab = 'upi' | 'card' | 'netbanking' | 'cod';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, appliedCoupon, clearCart } = useStore();

  const [paymentTab, setPaymentTab] = useState<PaymentTab>('upi');
  const [processing, setProcessing] = useState<boolean>(false);

  // Form State
  const [contact, setContact] = useState({
    email: 'prakash@example.com',
    mobile: '9876543210',
    createAccount: true,
  });

  const [address, setAddress] = useState({
    name: 'Aarav Sharma',
    line1: 'Flat 402, Signature Palms, 12th Main',
    line2: 'Indiranagar',
    landmark: 'Near Metro Station',
    pincode: '560038',
    city: 'Bangalore',
    state: 'Karnataka',
    saveAddress: true,
  });

  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [upiVerified, setUpiVerified] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [codAgreed, setCodAgreed] = useState<boolean>(true);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4532 8920 1234 5678');
  const [cardHolder, setCardHolder] = useState('AARAV SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');

  // Price calculations
  const discountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const basePriceAfterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const isFreeStandard = basePriceAfterDiscount >= 1499;
  const shippingFee = delivery === 'express' ? 199 : isFreeStandard ? 0 : 99;
  const codFee = paymentTab === 'cod' ? 49 : 0;
  const tax = Math.round(basePriceAfterDiscount * 0.18);
  const total = basePriceAfterDiscount + shippingFee + codFee;

  // Detect Card Provider
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'mastercard';
    if (clean.startsWith('6') || clean.startsWith('8')) return 'rupay';
    if (clean.startsWith('3')) return 'amex';
    return 'visa';
  };

  // Auto-fill pincode using India Post API
  const handlePincodeChange = async (pin: string) => {
    setAddress((prev) => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
          const po = data[0].PostOffice[0];
          setAddress((prev) => ({
            ...prev,
            city: po.District || po.Block || '',
            state: po.State || '',
          }));
        }
      } catch (err) {
        console.error('Pincode fetch error:', err);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact.email || !contact.mobile || !address.name || !address.line1 || !address.pincode) {
      alert('Please fill in all required shipping and contact fields.');
      return;
    }

    setProcessing(true);

    // Simulate payment verification delay
    setTimeout(() => {
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const orderId = `ORD-2026-${randomId}`;

      // Save order snapshot in sessionStorage for OrderSuccessPage
      const orderSnapshot = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        contact,
        address,
        delivery,
        paymentMethod:
          paymentTab === 'upi'
            ? `UPI (${selectedUpiApp.toUpperCase()})`
            : paymentTab === 'card'
            ? `Credit Card (${getCardBrand(cardNumber).toUpperCase()})`
            : paymentTab === 'netbanking'
            ? `Netbanking (${selectedBank})`
            : 'Cash on Delivery (COD)',
        items: [...cart],
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        codFee,
        tax,
        total,
      };

      sessionStorage.setItem('last_order', JSON.stringify(orderSnapshot));
      clearCart();
      setProcessing(false);
      navigate(`/order/${orderId}/success`);
    }, 1800);
  };

  if (cart.length === 0 && !processing) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
          <Wallet size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Your Cart is Empty</h2>
          <p className="text-sm text-zinc-500">
            You don't have any items ready for checkout. Explore our premium collection to add pieces to your bag.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black text-white text-sm font-semibold tracking-wide hover:bg-zinc-800 transition-colors shadow-sm"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-36 pt-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header & Trust Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200/80 gap-4 mb-8">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/cart" className="hover:text-zinc-900 transition-colors">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-zinc-900 font-semibold">Secure Checkout</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Express Checkout
          </h1>
        </div>

        {/* Security & Badges */}
        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-3.5 py-2 rounded-full self-start sm:self-auto shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
            <Lock size={12} className="text-emerald-600" />
            256-Bit Encrypted
          </span>
          <span className="text-zinc-300">|</span>
          <div className="flex items-center gap-2">
            <VisaLogo className="h-3.5" />
            <MastercardLogo className="h-3.5" />
            <RuPayLogo className="h-3.5" />
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Steps Accordion */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-500 block">
                      Account & Updates
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                      Contact Information
                    </h2>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <ShieldCheck size={16} /> Privacy Guaranteed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                    />
                    <Mail size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="flex items-center border border-zinc-200 rounded-xl h-11 bg-zinc-50/50 hover:bg-white focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950/10 focus-within:bg-white transition-all overflow-hidden">
                    <span className="pl-3.5 pr-2.5 text-xs text-zinc-600 font-semibold select-none border-r border-zinc-200 bg-zinc-100/70 h-full flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={contact.mobile}
                      onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
                      placeholder="98765 43210"
                      className="flex-1 h-full px-3 text-sm text-zinc-900 outline-none bg-transparent"
                    />
                    <Phone size={15} className="text-zinc-400 mr-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-zinc-500 border-t border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Real-time WhatsApp tracking & instant OTP confirmation
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={contact.createAccount}
                    onChange={(e) => setContact({ ...contact, createAccount: e.target.checked })}
                    className="w-4 h-4 rounded accent-zinc-950 cursor-pointer"
                  />
                  <span className="text-zinc-700 font-medium">Save for 1-click checkout</span>
                </label>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-500 block">
                      Delivery Destination
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                      Shipping Address
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full font-medium">
                  <MapPin size={12} className="text-zinc-900" /> Pan-India Express
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="Recipient's full name"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    placeholder="e.g. Flat 402, Signature Palms, 12th Main"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Area / Locality / Sector
                  </label>
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    placeholder="e.g. Indiranagar"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="e.g. Near Metro Station"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">Pincode *</label>
                    <span className="text-[10px] text-zinc-500 font-semibold">
                      Auto-detects City & State
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="6-digit Indian PIN"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Method */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-500 block">
                    Shipping Tier
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                    Delivery Speed
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Standard */}
                <div
                  onClick={() => setDelivery('standard')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    delivery === 'standard'
                      ? 'border-zinc-950 bg-zinc-50 shadow-xs ring-1 ring-zinc-950/10'
                      : 'border-zinc-200 hover:border-zinc-400 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          delivery === 'standard' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
                        }`}
                      >
                        {delivery === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-bold text-zinc-900">Standard Shipping</span>
                    </div>
                    <span className={`text-xs font-bold ${isFreeStandard ? 'text-emerald-600' : 'text-zinc-900'}`}>
                      {isFreeStandard ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 pl-6.5">
                    4–7 business days via Bluedart Air
                  </p>
                </div>

                {/* Priority Air */}
                <div
                  onClick={() => setDelivery('express')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    delivery === 'express'
                      ? 'border-zinc-950 bg-zinc-50 shadow-xs ring-1 ring-zinc-950/10'
                      : 'border-zinc-200 hover:border-zinc-400 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          delivery === 'express' ? 'border-zinc-950 bg-zinc-950' : 'border-zinc-300'
                        }`}
                      >
                        {delivery === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-zinc-900">Priority Air Cargo</span>
                        <span className="bg-zinc-200 text-zinc-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                          Fast
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">₹199</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 pl-6.5">
                    2–3 business days guaranteed priority dispatch
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: Payment Methods — Luxury Tabs with Real Logos */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-500 block">
                      Payment Gateway
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                      Select Payment Method
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <Shield size={14} /> PCI-DSS Level 1
                </div>
              </div>

              {/* Sleek Payment Method Tabs - 2x2 on Mobile, 4-col on Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 p-1.5 bg-zinc-100/90 rounded-2xl border border-zinc-200/80">
                {[
                  { id: 'upi', label: 'UPI / QR', sub: 'Instant 0-fee', icon: <Smartphone size={17} /> },
                  { id: 'card', label: 'Cards', sub: 'Debit & Credit', icon: <CreditCard size={17} /> },
                  { id: 'netbanking', label: 'Netbanking', sub: 'All Banks', icon: <Building2 size={17} /> },
                  { id: 'cod', label: 'Cash on Del.', sub: 'Pay at doorstep', icon: <Wallet size={17} /> },
                ].map((tab) => {
                  const isActive = paymentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentTab(tab.id as PaymentTab)}
                      className={`min-h-[58px] py-2.5 px-3 rounded-xl transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none ${
                        isActive
                          ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/90 ring-1 ring-zinc-950/5'
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className={isActive ? 'text-zinc-950' : 'text-zinc-600'}>{tab.icon}</span>
                        <span className="text-xs font-bold leading-none">{tab.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium leading-none">
                        {tab.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: UPI WITH REAL BRAND LOGOS */}
              {paymentTab === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 pt-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                        Select Preferred UPI App
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Instant 0-Fee Settlement
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                      {[
                        {
                          id: 'gpay',
                          name: 'Google Pay',
                          logo: <GPayLogo className="h-8 max-h-8 w-auto object-contain" />,
                        },
                        {
                          id: 'phonepe',
                          name: 'PhonePe',
                          logo: <PhonePeLogo className="h-8 w-8 max-h-8 object-contain rounded-md" />,
                        },
                        {
                          id: 'paytm',
                          name: 'Paytm UPI',
                          logo: <PaytmLogo className="h-7 max-h-7 w-auto object-contain" />,
                        },
                      ].map((app) => {
                        const isSelected = selectedUpiApp === app.id;
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center relative min-h-[96px] ${
                              isSelected
                                ? 'border-zinc-950 bg-zinc-50/80 shadow-xs ring-1 ring-zinc-950'
                                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-2xs'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[9px]">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                            <div className="h-9 w-full flex items-center justify-center">
                              {app.logo}
                            </div>
                            <span className="text-xs font-bold text-zinc-900 tracking-tight">{app.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* VPA / UPI ID Input */}
                  <div className="pt-4 border-t border-zinc-100">
                    <label className="block text-xs font-bold text-zinc-700 mb-2">
                      Or Enter UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={(e) => {
                            setCustomUpiId(e.target.value);
                            setUpiVerified(false);
                          }}
                          placeholder="e.g. 9876543210@paytm or name@okhdfcbank"
                          className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white font-mono"
                        />
                        {upiVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-xs font-bold">
                            <CheckCircle2 size={16} /> Verified
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (customUpiId.includes('@')) {
                            setUpiVerified(true);
                          } else {
                            alert('Please enter a valid UPI ID (e.g. 9876543210@paytm or name@okhdfcbank)');
                          }
                        }}
                        className="h-11 px-5 rounded-xl theme-flow-btn text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Verify VPA
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      A payment request will be sent to your UPI application upon placing the order.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS WITH REAL CARD PREVIEW */}
              {paymentTab === 'card' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-1"
                >
                  {/* Luxury Digital Card Preview */}
                  <div className="w-full max-w-sm mx-auto rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 text-white p-5 border border-white/15 shadow-xl relative overflow-hidden">
                    {/* Subtle Glow */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-zinc-500/10 blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-7 rounded-md bg-amber-200/90 border border-amber-300 flex items-center justify-center">
                        <div className="w-8 h-5 border border-amber-400/50 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                          <div className="bg-amber-300/40 rounded-xs" />
                          <div className="bg-amber-300/40 rounded-xs" />
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-white rounded-md shadow-xs flex items-center justify-center min-w-[52px] h-7">
                        {getCardBrand(cardNumber) === 'visa' && <VisaLogo className="h-4" />}
                        {getCardBrand(cardNumber) === 'mastercard' && <MastercardLogo className="h-5" />}
                        {getCardBrand(cardNumber) === 'rupay' && <RuPayLogo className="h-4" />}
                        {getCardBrand(cardNumber) === 'amex' && <AmexLogo className="h-4" />}
                      </div>
                    </div>

                    <div className="font-mono text-base sm:text-lg tracking-[0.2em] font-semibold text-white/95 drop-shadow-sm mb-4">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-end justify-between text-xs text-white/80 font-mono">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">
                          Cardholder
                        </span>
                        <span className="font-bold tracking-wider uppercase">
                          {cardHolder || 'AARAV SHARMA'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">
                          Expires
                        </span>
                        <span className="font-bold tracking-wider">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Card Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-100">
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                      Supported Networks
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md shadow-2xs flex items-center justify-center h-7 min-w-[48px]">
                        <VisaLogo className="h-3.5 w-auto" />
                      </div>
                      <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md shadow-2xs flex items-center justify-center h-7 min-w-[36px]">
                        <MastercardLogo className="h-4 w-auto" />
                      </div>
                      <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md shadow-2xs flex items-center justify-center h-7 min-w-[50px]">
                        <RuPayLogo className="h-3.5 w-auto" />
                      </div>
                      <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md shadow-2xs flex items-center justify-center h-7 min-w-[44px]">
                        <AmexLogo className="h-3.5 w-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Card Input Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full h-11 pl-3.5 pr-12 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <CreditCard size={18} className="text-zinc-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name on card"
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          CVV / Security Code *
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all bg-zinc-50/50 hover:bg-white"
                          />
                          <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: NETBANKING WITH REAL BANK BADGES */}
              {paymentTab === 'netbanking' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-1"
                >
                  <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Popular Indian Banks
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TOP_BANKS.map((bank) => {
                      const isSelected = selectedBank === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center relative ${
                            isSelected
                              ? 'border-zinc-950 bg-zinc-50 shadow-xs ring-1 ring-zinc-950/10'
                              : 'border-zinc-200 bg-white hover:border-zinc-400'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[8px]">
                              <Check size={8} strokeWidth={3} />
                            </div>
                          )}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shadow-2xs"
                            style={{ backgroundColor: bank.bgColor, color: bank.color }}
                          >
                            {bank.code.slice(0, 3)}
                          </div>
                          <span className="text-xs font-bold text-zinc-900 truncate w-full">
                            {bank.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CASH ON DELIVERY */}
              {paymentTab === 'cod' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-1"
                >
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-zinc-900" />
                      <span className="font-bold text-zinc-900 text-sm">
                        Pay on Delivery via Cash or UPI QR
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      You can pay via Cash or scan the delivery executive's UPI QR code upon door arrival. A nominal ₹49 handling fee applies for COD orders.
                    </p>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={codAgreed}
                      onChange={(e) => setCodAgreed(e.target.checked)}
                      className="w-4 h-4 rounded accent-zinc-950 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-700 font-medium">
                      I agree to inspect the tamper-proof security seal before paying.
                    </span>
                  </label>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-950">Order Summary</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200/60">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Line items thumbnail list */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200/80 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {item.color} · Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatINR(cartSubtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Promo ({appliedCoupon.code})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Shipping & Handling</span>
                  <span
                    className={`font-semibold ${
                      shippingFee === 0 ? 'text-emerald-600' : 'text-zinc-900'
                    }`}
                  >
                    {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>

                {codFee > 0 && (
                  <div className="flex justify-between text-zinc-600">
                    <span>COD Convenience Fee</span>
                    <span className="font-semibold text-zinc-900">{formatINR(codFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>GST (18% inclusive)</span>
                  <span className="font-mono">{formatINR(tax)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-zinc-100 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-extrabold text-zinc-950">Total Payable</span>
                  <p className="text-[10px] text-zinc-400">All duties & taxes included</p>
                </div>
                <span className="text-2xl font-extrabold text-zinc-950 font-sans tracking-tight">
                  {formatINR(total)}
                </span>
              </div>

              {/* Place Order CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={processing || (paymentTab === 'cod' && !codAgreed)}
                className="w-full h-12 sm:h-13 rounded-full theme-flow-btn text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Order...</span>
                  </div>
                ) : (
                  <>
                    <span>CONFIRM & PAY {formatINR(total)}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>

              {/* Luxury Guarantee Badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 border-t border-zinc-100 text-center">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <ShieldCheck size={14} className="mx-auto text-emerald-600 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-700 block">100% Genuine</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <Truck size={14} className="mx-auto text-zinc-800 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-700 block">Air Express</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <CheckCircle2 size={14} className="mx-auto text-zinc-800 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-700 block">Easy 15D Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Processing Payment Overlay */}
      <AnimatePresence>
        {processing && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full flex flex-col items-center text-center shadow-2xl border border-zinc-100 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-black flex items-center justify-center relative shadow-sm">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-950 font-serif">
                  Authorizing Payment
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Connecting to secure banking network. Please do not navigate away or refresh.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pt-2">
                <Lock size={10} className="text-emerald-500" /> End-to-end 256-bit encryption
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
