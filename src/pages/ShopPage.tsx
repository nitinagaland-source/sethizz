// src/pages/ShopPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { Product } from '../data/mockData';
import { useStorefrontData } from '../hooks/useStorefrontData';
import { ProductCard } from '../components/products/ProductCard';
import { formatINR } from '../utils/format';

export const ShopPage: React.FC = () => {
  const { products, categories } = useStorefrontData();
  const { category: routeCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFilter = searchParams.get('search') || '';
  const initialSpecialFilter = searchParams.get('filter') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(routeCategory || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync route param with state
  React.useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(routeCategory);
    }
  }, [routeCategory]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
  const allColors = [
    { id: 'black', name: 'Black', hex: '#0F0F14' },
    { id: 'cream', name: 'Cream', hex: '#F5EFE0' },
    { id: 'rust', name: 'Rust', hex: '#B85C3C' },
    { id: 'charcoal', name: 'Charcoal', hex: '#27272A' },
    { id: 'olive', name: 'Olive', hex: '#4D5645' },
    { id: 'navy', name: 'Navy', hex: '#1E293B' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // URL special filter
        if (initialSpecialFilter === 'deals' && !product.isDeal && !product.salePrice) {
          return false;
        }
        if (initialSpecialFilter === 'new' && !product.isNew) {
          return false;
        }

        // Search filter
        if (searchFilter) {
          const q = searchFilter.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.categoryLabel.toLowerCase().includes(q) ||
            product.shortDescription.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Price filter
        const currentPrice = product.salePrice ?? product.price;
        if (currentPrice > maxPrice) return false;

        // Size filter
        if (selectedSizes.length > 0) {
          const hasMatchingSize = product.colors.some((color) =>
            color.sizes.some((size) => selectedSizes.includes(size))
          );
          if (!hasMatchingSize) return false;
        }

        // Color filter
        if (selectedColors.length > 0) {
          const hasMatchingColor = product.colors.some((color) =>
            selectedColors.includes(color.id)
          );
          if (!hasMatchingColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0;
      });
  }, [
    selectedCategory,
    initialSpecialFilter,
    searchFilter,
    maxPrice,
    selectedSizes,
    selectedColors,
    sortBy,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(5000);
    setSearchParams({});
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const pageTitle = activeCategoryObj
    ? activeCategoryObj.name
    : initialSpecialFilter === 'deals'
    ? 'Deals of the Day'
    : initialSpecialFilter === 'new'
    ? 'New Arrivals'
    : searchFilter
    ? `Search Results for "${searchFilter}"`
    : 'All Products';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav
        className="mt-3 sm:mt-0 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-zinc-900 transition-colors uppercase tracking-wider text-[10.5px] sm:text-[11px]">
          Home
        </Link>
        <ChevronRight size={11} className="text-zinc-300 flex-shrink-0" />
        <Link to="/shop" className="hover:text-zinc-900 transition-colors uppercase tracking-wider text-[10.5px] sm:text-[11px]">
          Shop
        </Link>
        {selectedCategory !== 'all' && (
          <>
            <ChevronRight size={11} className="text-zinc-300 flex-shrink-0" />
            <span className="text-zinc-900 font-bold uppercase tracking-wider text-[10.5px] sm:text-[11px]">{pageTitle}</span>
          </>
        )}
      </nav>

      {/* Header with Title, Count, Sort, Mobile Filter Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEEEF0]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F0F14]">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden h-10 px-4 rounded-full border border-[#E4E4E7] bg-white text-xs font-bold text-[#0F0F14] flex items-center gap-2"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategory !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-full px-3 h-10">
            <ArrowUpDown size={14} className="text-[#71717A]" />
            <span className="text-xs font-semibold text-[#71717A] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0F0F14] outline-none cursor-pointer pr-2"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategory !== 'all' || searchFilter) && (
        <div className="flex items-center gap-2 flex-wrap py-2">
          <span className="text-xs font-semibold text-[#71717A]">Active Filters:</span>

          {searchFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0F7FF] text-[#1E40AF] text-xs font-bold border border-[#BFDBFE]">
              Search: "{searchFilter}"
              <button onClick={() => setSearchParams({})} className="hover:text-[#0F0F14]">
                <X size={12} />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-xs font-bold">
              Category: {pageTitle}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-[#0F0F14]">
                <X size={12} />
              </button>
            </span>
          )}

          {selectedSizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#0F0F14] text-xs font-semibold border border-[#E4E4E7]"
            >
              Size: {size}
              <button onClick={() => toggleSize(size)} className="hover:text-[#EF4444]">
                <X size={12} />
              </button>
            </span>
          ))}

          {selectedColors.map((cId) => (
            <span
              key={cId}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#0F0F14] text-xs font-semibold border border-[#E4E4E7] capitalize"
            >
              Color: {cId}
              <button onClick={() => toggleColor(cId)} className="hover:text-[#EF4444]">
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            onClick={clearAllFilters}
            className="text-xs text-[#EF4444] font-bold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid + Desktop Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-[#EEEEF0] sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF0]">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F0F14] flex items-center gap-1.5">
              <Filter size={14} className="text-[#1E40AF]" /> Filters
            </p>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-[#71717A] hover:text-[#EF4444] font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525B] mb-3">
              Categories
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-sm py-1 px-2 rounded-lg flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'font-bold text-[#1E40AF] bg-[#F0F7FF]'
                    : 'text-[#52525B] hover:text-[#0F0F14]'
                }`}
              >
                <span>All Products</span>
                <span className="text-xs text-[#A1A1AA]">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left text-sm py-1 px-2 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'font-bold text-[#1E40AF] bg-[#F0F7FF]'
                      : 'text-[#52525B] hover:text-[#0F0F14]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-[#A1A1AA]">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525B] mb-3">
              Size
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {allSizes.map((size) => {
                const active = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#0F0F14] text-white'
                        : 'bg-[#F5F5F7] text-[#52525B] hover:bg-[#E4E4E7]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525B] mb-3">
              Color
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {allColors.map((color) => {
                const active = selectedColors.includes(color.id);
                return (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={`w-8 h-8 rounded-full transition-all relative ${
                      active
                        ? 'ring-2 ring-offset-2 ring-[#1E3A8A] scale-110'
                        : 'ring-1 ring-[#E4E4E7] hover:scale-105'
                    }`}
                    style={{ background: color.hex }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525B]">
                Max Price
              </p>
              <span className="text-xs font-bold text-[#1E40AF]">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1E3A8A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#A1A1AA] mt-1 font-mono">
              <span>₹500</span>
              <span>₹5,000</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showDiscount />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EEEEF0] max-w-md mx-auto my-8">
              <p className="text-lg font-bold text-[#0F0F14]">No products match your filters</p>
              <p className="text-sm text-[#71717A] mt-2 leading-relaxed">
                Try widening your price range or clearing specific size/color filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-5 h-11 px-6 rounded-full bg-[#0F0F14] text-white text-sm font-semibold hover:bg-[#27272A]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Bottom Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF0]">
              <h3 className="text-lg font-bold text-[#0F0F14]">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold text-[#52525B] uppercase mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#F5F5F7] text-[#52525B]'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
                      selectedCategory === c.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-[#F5F5F7] text-[#52525B]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-xs font-bold text-[#52525B] uppercase mb-2">Size</p>
              <div className="grid grid-cols-4 gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`h-10 rounded-xl text-xs font-bold ${
                      selectedSizes.includes(size)
                        ? 'bg-[#0F0F14] text-white'
                        : 'bg-[#F5F5F7] text-[#52525B]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply / Close button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white font-bold text-sm shadow-md"
            >
              Apply Filters ({filteredProducts.length} Items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
