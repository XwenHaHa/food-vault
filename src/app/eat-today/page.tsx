'use client';

import { useState, useEffect } from 'react';
import { Zap, Sparkles, MapPin } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useAppStore } from '@/store';
import { RatingBadge } from '@/components/ui/badge';
import type { Store } from '@/types';

type RecommendFilter = 'delivery' | 'dinein' | 'wishlist';

export default function EatTodayPage() {
  const { stores } = useStores();
  const { recommendation, recommendLoading } = useAppStore();
  const [filter, setFilter] = useState<RecommendFilter | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);

  // Get all unique cities from stores
  const allCities = [...new Set(stores.map((s) => s.city).filter(Boolean))];

  // Auto-detect user's city
  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentCity(allCities[0] || null);
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Try to get city from Amap reverse geocoding
          const key = process.env.NEXT_PUBLIC_AMAP_KEY;
          if (key && key !== '你的Web端JS_API_Key') {
            const resp = await fetch(
              `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${pos.coords.longitude},${pos.coords.latitude}`,
            );
            const data = await resp.json();
            const city = data?.regeocode?.addressComponent?.city;
            if (city) {
              // Check if we have stores in this city
              const match = allCities.find(
                (c) => c.includes(city) || city.includes(c),
              );
              setCurrentCity(match || allCities[0] || city);
            } else {
              setCurrentCity(allCities[0] || null);
            }
          } else {
            setCurrentCity(allCities[0] || null);
          }
        } catch {
          setCurrentCity(allCities[0] || null);
        }
        setLocating(false);
      },
      () => {
        setCurrentCity(allCities[0] || null);
        setLocating(false);
      },
      { timeout: 5000 },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter stores by city first
  const cityStores = currentCity
    ? stores.filter((s) => s.city === currentCity)
    : stores;

  // Then filter by type
  const getFilteredStores = (): Store[] => {
    switch (filter) {
      case 'delivery':
        return cityStores.filter((s) => s.source === 'delivery');
      case 'dinein':
        return cityStores.filter(
          (s) => s.source === 'dinein' && s.status === 'visited',
        );
      case 'wishlist':
        return cityStores.filter((s) => s.status === 'wishlist');
      default:
        return cityStores;
    }
  };

  const handleRecommend = () => {
    const filtered = getFilteredStores();
    if (filtered.length === 0) return;
    useAppStore.setState({ recommendation: null, recommendLoading: true });
    import('@/services/ai-service').then(({ getRecommendation }) => {
      getRecommendation(filtered, 'today', currentCity || undefined).then(
        (rec) => {
          useAppStore.setState({
            recommendation: rec,
            recommendLoading: false,
          });
        },
      );
    });
  };

  const filteredStores = getFilteredStores();
  const alternatives = filteredStores
    .filter((s) => s.id !== recommendation?.store.id)
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed Header + Filters */}
      <div className="shrink-0 px-5 pt-5 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold">AI 帮你决定</h1>
            <p className="text-xs text-gray-400">今天吃什么？交给系统</p>
          </div>
          <Zap size={24} className="text-gray-600" />
        </div>

        {/* Current City */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-gray-400" />
          {locating ? (
            <span className="text-xs text-gray-400">定位中...</span>
          ) : (
            <select
              value={currentCity || ''}
              onChange={(e) => {
                setCurrentCity(e.target.value || null);
                useAppStore.setState({ recommendation: null });
              }}
              className="text-xs bg-gray-50 rounded-lg px-2 py-1 outline-none"
            >
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="">所有城市</option>
            </select>
          )}
          <span className="text-[10px] text-gray-400">
            {currentCity
              ? `${cityStores.length} 家收藏`
              : `共 ${stores.length} 家`}
          </span>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto">
          <button
            onClick={() => setFilter(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
              filter === null
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            全部
            <span className="ml-1 text-[10px] opacity-60">
              {cityStores.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('delivery')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
              filter === 'delivery'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            外卖
            <span className="ml-1 text-[10px] opacity-60">
              {cityStores.filter((s) => s.source === 'delivery').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('dinein')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
              filter === 'dinein'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            到店
            <span className="ml-1 text-[10px] opacity-60">
              {
                cityStores.filter(
                  (s) => s.source === 'dinein' && s.status === 'visited',
                ).length
              }
            </span>
          </button>
          <button
            onClick={() => setFilter('wishlist')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
              filter === 'wishlist'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            待吃
            <span className="ml-1 text-[10px] opacity-60">
              {cityStores.filter((s) => s.status === 'wishlist').length}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">

        {/* Empty state */}
        {filteredStores.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center mb-3">
            <p className="text-sm text-gray-400">
              {currentCity
                ? `${currentCity}没有符合条件的店铺`
                : '还没有收藏，快去添加吧'}
            </p>
          </div>
        ) : (
          <>
            {/* Main Decision Card */}
            {recommendLoading ? (
              <div className="bg-black text-white rounded-2xl p-5 mb-4 text-center">
                <p className="text-sm text-gray-300">AI 正在思考中...</p>
              </div>
            ) : recommendation ? (
              <div className="bg-black text-white rounded-2xl p-5 mb-4 text-center">
                <p className="text-xs text-gray-300 mb-2">推荐结果</p>
                <h2 className="text-2xl font-semibold mb-1">
                  {recommendation.store.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {recommendation.store.category} · {recommendation.store.city}
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  {recommendation.store.rating && (
                    <span className="text-xs bg-white text-black px-2 py-1 rounded-full">
                      评分 {recommendation.store.rating?.toFixed(1) || '-'}
                    </span>
                  )}
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {recommendation.store.category}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-5 mb-4 text-center">
                <p className="text-sm text-gray-400">点击下方按钮开始推荐</p>
              </div>
            )}

            {/* Reason */}
            {recommendation && (
              <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} />
                  <span className="text-xs font-medium">AI 推荐理由</span>
                </div>
                <p className="text-xs text-gray-500">{recommendation.reason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button className="bg-black text-white py-3 rounded-2xl text-sm">
                就吃这个
              </button>
              <button
                onClick={handleRecommend}
                className="bg-gray-100 py-3 rounded-2xl text-sm"
              >
                换一个
              </button>
            </div>

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-400 mb-2">备选推荐</p>
                <div className="space-y-2 overflow-y-auto">
                  {alternatives.map((store) => (
                    <div
                      key={store.id}
                      className="bg-gray-50 rounded-xl p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium">{store.name}</p>
                        <p className="text-xs text-gray-400">
                          {store.category} ·{' '}
                          {store.averageCost
                            ? `人均${store.averageCost}元`
                            : '评分 ' + (store.rating?.toFixed(1) || '无')}
                        </p>
                      </div>
                      {store.rating && <RatingBadge rating={store.rating} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
