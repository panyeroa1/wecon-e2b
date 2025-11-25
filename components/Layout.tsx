import React from 'react';
import { useAuth } from '../services/auth';
import { ShoppingCart, Package, Users, LogOut, Menu, UserCircle, Store, BarChart2, Settings } from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, cartCount = 0 }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'buyer':
        return [
          { id: 'marketplace', label: 'Marketplace', icon: <Store size={20} /> },
          { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
        ];
      case 'vendor':
        return [
          { id: 'dashboard', label: 'Overview', icon: <BarChart2 size={20} /> },
          { id: 'products', label: 'Products', icon: <Package size={20} /> },
          { id: 'marketing', label: 'Marketing & Ads', icon: <Users size={20} /> },
          { id: 'settings', label: 'Settings & Data', icon: <Settings size={20} /> },
        ];
      case 'admin':
        return [
          { id: 'admin-overview', label: 'Overview', icon: <Store size={20} /> },
          { id: 'approvals', label: 'Approvals', icon: <Users size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setActiveTab(navItems[0]?.id || 'marketplace')}>
                <span className="text-2xl font-bold text-primary-700">WeConnect</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      activeTab === item.id
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors duration-200`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'buyer' && (
                <button
                  onClick={() => setActiveTab('cart')}
                  className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              
              <div className="hidden sm:flex items-center space-x-3 border-l pl-4 ml-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
                <UserCircle size={32} className="text-gray-400" />
                <button
                  onClick={logout}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${
                    activeTab === item.id
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left flex items-center`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                 onClick={logout}
                 className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-red-600 text-base font-medium"
              >
                <div className="flex items-center">
                  <LogOut size={20} className="mr-3" /> Logout
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {children}
      </main>

      {/* Voice Assistant Overlay/Button */}
      {user && <VoiceAssistant />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2024 WeConnect Platform. Empowering Businesses.
          </p>
        </div>
      </footer>
    </div>
  );
};