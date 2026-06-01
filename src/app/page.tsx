'use client';

import { User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useStores, useStoreStats } from '@/hooks/useStores';
import { useRecommendation } from '@/hooks/useRecommendation';
import { StoreCard } from '@/components/store-card';
import { StatsCard } from '@/components/stats-card';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function DashboardPage() {
  const { stores, loading } = useStores();
  const { total, visited, wishlist } = useStoreStats();
  const { recommendation } = useRecommendation('today');

  const recentStores = stores.slice(0, 5);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold">FoodVault</h1>
          <p className="text-xs text-gray-400">你的私人美食库</p>
        </div>
        <User size={24} className="text-gray-600" />
      </div>

      {/* AI Recommend Card */}
      <div className="bg-black text-white rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} />
          <span className="text-sm font-medium">AI 今日推荐</span>
        </div>
        <p className="text-sm text-gray-200">
          {recommendation?.reason || '你最近偏爱火锅，附近有一家评分 4.8 的店值得尝试'}
        </p>
        <Link href="/eat-today">
          <button className="mt-3 text-xs bg-white text-black px-3 py-1 rounded-full">
            去看看
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatsCard label="收藏" value={total} />
        <StatsCard label="已吃" value={visited} />
        <StatsCard label="待吃" value={wishlist} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <Link href="/add-store" className="flex-1">
          <button className="w-full bg-black text-white py-2 rounded-xl text-sm">
            + 添加店铺
          </button>
        </Link>
        <Link href="/search" className="flex-1">
          <button className="w-full bg-gray-100 py-2 rounded-xl text-sm">
            🔍 搜索
          </button>
        </Link>
      </div>

      {/* Recent List */}
      <div className="flex-1 overflow-hidden">
        <h2 className="text-sm font-semibold mb-2">最近新增</h2>
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-4">加载中...</p>
        ) : recentStores.length > 0 ? (
          <div className="space-y-2 overflow-y-auto max-h-[200px]">
            {recentStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">
            还没有收藏，点击上方按钮添加
          </p>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </>
  );
}
