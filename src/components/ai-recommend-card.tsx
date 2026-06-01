import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AIRecommendCardProps {
  title?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function AIRecommendCard({
  title = 'AI 今日推荐',
  message,
  actionLabel = '去看看',
  actionHref = '/eat-today',
}: AIRecommendCardProps) {
  return (
    <div className="bg-black text-white rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-sm text-gray-200">{message}</p>
      {actionHref && (
        <Link href={actionHref}>
          <button className="mt-3 text-xs bg-white text-black px-3 py-1 rounded-full">
            {actionLabel}
          </button>
        </Link>
      )}
    </div>
  );
}
