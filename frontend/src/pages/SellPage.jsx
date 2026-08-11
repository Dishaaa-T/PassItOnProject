import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, FileText, IndianRupee, Image as ImageIcon, Leaf, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SellPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Clothing');
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(user?.location || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Sign in to sell</h2>
        <p className="text-stone-500 mb-6">You need an account to list items on PassItOn.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="px-5 py-2.5 font-semibold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const addImage = () => {
    if (imageUrl.trim() && images.length < 5) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !price) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.createProduct({
        title,
        description,
        category,
        condition,
        price: parseFloat(price),
        images,
        location,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const sustainabilityPreview = { New: 30, 'Like New': 70, Good: 85, Fair: 95 }[condition];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">List a new item</h1>
        <p className="text-stone-500">Give something you no longer need a second life.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g. Vintage Levi's Denim Jacket"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sustainability preview */}
        <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-emerald-700">Sustainability Score: {sustainabilityPreview}/100</span>
            <p className="text-xs text-emerald-600 mt-0.5">Score is based on item condition — the more worn, the more sustainable.</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            maxLength={2000}
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Describe your item's condition, history, and any notable details..."
          />
        </div>

        {/* Price & Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Price (INR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              step="0.01"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="25.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="City, State"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            Images (up to 5)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImage();
                }
              }}
              className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors"
            >
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Creating listing...' : 'Publish Listing'}
            {!loading && <ArrowRight className="w-5 h-5" />}
            {loading && <Check className="w-5 h-5 animate-spin" />}
          </button>
          <Link to="/dashboard" className="px-5 py-3.5 text-stone-600 font-medium hover:text-stone-800 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
