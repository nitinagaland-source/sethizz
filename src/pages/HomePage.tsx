// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Headphones,
  Percent,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useStorefrontData } from '../hooks/useStorefrontData';
import { useHomeContent } from '../hooks/useSiteContent';
import { ProductCard } from '../components/products/ProductCard';
import { ShinyCard } from '../components/ui/shiny-card';
import { CategoryExplorer } from '../components/home/CategoryExplorer';
import { CoverflowCarousel, CoverflowSlide } from '../components/ui/coverflow-carousel';
import { useCountdown } from '../hooks/useCountdown';
import { formatINR } from '../utils/format';

const LOOKBOOK_SLIDES: CoverflowSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&auto=format&fit=crop&q=85",
    alt: "Oversized Heavyweight Tee",
    title: "Oversized Heavyweight Tee",
    subtitle: "260 GSM Structured Combed Cotton",
    price: "₹1,199",
    href: "/product/oversized-heavyweight-tee-black",
    meta: [
      { label: "Fabric", value: "260 GSM Cotton" },
      { label: "Fit", value: "Boxy Oversized" },
      { label: "HQ", value: "Dimapur, Nagaland" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=85",
    alt: "Heavyweight French Terry Hoodie",
    title: "French Terry Hoodie",
    subtitle: "450 GSM Loopback Heavy Knit",
    price: "₹2,699",
    href: "/product/french-terry-hoodie-charcoal",
    meta: [
      { label: "Weight", value: "450 GSM Terry" },
      { label: "Structure", value: "Double Hood" },
      { label: "Drop", value: "Archival" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=85",
    alt: "Canvas Chore Work Jacket",
    title: "Canvas Chore Jacket",
    subtitle: "Triple-stitched 12oz Duck Canvas",
    price: "₹3,199",
    href: "/product/minimal-chore-jacket-navy",
    meta: [
      { label: "Material", value: "12oz Duck Canvas" },
      { label: "Pockets", value: "3 Drop-in" },
      { label: "Fit", value: "Regular Box Fit" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85",
    alt: "Nike Air Max 270",
    title: "Nike Air Max 270",
    subtitle: "Max Air 270 heel cushioning unit",
    price: "₹3,499",
    href: "/product/nike-air-max-270-white",
    meta: [
      { label: "Sole", value: "Max Air Unit" },
      { label: "Upper", value: "Engineered Mesh" },
      { label: "Rating", value: "★ 4.9 (240)" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=85",
    alt: "Wide Leg Pleated Trouser",
    title: "Pleated Relaxed Trouser",
    subtitle: "Drape Twill with Hidden Drawstring",
    price: "₹2,199",
    href: "/product/wide-leg-pleated-trouser-olive",
    meta: [
      { label: "Cut", value: "Wide Straight Leg" },
      { label: "Waist", value: "Elasticated Back" },
      { label: "Pockets", value: "Deep Slash" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85",
    alt: "Apple Watch Series 9",
    title: "Apple Watch Series 9",
    subtitle: "S9 SiP Chip with Double Tap",
    price: "₹9,999",
    href: "/product/apple-watch-series-9-midnight",
    meta: [
      { label: "Display", value: "Always-On Retina" },
      { label: "Battery", value: "All-day 18h+" },
      { label: "Case", value: "45mm Midnight" },
    ],
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, homeTestimonials } = useStorefrontData();
  const { content: homeData } = useHomeContent();
  const heroPrimaryCTALabel   = homeData?.hero?.primaryCta?.label   || 'Shop Collection';
  const heroSecondaryCTALabel = homeData?.hero?.secondaryCta?.label || 'New Arrivals';
  const heroTertiaryCTALabel  = homeData?.hero?.tertiaryCta?.label  || 'Watch Story';
  const dealTitle    = homeData?.dealBanner?.title       || 'Deals of the Day';
  const dealViewAll  = homeData?.dealBanner?.viewAllLink || '/shop?filter=deals';
  const offerEyebrow = homeData?.specialOffer?.eyebrow   || 'Special Offer';
  const offerTitle   = homeData?.specialOffer?.title     || 'Up to 50% Off';
  const offerSubtitle= homeData?.specialOffer?.subtitle  || 'On select heavyweight tees, French terry hoodies, and jackets. Limited quantities only!';
  const offerCTA     = homeData?.specialOffer?.ctaText   || 'Shop the Sale';
  const offerCTALink = homeData?.specialOffer?.ctaLink   || '/shop?filter=deals';
  const offerBg      = homeData?.specialOffer?.image     || 'https://i.ibb.co/VWbngKy2/e9c9bbb3-9f38-433f-83c0-baa3400205e6.png';
  const nlTitle  = homeData?.newsletter?.title      || 'Join the SETHIZZZ Club';
  const nlBody   = homeData?.newsletter?.body       || 'Get 10% off your first order, plus early access to limited edition seasonal drops.';
  const nlCoupon = homeData?.newsletter?.couponCode || 'SAVE10';
  const countdown = useCountdown(12, 45, 32);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const dealProducts = products.filter((p) => p.isDeal).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-14 md:space-y-20">
      {/* 6.1 Hero Section — fully CMS-driven from admin Site Content */}
      <section
        id="hero-banner-section"
        className="-mx-4 sm:mx-0 relative rounded-none sm:rounded-3xl overflow-hidden w-[calc(100%+2rem)] sm:w-full aspect-[4/5] sm:aspect-[2/1] md:aspect-[2.25/1] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[540px] border-b sm:border border-black/10 shadow-2xl group bg-zinc-950"
      >
        {/* Background image: Firestore-controlled. Defaults to ibb.co when no image is set in admin. */}
        {homeData?.hero?.image ? (
          <img
            src={homeData.hero.image}
            alt="SETHIZZZ Hero"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          />
        ) : (
          <>
            <img
              src="https://i.ibb.co/MDpsJXM0/aef7a6d5-ebf0-48fd-ac1c-b613a5eb061b.webp"
              alt="SETHIZZZ - Redefine Everyday"
              referrerPolicy="no-referrer"
              className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            />
            <img
              src="https://i.ibb.co/jkNtKczx/d9113ca4-80e1-4b29-8076-92dba452b084.webp"
              alt="SETHIZZZ - Redefine Everyday Mobile"
              referrerPolicy="no-referrer"
              className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            />
          </>
        )}

        {/* Always-on gradient scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

        {/* Hero text — always from Firestore with fallbacks. Change via admin > Site Content > Hero Banner */}
        <div className="absolute left-4 sm:left-8 md:left-14 top-1/2 -translate-y-[55%] z-10 max-w-[240px] sm:max-w-sm md:max-w-md">
          {(homeData?.hero?.eyebrow) && (
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 block mb-1.5 sm:mb-2">
              {homeData.hero.eyebrow}
            </span>
          )}
          <h1 className="text-[1.75rem] sm:text-4xl md:text-[3.25rem] font-black tracking-tight text-white leading-[1.05] mb-2 sm:mb-3">
            {homeData?.hero?.title || 'Redefine Everyday.'}
          </h1>
          <p className="text-[10px] sm:text-[13px] text-white/75 leading-relaxed max-w-[200px] sm:max-w-xs">
            {homeData?.hero?.subtitle || 'Timeless pieces. Modern edge.
Built for the way you move.'}
          </p>
        </div>

        {/* Action Buttons placed lower down, centered in a clean single row */}
        <div className="absolute bottom-2.5 sm:bottom-5 md:bottom-6 lg:bottom-7 inset-x-0 px-2 sm:px-6 z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-nowrap max-w-full mx-auto"
          >
            <Link
              id="hero-shop-collection-btn"
              to="/shop"
              className="h-6.5 sm:h-9 px-2 sm:px-4 rounded-full bg-white text-[#0F0F14] text-[9px] sm:text-xs font-bold inline-flex items-center gap-1 sm:gap-1.5 hover:bg-[#F4F4F5] hover:scale-105 active:scale-95 transition-all shadow-md group/btn flex-shrink-0 whitespace-nowrap"
            >
              <ShoppingBag size={10} className="sm:w-[13px] sm:h-[13px] text-[#5B21B6]" />
              <span>{heroPrimaryCTALabel}</span>
              <ArrowRight size={10} className="sm:w-[13px] sm:h-[13px] transition-transform group-hover/btn:translate-x-0.5" />
            </Link>

            <Link
              id="hero-new-arrivals-btn"
              to="/shop?sort=newest"
              className="h-6.5 sm:h-9 px-1.5 sm:px-3.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[9px] sm:text-xs font-semibold border border-white/25 inline-flex items-center gap-1 sm:gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-sm flex-shrink-0 whitespace-nowrap"
            >
              <Flame size={10} className="sm:w-[13px] sm:h-[13px] text-[#FBBF24]" />
              <span>{heroSecondaryCTALabel}</span>
            </Link>

            <button
              id="hero-watch-story-btn"
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="h-6.5 sm:h-9 px-1.5 sm:px-3 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md text-white text-[9px] sm:text-xs font-medium border border-white/20 inline-flex items-center gap-1 sm:gap-1.5 hover:scale-105 active:scale-95 transition-all flex-shrink-0 whitespace-nowrap cursor-pointer"
            >
              <PlayCircle size={11} className="sm:w-[14px] sm:h-[14px] text-[#DDD6FE]" />
              <span>{heroTertiaryCTALabel}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 6.2 Trust Badges Row (Sleek Bright Aesthetic Shiny Cards with Color Flow) */}
      <section id="trust-perks-section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <ShinyCard
            icon={Truck}
            title="Free Shipping"
            sub="On orders over ₹1,499"
            colorTheme="coral"
          />
          <ShinyCard
            icon={RotateCcw}
            title="Easy Returns"
            sub="15-day return policy"
            colorTheme="blue"
          />
          <ShinyCard
            icon={Shield}
            title="Secure Payment"
            sub="100% secure checkout"
            colorTheme="emerald"
          />
          <ShinyCard
            icon={Headphones}
            title="24/7 Support"
            sub="Always here to help"
            colorTheme="purple"
          />
        </div>
      </section>

      {/* 6.3 Shop by Category & Editorial Palette Edit (Matching Reference Design) */}
      <CategoryExplorer />

      {/* 6.4 Deals of the Day with Live Countdown (Section 4) */}
      <section id="deals-of-the-day-section">
        <style>{`
          @keyframes luxuryDealsGlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .deals-luxury-title {
            background: linear-gradient(
              90deg,
              #0f172a 0%,
              #1e3a8a 22%,
              #7c3aed 48%,
              #a855f7 72%,
              #1d4ed8 88%,
              #0f172a 100%
            );
            background-size: 250% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: luxuryDealsGlow 6s ease-in-out infinite;
          }
        `}</style>

        {/* Tight, Luxury Header Layout without harsh pure black */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h2 className="deals-luxury-title text-[19px] sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-none">
              {dealTitle}
            </h2>

            {/* Premium Frosted Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-md text-white rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-xs border border-zinc-700/60">
              <span className="text-zinc-400 text-[9.5px] uppercase tracking-wider font-bold">Ends in</span>
              <span className="font-mono font-bold bg-zinc-800/90 px-1.5 py-0.2 rounded text-zinc-100 text-[10px]">
                {countdown.hours}
              </span>
              <span className="text-zinc-400 text-[10px]">:</span>
              <span className="font-mono font-bold bg-zinc-800/90 px-1.5 py-0.2 rounded text-zinc-100 text-[10px]">
                {countdown.minutes}
              </span>
              <span className="text-zinc-400 text-[10px]">:</span>
              <span className="font-mono font-bold bg-[#E15B3E] px-1.5 py-0.2 rounded text-white text-[10px] shadow-xs">
                {countdown.seconds}
              </span>
            </div>
          </div>

          <Link
            to={dealViewAll}
            className="text-[11.5px] sm:text-xs font-bold text-zinc-600 hover:text-[#E15B3E] uppercase tracking-wider flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} showDiscount compact />
          ))}
        </div>
      </section>

      {/* 6.5 Special Offer Promo Banner (Section 5) */}
      <section className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-7 sm:p-11 lg:p-14 border border-zinc-800/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group">
        {/* Background Editorial Image */}
        <img
          src={offerBg}
          alt="Special Offer Background"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Sophisticated Dark Gradient Scrim for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35 sm:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Specular Rim */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10.5px] font-extrabold tracking-[0.18em] uppercase text-white mb-3.5 border border-white/25 shadow-xs">
            {offerEyebrow}
          </span>

          <h2 className="text-[clamp(1.85rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight">
            {offerTitle}
          </h2>

          <p className="mt-1.5 sm:mt-2 text-white/80 text-[11px] sm:text-[12.5px] leading-relaxed tracking-tight">
            {offerSubtitle}
          </p>

          <Link
            to={offerCTALink}
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-white text-zinc-900 font-bold text-xs sm:text-sm hover:bg-zinc-100 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>{offerCTA}</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* 6.55 Coverflow Lookbook Gallery (Clickable 3D Coverflow Carousel) */}
      <section id="coverflow-lookbook-section" className="py-2">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E15B3E] block mb-0.5">
              3D LOOKBOOK ARCHIVE
            </span>
            <h2 className="deals-luxury-title text-[19px] sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-none">
              Explore The Silhouette
            </h2>
          </div>
          <p className="text-xs text-zinc-500 hidden sm:block">
            Swipe or click any card to inspect piece
          </p>
        </div>

        <div className="w-full rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 sm:p-6 border border-zinc-800/80 shadow-2xl text-white overflow-hidden">
          <CoverflowCarousel
            slides={LOOKBOOK_SLIDES}
            showCaption
            showPagination
            showNavigation
            cardWidth="clamp(160px, 26vw, 290px)"
            onSlideClick={(slide) => {
              if (slide.href) {
                navigate(slide.href);
              }
            }}
          />
        </div>
      </section>

      {/* 6.6 New Arrivals Grid (Section 6) */}
      <section id="new-arrivals-section">
        {/* Tight, Luxury Header Layout matching Deals of the Day */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E15B3E] block mb-0.5">
              FRESH SILHOUETTES
            </span>
            <h2 className="deals-luxury-title text-[19px] sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-none">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-[11.5px] sm:text-xs font-bold text-zinc-600 hover:text-[#E15B3E] uppercase tracking-wider flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      {/* 6.7 Testimonials (Section 7) */}
      <section id="testimonials-section">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E15B3E] block mb-0.5">
              VERIFIED EXPERIENCES
            </span>
            <h2 className="deals-luxury-title text-[19px] sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-none">
              What People Say
            </h2>
          </div>
        </div>

        {/* Mobile Horizontal Snap Carousel & Desktop 3-Col Grid */}
        <div className="flex sm:grid sm:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 -mx-4 sm:px-0 sm:mx-0 py-1">
          {homeTestimonials.map((t) => (
            <div
              key={t.id}
              className="flex-shrink-0 w-[260px] sm:w-auto snap-start bg-white border border-zinc-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200 shadow-2xs flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                      <span className="ml-1 text-[10.5px] font-bold text-zinc-800">5.0</span>
                    </div>
                    <span className="text-[9.5px] font-semibold text-emerald-600 block truncate">
                      ✓ Verified Buyer
                    </span>
                  </div>
                </div>

                <p className="text-[12.5px] sm:text-[13.5px] font-bold text-zinc-800 mb-1 leading-snug tracking-tight">
                  {t.title}
                </p>
                <p className="text-[11.5px] sm:text-xs text-zinc-600 leading-relaxed line-clamp-3">
                  "{t.body}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10.5px] font-semibold text-zinc-700">
                  {t.author}
                </span>
                <span className="text-[9.5px] text-zinc-400 font-medium">
                  {t.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.8 Newsletter Club (Section 8) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#0F172A] to-[#1E3A8A] text-white p-7 sm:p-10 lg:p-12 border border-[#1E3A8A]/80 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.65)] text-center">
        {/* Subtle decorative background light streaks matching Special Offer */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 right-10 w-48 h-48 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-[#FB923C] blur-3xl" />
        </div>

        {/* Top Specular Rim Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="relative max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/95 mb-3 border border-white/25">
            VIP ACCESS
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight text-white leading-tight">
            {nlTitle}
          </h2>
          <p className="mt-2.5 text-xs sm:text-[14px] text-white/85 leading-relaxed max-w-md mx-auto">
            {nlBody} Use code <strong className="text-white">{nlCoupon}</strong>.
          </p>

          {newsletterSubscribed ? (
            <div className="mt-5 inline-flex items-center gap-2 p-2.5 px-5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold">
              <CheckCircle2 size={16} />
              <span>You're in! Use coupon <strong className="text-white">{nlCoupon}</strong> at checkout.</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-5 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full sm:flex-1 h-11 sm:h-12 rounded-full px-4.5 bg-white/10 backdrop-blur-md border border-white/20 focus:border-[#FB923C] focus:bg-white/15 focus:ring-2 focus:ring-[#FB923C]/30 text-xs sm:text-sm text-white placeholder:text-white/50 outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#E15B3E] text-white text-xs sm:text-sm font-bold hover:bg-[#D04A2E] active:scale-95 transition-all shadow-md flex-shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-3 text-[10.5px] text-white/50">
            No spam, ever. Unsubscribe anytime with a single click.
          </p>
        </div>
      </section>

      {/* Video Modal (Story) */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#EEEEF0]">
            <h3 className="text-xl font-bold text-[#0F0F14] mb-2">The SETHIZZZ Craft Story</h3>
            <p className="text-sm text-[#52525B] leading-relaxed mb-4">
              Designed out of Dimapur, Nagaland. Watch how our heavyweight fabrics are curated, crafted, and stitched with precision.
            </p>
            <div className="aspect-video rounded-2xl bg-[#0F0F14] flex flex-col items-center justify-center text-white p-6 text-center">
              <PlayCircle size={48} className="text-[#93C5FD] mb-2" />
              <p className="font-bold">Behind the Seams: Dimapur Studio</p>
              <p className="text-xs text-[#A1A1AA] mt-1">4K Documentary Preview (2:15)</p>
            </div>
            <button
              onClick={() => setVideoModalOpen(false)}
              className="mt-5 w-full h-11 rounded-full bg-[#0F0F14] text-white text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

