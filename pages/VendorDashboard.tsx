import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { Plus, Edit, Trash, DollarSign, Package, TrendingUp, Megaphone, Download, CreditCard, ShieldCheck, X, Video, Sparkles, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  minOrderQty: number;
  leadTimeHours: number;
  image: string;
  description: string;
}

const initialProductForm: ProductFormData = {
  name: '',
  category: 'Office Supplies',
  price: 0,
  stock: 0,
  minOrderQty: 1,
  leadTimeHours: 24,
  image: '',
  description: '',
};

export const VendorDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'marketing' | 'settings' | 'upgrades'>('overview');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS.slice(0, 2));
  const [showAddModal, setShowAddModal] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium'>('basic');
  const [aiMeetingEnabled, setAiMeetingEnabled] = useState(false);

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'minOrderQty' || name === 'leadTimeHours'
        ? Number(value)
        : value
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p${Date.now()}`,
      vendorId: 'o2',
      vendorName: 'My Business',
      ...productForm,
      rating: 0,
      reviewCount: 0,
      isVerified: true,
    };
    setProducts(prev => [...prev, newProduct]);
    setShowAddModal(false);
    setProductForm(initialProductForm);
    alert('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- Sub-components for Tabs ---

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd><div className="text-lg font-medium text-gray-900">₱45,231.00</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd><div className="text-lg font-medium text-gray-900">12</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">SLA Performance</dt>
                  <dd><div className="text-lg font-medium text-gray-900">98.5%</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Weekly Sales</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const MarketingTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Boost Your Visibility</h2>
            <p className="mt-1 opacity-90">Bring new customers in by sponsoring your products on the marketplace.</p>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-indigo-50 transition-colors">
            Create Campaign
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active Campaigns</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          <li className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Summer Office Sale</p>
                <p className="text-xs text-gray-500">Target: Metro Manila • Budget: ₱500/day</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">1,240 Views</p>
                <p className="text-xs text-green-600">8.5% CTR</p>
              </div>
            </div>
          </li>
          <li className="px-4 py-4 sm:px-6 bg-gray-50">
            <p className="text-sm text-gray-500 text-center italic">No other active campaigns.</p>
          </li>
        </ul>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Subscription Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <CreditCard className="mr-2 text-primary-600" /> Subscription Plan
          </h3>
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(['free', 'basic', 'premium'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSubscriptionTier(tier)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  subscriptionTier === tier
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold capitalize">{tier}</p>
                <p className="text-sm text-gray-500">
                  {tier === 'free' ? '₱0/mo' : tier === 'basic' ? '₱1,500/mo' : '₱4,500/mo'}
                </p>
              </button>
            ))}
          </div>
          <h4 className="text-xl font-bold text-gray-900 capitalize">{subscriptionTier} Plan</h4>
          <p className="text-gray-500 mt-1">
            {subscriptionTier === 'free' && 'Up to 10 products, basic analytics.'}
            {subscriptionTier === 'basic' && '₱1,500 / month • Unlimited products, priority support.'}
            {subscriptionTier === 'premium' && '₱4,500 / month • All features + AI tools access.'}
          </p>
          <div className="mt-6 flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      {/* Data Ownership Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <ShieldCheck className="mr-2 text-primary-600" /> Data Ownership
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4">
            Wecon believes you own your data. Export your full customer list, order history, and product data at any time in standard CSV format.
          </p>
          <button 
            onClick={() => alert('Downloading data_export_2024.csv...')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            <Download className="mr-2 h-4 w-4" /> Export All Data (CSV)
          </button>
        </div>
      </div>
    </div>
  );

  const UpgradesTab = () => (
    <div className="space-y-6">
      {/* AI Meeting Assistant */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-10 w-10 mr-4" />
            <div>
              <h2 className="text-xl font-bold">Zoom with AI Assistant</h2>
              <p className="mt-1 opacity-90">AI-powered video meetings for B2B negotiations and support.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAiMeetingEnabled(!aiMeetingEnabled);
              alert(aiMeetingEnabled ? 'AI Meeting Assistant disabled.' : 'AI Meeting Assistant enabled! You can now schedule AI-powered meetings.');
            }}
            className={`px-6 py-3 rounded-md font-medium shadow-sm transition-colors ${
              aiMeetingEnabled
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {aiMeetingEnabled ? 'Disable' : 'Enable AI Meetings'}
          </button>
        </div>
        {aiMeetingEnabled && (
          <div className="mt-4 bg-white/20 rounded-md p-4">
            <p className="text-sm">✅ AI Meeting Assistant is active. Features include:</p>
            <ul className="text-sm mt-2 space-y-1 ml-4">
              <li>• Real-time transcription & translation</li>
              <li>• Auto-generated meeting summaries</li>
              <li>• Smart action item extraction</li>
              <li>• Sentiment analysis for negotiations</li>
            </ul>
          </div>
        )}
      </div>

      {/* Other Upgrades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-colors">
          <div className="flex items-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 mr-3" />
            <h3 className="text-lg font-semibold">Analytics Pro</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Advanced insights, predictive analytics, and custom reports.</p>
          <button className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
            Upgrade to Pro Analytics
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-colors">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold">Inventory Alerts</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Get SMS & email alerts when stock runs low or orders spike.</p>
          <button className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
            Enable Smart Alerts
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar / Sub-nav */}
      <nav className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white shadow rounded-lg p-2 space-y-1">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp className="mr-3 h-5 w-5" /> Overview
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'products' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package className="mr-3 h-5 w-5" /> Products
          </button>
          <button
            onClick={() => setActiveSubTab('marketing')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'marketing' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Megaphone className="mr-3 h-5 w-5" /> Marketing & Ads
          </button>
          <button
            onClick={() => setActiveSubTab('upgrades')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'upgrades' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles className="mr-3 h-5 w-5" /> Upgrades & Tools
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CreditCard className="mr-3 h-5 w-5" /> Settings & Data
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeSubTab === 'overview' && <OverviewTab />}
        {activeSubTab === 'marketing' && <MarketingTab />}
        {activeSubTab === 'settings' && <SettingsTab />}
        {activeSubTab === 'upgrades' && <UpgradesTab />}
        {activeSubTab === 'products' && (
           <div className="bg-white shadow rounded-lg overflow-hidden">
             <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
               <h3 className="text-lg leading-6 font-medium text-gray-900">My Products</h3>
               <button
                 onClick={() => setShowAddModal(true)}
                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
               >
                 <Plus className="mr-2 h-4 w-4" /> Add Product
               </button>
             </div>
             <ul className="divide-y divide-gray-200">
               {products.map((product) => (
                 <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover mr-4" />
                       <div>
                         <p className="text-sm font-medium text-primary-600 truncate">{product.name}</p>
                         <p className="text-xs text-gray-500">
                           Stock: <span className={product.stock < 20 ? 'text-red-600 font-semibold' : ''}>{product.stock}</span> | Price: ₱{product.price}
                         </p>
                       </div>
                     </div>
                     <div className="flex space-x-2">
                       <button className="p-2 text-gray-400 hover:text-gray-500" aria-label="Edit product">
                         <Edit className="h-5 w-5" />
                       </button>
                       <button
                         onClick={() => handleDeleteProduct(product.id)}
                         className="p-2 text-gray-400 hover:text-red-500"
                         aria-label="Delete product"
                       >
                         <Trash className="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                 </li>
               ))}
               {products.length === 0 && (
                 <li className="px-4 py-8 text-center text-gray-500">
                   No products yet. Click "Add Product" to get started.
                 </li>
               )}
             </ul>
           </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Premium Bond Paper"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    aria-label="Product category"
                  >
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Construction">Construction</option>
                    <option value="Food Supplies">Food Supplies</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (hours) *</label>
                  <select
                    name="leadTimeHours"
                    value={productForm.leadTimeHours}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    aria-label="Lead time in hours"
                  >
                    <option value={12}>12 hours (Express)</option>
                    <option value={24}>24 hours (Standard SLA)</option>
                    <option value={48}>48 hours</option>
                    <option value={72}>72 hours</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    name="stock"
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Qty *</label>
                  <input
                    name="minOrderQty"
                    type="number"
                    required
                    min="1"
                    value={productForm.minOrderQty}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  name="image"
                  type="url"
                  value={productForm.image}
                  onChange={handleProductFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Product description..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};