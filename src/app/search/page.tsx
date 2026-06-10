'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useStores } from '@/hooks/useStores';
import { StoreCard } from '@/components/store-card';
import { FilterChips, FilterGrid } from '@/components/filter-chips';
import { BottomNav } from '@/components/ui/bottom-nav';
import { CATEGORIES, CITIES } from '@/constants';

const STATUS_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '已吃', value: 'visited' },
  { label: '待吃', value: 'wishlist' },
];

export default function SearchPage() {
  const { stores } = useStores();
  const { results, searchTerm, updateSearch, updateFilter, executeSearch, filters } = useSearch();
  const [activeCategory, setActiveCategory] = useState('');
  const [activeCity, setActiveCity] = useState('');

  useEffect(() => { executeSearch(); }, [executeSearch]);

  const displayResults = results.length > 0 || searchTerm ? results : stores;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">搜索</h1>
            <p className="text-xs text-gray-400">3 秒找到想吃的</p>
          </div>
          <Search size={20} className="text-gray-400" />
        </div>

        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-2">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="搜索店名 / 火锅 / 上海 / 咖啡..."
            value={searchTerm}
            onChange={(e) => { updateSearch(e.target.value); executeSearch(); }}
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1.5">状态</p>
            <FilterChips options={STATUS_OPTIONS} selected={filters.status || 'all'} onChange={(v) => { updateFilter('status', v); executeSearch(); }} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1.5">分类</p>
            <FilterGrid options={[{ label: '全部', value: '' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]} selected={activeCategory} onChange={(v) => { setActiveCategory(v); updateFilter('category', v); executeSearch(); }} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1.5">城市</p>
            <FilterChips options={[{ label: '全部', value: '' }, ...CITIES.map((c) => ({ label: c, value: c }))]} selected={activeCity} onChange={(v) => { setActiveCity(v); updateFilter('city', v); executeSearch(); }} />
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">{searchTerm ? `搜索结果 (${displayResults.length})` : '全部店铺'}</p>
          <div className="space-y-2">
            {displayResults.length > 0 ? displayResults.map((s) => <StoreCard key={s.id} store={s} />) : (
              <div className="text-center py-10">
                <p className="text-gray-300 text-3xl mb-2">🔍</p>
                <p className="text-xs text-gray-400">{searchTerm ? '没有找到匹配的店铺' : '还没有收藏任何店铺'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
