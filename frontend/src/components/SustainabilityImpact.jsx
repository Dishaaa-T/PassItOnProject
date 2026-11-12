import { Leaf } from 'lucide-react';
import {
  getProductCO2Saved,
  formatCO2,
} from '@/lib/sustainability';

export default function SustainabilityImpact({
  product,
  variant = 'default',
}) {
  if (!product) return null;

  const score =
    product.sustainabilityScore ?? 0;

  const co2Saved = getProductCO2Saved(product);

  if (variant === 'score') {
    return (
      <div className="bg-emerald-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Leaf className="w-4 h-4" />
            Sustainability Score
          </span>

          <span className="text-lg font-bold text-emerald-700">
            {score}/100
          </span>
        </div>

        <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-emerald-600 mt-2">
          Buying this item saves approximately{' '}
          {formatCO2(co2Saved)} of CO2 compared to buying new.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-2">
      <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0" />

      <p className="text-xs text-emerald-700">
        This item saves approximately{' '}
        <span className="font-semibold">
          {formatCO2(co2Saved)}
        </span>{' '}
        of CO2 compared to buying new.
      </p>
    </div>
  );
}