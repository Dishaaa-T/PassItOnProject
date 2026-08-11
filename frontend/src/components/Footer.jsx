import { Link } from 'react-router-dom';
import { Recycle, Heart, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Pass<span className="text-emerald-400">It</span>On
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              The sustainable marketplace for second-hand goods. Give your items a second life.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-emerald-400 transition-colors">Browse All</Link></li>
              <li><Link to="/browse?category=Clothing" className="hover:text-emerald-400 transition-colors">Clothing</Link></li>
              <li><Link to="/browse?category=Electronics" className="hover:text-emerald-400 transition-colors">Electronics</Link></li>
              <li><Link to="/browse?category=Books" className="hover:text-emerald-400 transition-colors">Books</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sell" className="hover:text-emerald-400 transition-colors">Sell an Item</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Our Mission</h3>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Every purchase on PassItOn keeps usable goods out of landfills and reduces the demand for new manufacturing.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Leaf className="w-4 h-4" /> Sustainable
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Heart className="w-4 h-4" /> Community
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-10 pt-6 text-center text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} PassItOn. Built for a more sustainable future.</p>
        </div>
      </div>
    </footer>
  );
}
