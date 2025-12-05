import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/auth';
import { Layout } from './components/Layout';
import { BuyerMarketplace } from './pages/BuyerMarketplace';
import { Cart } from './pages/Cart';
import { BuyerOrders } from './pages/BuyerOrders';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SupplierSignup } from './pages/SupplierSignup';
import { Product, CartItem, UserRole } from './types';
import { Lock, ShoppingBag, Truck, CheckCircle } from 'lucide-react';

const LoginPage = ({ onShowSupplierSignup }: { onShowSupplierSignup: () => void }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-accent-blue rounded-2xl flex items-center justify-center shadow-apple-md">
            <Truck size={32} className="text-white" />
          </div>
        </div>
        <h1 className="mt-8 text-center text-headline font-semibold text-primary-600 tracking-tight">
          Wecon
        </h1>
        <p className="mt-3 text-center text-body text-primary-500">
          B2B Marketplace for Filipino SMEs
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-10 px-8 shadow-apple-lg rounded-apple-xl border border-primary-100/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-primary-600">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="user@example.com"
                  className="block w-full px-4 py-3 text-body text-primary-600 bg-primary-50/50 border-0 rounded-apple placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-body-sm font-medium text-primary-600">
                Select Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  title="Select your role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="block w-full px-4 py-3 text-body text-primary-600 bg-primary-50/50 border-0 rounded-apple focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="buyer">Buyer (SME)</option>
                  <option value="vendor">Vendor (Supplier)</option>
                  <option value="admin">Admin (Wecon)</option>
                </select>
              </div>
              <p className="mt-2 text-caption text-primary-400">
                Role is determined by your account in production.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-apple w-full py-3.5 px-6 text-body font-medium"
              >
                Sign In
              </button>
            </div>

            <div className="pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-100" />
                </div>
                <div className="relative flex justify-center text-caption">
                  <span className="px-4 bg-white text-primary-400">New supplier?</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={onShowSupplierSignup}
                  className="btn-apple-secondary w-full py-3 px-6 text-body font-medium border border-primary-200 hover:border-accent-blue"
                >
                  Register as Supplier
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-caption text-primary-400">
          By signing in, you agree to our Terms of Service
        </p>
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
  const [showSupplierSignup, setShowSupplierSignup] = useState(false);

  if (showSupplierSignup) {
    return (
      <SupplierSignup
        onBack={() => setShowSupplierSignup(false)}
        onComplete={() => setShowSupplierSignup(false)}
      />
    );
  }

  return isAuthenticated ? (
    <AuthenticatedApp />
  ) : (
    <LoginPage onShowSupplierSignup={() => setShowSupplierSignup(true)} />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;