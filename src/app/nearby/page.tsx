'use client';

import { useState, useEffect } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { FilterChips } from '@/components/filter-chips';
import { BottomNav } from '@/components/ui/bottom-nav';
import { calculateDistance, formatDistance } from '@/utils/distance';
import type { Store } from '@/types';

const FILTER_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '1km', value: '1km' },
  { label: '火锅', value: '火锅' },
  { label: '高评分', value: 'high-rating' },
];

export default function NearbyPage() {
  const { stores } = useStores();
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  // Calculate distances and filter
  const nearbyStores = stores
    .filter((s) => s.latitude && s.longitude)
    .map((s) => ({
      ...s,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, s.latitude!, s.longitude!)
        : 0,
    }))
    .sort((a, b) => a.distance - b.distance);

  const filteredStores = nearbyStores.filter((s) => {
    if (filter === 'all') return true;
    if (filter === '1km') return s.distance <= 1;
    if (filter === 'high-rating') return (s.rating || 0) >= 4.5;
    return s.category === filter;
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold">附近推荐</h1>
          <p className="text-xs text-gray-400">基于你的收藏 & 当前位置</p>
        </div>
        <MapPin size={24} className="text-gray-600" />
      </div>

      {/* AI Summary */}
      <div className="bg-black text-white rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} />
          <span className="text-sm font-medium">AI 推荐结论</span>
        </div>
        <p className="text-sm text-gray-200">
          {filteredStores.length > 0
            ? `附近有 ${filteredStores.length} 家你收藏的店`
            : '附近暂无收藏的店铺，试试扩大范围'}
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-2xl h-40 mb-3 flex items-center justify-center">
        <MapPin size={40} className="text-gray-500" />
        <p className="text-xs text-gray-500 ml-2">地图加载中...</p>
      </div>

      {/* Quick Filter */}
      <div className="mb-3">
        <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-hidden space-y-2">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-gray-50 rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{store.name}</p>
                <p className="text-xs text-gray-400">
                  {formatDistance(store.distance)} · {store.category} · 评分{' '}
                  {store.rating?.toFixed(1) || '无'}
                </p>
              </div>
              <button className="text-xs bg-black text-white px-3 py-1 rounded-full">
                去吃
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">
            {stores.length === 0
              ? '还没有收藏店铺'
              : '附近没有匹配的店铺，试试其他筛选条件'}
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <button className="bg-black text-white py-3 rounded-2xl text-sm mt-3 w-full">
        AI 帮我选一个
      </button>

      <BottomNav />
    </>
  );
}
