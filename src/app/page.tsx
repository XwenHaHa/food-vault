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

  const recentStores = stores.slice(0, 10);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed Header Section */}
      <div className="shrink-0 px-5 pt-5 pb-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">FoodVault</h1>
            <p className="text-xs text-gray-400">你的私人美食库</p>
          </div>
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-gray-500" />
          </div>
        </div>

        {/* AI Recommend Card */}
        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} />
            <span className="text-sm font-medium">AI 今日推荐</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {recommendation?.reason || '点击 AI 标签，让我帮你决定吃什么'}
          </p>
          <Link href="/eat-today">
            <button className="mt-3 text-xs bg-white text-black px-4 py-1.5 rounded-full font-medium">
              去看看
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatsCard label="收藏" value={total} />
          <StatsCard label="已吃" value={visited} />
          <StatsCard label="待吃" value={wishlist} />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2.5">
          <Link href="/add-store" className="flex-1">
            <button className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform">
              + 添加店铺
            </button>
          </Link>
          <Link href="/search" className="flex-1">
            <button className="w-full bg-gray-100 py-3 rounded-xl text-sm active:scale-[0.98] transition-transform">
              🔍 搜索
            </button>
          </Link>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <h2 className="text-sm font-semibold mb-3">最近新增</h2>
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-6">加载中...</p>
        ) : recentStores.length > 0 ? (
          <div className="space-y-2">
            {recentStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-300 text-3xl mb-2">🍽️</p>
            <p className="text-xs text-gray-400">还没有收藏，点击上方按钮添加</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
