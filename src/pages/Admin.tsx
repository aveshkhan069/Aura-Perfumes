import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, DollarSign, Users, ShoppingBag, Check, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsData } from '../data/perfumes';
import { Product, Order } from '../types';
import { useToast } from '../context/ToastContext';

export const Admin: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(productsData);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');

  // Modal / Form state for Product adding/editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'AURA',
    category: 'Men' as 'Men' | 'Women' | 'Unisex',
    price: 1999,
    originalPrice: 2499,
    concentration: 'Eau de Parfum',
    fragranceFamily: 'Woody' as any,
    size: '100ml',
    stock: 25,
    topNotes: 'Bergamot, Lemon, Pepper',
    heartNotes: 'Lavender, Cedarwood',
    baseNotes: 'Musk, Amber, Vanilla',
    description: '',
    longevity: '8-10 Hours',
    season: 'Autumn / Winter',
    occasion: 'Evening',
  });

  useEffect(() => {
    // Fetch orders from API
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.grandTotal, 0) + 48200; // includes seeded historical demo revenue

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'AURA',
      category: 'Men',
      price: 1999,
      originalPrice: 2499,
      concentration: 'Eau de Parfum',
      fragranceFamily: 'Woody',
      size: '100ml',
      stock: 30,
      topNotes: 'Bergamot, Lemon, Pepper',
      heartNotes: 'Lavender, Cedarwood',
      baseNotes: 'Musk, Amber, Vanilla',
      description: 'Sophisticated modern fragrance.',
      longevity: '8-10 Hours',
      season: 'Autumn / Winter',
      occasion: 'Evening',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      concentration: p.concentration,
      fragranceFamily: p.fragranceFamily,
      size: p.size,
      stock: p.stock,
      topNotes: p.topNotes.join(', '),
      heartNotes: p.heartNotes.join(', '),
      baseNotes: p.baseNotes.join(', '),
      description: p.description,
      longevity: p.longevity,
      season: p.season,
      occasion: p.occasion,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this fragrance from the public catalog?')) {
      setProducts(products.filter((p) => p.id !== id));
      showToast('Fragrance removed from catalog');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Please enter perfume name', 'error');
      return;
    }

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...formData,
              topNotes: formData.topNotes.split(',').map((s) => s.trim()),
              heartNotes: formData.heartNotes.split(',').map((s) => s.trim()),
              baseNotes: formData.baseNotes.split(',').map((s) => s.trim()),
            }
          : p
      );
      setProducts(updated);
      showToast(`Updated ${formData.name}`);
    } else {
      // Add
      const newProd: Product = {
        id: `aura-${Date.now()}`,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        gender: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100) || 0,
        size: formData.size,
        availableSizes: [
          { size: '50ml', price: Math.round(formData.price * 0.75), originalPrice: Math.round(formData.originalPrice * 0.75) },
          { size: formData.size, price: Number(formData.price), originalPrice: Number(formData.originalPrice) },
        ],
        rating: 5.0,
        reviewCount: 1,
        fragranceFamily: formData.fragranceFamily,
        concentration: formData.concentration,
        topNotes: formData.topNotes.split(',').map((s) => s.trim()),
        heartNotes: formData.heartNotes.split(',').map((s) => s.trim()),
        baseNotes: formData.baseNotes.split(',').map((s) => s.trim()),
        description: formData.description,
        shortDescription: formData.description.slice(0, 100),
        longevity: formData.longevity,
        sillage: 'Moderate',
        season: formData.season,
        occasion: formData.occasion,
        ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua (Water).',
        images: ['/src/assets/images/hero_aura_perfume_1790347541852.jpg'],
        stock: Number(formData.stock),
        isBestseller: false,
        isNewArrival: true,
      };
      setProducts([newProd, ...products]);
      showToast(`Added ${newProd.name} to catalogue`);
    }
    setIsModalOpen(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    showToast(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-300 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880] font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>AURA Concierge Portal</span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-stone-900 mt-0.5">
              Store Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-black flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </Link>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Total Revenue
              </span>
              <strong className="text-xl font-bold text-stone-900 tabular-nums">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Active Orders
              </span>
              <strong className="text-xl font-bold text-stone-900 tabular-nums">
                {orders.length + 8} orders
              </strong>
            </div>
          </div>

          <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Catalog Fragrances
              </span>
              <strong className="text-xl font-bold text-stone-900 tabular-nums">
                {products.length} SKUs
              </strong>
            </div>
          </div>

          <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                VIP Clients
              </span>
              <strong className="text-xl font-bold text-stone-900 tabular-nums">
                218 Registered
              </strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-300">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-6 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer relative ${
              activeTab === 'products' ? 'text-black' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Product Management ({products.length})
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-6 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer relative ${
              activeTab === 'orders' ? 'text-black' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Orders & Shipments ({orders.length})
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
        </div>

        {/* 1. Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-stone-500">
                Manage luxury perfume listings, retail pricing, stock levels, and fragrance notes.
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Fragrance
              </button>
            </div>

            <div className="bg-white border border-stone-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Fragrance</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/src/assets/images/hero_aura_perfume_1790347541852.jpg'}
                          alt={p.name}
                          className="w-10 h-10 object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div>
                          <strong className="text-stone-900 block font-serif-luxury text-sm">
                            {p.name}
                          </strong>
                          <span className="text-[10px] text-stone-400">
                            {p.brand} · {p.size}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[10px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900 tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 tabular-nums">
                        <span className={p.stock < 15 ? 'text-amber-700 font-bold' : 'text-stone-600'}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3.5 tabular-nums text-stone-700">
                        ★ {p.rating.toFixed(1)} ({p.reviewCount})
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-stone-500 hover:text-black transition-colors"
                          title="Edit fragrance"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete fragrance"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-500">
              Review incoming client orders and update logistics shipment milestones.
            </p>

            <div className="bg-white border border-stone-200 shadow-xs divide-y divide-stone-200">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-3">
                      <strong className="text-sm font-mono text-stone-900">{ord.orderNumber}</strong>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-stone-700 font-medium">
                      Recipient: {ord.shippingAddress.fullName} ({ord.shippingAddress.city}, {ord.shippingAddress.state})
                    </p>
                    <p className="text-stone-500">
                      Items: {ord.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(', ')}
                    </p>
                    <p className="text-stone-900 font-bold pt-1">
                      Total: ₹{ord.grandTotal.toLocaleString('en-IN')} ({ord.paymentMethod.toUpperCase()})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs text-stone-500 uppercase tracking-wider">Status:</label>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="bg-stone-50 border border-stone-300 p-1.5 text-xs font-semibold focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Add / Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-stone-300 shadow-2xl z-10 space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold pb-2 border-b border-stone-200">
                {editingProduct ? 'Edit Fragrance Listing' : 'Add New Fragrance SKU'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Fragrance Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Concentration</label>
                    <input
                      type="text"
                      value={formData.concentration}
                      onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Default Size</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Inventory Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold mb-1">Top Notes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.topNotes}
                      onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Heart Notes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.heartNotes}
                      onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Base Notes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.baseNotes}
                      onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Olfactory Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#faf9f5] border border-stone-300 p-2"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2.5 font-semibold uppercase tracking-wider hover:bg-stone-800"
                  >
                    Save Fragrance
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 border border-stone-300 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
