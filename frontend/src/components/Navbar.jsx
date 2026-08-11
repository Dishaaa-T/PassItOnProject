import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-800 tracking-tight">
              Pass<span className="text-emerald-600">It</span>On
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              Browse
            </Link>
            <Link to="/browse?category=Clothing" className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              Clothing
            </Link>
            <Link to="/browse?category=Electronics" className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              Electronics
            </Link>
            <Link to="/browse?category=Books" className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              Books
            </Link>
            <Link to="/sell" className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              Sell
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-emerald-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-stone-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-stone-200 pt-3">
            <Link to="/browse" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 rounded-lg">Browse</Link>
            <Link to="/sell" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 rounded-lg">Sell an Item</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 rounded-lg">Cart ({itemCount})</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 rounded-lg">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
