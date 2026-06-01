import Link from 'next/link';
import type { Store } from '@/types';
import { RatingBadge } from './ui/badge';
import { SOURCE_LABELS } from '@/constants';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/store/${store.id}`}>
      <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center active:bg-gray-100 transition-colors">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{store.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {store.category} · {store.city}
            {store.source && ` · ${SOURCE_LABELS[store.source]}`}
          </p>
        </div>
        {store.rating !== undefined && <RatingBadge rating={store.rating} />}
      </div>
    </Link>
  );
}
