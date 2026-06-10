'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MoreHorizontal, Star } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Store } from '@/types';
import { Badge } from '@/components/ui/badge';
import { SOURCE_LABELS, STATUS_LABELS } from '@/constants';
import { formatDate } from '@/utils/format';
import { getStoreById } from '@/services/store-service';

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateStore, deleteStore } = useAppStore();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStoreById(params.id as string);
        setStore(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleMarkVisited = async () => {
    if (!store) return;
    await updateStore(store.id, { status: 'visited' });
    setStore({ ...store, status: 'visited' });
  };

  const handleDelete = async () => {
    if (!store) return;
    if (confirm('确定删除这家店铺吗？')) {
      await deleteStore(store.id);
      router.push('/');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 py-8">加载中...</p>;
  }

  if (!store) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">店铺不存在</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm underline"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold">{store.name}</h1>
            <p className="text-xs text-gray-400">
              {store.category} · {store.city}
            </p>
          </div>
          <button onClick={handleDelete}>
            <MoreHorizontal size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Rating Overview */}
        <div className="bg-black text-white rounded-2xl p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300">综合评分</p>
              <p className="text-2xl font-semibold">
                {store.rating?.toFixed(1) || '未评分'}
              </p>
            </div>
            <Star size={32} className="text-yellow-400" />
          </div>
          <p className="text-xs text-gray-300 mt-2">
            {STATUS_LABELS[store.status]} · {SOURCE_LABELS[store.source]}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={handleMarkVisited}
            className="bg-green-50 text-green-600 py-2 rounded-xl text-xs"
          >
            ✔ 再吃一次
          </button>
          <button className="bg-gray-100 py-2 rounded-xl text-xs">
            ⭐ 更新评分
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-500 py-2 rounded-xl text-xs"
          >
            ✖ 标记踩雷
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-2 mb-3">
          {store.averageCost !== undefined && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">人均消费</p>
              <p className="text-sm font-medium">{store.averageCost} 元</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">添加时间</p>
            <p className="text-sm font-medium">{formatDate(store.createdAt)}</p>
          </div>

          {store.tags && store.tags.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">标签</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {store.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {store.note && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3 flex-1 overflow-hidden">
            <p className="text-xs text-gray-400 mb-1">个人备注</p>
            <p className="text-sm text-gray-600">{store.note}</p>
          </div>
        )}

        {/* Bottom CTA */}
        <button
          onClick={handleMarkVisited}
          className="bg-black text-white py-3 rounded-2xl text-sm w-full"
        >
          记录一次消费
        </button>
      </div>
    </div>
  );
}
