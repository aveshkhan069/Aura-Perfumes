import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { productsData } from '../data/perfumes';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    const matches = productsData.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.fragranceFamily.toLowerCase().includes(q) ||
        p.topNotes.some(n => n.toLowerCase().includes(q)) ||
        p.heartNotes.some(n => n.toLowerCase().includes(q)) ||
        p.baseNotes.some(n => n.toLowerCase().includes(q))
    );
    setResults(matches.slice(0, 6));
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
        <div className="relative bg-white w-full max-w-2xl shadow-2xl p-6 border border-stone-200 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Fragrance Search
            </span>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-900 p-1"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by perfume name, brand (e.g. Dior, AURA), or note (e.g. Bergamot, Oud)..."
              className="w-full bg-[#f8f7f4] border border-stone-300 pl-11 pr-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Suggested searches if empty */}
          {!searchTerm && (
            <div className="mt-6">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['AURA Noir', 'Oud Wood', 'Velvet Rose', 'Dior Sauvage', 'Citrus Dream', 'Bergamot'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchTerm(item)}
                    className="text-xs px-3 py-1.5 bg-[#f4f1ec] text-stone-700 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                <span>Matching Fragrances ({results.length})</span>
                <button
                  onClick={handleViewAll}
                  className="text-stone-900 font-medium hover:text-[#c5a880] flex items-center gap-1"
                >
                  View all results <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-4 py-2.5 px-2 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images?.[0] || '/src/assets/images/hero_aura_perfume_1790347541852.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">
                        {product.brand} · {product.category}
                      </div>
                      <h4 className="font-serif-luxury text-base font-semibold text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">
                        {product.topNotes.slice(0, 3).join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && results.length === 0 && (
            <div className="py-8 text-center text-xs text-stone-500">
              No fragrances found matching "{searchTerm}". Try searching for "Oud", "Rose", or "Men".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
