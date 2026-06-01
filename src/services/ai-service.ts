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

    const store = stores.find((s) => s.id === data.storeId) || stores[0];

    return {
      store,
      reason: data.reason || '基于你的收藏偏好推荐',
      confidence: 0.85,
    };
  } catch {
    return getMockRecommendation(stores, type);
  }
}

function getMockRecommendation(stores: Store[], type: string): AIRecommendation {
  const unvisited = stores.filter((s) => s.status === 'wishlist');
  const candidates = unvisited.length > 0 ? unvisited : stores;
  const sorted = [...candidates].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const store = sorted[0];

  const reasons: Record<string, string> = {
    today: `基于你最近的收藏记录，${store.name}评分最高，值得一试！`,
    delivery: `${store.name}适合外卖，评分${store.rating || '不错'}。`,
    dinein: `${store.name}距离近、评分高，适合到店用餐。`,
    city: `在${store.city}，${store.name}是你的首选。`,
  };

  return {
    store,
    reason: reasons[type] || reasons.today,
    confidence: 0.75,
  };
}
