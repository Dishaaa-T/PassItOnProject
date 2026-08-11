import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '@/types';
import { api } from '@/lib/api';
import { filterMockProducts } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const condition = searchParams.get('condition') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = {
      category: category || undefined,
      condition: condition || undefined,
      sort: sort || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      search: search || undefined,
    };

    try {
      const res = await api.getProducts(params);
      setProducts(res.products);
    } catch {
      const mock = filterMockProducts(params);
      setProducts(mock.products);
    } finally {
      setLoading(false);
    }
  }, [category, condition, sort, minPrice, maxPrice, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const hasFilters = category || condition || sort || minPrice || maxPrice || search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          {category || 'Browse all items'}
        </h1>
        <p className="text-stone-500">
          {loading ? 'Loading...' : `${products.length} item${products.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for items..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-stone-700"
        />
      </form>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Sort: Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 ml-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', category === cat ? '' : cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                category === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Condition</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateParam('condition', condition === c ? '' : c)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    condition === c
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Price Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-stone-400">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-stone-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-stone-200 rounded w-1/3" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-5 bg-stone-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No items found"
          message="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
