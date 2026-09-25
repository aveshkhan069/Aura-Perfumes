import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { productsData } from '../data/perfumes';
import { ProductCard } from '../components/ProductCard';
import { Product, FragranceGender } from '../types';

interface ShopProps {
  onQuickView: (product: Product) => void;
  forcedCategory?: FragranceGender;
}

export const Shop: React.FC<ShopProps> = ({ onQuickView, forcedCategory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Filters State
  const initialCategory = forcedCategory || searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const itemsPerPage = 6;

  // Sync when route or forcedCategory changes
  useEffect(() => {
    if (forcedCategory) {
      setSelectedCategory(forcedCategory);
    } else {
      const catParam = searchParams.get('category');
      if (catParam) setSelectedCategory(catParam);
    }

    const searchParam = searchParams.get('search');
    if (searchParam) setSearchQuery(searchParam);

    const filterParam = searchParams.get('filter');
    if (filterParam === 'bestseller') setSortBy('popularity');
    if (filterParam === 'new') setSortBy('newest');

    setCurrentPage(1);
  }, [forcedCategory, searchParams, location.pathname]);

  // Brand Options
  const brands = ['AURA', 'Dior', 'Chanel', 'Versace', 'Tom Ford', 'Giorgio Armani', 'Creed', 'Lancôme'];

  // Categories with counts
  const categoryCounts = useMemo(() => {
    return {
      All: productsData.length,
      Men: productsData.filter((p) => p.category === 'Men').length,
      Women: productsData.filter((p) => p.category === 'Women').length,
      Unisex: productsData.filter((p) => p.category === 'Unisex').length,
    };
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        // Category
        if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Brand
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        // Fragrance Family
        if (selectedFamily !== 'all' && product.fragranceFamily !== selectedFamily) {
          return false;
        }

        // Price Range
        if (selectedPriceRange === 'under-1000' && product.price >= 1000) return false;
        if (selectedPriceRange === '1000-2000' && (product.price < 1000 || product.price > 2000)) return false;
        if (selectedPriceRange === '2000-3000' && (product.price < 2000 || product.price > 3000)) return false;
        if (selectedPriceRange === 'above-3000' && product.price <= 3000) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.fragranceFamily.toLowerCase().includes(q) ||
            product.topNotes.some((n) => n.toLowerCase().includes(q)) ||
            product.heartNotes.some((n) => n.toLowerCase().includes(q)) ||
            product.baseNotes.some((n) => n.toLowerCase().includes(q));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        // popularity
        return b.reviewCount - a.reviewCount;
      });
  }, [selectedCategory, selectedBrands, selectedFamily, selectedPriceRange, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory(forcedCategory || 'All');
    setSelectedBrands([]);
    setSelectedPriceRange('all');
    setSelectedFamily('all');
    setSearchQuery('');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const pageTitle = forcedCategory
    ? `${forcedCategory}'s Fragrance Collection`
    : 'Shop All Perfumes';

  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. Header Banner - Exact Match to Wireframe Panel 02 */}
      <div className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 text-center border-b border-stone-800">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm font-light mt-2 max-w-lg mx-auto">
          Find your perfect fragrance formulated with master perfumery oils and noble ingredients.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. Top Filter Controls Bar - Wireframe Panel 02 */}
        <div className="bg-white p-4 border border-stone-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            {!forcedCategory && (
              <div className="relative min-w-[150px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-stone-50 border border-stone-300 px-3.5 py-2 text-xs font-medium text-stone-900 pr-8 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="All">All Categories ({categoryCounts.All})</option>
                  <option value="Men">Men ({categoryCounts.Men})</option>
                  <option value="Women">Women ({categoryCounts.Women})</option>
                  <option value="Unisex">Unisex ({categoryCounts.Unisex})</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative min-w-[170px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-300 px-3.5 py-2 text-xs font-medium text-stone-900 pr-8 focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="newest">Sort by: New Arrivals</option>
                <option value="rating">Sort by: Customer Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3.5 py-2 text-xs font-medium text-stone-900 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({selectedBrands.length + (selectedPriceRange !== 'all' ? 1 : 0)})</span>
            </button>
          </div>

          {/* Search Box on Right */}
          <div className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search perfumes..."
              className="w-full bg-stone-50 border border-stone-300 pl-3.5 pr-10 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-black"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Main Content: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                  Filters
                </h3>
                {(selectedBrands.length > 0 || selectedPriceRange !== 'all' || selectedFamily !== 'all') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-[#c5a880] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {(['All', 'Men', 'Women', 'Unisex'] as const).map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-stone-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                          onChange={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                          }}
                          className="accent-stone-900"
                        />
                        <span className={selectedCategory.toLowerCase() === cat.toLowerCase() ? 'font-semibold text-stone-950' : ''}>
                          {cat}
                        </span>
                      </div>
                      <span className="text-stone-400 tabular-nums">({categoryCounts[cat]})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter - Wireframe Panel 02 */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
                  Price Range
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-1000', label: 'Under ₹1,000' },
                    { id: '1000-2000', label: '₹1,000 - ₹2,000' },
                    { id: '2000-3000', label: '₹2,000 - ₹3,000' },
                    { id: 'above-3000', label: 'Above ₹3,000' },
                  ].map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-stone-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.id}
                        onChange={() => {
                          setSelectedPriceRange(range.id);
                          setCurrentPage(1);
                        }}
                        className="accent-stone-900"
                      />
                      <span className={selectedPriceRange === range.id ? 'font-semibold text-stone-950' : ''}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter - Wireframe Panel 02 */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
                  Brand
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-stone-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="accent-stone-900 rounded-none"
                      />
                      <span className={selectedBrands.includes(brand) ? 'font-semibold text-stone-950' : ''}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fragrance Family */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
                  Fragrance Family
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {['all', 'Woody', 'Floral', 'Fresh', 'Citrus', 'Oriental', 'Gourmand', 'Aromatic'].map((family) => (
                    <label
                      key={family}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-stone-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="fragranceFamily"
                        checked={selectedFamily === family}
                        onChange={() => {
                          setSelectedFamily(family);
                          setCurrentPage(1);
                        }}
                        className="accent-stone-900"
                      />
                      <span className={selectedFamily === family ? 'font-semibold text-stone-950' : ''}>
                        {family === 'all' ? 'All Families' : family}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area (3 Columns on Desktop as Wireframe Panel 02) */}
          <main className="lg:col-span-3">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-stone-200">
                <h3 className="font-serif-luxury text-2xl text-stone-900 mb-2">
                  No Fragrances Found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                  We could not find any perfumes matching your exact filter criteria. Try adjusting your
                  budget or clearing active filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-2.5 hover:bg-[#252525] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>

                {/* 4. Pagination - Wireframe Panel 02 (< 1 2 3 >) */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 border border-stone-300 flex items-center justify-center text-stone-700 hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#111111] text-white border border-[#111111]'
                              : 'bg-white text-stone-700 border border-stone-300 hover:border-black'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 border border-stone-300 flex items-center justify-center text-stone-700 hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif-luxury text-xl font-bold">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6 flex-1">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  {(['All', 'Men', 'Women', 'Unisex'] as const).map((cat) => (
                    <label key={cat} className="flex items-center gap-2 py-1">
                      <input
                        type="radio"
                        name="mob-category"
                        checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <h4 className="text-xs uppercase tracking-wider font-semibold mb-2">Price Range</h4>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-1000', label: 'Under ₹1,000' },
                    { id: '1000-2000', label: '₹1,000 - ₹2,000' },
                    { id: '2000-3000', label: '₹2,000 - ₹3,000' },
                    { id: 'above-3000', label: 'Above ₹3,000' },
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-2 py-1">
                      <input
                        type="radio"
                        name="mob-price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#111111] text-white py-3 text-xs uppercase tracking-widest font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
