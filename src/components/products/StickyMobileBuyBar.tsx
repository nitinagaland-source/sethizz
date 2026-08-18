// src/components/products/StickyMobileBuyBar.tsx
import React from 'react';
import { Product } from '../../data/mockData';
import { formatINR } from '../../utils/format';

interface StickyMobileBuyBarProps {
  product: Product;
  price: number;
  selectedSize: string | null;
  onAddToCart: () => void;
}

export const StickyMobileBuyBar: React.FC<StickyMobileBuyBarProps> = ({
  product,
  price,
  selectedSize,
  onAddToCart,
}) => {
  return (
    <div className="lg:hidden fixed bottom-[60px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 p-3 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 font-medium truncate max-w-[140px]">{product.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-zinc-950">
              {formatINR(price)}
            </span>
            {selectedSize && (
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                {selectedSize}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 max-w-[160px] h-10 rounded-full theme-flow-btn text-xs font-bold tracking-wider uppercase shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          {selectedSize ? 'Add to Cart' : 'Select Size'}
        </button>
      </div>
    </div>
  );
};
