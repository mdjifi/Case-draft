import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, ShieldCheck, Sparkles, Filter, Search, X, Check } from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Aibex Clear Case',
    category: 'Clear',
    price: 39.99,
    description: 'Ultra-thin, non-yellowing crystal clear protective case engineered for high durability.',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Ostik MagSafe Leather',
    category: 'Leather',
    price: 59.99,
    description: 'Supple full-grain leather shell integrated with heavy-duty MagSafe alignment magnets.',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Runoff Matte Shield',
    category: 'Matte',
    price: 44.99,
    description: 'Fingerprint-resistant frosted matte back frame with tactile anodized aluminum buttons.',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Stealth Armor Case',
    category: 'Impact',
    price: 49.99,
    description: 'Military-grade drop test certified housing featuring corner airbag shock absorbers.',
    badge: 'Rugged',
    image: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?auto=format&fit=crop&q=80&w=600'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Clear', price: '', description: '', image: '', badge: 'New' });

  // Filter products
  const categories = ['All', 'Clear', 'Leather', 'Matte', 'Impact'];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Store Management
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const item = {
      ...newProduct,
      id: Date.now().toString(),
      price: parseFloat(newProduct.price),
      image: newProduct.image || 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=600'
    };
    setProducts([item, ...products]);
    setNewProduct({ name: '', category: 'Clear', price: '', description: '', image: '', badge: 'New' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-white rounded-full inline-block"></span>
              DraftStore
            </span>
            <nav className="hidden md:flex space-x-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'store' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Storefront
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'admin' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Store Management
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'store' ? (
          <div className="space-y-10">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-8 md:p-12">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Next-Gen Accessories
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Minimal design. Engineered protection.
                </h1>
                <p className="text-neutral-400 text-base md:text-lg">
                  Precision-crafted cases designed specifically for seamless ergonomics and durable daily performance.
                </p>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                No products match your current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="group bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-neutral-700 transition flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">
                          {product.category}
                        </div>
                        <h3 className="font-semibold text-white text-lg tracking-tight">{product.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Admin Store Management Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-fit space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ostik Ultra"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-neutral-600"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="49.99"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of product features..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition"
                >
                  Publish to Store
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Inventory Management ({products.length})</h2>
              </div>
              <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/40">
                <div className="divide-y divide-neutral-800">
                  {products.map(product => (
                    <div key={product.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-neutral-800" />
                        <div>
                          <h4 className="font-semibold text-white text-sm">{product.name}</h4>
                          <span className="text-xs text-neutral-500">{product.category} • ${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Shopping Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">Your cart is currently empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                        <div className="text-xs text-neutral-400">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-neutral-800 text-white rounded-lg flex items-center justify-center">-</button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-neutral-800 text-white rounded-lg flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <div className="flex justify-between text-base font-semibold text-white">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
