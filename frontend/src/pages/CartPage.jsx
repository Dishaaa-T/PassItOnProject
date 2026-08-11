import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Leaf, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your cart is empty"
          message="Browse the marketplace and add items you'd like to give a second life to."
          actionLabel="Browse Items"
          actionTo="/browse"
        />
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-800">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-stone-500 hover:text-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="flex gap-4 bg-white rounded-xl border border-stone-200 p-4">
              <Link to={`/product/${item.product._id}`} className="w-24 h-24 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                {item.product.images[0] && (
                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product._id}`} className="font-medium text-stone-800 hover:text-emerald-600 block truncate">
                  {item.product.title}
                </Link>
                <div className="text-sm text-stone-500 mt-1">
                  {item.product.category} · {item.product.condition}
                </div>
                <div className="text-sm text-stone-400 mt-1">
                  Sold by {item.product.sellerName}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="text-lg font-bold text-stone-900">${item.product.price}</span>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items ({items.length})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-stone-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-stone-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-700">
                This purchase saves ~{(items.length * 12.5).toFixed(1)}kg CO2
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/browse"
              className="block text-center mt-3 text-sm text-stone-500 hover:text-emerald-600 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
