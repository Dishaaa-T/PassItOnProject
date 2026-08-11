import { Link } from 'react-router-dom';
import { Leaf, Recycle, ShoppingBag, ArrowRight, TrendingUp, Heart, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { mockProducts } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState(mockProducts.slice(0, 8));

  useEffect(() => {
    api
      .getProducts({ limit: 8 })
      .then((res) => setProducts(res.products))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-6">
                <Leaf className="w-4 h-4" />
                Sustainable shopping, reimagined
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight tracking-tight mb-6">
                Give good things a{' '}
                <span className="text-emerald-600">second life</span>
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-lg">
                Buy and sell pre-loved clothing, electronics, books, and more. Every transaction keeps quality goods in use and out of landfills.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Start Browsing
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-700 font-semibold rounded-xl border border-stone-300 transition-colors"
                >
                  Sell Your Items
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10 text-sm">
                <div>
                  <div className="text-2xl font-bold text-stone-800">2.4k+</div>
                  <div className="text-stone-500">Items rehomed</div>
                </div>
                <div className="w-px h-10 bg-stone-300" />
                <div>
                  <div className="text-2xl font-bold text-stone-800">830</div>
                  <div className="text-stone-500">Active sellers</div>
                </div>
                <div className="w-px h-10 bg-stone-300" />
                <div>
                  <div className="text-2xl font-bold text-stone-800">12t</div>
                  <div className="text-stone-500">Waste avoided</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                    <img
                      src="https://images.pexels.com/photos/30922973/pexels-photo-30922973.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Vintage clothing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src="https://images.pexels.com/photos/1203819/pexels-photo-1203819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Vintage camera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src="https://images.pexels.com/photos/18533669/pexels-photo-18533669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Denim and camera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                    <img
                      src="https://images.pexels.com/photos/34889792/pexels-photo-34889792.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt="Stack of books"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Recycle className="w-6 h-6" />, title: 'Circular Economy', text: 'Every item sold extends a product lifecycle and reduces the need for new manufacturing.' },
            { icon: <TrendingUp className="w-6 h-6" />, title: 'Fair Pricing', text: 'Set your own prices and find genuine bargains. No middlemen, no inflated markups.' },
            { icon: <Globe className="w-6 h-6" />, title: 'Community Driven', text: 'Buy directly from and sell directly to people in your community. Real connections, real trust.' },
          ].map((v) => (
            <div key={v.title} className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                {v.icon}
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">{v.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Clothing', image: 'https://images.pexels.com/photos/31826316/pexels-photo-31826316.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Electronics', image: 'https://images.pexels.com/photos/31696749/pexels-photo-31696749.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Books', image: 'https://images.pexels.com/photos/2002217/pexels-photo-2002217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Sports', image: 'https://images.pexels.com/photos/26770053/pexels-photo-26770053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Home & Garden', image: 'https://images.pexels.com/photos/18347938/pexels-photo-18347938.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Other', image: 'https://images.pexels.com/photos/6787035/pexels-photo-6787035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white font-semibold text-sm">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Recently listed</h2>
          <Link to="/browse" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-stone-800 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="relative">
            <Heart className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Have items you no longer need?</h2>
            <p className="text-stone-300 max-w-xl mx-auto mb-8">
              List them on PassItOn and find someone who'll give them a second life. It takes less than two minutes.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
            >
              Start Selling <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
