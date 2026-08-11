import { Link } from 'react-router-dom';
import { Leaf, MapPin } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-stone-100 relative">
        {product.images[0] ? (
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
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur text-stone-700 rounded-full">
            {product.condition}
          </span>
        </div>
        {product.sustainabilityScore >= 85 && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full">
              <Leaf className="w-3 h-3" />
              Eco
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs font-medium text-emerald-600 mb-1">{product.category}</div>
        <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">${product.price}</span>
          {product.location && (
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <MapPin className="w-3 h-3" />
              {product.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
