'use client';

import { useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useAppStore } from '@/store';
import { RatingBadge } from '@/components/ui/badge';
import type { Store } from '@/types';

type RecommendFilter = 'all' | 'delivery' | 'dinein' | 'wishlist';

const FILTER_OPTIONS: { label: string; value: RecommendFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '外卖', value: 'delivery' },
  { label: '到店', value: 'dinein' },
  { label: '待吃', value: 'wishlist' },
];

export default function EatTodayPage() {
  const { stores } = useStores();
  const { recommendation, recommendLoading, fetchRecommendation } = useAppStore();
  const [filter, setFilter] = useState<RecommendFilter>('all');

  const getFilteredStores = (): Store[] => {
    switch (filter) {
      case 'delivery':
        return stores.filter((s) => s.source === 'delivery');
      case 'dinein':
        return stores.filter((s) => s.source === 'dinein' && s.status === 'visited');
      case 'wishlist':
        return stores.filter((s) => s.status === 'wishlist');
      default:
        return stores;
    }
  };

  const handleRecommend = () => {
    const filtered = getFilteredStores();
    if (filtered.length === 0) return;
    // Pass filtered stores to the recommendation
    useAppStore.setState({ recommendation: null, recommendLoading: true });
    import('@/services/ai-service').then(({ getRecommendation }) => {
      getRecommendation(filtered, 'today').then((rec) => {
        useAppStore.setState({ recommendation: rec, recommendLoading: false });
      });
    });
  };

  const filteredStores = getFilteredStores();
  const alternatives = filteredStores
    .filter((s) => s.id !== recommendation?.store.id)
    .slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold">AI 帮你决定</h1>
          <p className="text-xs text-gray-400">今天吃什么？交给系统</p>
        </div>
        <Zap size={24} className="text-gray-600" />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-3">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              filter === opt.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {opt.label}
            <span className="ml-1 text-[10px] opacity-60">
              {opt.value === 'all'
                ? stores.length
                : opt.value === 'delivery'
                ? stores.filter((s) => s.source === 'delivery').length
                : opt.value === 'dinein'
                ? stores.filter((s) => s.source === 'dinein' && s.status === 'visited').length
                : stores.filter((s) => s.status === 'wishlist').length}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredStores.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center mb-3">
          <p className="text-sm text-gray-400">
            {filter === 'delivery'
              ? '还没有外卖记录'
              : filter === 'dinein'
              ? '还没有到店记录'
              : filter === 'wishlist'
              ? '还没有待吃清单'
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
                        {store.averageCost ? `人均${store.averageCost}元` : '评分 ' + (store.rating?.toFixed(1) || '无')}
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
    </>
  );
}
