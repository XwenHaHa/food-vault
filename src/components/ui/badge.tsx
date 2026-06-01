interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variants = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-500',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full inline-block ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function RatingBadge({ rating }: { rating: number }) {
  const variant = rating >= 4.5 ? 'success' : rating >= 4.0 ? 'warning' : 'default';
  return <Badge variant={variant}>{rating.toFixed(1)}</Badge>;
}
