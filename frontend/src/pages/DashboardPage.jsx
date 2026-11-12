import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  IndianRupee,
  Leaf,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';
import { getProductCO2Saved } from '@/lib/sustainability';



export default function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [mySales, setMySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalListings: 0, activeListings: 0 });

  const completedPurchases = myOrders.filter(
  (order) => order.status === 'completed'
);

const completedSales = mySales.filter(
  (order) => order.status === 'completed'
);

const purchasedCO2 = completedPurchases.reduce(
  (sum, order) => sum + getProductCO2Saved(order.product),
  0
);

const soldCO2 = completedSales.reduce(
  (sum, order) => sum + getProductCO2Saved(order.product),
  0
);

const totalCO2Impact = purchasedCO2 + soldCO2;

  useEffect(() => {
    Promise.all([
      api.getMyProducts().catch(() => []),
      api.getMyOrders().catch(() => []),
      api.getMySales().catch(() => []),
      api.getUserStats().catch(() => ({ totalListings: 0, activeListings: 0 })),
    ]).then(([products, orders, sales, s]) => {
      setMyProducts(products);
      setMyOrders(orders);
      setMySales(sales);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.deleteProduct(id);
      setMyProducts(myProducts.filter((p) => p._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setMySales(mySales.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const handleBuyerCancel = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }

  try {
    const updated = await api.updateOrderStatus(orderId, 'cancelled');

    setMyOrders((orders) =>
      orders.map((o) => (o._id === orderId ? updated : o))
    );
  } catch (err) {
    alert(
      err instanceof Error
        ? err.message
        : 'Failed to cancel order'
    );
  }
};

const getStatusOptions = (status) => {
  switch (status) {
    case 'paid':
      return ['paid', 'shipped', 'cancelled'];

    case 'shipped':
      return ['shipped', 'completed'];

    case 'completed':
      return ['completed'];

    case 'cancelled':
      return ['cancelled'];

    default:
      return [status];
  }
};

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign in to view your dashboard</h2>
        <Link to="/login" className="px-5 py-2.5 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const totalEarnings = mySales
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  const statusIcon = (status) => {
    switch (status) {
      case 'paid': return <DollarSign className="w-4 h-4 text-amber-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">My Dashboard</h1>
        <p className="text-stone-500">Welcome back, {user.name}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-stone-200 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'listings', label: `My Listings (${myProducts.length})` },
          { key: 'orders', label: `My Orders (${myOrders.length})` },
          { key: 'sales', label: `My Sales (${mySales.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-stone-200 rounded-2xl" />
          <div className="h-64 bg-stone-200 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: <Package className="w-5 h-5" />, label: 'Active Listings', value: stats.activeListings, bg: 'bg-emerald-100', text: 'text-emerald-600' },
                  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Items Bought', value: myOrders.length, bg: 'bg-blue-100', text: 'text-blue-600' },
                  { icon: <TrendingUp className="w-5 h-5" />, label: 'Items Sold', value: mySales.length, bg: 'bg-amber-100', text: 'text-amber-600' },
                  { icon: <IndianRupee className="w-5 h-5" />, label: 'Earnings', value: ` ₹${totalEarnings.toFixed(0)}`, bg: 'bg-emerald-100', text: 'text-emerald-600' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-5">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
                      {s.icon}
                    </div>
                    <div className="text-2xl font-bold text-stone-800">{s.value}</div>
                    <div className="text-sm text-stone-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* <div className="bg-emerald-50 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">Your sustainability impact</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    You've helped keep {myProducts.length + myOrders.length} items in circulation and saved approximately {((myProducts.length + myOrders.length) * 12.5).toFixed(1)}kg of CO2.
                  </p>
                </div>
              </div> */}

              <div className="bg-emerald-50 rounded-2xl p-6 flex items-center gap-4">
  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
    <Leaf className="w-7 h-7 text-white" />
  </div>

  <div>
    <h3 className="font-semibold text-emerald-800">
      Your sustainability impact
    </h3>

    <p className="text-sm text-emerald-700 mt-1">
      You've helped keep{' '}
      {completedPurchases.length + completedSales.length}{' '}
      items in circulation and saved approximately{' '}
      {totalCO2Impact.toFixed(1)}kg of CO2.
    </p>
  </div>
</div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-800 mb-4">Recent activity</h3>
                {myOrders.length === 0 && mySales.length === 0 ? (
                  <p className="text-sm text-stone-500">No activity yet. Start by browsing or listing an item.</p>
                ) : (
                  <div className="space-y-3">
                    {[...myOrders.slice(0, 3), ...mySales.slice(0, 3)].slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center gap-3 py-2">
                        {order.product.images[0] && (
                          <img src={order.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-stone-700 truncate">{order.product.title}</div>
                          <div className="text-xs text-stone-400"> ₹{order.price} · {order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Listings */}
          {tab === 'listings' && (
            <div>
              <div className="flex justify-end mb-4">
                <Link to="/sell" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  New Listing
                </Link>
              </div>
              {myProducts.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-8 h-8" />}
                  title="No listings yet"
                  message="Start selling by creating your first listing. It takes less than two minutes."
                  actionLabel="Create Listing"
                  actionTo="/sell"
                />
              ) : (
                <div className="space-y-3">
                  {myProducts.map((p) => (
                    <div key={p._id} className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${p._id}`} className="font-medium text-stone-800 hover:text-emerald-600 truncate block">
                          {p.title}
                        </Link>
                        <div className="text-sm text-stone-500">
                           ₹{p.price} · {p.category} · {p.condition}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.isAvailable ? (
                          <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-500 rounded-full">Sold</span>
                        )}
                        <Link to={`/product/${p._id}`} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Orders (purchases) */}
          {tab === 'orders' && (
            <div>
              {myOrders.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="w-8 h-8" />}
                  title="No purchases yet"
                  message="Browse the marketplace to find items you'd like to give a second life."
                  actionLabel="Browse Items"
                  actionTo="/browse"
                />
              ) : (
                <div className="space-y-3">
                  {myOrders.map((o) => (
                    <div key={o._id} className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {o.product.images[0] && <img src={o.product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${o.product._id}`} className="font-medium text-stone-800 hover:text-emerald-600 truncate block">
                          {o.product.title}
                        </Link>
                        <div className="text-sm text-stone-500">
                           ₹{o.price} · from {o.seller.name}
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        {statusIcon(o.status)}
                        <span className="text-sm font-medium text-stone-600 capitalize">{o.status}</span>
                      </div> */}
                      <div className="flex items-center gap-3">
  {o.status === 'paid' ? (
    <button
      type="button"
      onClick={() => handleBuyerCancel(o._id)}
      className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      Cancel Order
    </button>
  ) : (
    <div className="flex items-center gap-2">
      {statusIcon(o.status)}
      <span className="text-sm font-medium text-stone-600 capitalize">
        {o.status}
      </span>
    </div>
  )}
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Sales */}
          {tab === 'sales' && (
            <div>
              {mySales.length === 0 ? (
                <EmptyState
                  icon={<TrendingUp className="w-8 h-8" />}
                  title="No sales yet"
                  message="When someone buys your listing, the order will appear here for you to manage."
                  actionLabel="List an Item"
                  actionTo="/sell"
                />
              ) : (
                <div className="space-y-3">
                  {mySales.map((o) => (
                    <div key={o._id} className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {o.product.images[0] && <img src={o.product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${o.product._id}`} className="font-medium text-stone-800 hover:text-emerald-600 truncate block">
                          {o.product.title}
                        </Link>
                        <div className="text-sm text-stone-500">
                           ₹{o.price} · buyer: {o.buyer.name}
                        </div>
                      </div>
                      {/* <select
                        value={o.status}
                        onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                        className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select> */}

                      <select
  value={o.status}
  onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
  className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
>
  {getStatusOptions(o.status).map((status) => (
    <option key={status} value={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </option>
  ))}
</select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
