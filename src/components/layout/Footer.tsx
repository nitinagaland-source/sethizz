// src/components/layout/Footer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { useFooterContent } from '../../hooks/useSiteContent';

const DEFAULT_SHOP = [
  { label: 'Heavyweight Tees', href: '/shop/tees' },
  { label: 'French Terry Hoodies', href: '/shop/hoodies' },
  { label: 'Canvas Jackets', href: '/shop/jackets' },
  { label: 'Pants & Shorts', href: '/shop/bottoms' },
  { label: 'Caps & Accessories', href: '/shop/caps' },
  { label: 'Deals of the Day 🔥', href: '/shop?filter=deals' },
];
const DEFAULT_HELP = [
  { label: 'Track Your Order', href: '/account' },
  { label: '15-Day Return Policy', href: '/account#support' },
  { label: 'Shipping Rates & Timelines', href: '/account#support' },
  { label: 'Size Guide & Fabric Care', href: '/account#support' },
  { label: 'WhatsApp Support (24/7)', href: '/account#support' },
];
const DEFAULT_SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Twitter / X', href: 'https://twitter.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
];

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const footerData = useFooterContent();

  const about = footerData?.about || 'Heavyweight everyday apparel, crafted and curated with high-density materials, double-needle seams, and structured silhouettes. Based out of Dimapur, Nagaland.';
  const hqLocation = footerData?.hqLocation || 'Dimapur, Nagaland';
  const contactEmail = footerData?.contactEmail || 'hello@sethizzz.com';
  const copyright = footerData?.copyright || `${new Date().getFullYear()} SETHIZZZ Apparel. All rights reserved. Made in India.`;
  const shopLinks = footerData?.shopLinks?.length ? footerData.shopLinks : DEFAULT_SHOP;
  const helpLinks = footerData?.helpLinks?.length ? footerData.helpLinks : DEFAULT_HELP;
  const socialLinks = footerData?.socialLinks?.length ? footerData.socialLinks : DEFAULT_SOCIAL;

  const isExternal = (href: string) => href.startsWith('http');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setTimeout(() => setSubscribed(false), 4000); setEmail(''); }
  };

  return (
    <footer className="relative mt-20 sm:mt-28 bg-zinc-950 text-zinc-400 border-t border-zinc-800/80 pt-14 sm:pt-18 pb-24 sm:pb-12 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Newsletter Row */}
        <div className="pb-12 border-b border-zinc-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
          <div className="lg:col-span-6">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Join the SETHIZZZ Inner Circle</h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">Early drop notifications, private archive sales, and zero-spam editorial updates.</p>
          </div>
          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md lg:ml-auto">
              <div className="relative flex-1">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full h-11 px-4 rounded-full bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all" />
              </div>
              <button type="submit" className="h-11 px-5 sm:px-6 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
                {subscribed ? <><Check size={14} /> Joined</> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Main Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-5 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-3.5 group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors">SETHIZZZ</span>
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mb-5">{about}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold tracking-wide text-zinc-300">
              <span>HQ: {hqLocation} · Pan-India Delivery</span>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-6">
            <p className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-zinc-300 mb-4">Shop</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              {shopLinks.map((link, i) => (
                <li key={i}>
                  {isExternal(link.href) ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1">
                      {link.label} <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  ) : (
                    <Link to={link.href} className="hover:text-white transition-colors duration-150">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <p className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-zinc-300 mb-4">Help & Info</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              {helpLinks.map((link, i) => (
                <li key={i}>
                  {isExternal(link.href) ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1">
                      {link.label} <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  ) : (
                    <Link to={link.href} className="hover:text-white transition-colors duration-150">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-3">
            <p className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-zinc-300 mb-4">Connect</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1">
                    {link.label} <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors duration-150">{contactEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11.5px] text-zinc-500 text-center sm:text-left">© {copyright}</p>
          <div className="flex items-center gap-3 text-[11.5px] text-zinc-500">
            <Link to="/account#terms" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <span className="text-zinc-700">·</span>
            <Link to="/account#terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <span className="text-zinc-700">·</span>
            <Link to="/account#support" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
