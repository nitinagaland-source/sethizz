// src/components/products/ProductCarousel.tsx
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../data/mockData';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#0F0F14]">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center hover:border-[#0F0F14] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center hover:border-[#0F0F14] transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Product strip */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[240px] sm:w-[270px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} showDiscount />
          </div>
        ))}
      </div>
    </div>
  );
};
