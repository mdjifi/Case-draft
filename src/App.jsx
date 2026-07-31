import React, { useState, useEffect } from 'react';
import { ShoppingBag, LayoutDashboard, Plus, Trash2, Edit, X, RefreshCw, Layers } from 'lucide-react';

// Default initial catalog
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Runoff Minimalist Case",
    category: "Cases",
    price: 39.00,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-slim design engineered with tactile polycarbonate materials for high-precision tactile feel."
  },
  {
    id: 2,
    name: "Aibex Clear Case",
    category: "Clear",
    price: 34.00,
    image: "https://images.unsplash.com/photo-1541877206-e06864dd0053?auto=format&fit=crop&w=600&q=80",
    description: "Crystal-clear optical clarity with anti-yellowing coating and raised camera bezel defense."
  },
  {
    id: 3,
    name: "Ostik Rugged Protection",
    category: "Protection",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    description: "Dual-layer corner drop protection built to withstand severe impacts without extra bulk."
  }
];

export default function App() {
  // State Management
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('draftstore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'admin'
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null); // Product Modal
  const [isFormOpen, setIsFormOpen] = useState(false); // Admin Add/Edit Modal
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cases',
    price: '',
    image: '',
    description: ''
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('draftstore_products', JSON.stringify(products));
  }, [products]);

  // Handle Form Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open Form for Add/Edit
  const openFormModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Cases', price: '', image: '', description: '' });
    }
    setIsFormOpen(true);
  };

  // Save Product (Create / Update)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description
      } : p));
    } else {
      const newProd = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description
      };
      setProducts(prev => [...prev, newProd]);
    }
    setIsFormOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Reset Catalog
  const handleResetCatalog = () => {
    if (window.confirm("Reset catalog back to default initial items?")) {
      setProducts(INITIAL_PRODUCTS);
    }
  };

  // Filter products by active category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-black selection:text-white">
      
      {/* HEADER / NAVIGATION */}
      <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div 
              onClick={() => setActiveTab('store')} 
              class="flex items-center gap-3 cursor-pointer group"
            >
              <div class="w-7 h-10 border-2 border-black rounded-lg flex items-center justify-center p-0.5 group-hover:bg-black transition-colors">
                <div class="w-full h-full border border-black/30 rounded-md group-hover:border-white"></div>
              </div>
              <span class="font-bold text-xl tracking-tight text-black">DraftStore</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('store')}
                class={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  activeTab === 'store' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ShoppingBag class="w-3.5 h-3.5" />
                Store
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                class={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  activeTab === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard class="w-3.5 h-3.5" />
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* STORE VIEW */}
      {activeTab === 'store' && (
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Hero Banner */}
          <section class="mb-12 text-center max-w-2xl mx-auto py-8">
            <span class="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 block">New Collection</span>
            <h1 class="text-4xl sm:text-5xl font-extrabold text-black tracking-tight mb-4">Precision-Crafted Essentials.</h1>
            <p class="text-gray-500 text-base sm:text-lg font-light">Minimalist cases and accessories engineered for structural purity and modern style.</p>
          </section>

          {/* Category Filter Pills */}
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['All', 'Cases', 'Clear', 'Protection'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  class={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-black'
                  }`}
                >
                  {cat === 'Clear' ? 'Clear Series' : cat}
                </button>
              ))}
            </div>
            <p class="text-xs text-gray-400 font-medium">{filteredProducts.length} item(s) showing</p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div class="text-center py-20 text-gray-400 text-sm">No products found in this category.</div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div class="h-64 bg-gray-100 overflow-hidden relative">
                    <img src={p.image} alt={p.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider text-black">
                      {p.category}
                    </span>
                  </div>
                  <div class="p-5 flex justify-between items-center">
                    <div>
                      <h3 class="font-bold text-sm text-black">{p.name}</h3>
                      <p class="text-xs text-gray-400 mt-0.5">${Number(p.price).toFixed(2)} USD</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                      class="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ADMIN VIEW */}
      {activeTab === 'admin' && (
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
              <h1 class="text-2xl font-bold text-black">DraftStore Admin Dashboard</h1>
              <p class="text-xs text-gray-500">Manage products, pricing, specs, and local state persistence</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                onClick={handleResetCatalog}
                class="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                <RefreshCw class="w-3.5 h-3.5" />
                Reset Catalog
              </button>
              <button
                onClick={() => openFormModal()}
                class="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition"
              >
                <Plus class="w-3.5 h-3.5" />
                Add Product
              </button>
            </div>
          </div>

          {/* Admin Metrics Bar */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span class="text-xs font-medium text-gray-400">Total Products</span>
              <p class="text-2xl font-bold mt-1 text-black">{products.length}</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span class="text-xs font-medium text-gray-400">Categories</span>
              <p class="text-2xl font-bold mt-1 text-black">3</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span class="text-xs font-medium text-gray-400">Storage Sync</span>
              <p class="text-2xl font-bold text-emerald-600 mt-1">localStorage Active</p>
            </div>
          </div>

          {/* Admin Table */}
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th class="p-4">Product</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Price</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" class="p-8 text-center text-gray-400">
                      No products found. Click "Add Product" to populate inventory.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} class="hover:bg-gray-50/50 transition">
                      <td class="p-4 font-semibold text-gray-900 flex items-center gap-3">
                        <img src={p.image} alt={p.name} class="w-8 h-8 rounded-lg object-cover" />
                        {p.name}
                      </td>
                      <td class="p-4 text-gray-500">{p.category}</td>
                      <td class="p-4 text-gray-900 font-medium">${Number(p.price).toFixed(2)}</td>
                      <td class="p-4 text-right space-x-2">
                        <button
                          onClick={() => openFormModal(p)}
                          class="p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition"
                        >
                          <Edit class="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          class="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition"
                        >
                          <Trash2 class="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              class="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 z-10"
            >
              <X class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2">
              <div class="h-80 md:h-full bg-gray-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} class="w-full h-full object-cover" />
              </div>
              <div class="p-8 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    {selectedProduct.category}
                  </span>
                  <h2 class="text-2xl font-bold text-black mb-2">{selectedProduct.name}</h2>
                  <p class="text-xl font-medium text-black mb-4">${Number(selectedProduct.price).toFixed(2)} USD</p>
                  <p class="text-xs text-gray-500 leading-relaxed mb-6">
                    {selectedProduct.description || 'Precision-engineered case crafted for minimalist protection.'}
                  </p>
                </div>
                <div class="space-y-3">
                  <button
                    onClick={() => { alert('Added to cart!'); setSelectedProduct(null); }}
                    class="w-full py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    class="w-full py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 class="text-lg font-bold text-black mb-4">
              {editingProduct ? "Edit Product Details" : "Add Product to DraftStore"}
            </h2>
            <form onSubmit={handleSaveProduct} class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  placeholder="e.g. Runoff Ultra Case"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="Cases">Cases</option>
                  <option value="Clear">Clear Series</option>
                  <option value="Protection">Protection</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  placeholder="39.99"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Product details and features..."
                />
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  class="px-4 py-2 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
