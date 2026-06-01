'use client';

import { Zap, Sparkles } from 'lucide-react';
import { useRecommendation } from '@/hooks/useRecommendation';
import { useStores } from '@/hooks/useStores';
import { StoreCard } from '@/components/store-card';
import { RatingBadge } from '@/components/ui/badge';

export default function EatTodayPage() {
  const { stores } = useStores();
  const { recommendation, loading, refresh } = useRecommendation('today');

  // Get alternatives (other stores)
  const alternatives = stores
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

      {/* Main Decision Card */}
      {loading ? (
        <div className="bg-black text-white rounded-2xl p-5 mb-4 text-center">
          <p className="text-sm text-gray-300">AI 正在思考中...</p>
        </div>
      ) : recommendation ? (
        <div className="bg-black text-white rounded-2xl p-5 mb-4 text-center">
          <p className="text-xs text-gray-300 mb-2">推荐结果</p>
          <h2 className="text-2xl font-semibold mb-1">{recommendation.store.name}</h2>
          <p className="text-sm text-gray-300">
            {recommendation.store.category} · {recommendation.store.city}
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {recommendation.store.rating && (
              <span className="text-xs bg-white text-black px-2 py-1 rounded-full">
                评分 {recommendation.store.rating.toFixed(1)}
              </span>
            )}
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
              {recommendation.store.category}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-black text-white rounded-2xl p-5 mb-4 text-center">
          <p className="text-sm text-gray-300">暂无推荐，请先添加店铺</p>
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
          onClick={refresh}
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
                    {store.category} · 评分 {store.rating?.toFixed(1) || '无'}
                  </p>
                </div>
                {store.rating && <RatingBadge rating={store.rating} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
