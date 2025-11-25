import React from 'react';
import { MOCK_ORDERS, MOCK_COURIERS } from '../constants';
import { Package, ExternalLink, Check, Truck, AlertCircle } from 'lucide-react';

export const BuyerOrders: React.FC = () => {
  const orders = MOCK_ORDERS; // In a real app, filter by current user ID

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const timelineSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const getCourierName = (courierId?: string) => {
    return MOCK_COURIERS.find(c => c.id === courierId)?.name || 'Unknown Courier';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders & Tracking</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStepIndex = getStepIndex(order.status);
          const courierName = getCourierName(order.courierId);
          
          return (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Order <span className="font-mono">{order.id}</span></h3>
                  <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">₱{order.totalAmount.toLocaleString()}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6">
                {/* Visual Step-by-Step Timeline */}
                {order.status !== 'cancelled' && (
                  <div className="mb-8 mt-2 px-2">
                    <div className="relative">
                      {/* Connecting Lines */}
                      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />
                      <div 
                        className="absolute top-4 left-0 h-0.5 bg-primary-600 -z-10 transition-all duration-500 ease-in-out" 
                        style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
                      />

                      {/* Steps */}
                      <div className="flex justify-between w-full">
                        {timelineSteps.map((step, index) => {
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          return (
                            <div key={step} className="flex flex-col items-center group">
                              <div 
                                className={`
                                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200
                                  ${isCompleted 
                                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
                                    : 'bg-white border-gray-300 text-gray-400'}
                                  ${isCurrent ? 'ring-4 ring-primary-100' : ''}
                                `}
                              >
                                {index < currentStepIndex ? (
                                  <Check size={16} strokeWidth={3} />
                                ) : (
                                  <span className="text-xs font-semibold">{index + 1}</span>
                                )}
                              </div>
                              <span 
                                className={`
                                  mt-2 text-xs font-medium transition-colors duration-200
                                  ${isCompleted ? 'text-primary-700' : 'text-gray-500'}
                                  ${isCurrent ? 'font-bold' : ''}
                                `}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {order.status === 'cancelled' && (
                   <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">This order has been cancelled.</p>
                   </div>
                )}

                {/* Items */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</h4>
                  <ul className="space-y-3">
                    {order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-3 text-sm">
                          <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <img src={item.image} alt="" className="h-full w-full object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₱{item.price.toLocaleString()}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-400 italic">Item details not available for historical data.</li>
                    )}
                  </ul>
                </div>

                {/* Tracking Info */}
                <div className="bg-blue-50 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Shipped via {courierName}</p>
                      {order.trackingNumber ? (
                        <p className="text-sm text-blue-700 mt-1">
                          Tracking Number: <span className="font-mono font-bold select-all">{order.trackingNumber}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-blue-700 mt-1 italic">Tracking number pending...</p>
                      )}
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert(`Redirecting to ${courierName} tracking page for #${order.trackingNumber}`); }}
                      className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Track Package <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Go to the marketplace to start shopping.</p>
          </div>
        )}
      </div>
    </div>
  );
};
