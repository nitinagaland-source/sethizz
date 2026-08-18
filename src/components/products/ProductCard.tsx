// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../data/mockData';
import { formatINR } from '../../utils/format';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDiscount = false,
  compact = false,
}) => {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const [justAdded, setJustAdded] = React.useState(false);
  const inWishlist = wishlist.includes(product.id);
  const isOnSale = Boolean(product.salePrice && product.salePrice < product.price);
  const discount = isOnSale
    ? Math.round((1 - (product.salePrice! / product.price)) * 100)
    : 0;

  const activeColor = product.colors[0];
  const activeImage = activeColor?.images[0] || '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: activeImage,
      color: activeColor.name,
      size: activeColor.sizes[0] || 'M',
      price: product.salePrice ?? product.price,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
        {/* Product Image Box */}
        <div
          className={`relative aspect-[3/3.7] w-full rounded-2xl bg-[#F8F8F9] border border-zinc-200/80 p-0 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#E15B3E]/40 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
        >
          {/* Badge: Discount or New */}
          {isOnSale && showDiscount ? (
            <span
              className={`absolute top-2 left-2 z-10 bg-[#E15B3E] text-white font-extrabold rounded-full shadow-xs tracking-tight ${
                compact ? 'text-[9.5px] px-1.5 py-0.5' : 'text-[10.5px] px-2 py-0.5'
              }`}
            >
              -{discount}%
            </span>
          ) : product.isNew ? (
            <span
              className={`absolute top-2 left-2 z-10 bg-zinc-900/90 backdrop-blur-md text-white font-bold tracking-wider rounded-full uppercase ${
                compact ? 'text-[8.5px] px-1.5 py-0.5' : 'text-[9.5px] px-2 py-0.5'
              }`}
            >
              New
            </span>
          ) : null}

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 z-10 rounded-full bg-white/90 backdrop-blur-xs border border-white/70 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all ${
              compact ? 'w-6.5 h-6.5' : 'w-8 h-8'
            }`}
            aria-label="Wishlist"
          >
            <Heart
              size={compact ? 12 : 14}
              className={inWishlist ? 'fill-[#E15B3E] text-[#E15B3E]' : 'text-zinc-600'}
            />
          </button>

          {/* Product Image */}
          <img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85';
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />

          {/* Top Subtle Specular Line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Quick Add Button — pops up on hover */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`absolute bottom-2 right-2 z-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 ${
              compact ? 'w-7.5 h-7.5' : 'w-9 h-9'
            } ${
              justAdded
                ? 'bg-emerald-600 text-white opacity-100 translate-y-0 scale-105'
                : 'bg-zinc-900/90 backdrop-blur-md text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#E15B3E]'
            }`}
            aria-label="Quick add"
          >
            {justAdded ? (
              <Check size={compact ? 13 : 15} />
            ) : (
              <ShoppingBag size={compact ? 13 : 15} />
            )}
          </button>
        </div>

        {/* Product Meta - Soft, Premium Graphite & Warm Neutrals without harsh black text */}
        <div className={`mt-1.5 px-0.5 flex flex-col flex-1 ${compact ? 'space-y-0' : 'mt-2 space-y-0.5'}`}>
          <div className="flex items-center justify-between gap-1">
            <span className={`${compact ? 'text-[9.5px]' : 'text-[10px]'} uppercase tracking-wider text-zinc-500 font-bold truncate`}>
              {product.categoryLabel}
            </span>
          </div>

          <p
            className={`font-semibold text-zinc-800 leading-tight line-clamp-1 group-hover:text-[#E15B3E] transition-colors tracking-tight ${
              compact ? 'text-[12px] sm:text-[13px]' : 'text-[14px]'
            }`}
          >
            {product.name}
          </p>

          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span
              className={`font-bold text-zinc-900 tracking-tight ${
                compact ? 'text-[13px] sm:text-[14px]' : 'text-[15px]'
              }`}
            >
              {formatINR(product.salePrice ?? product.price)}
            </span>
            {isOnSale && (
              <span
                className={`${
                  compact ? 'text-[10px]' : 'text-[11px]'
                } text-zinc-400 line-through font-medium`}
              >
                {formatINR(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
