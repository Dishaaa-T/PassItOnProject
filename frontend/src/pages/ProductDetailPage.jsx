import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  Shield,
  Package,
  Star,
} from "lucide-react";
import { api } from "@/lib/api";
import { getMockProductById, getMockRelatedProducts } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import SustainabilityImpact from "@/components/SustainabilityImpact";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        return api.getRelatedProducts(id);
      })
      .then((r) => setRelated(r))
      .catch(() => {
        const mock = getMockProductById(id);
        if (mock) {
          setProduct(mock);
          setRelated(getMockRelatedProducts(id));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-stone-200 rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-stone-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">
          Product not found
        </h2>
        <Link
          to="/browse"
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Back to browse
        </Link>
      </div>
    );
  }

  const isOwner = user && product.seller._id === user._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/browse"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to browse
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-4">
            {product.images[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <Package className="w-16 h-16" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? "border-emerald-600"
                      : "border-stone-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
              {product.category}
            </span>
            <span className="px-3 py-1 text-xs font-semibold bg-stone-100 text-stone-600 rounded-full">
              {product.condition}
            </span>
            {product.sustainabilityScore >= 85 && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full">
                <Leaf className="w-3 h-3" />
                Eco Choice
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            {product.title}
          </h1>
          <div className="text-3xl font-bold text-stone-900 mb-6">
            {" "}
            ₹{product.price}
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Sustainability score */}
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            {/* <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Leaf className="w-4 h-4" />
                Sustainability Score
              </span>
              <span className="text-lg font-bold text-emerald-700">
                {product.sustainabilityScore}/100
              </span>
            </div> */}
            {/* <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${product.sustainabilityScore}%` }}
              />
            </div> */}
            {/* <p className="text-xs text-emerald-600 mt-2">
              Buying this item saves approximately {(product.sustainabilityScore * 0.15).toFixed(1)}kg of CO2 vs buying new.
            </p> */}
            <SustainabilityImpact product={product} variant="score" />
          </div>

          {/* Seller info */}
          <div className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-lg">
              {product.seller.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-stone-800">
                {product.seller.name}
              </div>
              {product.seller.location && (
                <div className="flex items-center gap-1 text-sm text-stone-500">
                  <MapPin className="w-3 h-3" />
                  {product.seller.location}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              4.8
            </div>
          </div>

          {/* Actions */}
          {isOwner ? (
            <div className="bg-stone-100 rounded-xl p-4 text-center text-stone-600 text-sm">
              This is your listing.{" "}
              <Link
                to="/dashboard"
                className="text-emerald-600 font-medium hover:underline"
              >
                Manage in dashboard
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all ${
                  added
                    ? "bg-emerald-100 text-emerald-700"
                    : product.isAvailable
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
              >
                {added ? (
                  "Added to cart!"
                ) : product.isAvailable ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                ) : (
                  "Sold Out"
                )}
              </button>
              <Link
                to="/cart"
                className="px-6 py-3.5 font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
              >
                View Cart
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 text-xs text-stone-400">
            <Shield className="w-4 h-4" />
            Secure transaction. Buyer protection guaranteed.
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Similar items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
