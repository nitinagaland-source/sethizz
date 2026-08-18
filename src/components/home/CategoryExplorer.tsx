import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  image: string;
  link: string;
}

interface EditorialLook {
  id: string;
  title: string;
  price: string;
  image: string;
  thumbnail: string;
  link: string;
}

// Curated high-fashion editorial images matching the exact reference design
const womenCategories: CategoryItem[] = [
  {
    id: 'w-dresses',
    name: 'Dresses',
    count: 16,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=tees',
  },
  {
    id: 'w-blouses',
    name: 'Blouses',
    count: 12,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=tees',
  },
  {
    id: 'w-outerwear',
    name: 'Outerwear',
    count: 12,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=jackets',
  },
  {
    id: 'w-knitwear',
    name: 'Knitwear',
    count: 12,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=hoodies',
  },
  {
    id: 'w-bags',
    name: 'Bags',
    count: 12,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bags',
  },
  {
    id: 'w-trousers',
    name: 'Trousers',
    count: 12,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bottoms',
  },
  {
    id: 'w-skirts',
    name: 'Skirts',
    count: 12,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bottoms',
  },
  {
    id: 'w-shoes',
    name: 'Shoes',
    count: 12,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bottoms',
  },
];

const menCategories: CategoryItem[] = [
  {
    id: 'm-tees',
    name: 'Tees',
    count: 18,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=tees',
  },
  {
    id: 'm-shirts',
    name: 'Overshirts',
    count: 12,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=tees',
  },
  {
    id: 'm-jackets',
    name: 'Outerwear',
    count: 16,
    image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=jackets',
  },
  {
    id: 'm-hoodies',
    name: 'Knitwear',
    count: 14,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=hoodies',
  },
  {
    id: 'm-bags',
    name: 'Bags',
    count: 8,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bags',
  },
  {
    id: 'm-trousers',
    name: 'Trousers',
    count: 15,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bottoms',
  },
  {
    id: 'm-caps',
    name: 'Caps',
    count: 10,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=caps',
  },
  {
    id: 'm-shoes',
    name: 'Shoes',
    count: 22,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=85',
    link: '/shop?category=bottoms',
  },
];

const editorialLooks: EditorialLook[] = [
  {
    id: 'look-1',
    title: 'Check shirt with pocket',
    price: '$22.99',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=jackets',
  },
  {
    id: 'look-2',
    title: 'Boxy denim overshirt',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=bottoms',
  },
  {
    id: 'look-3',
    title: 'Rustic linen blend shirt',
    price: '$59.99',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=tees',
  },
  {
    id: 'look-4',
    title: 'Basic tailored blazer',
    price: '$109.00',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=jackets',
  },
  {
    id: 'look-5',
    title: 'Check shirt with pocket',
    price: '$22.99',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=tees',
  },
  {
    id: 'look-6',
    title: 'Boxy denim overshirt',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&auto=format&fit=crop&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&auto=format&fit=crop&q=80',
    link: '/shop?category=hoodies',
  },
];

export const CategoryExplorer: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'women' | 'men'>('women');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -160 : 160;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentCategories = selectedGender === 'women' ? womenCategories : menCategories;

  return (
    <>
      <style>{`
        @keyframes luxuryColorFlow {
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

        .title-color-flow {
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
          animation: luxuryColorFlow 6s ease-in-out infinite;
        }

        .palette-title-flow {
          background: linear-gradient(
            90deg,
            #0f172a 0%,
            #1e3a8a 20%,
            #6d28d9 45%,
            #9333ea 68%,
            #2563eb 88%,
            #0f172a 100%
          );
          background-size: 250% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: luxuryColorFlow 6.5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-[1240px] mx-auto space-y-12 sm:space-y-14 md:space-y-16">
        {/* 1. Explore Categories / Shop by Category Row */}
        <section id="explore-categories-section">
          {/* Header with BROWSE tag, Title, and Gender Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 md:mb-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E15B3E] block mb-1">
                BROWSE
              </span>
              <h2 className="title-color-flow text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight leading-tight text-[#0F0F14]">
                Explore Categories
              </h2>
            </div>

            {/* Gender Pill Toggle & Directional Scroll Arrows */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-full border border-zinc-200/80 backdrop-blur-xs shadow-xs">
                <button
                  type="button"
                  onClick={() => setSelectedGender('women')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    selectedGender === 'women'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span>Women</span>
                  <span
                    className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-colors ${
                      selectedGender === 'women'
                        ? 'bg-[#E15B3E] text-white'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    34
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGender('men')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    selectedGender === 'men'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span>Men</span>
                  <span
                    className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-colors ${
                      selectedGender === 'men'
                        ? 'bg-[#E15B3E] text-white'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    32
                  </span>
                </button>
              </div>

              {/* Mobile Scroll Arrows */}
              <div className="flex sm:hidden items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-700 active:scale-90 hover:bg-zinc-50 transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-700 active:scale-90 hover:bg-zinc-50 transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Cards: Horizontal Swipe Scroll on Mobile ONLY, 8-Column Grid on Desktop */}
          <div className="relative group/carousel">
            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-2.5 md:gap-3 overflow-x-auto sm:overflow-visible scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 -mx-4 sm:px-0 sm:mx-0 py-1.5"
            >
              <AnimatePresence mode="wait">
                {currentCategories.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, delay: idx * 0.025 }}
                    className="flex-shrink-0 w-[96px] sm:w-auto snap-start"
                  >
                    <Link
                      to={cat.link}
                      className="group flex flex-col block cursor-pointer select-none"
                    >
                      {/* Luxury Portrait Card Container */}
                      <div className="w-full aspect-[3/4] sm:aspect-[3/3.8] rounded-xl sm:rounded-2xl overflow-hidden relative bg-zinc-900 border border-black sm:border-black/90 shadow-[0_3px_10px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] group-hover:border-black group-hover:-translate-y-1.5 active:scale-95">
                        {/* High-Res Fashion Editorial Image */}
                        <img
                          src={cat.image}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        {/* High-Fashion Gradient Scrim for Contrast & Depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none opacity-90 sm:opacity-40 sm:group-hover:opacity-80 transition-opacity duration-300" />

                        {/* Top Accent Rim & Glass Glint */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                        {/* Mobile Overlay Content (Name + Count inside the card for high luxury look) */}
                        <div className="absolute inset-x-0 bottom-0 p-2 flex flex-col justify-end pointer-events-none sm:hidden">
                          <div className="flex items-center justify-between gap-0.5">
                            <span className="text-[11px] font-bold text-white tracking-tight leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] truncate">
                              {cat.name}
                            </span>
                            <span className="text-[8.5px] font-bold px-1 py-0.2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex-shrink-0">
                              {cat.count}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Corner Count Badge */}
                        <span className="hidden sm:flex absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-white/95 backdrop-blur-md text-zinc-900 text-[10px] font-bold items-center justify-center shadow-xs border border-white/60 group-hover:bg-[#0F0F14] group-hover:text-white transition-colors">
                          {cat.count}
                        </span>
                      </div>

                      {/* Desktop Label Below Card */}
                      <span className="hidden sm:block mt-2 text-xs font-semibold text-zinc-800 text-center group-hover:text-[#E15B3E] transition-colors truncate max-w-full">
                        {cat.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 2. Editorial Lookbooks ("Colours that define a season") */}
        <section id="palette-edit-section">
          {/* Header */}
          <div className="mb-4 md:mb-5">
            <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E15B3E] block mb-1">
              SS26 — PALETTE EDIT
            </span>
            <h2 className="palette-title-flow text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight leading-tight text-[#0F0F14]">
              Colours that define a season
            </h2>
          </div>

          {/* Mobile: 2-Column Dynamic Editorial Bento Layout with Alternating Shapes */}
          <div className="grid grid-cols-2 sm:hidden gap-2.5 items-start">
            {/* Column 1 on Mobile */}
            <div className="flex flex-col gap-2.5">
              {/* Look 1: Tall Editorial with Arch Top Left Corner */}
              <EditorialCard
                look={editorialLooks[0]}
                shapeStyle="arch-left"
                mobileHeight="tall"
                tagLabel="NEW LOOK"
              />
              {/* Look 3: Squarish Editorial with Soft Contour */}
              <EditorialCard
                look={editorialLooks[2]}
                shapeStyle="soft-pill"
                mobileHeight="compact"
                tagLabel="LINEN"
              />
              {/* Look 5: Asymmetric High Arch */}
              <EditorialCard
                look={editorialLooks[4]}
                shapeStyle="arch-right"
                mobileHeight="standard"
                tagLabel="ESSENTIAL"
              />
            </div>

            {/* Column 2 on Mobile */}
            <div className="flex flex-col gap-2.5">
              {/* Look 2: Standard Editorial with Arch Top Right Corner */}
              <EditorialCard
                look={editorialLooks[1]}
                shapeStyle="arch-right"
                mobileHeight="compact"
                tagLabel="DENIM"
              />
              {/* Look 4: Tall Editorial with Architectural Tailoring */}
              <EditorialCard
                look={editorialLooks[3]}
                shapeStyle="arch-left"
                mobileHeight="tall"
                tagLabel="TAILORED"
              />
              {/* Look 6: Pill Rounded Contour */}
              <EditorialCard
                look={editorialLooks[5]}
                shapeStyle="soft-pill"
                mobileHeight="standard"
                tagLabel="OVERSIZED"
              />
            </div>
          </div>

          {/* Desktop & Tablet: 3-Column 6-Card Editorial Bento Grid matching exact reference with tight gaps */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-3.5 items-start">
            {/* Column 1: Look 1 & Look 2 (Equal Height) */}
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-3.5">
              <EditorialCard look={editorialLooks[0]} variant="medium" />
              <EditorialCard look={editorialLooks[1]} variant="medium" />
            </div>

            {/* Column 2: Look 3 (Taller) & Look 4 (Shorter) */}
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-3.5">
              <EditorialCard look={editorialLooks[2]} variant="tall" />
              <EditorialCard look={editorialLooks[3]} variant="short" />
            </div>

            {/* Column 3: Look 5 (Taller) & Look 6 (Shorter) */}
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-3.5">
              <EditorialCard look={editorialLooks[4]} variant="tall" />
              <EditorialCard look={editorialLooks[5]} variant="short" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

interface EditorialCardProps {
  look: EditorialLook;
  variant?: 'medium' | 'tall' | 'short';
  shapeStyle?: 'standard' | 'arch-left' | 'arch-right' | 'soft-pill';
  mobileHeight?: 'tall' | 'compact' | 'standard';
  tagLabel?: string;
}

const EditorialCard: React.FC<EditorialCardProps> = ({
  look,
  variant = 'medium',
  shapeStyle = 'standard',
  mobileHeight,
  tagLabel,
}) => {
  // Mobile dynamic heights and shapes
  const mobileHeightClass =
    mobileHeight === 'tall'
      ? 'aspect-[3/4.6] min-h-[220px]'
      : mobileHeight === 'compact'
      ? 'aspect-[3/3.6] min-h-[175px]'
      : 'aspect-[3/4.0] min-h-[195px]';

  const desktopHeightClass =
    variant === 'tall'
      ? 'sm:aspect-[4/5.0] sm:max-h-[385px]'
      : variant === 'short'
      ? 'sm:aspect-[4/3.1] sm:max-h-[235px]'
      : 'sm:aspect-[4/4.0] sm:max-h-[305px]';

  // Different high-fashion architectural corner silhouettes for variety
  const shapeClass =
    shapeStyle === 'arch-left'
      ? 'rounded-tl-[2.2rem] rounded-tr-xl rounded-b-xl sm:rounded-3xl'
      : shapeStyle === 'arch-right'
      ? 'rounded-tr-[2.2rem] rounded-tl-xl rounded-b-xl sm:rounded-3xl'
      : shapeStyle === 'soft-pill'
      ? 'rounded-2xl sm:rounded-3xl'
      : 'rounded-xl sm:rounded-3xl';

  return (
    <div
      className={`relative overflow-hidden ${mobileHeightClass} ${desktopHeightClass} ${shapeClass} w-full group border-[0.5px] border-zinc-200/80 sm:border-zinc-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] bg-zinc-950 transition-all duration-500 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:scale-[0.98]`}
    >
      {/* Background Editorial Image */}
      <img
        src={look.image}
        alt={look.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
      />

      {/* High-Fashion Gradient Scrim for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

      {/* Top Specular Rim */}
      <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Top Editorial Pill Tag on Mobile (if provided) */}
      {tagLabel && (
        <div className="sm:hidden absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[8px] font-extrabold tracking-[0.16em] uppercase text-white/95 border-[0.5px] border-white/25 shadow-xs">
            {tagLabel}
          </span>
        </div>
      )}

      {/* Floating Black Glass Tag inside Card */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-zinc-950/90 sm:bg-black/90 backdrop-blur-md border-[0.5px] border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-between gap-1.5 transition-all duration-300 group-hover:bg-black group-hover:border-white/30">
        {/* Left Side: Thumbnail & Title/Price */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg overflow-hidden bg-zinc-900 border-[0.5px] border-white/25 flex-shrink-0 shadow-xs">
            <img
              src={look.thumbnail}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] sm:text-[13px] font-bold text-zinc-100 truncate leading-tight">
              {look.title}
            </p>
            <p className="text-[9px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
              {look.price}
            </p>
          </div>
        </div>

        {/* Right Side: Terracotta Pill Button */}
        <Link
          to={look.link}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#E15B3E] hover:bg-[#D04A2E] active:scale-95 text-white text-[9.5px] sm:text-xs font-bold whitespace-nowrap shadow-xs hover:shadow-md transition-all flex-shrink-0 flex items-center gap-0.5 cursor-pointer"
        >
          <span>Shop</span>
        </Link>
      </div>
    </div>
  );
};
