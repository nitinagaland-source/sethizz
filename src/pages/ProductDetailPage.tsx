// src/pages/ProductDetailPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Sparkles,
  Ruler,
  ChevronDown,
  ChevronLeft,
  Check,
  PackageCheck,
} from 'lucide-react';
import { useStorefrontData } from '../hooks/useStorefrontData';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';
import { ProductCarousel } from '../components/products/ProductCarousel';
import { StickyMobileBuyBar } from '../components/products/StickyMobileBuyBar';
import { SizeGuideModal } from '../components/products/SizeGuideModal';

export const ProductDetailPage: React.FC = () => {
  const { products } = useStorefrontData();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const [selectedColorId, setSelectedColorId] = useState<string>(
    product?.colors[0]?.id ?? 'black'
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.colors[0]?.sizes[0] || 'M'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Sync color selection when product changes
  useEffect(() => {
    if (product?.colors?.[0]) {
      setSelectedColorId(product.colors[0].id);
      setActiveImageIdx(0);
      setSelectedSize(product.colors[0].sizes[0] || null);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F0F14]">Product Not Found</h2>
        <p className="text-sm text-[#71717A]">
          The product you are looking for might have been moved or discontinued.
        </p>
        <Link
          to="/shop"
          className="inline-block h-12 px-6 rounded-full bg-[#0F0F14] text-white text-sm font-semibold leading-[48px]"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const activeColor =
    product.colors.find((c) => c.id === selectedColorId) || product.colors[0];
  const inWishlist = wishlist.includes(product.id);
  const isOnSale = Boolean(product.salePrice && product.salePrice < product.price);
  const displayPrice = isOnSale ? product.salePrice! : product.price;
  const savings = isOnSale ? product.price - product.salePrice! : 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: activeColor.images[activeImageIdx] || activeColor.images[0],
      color: activeColor.name,
      size: selectedSize,
      price: displayPrice,
      quantity,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="pb-24">
      {/* Breadcrumb Navigation */}
      <nav
        className="mt-3.5 sm:mt-1 mb-5 sm:mb-6 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide flex-wrap px-2 sm:px-0"
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
        <Link
          to={`/shop/${product.category}`}
          className="hover:text-zinc-900 transition-colors uppercase tracking-wider text-[10.5px] sm:text-[11px]"
        >
          {product.categoryLabel}
        </Link>
        <ChevronRight size={11} className="text-zinc-300 flex-shrink-0" />
        <span className="text-zinc-900 font-bold truncate max-w-[160px] sm:max-w-[240px]">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Full-Cover Image Stage & Thumbnails */}
        <div>
          <div className="relative aspect-square sm:aspect-[4/4.2] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${selectedColorId}-${activeImageIdx}`}
                src={activeColor.images[activeImageIdx] || activeColor.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* In stock badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.8 rounded-full border border-white/60 text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1 shadow-xs">
              <PackageCheck size={12} />
              <span>In Stock · Ready to Ship</span>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-2.5 overflow-x-auto py-1">
            {activeColor.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIdx(i)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-50 p-1 transition-all border overflow-hidden flex-shrink-0 cursor-pointer ${
                  i === activeImageIdx
                    ? 'border-zinc-950 ring-2 ring-zinc-950/20 shadow-xs scale-102'
                    : 'border-zinc-200 opacity-70 hover:opacity-100 hover:border-zinc-400'
                }`}
              >
                <img
                  src={img}
                  alt={`View angle ${i + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
                  }}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Information Stack */}
        <div className="space-y-4">
          {/* Clean Editorial Header */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400">
              SETHIZZZ · {product.categoryLabel}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-zinc-500">
              {product.details.weight} · {product.details.fabric}
            </p>

            {/* Rating Row */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-zinc-200'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-500">
                {product.reviewCount.toLocaleString('en-IN')} reviews
              </span>
            </div>
          </div>

          {/* Price & Delivery Information */}
          <div className="pt-2 border-t border-zinc-100 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                {formatINR(displayPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-sm text-zinc-400 line-through font-normal">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Save {formatINR(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              Inclusive of all taxes · Free shipping over ₹1,499
            </p>
          </div>

          {/* Product Editorial Description */}
          <p className="text-xs text-zinc-600 leading-relaxed max-w-[55ch]">
            {product.shortDescription}
          </p>

          {/* Color Selection */}
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10.5px]">
                Color
              </span>
              <span className="font-bold text-zinc-900">
                {activeColor.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedColorId(c.id);
                    setActiveImageIdx(0);
                  }}
                  aria-label={c.name}
                  className={`w-7 h-7 rounded-full transition-all relative cursor-pointer ${
                    selectedColorId === c.id
                      ? 'ring-2 ring-offset-2 ring-zinc-950 scale-105 shadow-xs'
                      : 'ring-1 ring-zinc-200 hover:scale-105'
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection + Size Guide */}
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10.5px]">
                Size {selectedSize && <span className="text-zinc-900 font-bold ml-1">({selectedSize})</span>}
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[11px] text-zinc-500 hover:text-zinc-950 font-medium underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Ruler size={12} /> Size Guide
              </button>
            </div>

            {/* Dynamic Sizes Grid */}
            <div className="flex flex-wrap gap-2">
              {activeColor.sizes.map((size) => {
                const isSelected = selectedSize === size;
                const stockCount = activeColor.stock?.[size];
                const isLowStock = stockCount !== undefined && stockCount <= 5 && stockCount > 0;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-9.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'bg-white border border-zinc-200 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{size}</span>
                    {isLowStock && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Low stock" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-2.5 pt-1.5">
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="inline-flex items-center border border-zinc-200 rounded-full bg-white h-10 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-full flex items-center justify-center hover:bg-zinc-100 rounded-full text-zinc-600 cursor-pointer transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center font-bold text-xs text-zinc-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-full flex items-center justify-center hover:bg-zinc-100 rounded-full text-zinc-600 cursor-pointer transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 h-10 sm:h-11 rounded-full theme-flow-btn text-xs font-bold tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                {addedToast ? (
                  <>
                    <Check size={15} className="text-emerald-300" /> Added to Bag!
                  </>
                ) : (
                  'Add to Cart'
                )}
              </motion.button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border transition-all flex items-center justify-center cursor-pointer flex-shrink-0 ${
                  inWishlist
                    ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-rose-400 hover:text-rose-500'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={15} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full h-10 sm:h-10.5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center cursor-pointer uppercase border border-zinc-200"
            >
              Buy Now · Express Checkout
            </motion.button>

            <p className="text-center text-[10.5px] text-zinc-400 pt-0.5">
              Free Express Delivery on orders over ₹1,499 · 15-Day Hassle-Free Returns
            </p>
          </div>

          {/* 2x2 Trust Badges Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { icon: Shield, label: 'Secure 256-Bit SSL Checkout' },
              { icon: Truck, label: 'Express Air Shipping' },
              { icon: RotateCcw, label: '15-Day Doorstep Returns' },
              { icon: Award, label: '100% Combed Heavyweight Cotton' },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs"
              >
                <b.icon size={12} className="text-zinc-600 flex-shrink-0" />
                <span className="text-[10.5px] font-medium text-zinc-700 leading-tight">{b.label}</span>
              </div>
            ))}
          </div>

          {/* SKU and Fabric Detail Note */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>SKU: {product.sku}</span>
            <span>Fabric: {product.details.fabric}</span>
          </div>
        </div>
      </div>

      {/* SECTION: WHY SETHIZZZ? — Compact 3-Column Features without icons */}
      <section className="mt-12 sm:mt-16">
        <div className="text-center mb-5 sm:mb-6">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E15B3E] block mb-1">
            THE ETHOS
          </span>
          <h2 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
            WHY <span className="text-[#FB923C]">SETHIZZZ</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              title: 'Premium Fabric',
              body: 'Heavyweight combed cotton and French terry sourced from the best spinning mills in Tirupur. Pre-shrunk for zero post-wash warping.',
            },
            {
              title: 'Designed in Nagaland',
              body: 'Designed in Dimapur, Nagaland, cut and sewn in clean, ethical facilities. High-density textiles, fair wages, and master craftsmanship.',
            },
            {
              title: 'Structured Boxy Fit',
              body: 'Reinforced 1x1 ribbed collar that won’t sag, clean drop shoulders, and double-needle hem stitching for years of wear.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-3.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-zinc-200/80 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <h3 className="text-xs sm:text-[13.5px] font-bold text-zinc-800 tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-zinc-600 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: CUSTOMER REVIEWS */}
      <section className="mt-14 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#0F0F14]">
              CUSTOMER REVIEWS
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
              Verified buyers sharing fit, fabric, and washing feedback
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap self-start sm:self-auto">
            <div className="flex text-[#F59E0B] flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F0F14] whitespace-nowrap">
              {product.rating.toFixed(1)} / 5.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {product.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {rev.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                      <span className="ml-1 text-[11px] font-bold text-zinc-900">
                        {rev.rating}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ✓ Verified Buyer
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] font-bold text-zinc-900 mb-1">{rev.title}</p>
                <p className="text-xs text-zinc-600 leading-relaxed">{rev.body}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10.5px] text-zinc-400">
                <span>— {rev.author}{rev.city ? `, ${rev.city}` : ''}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: FREQUENTLY ASKED QUESTIONS (Accordion) */}
      <section className="mt-14 sm:mt-20 max-w-3xl mx-auto">
        <h2 className="text-center text-lg sm:text-2xl font-extrabold tracking-tight mb-6 text-zinc-900">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-3">
          {[
            {
              q: 'What is the fabric weight?',
              a: 'Our heavyweight tees are 260 GSM combed cotton and our hoodies are 450 GSM French terry — substantial enough to have clean drape without overheating in Indian weather.',
            },
            {
              q: 'How does the sizing run?',
              a: 'Our oversized silhouettes are true-to-size for a relaxed, drop-shoulder look. If you prefer a slimmer tailored fit, we recommend ordering one size down.',
            },
            {
              q: 'What is the return & exchange policy?',
              a: 'We offer an easy 15-day return and exchange window from the delivery date. Items must be unworn with tags attached. Return pickup is completely free.',
            },
            {
              q: 'How long does delivery take?',
              a: 'Metros (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai): 2–3 business days. Rest of India: 4–6 business days. Free shipping over ₹1,499.',
            },
            {
              q: 'Is Cash on Delivery (COD) available?',
              a: 'Yes, COD is available for all serviceable pin codes across India for orders up to ₹5,000. A standard ₹49 handling fee applies.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-[#EEEEF0] rounded-2xl overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[#F5F5F7]/50 transition-colors"
              >
                <span className="font-bold text-[#0F0F14] text-[15px]">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#71717A] transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180 text-[#1E40AF]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-[#52525B] leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <ProductCarousel
            products={relatedProducts}
            title="RELATED PRODUCTS"
          />
        </section>
      )}

      {/* Mobile Sticky Buy Bar */}
      <StickyMobileBuyBar
        product={product}
        price={displayPrice}
        selectedSize={selectedSize}
        onAddToCart={handleAddToCart}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
        productName={product.name}
        onSelectSize={(s) => setSelectedSize(s)}
        currentSelectedSize={selectedSize}
      />
    </div>
  );
};
