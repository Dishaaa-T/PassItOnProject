import { Link } from 'react-router-dom';

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 max-w-md mb-6">{message}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
