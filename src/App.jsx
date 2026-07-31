import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, Search, X, Image as ImageIcon } from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Aibex Clear Case',
    category: 'CLEAR',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Ostik MagSafe',
    category: 'IMPACT',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Runoff Matte',
    category: 'SILICONE',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Classic Hide',
    category: 'LEATHER',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?auto=format&fit=crop&q=80&w=600'
  }
];

export default function App() {
  const [appView, setAppView] = useState('Shop'); // 'Shop' or 'Admin'
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form states for Admin
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'CLEAR', price: '', image: '' });

  // Filtering
  const categories = ['All', 'CLEAR', 'IMPACT', 'SILICONE', 'LEATHER'];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Admin Operations
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id, price: parseFloat(formData.price) } : p));
      setEditingProduct(null);
    } else {
      const newEntry = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=600'
      };
      setProducts([newEntry, ...products]);
    }
    setFormData({ name: '', category: 'CLEAR', price: '', image: '' });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image
    });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header */}
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">DraftStore Management & Shop</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xl text-slate-900 tracking-tight">DraftStore</span>
            
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-1.5 rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" /> Cart
            </button>
          </div>

          {/* View Toggle Switch */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-600">App View</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAppView('Shop')}
                className={`px-6 py-1.5 text-xs font-semibold rounded-lg transition ${
                  appView === 'Shop' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => setAppView('Admin')}
                className={`px-6 py-1.5 text-xs font-semibold rounded-lg transition ${
                  appView === 'Admin' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4">
        {appView === 'Shop' ? (
          <div className="space-y-6">
            {/* Category Select */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-sm font-medium text-slate-600">Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-1 focus:outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-slate-100/80 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between">
                  <div>
                    {/* Photo Container */}
                    <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-base leading-snug">{product.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{product.category}</p>
                    <p className="text-blue-600 font-bold text-lg mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Summary bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-around shadow-sm text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cart Items</p>
                <p className="text-lg font-bold text-slate-800">{totalCartItems}</p>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                <p className="text-lg font-bold text-slate-800">${totalCartPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Admin / Editable Mode */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-slate-800 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leather Pro Case"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="29.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', category: 'CLEAR', price: '', image: '' });
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 text-xs rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Inventory List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-800 text-sm">Product Inventory</h3>
              <div className="divide-y divide-slate-100">
                {products.map(product => (
                  <div key={product.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-slate-400">{product.category} • ${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="py-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between font-bold text-slate-800 text-sm mb-3">
                <span>Total</span>
                <span>${totalCartPrice.toFixed(2)}</span>
              </div>
              <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
