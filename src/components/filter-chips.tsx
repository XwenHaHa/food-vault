'use client';

interface FilterChipsProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            selected === opt.value
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface FilterGridProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
  columns?: number;
}

export function FilterGrid({ options, selected, onChange, columns = 4 }: FilterGridProps) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`py-1 rounded-xl text-xs transition-colors ${
            selected === opt.value
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
