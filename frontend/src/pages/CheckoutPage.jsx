import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Leaf, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    name: user?.name || '',
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-3">Order placed!</h1>
        <p className="text-stone-500 mb-6">
          Thank you for choosing sustainable shopping. The seller has been notified and will ship your items soon.
        </p>
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            You saved ~{(items.length * 12.5).toFixed(1)}kg of CO2
          </span>
        </div>
        <Link to="/dashboard" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      for (const item of items) {
        await api.createOrder({
          productId: item.product._id,
          shippingAddress: address,
        });
      }
      clearCart();
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold text-stone-800 mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        {/* Shipping form */}
        <div>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Address Line 1</label>
              <input
                type="text"
                required
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Country</label>
                <input
                  type="text"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Order Summary</h2>
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-700 truncate">{item.product.title}</div>
                  <div className="text-xs text-stone-400">{item.product.sellerName}</div>
                </div>
                <div className="text-sm font-semibold text-stone-800">${item.product.price}</div>
              </div>
            ))}

            <div className="border-t border-stone-200 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full mt-4 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {processing ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>

          <div className="mt-4 bg-emerald-50 rounded-xl p-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-700">
              This order keeps {items.length} item{items.length > 1 ? 's' : ''} in circulation and saves approximately {(items.length * 12.5).toFixed(1)}kg of CO2 compared to buying new.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
