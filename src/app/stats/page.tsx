'use client';

import { BarChart3, Sparkles } from 'lucide-react';
import { useStoreStats } from '@/hooks/useStores';
import { StatsBar } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function StatsPage() {
  const { total, visited, wishlist, categoryStats, cityStats } = useStoreStats();
  const topCategory = categoryStats[0];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">美食画像</h1>
            <p className="text-xs text-gray-400">你的饮食偏好分析</p>
          </div>
          <BarChart3 size={20} className="text-gray-400" />
        </div>

        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} />
            <span className="text-sm font-medium">AI 画像总结</span>
          </div>
          <p className="text-xs text-gray-300">
            {topCategory ? `你是"${topCategory.category}爱好者"，占比 ${topCategory.percentage}%` : '还没有足够的数据来生成画像'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-3">分类分布</p>
          {categoryStats.length > 0 ? (
            <div className="space-y-2.5">
              {categoryStats.map((s) => <StatsBar key={s.category} label={s.category} percentage={s.percentage} />)}
            </div>
          ) : <p className="text-xs text-gray-400 text-center py-4">暂无数据</p>}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-3">城市偏好</p>
          {cityStats.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {cityStats.map((s, i) => (
                <span key={s.city} className={`text-xs px-3 py-1.5 rounded-full ${i === 0 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  {s.city} {s.percentage}%
                </span>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400 text-center py-4">暂无数据</p>}
        </div>

        <div className="space-y-2">
          {[
            { label: '总收藏', value: total, variant: 'default' as const },
            { label: '已吃', value: visited, variant: 'success' as const },
            { label: '待吃', value: wishlist, variant: 'warning' as const },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-400">{item.value} 家店铺</p>
              </div>
              <Badge variant={item.variant}>{item.value}</Badge>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
