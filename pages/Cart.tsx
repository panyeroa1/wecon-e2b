import React, { useState } from 'react';
import { CartItem } from '../types';
import { MOCK_COURIERS } from '../constants';
import { Trash2, ArrowRight, CreditCard, Truck, AlertTriangle, CheckCircle, Package, Store } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, updateQuantity, removeItem, clearCart }) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Default to a vendor fleet if available (mock logic: if vendor fleet exists in list, pick it)
  const defaultCourier = MOCK_COURIERS.find(c => c.isVendorFleet) || MOCK_COURIERS[0];
  const [selectedCourierId, setSelectedCourierId] = useState<string>(defaultCourier.id);

  const selectedCourier = MOCK_COURIERS.find(c => c.id === selectedCourierId) || defaultCourier;
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.12;
  const shipping = selectedCourier.baseRate;
  const total = subtotal + vat + shipping;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');
      clearCart();
    }, 2000);
  };

  if (checkoutStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-lg font-medium text-gray-900">Order Placed Successfully!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for your order. We have sent a confirmation email to your registered address.
          Your order ID is <span className="font-mono font-bold">#ORD-{(Math.random() * 10000).toFixed(0)}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Delivered via <span className="font-semibold">{selectedCourier.name}</span>.
        </p>
        <div className="mt-6">
          <button onClick={() => window.location.reload()} className="text-primary-600 hover:text-primary-500 font-medium">
            Continue Shopping &rarr;
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && checkoutStep === 'cart') {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Start adding items from the marketplace to build your order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {checkoutStep === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Main Section */}
        <div className="lg:col-span-7">
          {checkoutStep === 'cart' ? (
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <span className="font-medium text-gray-700 hover:text-gray-800">
                              {item.name}
                            </span>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{item.vendorName}</p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">₱{item.price.toLocaleString()}</p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                            disabled={item.quantity <= item.minOrderQty}
                          >
                            -
                          </button>
                          <span className="text-gray-900 font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="absolute top-0 right-0">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                
                {/* Shipping Info */}
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Truck className="mr-2 text-primary-600" /> Shipping Information
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input type="text" defaultValue="TechStart Inc." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input type="text" defaultValue="123 Corporate Center, Makati City" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                  </div>
                </div>

                {/* Courier Selection */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <Package className="mr-2 text-primary-600" /> Delivery Service
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {MOCK_COURIERS.map((courier) => (
                      <div 
                        key={courier.id}
                        onClick={() => setSelectedCourierId(courier.id)}
                        className={`
                          relative rounded-lg border p-4 cursor-pointer flex flex-col justify-between hover:border-primary-500 transition-colors
                          ${selectedCourierId === courier.id ? 'border-primary-600 ring-1 ring-primary-600 bg-primary-50' : 'border-gray-300 bg-white'}
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block text-sm font-medium text-gray-900 flex items-center">
                               {courier.isVendorFleet && <Store size={14} className="mr-1 text-purple-600" />}
                               {courier.name}
                            </span>
                            <span className="block text-xs text-gray-500 mt-1">{courier.description}</span>
                          </div>
                          {selectedCourierId === courier.id && (
                            <CheckCircle className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                        <div className="mt-4 flex justify-between items-end">
                          <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {courier.estimatedDays}
                          </span>
                          <span className={`text-sm font-bold ${courier.baseRate === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {courier.baseRate === 0 ? 'FREE' : `₱${courier.baseRate}`}
                          </span>
                        </div>
                        {courier.isVendorFleet && (
                           <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                               DIRECT
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedCourier.id === 'wecon-express' && (
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Orders placed before 2:00 PM in Makati qualify for <span className="font-bold">24-hour delivery</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <CreditCard className="mr-2 text-primary-600" /> Payment Method
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input id="bank" name="payment-method" type="radio" defaultChecked className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
                      <label htmlFor="bank" className="ml-3 block text-sm font-medium text-gray-700">
                        Bank Transfer (BDO/BPI)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="ewallet" name="payment-method" type="radio" className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
                      <label htmlFor="ewallet" className="ml-3 block text-sm font-medium text-gray-700">
                        GCash / Maya
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="terms" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                        I agree to the Terms of Service and Delivery SLA.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 mt-16 lg:mt-0">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">₱{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">VAT (12%)</p>
                <p className="text-sm font-medium text-gray-900">₱{vat.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping ({selectedCourier.name})</p>
                <p className="text-sm font-medium text-gray-900">
                  {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₱${shipping.toLocaleString()}`}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-bold text-primary-700">₱{total.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6">
              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500"
                >
                  Proceed to Checkout <ArrowRight className="inline ml-2 h-4 w-4" />
                </button>
              ) : (
                <div className="space-y-3">
                   <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    disabled={isProcessing}
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 flex justify-center items-center"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>Confirm Order ₱{total.toLocaleString()}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};