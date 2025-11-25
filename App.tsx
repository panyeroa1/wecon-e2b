import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/auth';
import { Layout } from './components/Layout';
import { BuyerMarketplace } from './pages/BuyerMarketplace';
import { Cart } from './pages/Cart';
import { BuyerOrders } from './pages/BuyerOrders';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product, CartItem, UserRole } from './types';
import { Lock, ShoppingBag, Truck, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-600">
          <Truck size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          WeCon B2B
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="user@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Select Demo Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="buyer">Buyer (SME)</option>
                  <option value="vendor">Vendor (Supplier)</option>
                  <option value="admin">Admin (WeCon)</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                *In a real app, role is determined by your account credentials.
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Reset tab when role changes
  React.useEffect(() => {
    if (user?.role === 'buyer') setActiveTab('marketplace');
    if (user?.role === 'vendor') setActiveTab('dashboard');
    if (user?.role === 'admin') setActiveTab('admin-overview');
  }, [user]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    alert(`Added ${quantity} x ${product.name} to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty >= item.minOrderQty ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const renderContent = () => {
    switch (user?.role) {
      case 'buyer':
        if (activeTab === 'marketplace') return <BuyerMarketplace addToCart={addToCart} />;
        if (activeTab === 'cart') return <Cart items={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} clearCart={clearCart} />;
        if (activeTab === 'orders') return <BuyerOrders />;
        return <BuyerMarketplace addToCart={addToCart} />;
      
      case 'vendor':
        if (activeTab === 'dashboard') return <VendorDashboard />;
        return <div className="p-8 text-center text-gray-500">Other Vendor Pages (Products/Orders) Placeholder</div>;
      
      case 'admin':
        if (activeTab === 'admin-overview') return <AdminDashboard />;
        return <AdminDashboard />;
        
      default:
        return <div>Unknown Role</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartItems.length}>
      {renderContent()}
    </Layout>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedApp /> : <LoginPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;