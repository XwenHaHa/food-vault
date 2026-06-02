import type { Store, AIRecommendation } from '@/types';

export async function getRecommendation(
  stores: Store[],
  type: 'today' | 'delivery' | 'dinein' | 'city',
  currentCity?: string
): Promise<AIRecommendation> {
  if (stores.length === 0) {
    return {
      store: {
        id: 'mock',
        userId: '',
        name: '暂无收藏',
        category: '未知',
        city: '未知',
        source: 'dinein',
        status: 'wishlist',
        createdAt: '',
        updatedAt: '',
      },
      reason: '你还没有收藏任何店铺，快去添加吧！',
      confidence: 0,
    };
  }

  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stores, type, currentCity }),
    });

    const data = await res.json();

    if (data.error) {
      return getMockRecommendation(stores, type);
    }

    const store = stores.find((s) => s.id === data.storeId);

    // If AI returned a valid store, use it; otherwise fallback to random
    if (store) {
      return {
        store,
        reason: data.reason || '基于你的收藏偏好推荐',
        confidence: 0.85,
      };
    }

    return getMockRecommendation(stores, type);
  } catch {
    return getMockRecommendation(stores, type);
  }
}

function getMockRecommendation(stores: Store[], type: string): AIRecommendation {
  const unvisited = stores.filter((s) => s.status === 'wishlist');
  const candidates = unvisited.length > 0 ? unvisited : stores;

  // 随机选一个，每次点"换一个"都能换
  const store = candidates[Math.floor(Math.random() * candidates.length)];

  const reasons: Record<string, string> = {
    today: `基于你最近的收藏记录，推荐你试试 ${store.name}！`,
    delivery: `${store.name}适合外卖，${store.averageCost ? '人均' + store.averageCost + '元' : '值得试试'}。`,
    dinein: `${store.name}值得一去，${store.note ? store.note.slice(0, 20) : '快去尝尝吧'}。`,
    city: `在${store.city}，${store.name}值得一试。`,
  };

  return {
    store,
    reason: reasons[type] || reasons.today,
    confidence: 0.75,
  };
}
