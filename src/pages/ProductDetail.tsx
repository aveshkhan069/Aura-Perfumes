import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  Award,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { productsData, initialReviews } from '../data/perfumes';
import { ProductCard } from '../components/ProductCard';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface ProductDetailProps {
  onQuickView?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onQuickView }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = productsData.find((p) => p.id === id || p.slug === id) || productsData[0];

  const [selectedSize, setSelectedSize] = useState<string>(product.size || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'description' | 'reviews'>('notes');

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>(() => {
    return initialReviews.filter((r) => r.productId === product.id);
  });
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(product.size || '100ml');
    setQuantity(1);
    setReviews(initialReviews.filter((r) => r.productId === product.id));
    setHasSubmittedReview(false);
    setActiveImageIdx(0);
  }, [id, product]);

  const isFavorited = isInWishlist(product.id);

  // Price calculations based on selected size
  const sizeOption = product.availableSizes.find((s) => s.size === selectedSize);
  const currentPrice = sizeOption ? sizeOption.price : product.price;
  const currentOrigPrice = sizeOption ? sizeOption.originalPrice : product.originalPrice;
  const discountPct = Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100);

  // Gallery state - allows switching between product images
  const galleryImages = product.images?.length ? product.images : [product.primaryImage || ''];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = galleryImages[activeImageIdx] || galleryImages[0];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    showToast(`Added ${quantity}x ${product.name} to your bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Please fill out all required review fields', 'error');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle || 'Verified Customer Review',
      comment: reviewComment,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setHasSubmittedReview(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    showToast('Your fragrance review has been submitted');
  };

  // Related products based on category or family
  const relatedProducts = productsData
    .filter((p) => p.id !== product.id && (p.category === product.category || p.fragranceFamily === product.fragranceFamily))
    .slice(0, 4);

  return (
    <div className="bg-[#faf9f5] min-h-screen pb-20">
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-xs text-stone-500 space-x-2 font-medium">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to={`/shop/${product.category.toLowerCase()}`} className="hover:text-black transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-semibold truncate">{product.name}</span>
        </nav>
      </div>

      {/* 2. Main Product PDP Grid - Exact Match to Wireframe Panel 03 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            {/* Large Main Showcase Image */}
            <div className="relative aspect-square w-full bg-[#f4f2ee] border border-stone-200/80 overflow-hidden shadow-sm group">
              <img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 animate-fadeIn"
              />

              {/* Wishlist Heart Icon on Top Right */}
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  showToast(isFavorited ? 'Removed from wishlist' : 'Added to your wishlist');
                }}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isFavorited
                    ? 'bg-[#111111] text-[#c5a880] shadow-md'
                    : 'bg-white/90 text-stone-700 hover:text-black hover:bg-white backdrop-blur-sm shadow-md'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 mt-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 border-2 overflow-hidden bg-[#f4f2ee] transition-all duration-200 flex-shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-[#111111] shadow-md'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              {/* Brand and Subtitle */}
              <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">
                {product.brand}
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold mt-1">
                {product.category} {product.concentration}
              </p>

              {/* Rating and Reviews Count */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-[#c5a880]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-[#c5a880]' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800 tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-stone-500 hover:text-black underline cursor-pointer"
                >
                  ({product.reviewCount} customer reviews)
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 py-3 border-y border-stone-200">
              <span className="text-3xl font-bold text-stone-950 tabular-nums">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentOrigPrice > currentPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ₹{currentOrigPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Narrative Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector - Wireframe Panel 03 */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2.5">
                <span>Select Size</span>
                <span className="text-stone-400 normal-case font-normal text-[11px]">
                  Flacon with magnetic cap
                </span>
              </div>
              <div className="flex gap-3">
                {product.availableSizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`flex-1 py-3 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                      selectedSize === s.size
                        ? 'border-black bg-stone-900 text-white shadow-xs'
                        : 'border-stone-300 bg-white text-stone-800 hover:border-black'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                      ₹{s.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold tabular-nums text-stone-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Buy Now Secondary CTA */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#f2eee9] hover:bg-[#eae4dc] text-stone-900 border border-stone-300 text-xs uppercase tracking-widest font-semibold py-3 cursor-pointer transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges Bar - Wireframe Panel 03 */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200 text-center text-stone-600">
              <div className="flex flex-col items-center p-2">
                <Clock className="w-5 h-5 text-[#c5a880] mb-1 stroke-[1.5]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-900">
                  Long Lasting
                </span>
                <span className="text-[10px] text-stone-400">{product.longevity}</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <Truck className="w-5 h-5 text-[#c5a880] mb-1 stroke-[1.5]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-900">
                  Free Shipping
                </span>
                <span className="text-[10px] text-stone-400">Above ₹999</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <ShieldCheck className="w-5 h-5 text-[#c5a880] mb-1 stroke-[1.5]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-900">
                  100% Original
                </span>
                <span className="text-[10px] text-stone-400">Authentic Batch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS SECTION (Fragrance Notes, Description, Reviews) - Exact Match to Wireframe Panel 03 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white border border-stone-200/90 shadow-xs">
          {/* Tab Navigation Header */}
          <div className="flex border-b border-stone-200">
            {[
              { id: 'notes', label: 'Fragrance Notes' },
              { id: 'description', label: 'Description & Olfactory Story' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 sm:px-8 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === tab.id
                    ? 'text-stone-950 bg-white'
                    : 'text-stone-500 hover:text-stone-900 bg-stone-50/50'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Fragrance Notes - Wireframe Panel 03 */}
          {activeTab === 'notes' && (
            <div className="p-6 sm:p-10 space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-2">
                  The Olfactory Pyramid
                </h3>
                <p className="text-xs text-stone-500">
                  Crafted by master perfumers to unfold progressively over hours on your skin.
                </p>
              </div>

              {/* 3 Fragrance Notes Cards with Images - Wireframe Panel 03 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Notes */}
                <div className="bg-[#faf9f5] border border-stone-200 p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full mb-4 border-2 border-stone-200 shadow-xs">
                    <img
                      src="/src/assets/images/notes_citrus_spice_1790347646136.jpg"
                      alt="Top Notes Ingredients"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">
                    Initial Impression (0-30 min)
                  </span>
                  <h4 className="font-serif-luxury text-xl font-semibold text-stone-900 mt-1 mb-2">
                    Top Notes
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {product.topNotes.join(', ')}
                  </p>
                </div>

                {/* Heart / Middle Notes */}
                <div className="bg-[#faf9f5] border border-stone-200 p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full mb-4 border-2 border-stone-200 shadow-xs">
                    <img
                      src="/src/assets/images/notes_lavender_woods_1790347654940.jpg"
                      alt="Heart Notes Ingredients"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">
                    The Soul (30 min - 4 hours)
                  </span>
                  <h4 className="font-serif-luxury text-xl font-semibold text-stone-900 mt-1 mb-2">
                    Middle Notes
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {product.heartNotes.join(', ')}
                  </p>
                </div>

                {/* Base Notes */}
                <div className="bg-[#faf9f5] border border-stone-200 p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full mb-4 border-2 border-stone-200 shadow-xs">
                    <img
                      src="/src/assets/images/notes_amber_musk_1790347665951.jpg"
                      alt="Base Notes Ingredients"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">
                    The Memory (4-12+ hours)
                  </span>
                  <h4 className="font-serif-luxury text-xl font-semibold text-stone-900 mt-1 mb-2">
                    Base Notes
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {product.baseNotes.join(', ')}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-8 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                    Fragrance Family
                  </span>
                  <strong className="text-stone-900 text-sm mt-0.5 block">
                    {product.fragranceFamily}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                    Concentration
                  </span>
                  <strong className="text-stone-900 text-sm mt-0.5 block">
                    {product.concentration}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                    Longevity
                  </span>
                  <strong className="text-stone-900 text-sm mt-0.5 block">
                    {product.longevity}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                    Recommended Occasion
                  </span>
                  <strong className="text-stone-900 text-sm mt-0.5 block">
                    {product.occasion}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Full Description */}
          {activeTab === 'description' && (
            <div className="p-6 sm:p-10 space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-3">
                  About {product.name}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2">
                  Artisanal Sourcing & Formula
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Every flacon is filled under pristine atmospheric conditions. We utilize sustainably
                  harvested botanicals and organic alcohol bases to ensure maximum pure oil evaporation
                  and true-to-character skin projection.
                </p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2">
                  Complete Ingredients
                </h4>
                <p className="text-xs text-stone-400 font-mono leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-6 sm:p-10 space-y-10">
              {/* Reviews Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-stone-200">
                <div className="md:col-span-4 text-center md:text-left">
                  <div className="text-5xl font-serif-luxury font-bold text-stone-950 tabular-nums">
                    {product.rating.toFixed(1)}
                  </div>
                  <div className="flex justify-center md:justify-start text-[#c5a880] my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-[#c5a880]' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-500">
                    Based on {reviews.length} authentic customer reviews
                  </p>
                </div>

                <div className="md:col-span-8 space-y-2 text-xs">
                  {[
                    { stars: 5, pct: '85%' },
                    { stars: 4, pct: '12%' },
                    { stars: 3, pct: '3%' },
                    { stars: 2, pct: '0%' },
                    { stars: 1, pct: '0%' },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-12 text-stone-600 font-medium">{row.stars} Stars</span>
                      <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#c5a880] h-full" style={{ width: row.pct }} />
                      </div>
                      <span className="w-10 text-right text-stone-400 tabular-nums">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Customer Testimonials
                </h4>

                <div className="divide-y divide-stone-100">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="py-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-stone-900">{rev.userName}</span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>

                      <div className="flex text-[#c5a880]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-[#c5a880]' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>

                      <h5 className="font-serif-luxury text-sm font-semibold text-stone-900">
                        {rev.title}
                      </h5>

                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write a Review Form */}
              <div className="pt-8 border-t border-stone-200">
                <h4 className="font-serif-luxury text-xl font-bold text-stone-900 mb-4">
                  Write an Honest Fragrance Review
                </h4>

                {hasSubmittedReview ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 text-xs rounded">
                    Thank you! Your verified review has been posted and will help other perfume lovers.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Rohini Roy"
                          className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                          Rating *
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                        >
                          <option value={5}>5 Stars - Pure Masterpiece</option>
                          <option value={4}>4 Stars - Very Impressive</option>
                          <option value={3}>3 Stars - Pleasant Scent</option>
                          <option value={2}>2 Stars - Not for my skin</option>
                          <option value={1}>1 Star - Disappointed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                        Review Headline
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Sum up your experience in one sentence"
                        className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                        Fragrance Comments & Longevity *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How did this fragrance develop on your skin? Notes, longevity, compliments?"
                        className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 cursor-pointer transition-colors"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. You May Also Like - Wireframe Section 15 */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-stone-300">
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                You May Also Like
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Complementary fragrances sharing note harmonies and olfactory depth
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-[#c5a880] transition-colors"
            >
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
