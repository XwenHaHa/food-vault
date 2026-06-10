'use client';

import { useState, useEffect } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStores } from '@/hooks/useStores';
import { useAppStore } from '@/store';
import { FilterChips } from '@/components/filter-chips';
import { BottomNav } from '@/components/ui/bottom-nav';
import { MapView } from '@/components/map-view';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { getRecommendation } from '@/services/ai-service';

const FILTER_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '1km', value: '1km' },
  { label: '火锅', value: '火锅' },
  { label: '高评分', value: 'high-rating' },
];

export default function NearbyPage() {
  const { stores } = useStores();
  const router = useRouter();
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

  const storesWithLocation = stores.filter((s) => s.latitude && s.longitude);
  const nearbyStores = storesWithLocation
    .map((s) => ({ ...s, distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, s.latitude!, s.longitude!) : 0 }))
    .sort((a, b) => a.distance - b.distance);

  const filteredStores = nearbyStores.filter((s) => {
    if (filter === 'all') return true;
    if (filter === '1km') return s.distance <= 1;
    if (filter === 'high-rating') return (s.rating || 0) >= 4.5;
    return s.category === filter;
  });

  const markers = filteredStores.map((s) => ({ id: s.id, name: s.name, lat: s.latitude!, lng: s.longitude! }));

  const handleAISelect = async () => {
    const candidates = filteredStores.length > 0 ? filteredStores : stores;
    if (candidates.length === 0) return;
    const rec = await getRecommendation(candidates, 'today');
    useAppStore.setState({ recommendation: rec });
    router.push('/eat-today');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed Header + Map + Filters */}
      <div className="shrink-0 px-5 pt-5 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">附近推荐</h1>
            <p className="text-xs text-gray-400">基于你的收藏 & 当前位置</p>
          </div>
          <MapPin size={20} className="text-gray-400" />
        </div>

        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} />
            <span className="text-sm font-medium">AI 推荐结论</span>
          </div>
          <p className="text-sm text-gray-200">
            {storesWithLocation.length > 0
              ? filteredStores.length > 0 ? `附近有 ${filteredStores.length} 家你收藏的店` : '当前筛选条件下没有匹配的店铺'
              : `你有 ${stores.length} 家收藏，但还没有位置信息`}
          </p>
        </div>

        <MapView center={userLocation || undefined} markers={markers} />
        <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
      </div>

      {/* Scrollable Store List */}
      <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-2">
        {filteredStores.length > 0 ? filteredStores.map((store) => (
          <div key={store.id} className="bg-gray-50 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{store.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDistance(store.distance)} · {store.category} · 评分 {store.rating?.toFixed(1) || '无'}
              </p>
            </div>
            <button className="text-xs bg-black text-white px-3 py-1.5 rounded-full">去吃</button>
          </div>
        )) : (
          <div className="text-center py-10">
            <p className="text-gray-300 text-3xl mb-2">📍</p>
            <p className="text-xs text-gray-400">{stores.length === 0 ? '还没有收藏店铺' : '附近没有匹配的店铺'}</p>
          </div>
        )}

        <button onClick={handleAISelect} className="bg-black text-white py-3 rounded-2xl text-sm font-medium w-full active:scale-[0.98] transition-transform">
          AI 帮我选一个
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
