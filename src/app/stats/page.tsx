'use client';

import { BarChart3, Sparkles } from 'lucide-react';
import { useStoreStats } from '@/hooks/useStores';
import { StatsBar } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function StatsPage() {
  const { total, visited, wishlist, categoryStats, cityStats } = useStoreStats();

  const topCategory = categoryStats[0];
  const topStores = categoryStats.slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold">美食画像</h1>
          <p className="text-xs text-gray-400">你的饮食偏好分析</p>
        </div>
        <BarChart3 size={24} className="text-gray-600" />
      </div>

      {/* AI Summary */}
      <div className="bg-black text-white rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} />
          <span className="text-sm font-medium">AI 画像总结</span>
        </div>
        <p className="text-xs text-gray-300">
          {topCategory
            ? `你是"${topCategory.category}爱好者"，占比 ${topCategory.percentage}%`
            : '还没有足够的数据来生成画像，快去收藏更多店铺吧！'}
        </p>
      </div>

      {/* Category Chart */}
      <div className="bg-gray-50 rounded-2xl p-3 mb-3">
        <p className="text-xs text-gray-400 mb-2">分类分布</p>
        {categoryStats.length > 0 ? (
          <div className="space-y-2">
            {categoryStats.map((stat) => (
              <StatsBar
                key={stat.category}
                label={stat.category}
                percentage={stat.percentage}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">暂无数据</p>
        )}
      </div>

      {/* City Stats */}
      <div className="bg-gray-50 rounded-2xl p-3 mb-3">
        <p className="text-xs text-gray-400 mb-2">城市偏好</p>
        {cityStats.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {cityStats.map((stat, i) => (
              <span
                key={stat.city}
                className={`text-xs px-3 py-1 rounded-full ${
                  i === 0 ? 'bg-black text-white' : 'bg-gray-200'
                }`}
              >
                {stat.city} {stat.percentage}%
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">暂无数据</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="flex-1 overflow-hidden">
        <p className="text-xs text-gray-400 mb-2">收藏概览</p>
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">总收藏</p>
              <p className="text-xs text-gray-400">{total} 家店铺</p>
            </div>
            <Badge>{total}</Badge>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">已吃</p>
              <p className="text-xs text-gray-400">{visited} 家店铺</p>
            </div>
            <Badge variant="success">{visited}</Badge>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">待吃</p>
              <p className="text-xs text-gray-400">{wishlist} 家店铺</p>
            </div>
            <Badge variant="warning">{wishlist}</Badge>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
