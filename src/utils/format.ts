import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd');
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: zhCN,
  });
}

export function formatCost(cost: number): string {
  return `${cost} 元`;
}

export function formatRating(rating?: number | null): string {
  return rating?.toFixed(1) ?? '-';
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'bg-green-100 text-green-600';
  if (rating >= 4.0) return 'bg-yellow-100 text-yellow-600';
  return 'bg-gray-100 text-gray-600';
}
