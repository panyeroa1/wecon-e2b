import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { Plus, Edit, Trash, DollarSign, Package, TrendingUp, Megaphone, Download, CreditCard, ShieldCheck } from 'lucide-react';
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

export const VendorDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'marketing' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS.slice(0, 2)); 

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
          <h4 className="text-xl font-bold text-gray-900">Professional Plan</h4>
          <p className="text-gray-500 mt-1">₱2,500 / month • No Lock-in Contract</p>
          <div className="mt-4">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Unlimited Product Listings</li>
              <li>Own Fleet Management System</li>
              <li>Real-time Order Notifications</li>
              <li>Basic Marketplace Visibility</li>
            </ul>
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
              Manage Billing
            </button>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium px-4 py-2">
              Cancel Subscription
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
            WeConnect believes you own your data. Export your full customer list, order history, and product data at any time in standard CSV format.
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
        {activeSubTab === 'products' && (
           <div className="bg-white shadow rounded-lg overflow-hidden">
             <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
               <h3 className="text-lg leading-6 font-medium text-gray-900">My Products</h3>
               <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
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
                         <p className="text-xs text-gray-500">Stock: {product.stock} | Price: ₱{product.price}</p>
                       </div>
                     </div>
                     <div className="flex space-x-2">
                       <button className="p-2 text-gray-400 hover:text-gray-500">
                         <Edit className="h-5 w-5" />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-red-500">
                         <Trash className="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
        )}
      </div>
    </div>
  );
};