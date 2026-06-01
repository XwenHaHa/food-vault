'use client';

import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = '搜索店名 / 火锅 / 上海...',
  onSubmit,
}: SearchInputProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-2">
      <Search size={16} className="text-gray-400 shrink-0" />
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
      />
    </div>
  );
}
