import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, stores, currentCity, history } = await request.json();

    const endpoint =
      process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const key = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!key) {
      return NextResponse.json({
        reply: getMockReply(message, stores || []),
        storeNames: [],
      });
    }

    // Extract only store names, limit to 20
    const allStores: { name: string; category?: string; averageCost?: number; status?: string }[] = stores || [];
    const sample = allStores
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
      .map((s) => s.name.replace(/[^一-龥a-zA-Z0-9·]/g, '').slice(0, 12))
      .filter(Boolean);

    const storeNamesStr = sample.join('、');
    const systemText = `你是美食助手。用户在${currentCity || ''}，收藏了：${storeNamesStr}等共${allStores.length}家。根据需求从收藏里推荐，回复简短，末尾加__STORES__["店名"]。`;

    // Build messages with limited history (last 3 rounds = 6 messages)
    const recentHistory = (history || []).slice(-6).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: String(m.content || '').slice(0, 200),
    }));

    const messages = [
      { role: 'system', content: systemText },
      ...recentHistory,
      { role: 'user', content: String(message || '').slice(0, 200) },
    ];

    const body = JSON.stringify({ model, messages });

    console.log('Chat request body length:', body.length);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body,
    });

    const data = await response.json();

    if (data.error) {
      console.error('AI error:', data.error);
      return NextResponse.json({
        reply: `AI 报错：${data.error.message || '未知错误'}`,
        storeNames: [],
      });
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({
        reply: 'AI 没有返回内容',
        storeNames: [],
      });
    }

    // Extract all store names from __STORES__ markers
    const storeNames: string[] = [];
    const matches = content.matchAll(/__STORES__\[(.*?)\]/g);
    for (const m of matches) {
      try { storeNames.push(...JSON.parse('[' + m[1] + ']')); } catch { /* ignore */ }
    }

    // Remove all __STORES__ markers from reply
    const cleanReply = content.replace(/__STORES__\[.*?\]/g, '').trim();
    return NextResponse.json({ reply: cleanReply, storeNames });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMockReply(message: string, stores: any[]): string {
  const lower = (message || '').toLowerCase();
  if (!stores.length) return '你还没有收藏任何店铺哦，先去添加一些吧！';

  const spicy = stores.filter((s) => String(s.note || '').includes('辣') || String(s.name || '').includes('川') || String(s.name || '').includes('湘'));
  const cheap = stores.filter((s) => s.averageCost && Number(s.averageCost) < 50);
  const wishlist = stores.filter((s) => s.status === 'wishlist');

  if (lower.includes('辣') || lower.includes('川')) {
    if (spicy.length) { const p = spicy[Math.floor(Math.random() * spicy.length)]; return `推荐 ${p.name}，${p.averageCost ? '人均' + p.averageCost + '元' : '值得一试'}！`; }
    return '收藏里没有特别辣的店，要不要找新店？';
  }
  if (lower.includes('便宜') || /\d+\s*元/.test(lower)) {
    if (cheap.length) { const p = cheap[Math.floor(Math.random() * cheap.length)]; return `省钱推荐：${p.name}，人均${p.averageCost}元！`; }
    return '你收藏的店都挺有品质的～';
  }
  if (lower.includes('待吃')) {
    if (wishlist.length) { const p = wishlist[Math.floor(Math.random() * wishlist.length)]; return `你有${wishlist.length}家待吃，推荐 ${p.name}！`; }
    return '待吃清单清空啦！';
  }
  const p = stores[Math.floor(Math.random() * stores.length)];
  return `推荐 ${p.name}！${p.category || ''}，${p.averageCost ? '人均' + p.averageCost + '元' : ''}～`;
}
