import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, CartItem } from '../types';
import { Search, Filter, Clock, Info, Megaphone } from 'lucide-react';

interface BuyerMarketplaceProps {
  addToCart: (product: Product, qty: number) => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (b.isSponsored ? 1 : 0) - (a.isSponsored ? 1 : 0)); // Sort sponsored first

  const handleQtyChange = (id: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      setQtyMap(prev => ({ ...prev, [id]: num }));
    }
  };

  const getQty = (product: Product) => qtyMap[product.id] || product.minOrderQty;

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search products, suppliers, or SKUs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className={`bg-white rounded-lg shadow-sm border ${product.isSponsored ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-200'} overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200`}>
            <div className="aspect-w-3 aspect-h-2 bg-gray-200 relative">
               <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
               <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                 {product.isSponsored && (
                   <div className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                     <Megaphone size={10} className="mr-1" /> Sponsored
                   </div>
                 )}
                 {product.leadTimeHours <= 24 && (
                   <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                     <Clock size={12} className="mr-1" /> 24h
                   </div>
                 )}
               </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-1">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Sold by: {product.vendorName}</p>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs text-gray-400">Price per unit</span>
                    <div className="text-xl font-bold text-gray-900">₱{product.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">MOQ: {product.minOrderQty}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={product.minOrderQty}
                    value={getQty(product)}
                    onChange={(e) => handleQtyChange(product.id, e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-md text-center text-sm"
                  />
                  <button
                    onClick={() => addToCart(product, getQty(product))}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium flex justify-center items-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Info className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};