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
          { id: 'marketplace', label: 'Marketplace', icon: <Store size={18} /> },
          { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
        ];
      case 'vendor':
        return [
          { id: 'dashboard', label: 'Overview', icon: <BarChart2 size={18} /> },
          { id: 'products', label: 'Products', icon: <Package size={18} /> },
          { id: 'marketing', label: 'Marketing', icon: <Users size={18} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        ];
      case 'admin':
        return [
          { id: 'admin-overview', label: 'Overview', icon: <Store size={18} /> },
          { id: 'approvals', label: 'Approvals', icon: <Users size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      {/* Header - Apple-style glass navigation */}
      <header className="glass sticky top-0 z-50 border-b border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group" 
                onClick={() => setActiveTab(navItems[0]?.id || 'marketplace')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-700 to-accent-blue rounded-lg flex items-center justify-center mr-2.5 group-hover:scale-105 transition-transform">
                  <Store size={16} className="text-white" />
                </div>
                <span className="text-title-lg font-semibold text-primary-600 tracking-tight">Eburon</span>
              </div>
              <nav className="hidden sm:ml-10 sm:flex sm:space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      activeTab === item.id
                        ? 'bg-primary-100/80 text-primary-600'
                        : 'text-primary-500 hover:bg-primary-100/50 hover:text-primary-600'
                    } inline-flex items-center px-4 py-2 rounded-full text-body-sm font-medium transition-all duration-200`}
                  >
                    <span className="mr-1.5 opacity-80">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-2">
              {user?.role === 'buyer' && (
                <button
                  onClick={() => setActiveTab('cart')}
                  aria-label="Go to cart"
                  className="relative p-2.5 text-primary-500 hover:text-accent-blue hover:bg-primary-100/50 rounded-full transition-all duration-200"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-caption font-semibold text-white bg-accent-red rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              
              <div className="hidden sm:flex items-center space-x-3 border-l border-primary-200/50 pl-4 ml-2">
                <div className="text-right">
                  <div className="text-body-sm font-medium text-primary-600">{user?.name}</div>
                  <div className="text-caption text-primary-400 capitalize">{user?.role}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                  <UserCircle size={22} className="text-primary-500" />
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-primary-400 hover:text-accent-red hover:bg-accent-red/10 rounded-full transition-all duration-200"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-100/50 rounded-full transition-all"
                  aria-label="Toggle menu"
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white/95 backdrop-blur-lg border-t border-primary-100">
            <div className="pt-2 pb-3 space-y-1 px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${
                    activeTab === item.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-primary-500 hover:bg-primary-50'
                  } block w-full px-4 py-3 rounded-apple text-body-sm font-medium text-left flex items-center transition-colors`}
                >
                  <span className="mr-3 opacity-80">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-primary-100 my-2" />
              <button
                 onClick={logout}
                 className="block w-full text-left px-4 py-3 rounded-apple text-primary-500 hover:bg-accent-red/10 hover:text-accent-red text-body-sm font-medium transition-colors"
              >
                <div className="flex items-center">
                  <LogOut size={18} className="mr-3" /> Sign Out
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Voice Assistant Overlay/Button */}
      {user && <VoiceAssistant />}

      {/* Footer - Minimal Apple-style */}
      <footer className="bg-primary-50 border-t border-primary-100 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-caption text-primary-400">
            &copy; 2024 Eburon. Empowering Filipino SMEs.
          </p>
        </div>
      </footer>
    </div>
  );
};