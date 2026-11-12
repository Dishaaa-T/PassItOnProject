import { Link } from 'react-router-dom';
import { Leaf, MapPin } from 'lucide-react';
import { getCO2Saved, getSustainabilityScore } from '@/lib/sustainability';

export default function ProductCard({ product }) {
  const sustainabilityScore = getSustainabilityScore(product);
  const co2Saved = getCO2Saved(sustainabilityScore);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-stone-100 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Leaf className="w-12 h-12" />
          </div>
        )}

        {/* Condition */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur text-stone-700 rounded-full">
            {product.condition}
          </span>
        </div>

        {/* Eco badge */}
        {sustainabilityScore >= 85 && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full">
              <Leaf className="w-3 h-3" />
              Eco
            </span>
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="p-4">
        <div className="text-xs font-medium text-emerald-600 mb-1">
          {product.category}
        </div>

        <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-stone-900">
            ₹{product.price}
          </span>

          {product.location && (
            <span className="flex items-center gap-1 text-xs text-stone-400 max-w-[120px] truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {product.location}
            </span>
          )}
        </div>

        {/* Sustainability information
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />

              <span className="text-xs font-medium text-emerald-700">
                Sustainability
              </span>
            </div>

            <span className="text-xs font-semibold text-emerald-700">
              {sustainabilityScore}/100
            </span>
          </div>

          <p className="text-[11px] text-emerald-600 mt-1">
            Saves ~{co2Saved}kg CO₂ vs buying new
          </p>
        </div> */}
      </div>
    </Link>
  );
}