import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { stores, type, currentCity, apiUrl, apiKey, model } =
      await request.json();

    // Use request params first, fall back to env vars
    const endpoint =
      apiUrl || process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const key = apiKey || process.env.OPENAI_API_KEY;
    const modelName = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!key) {
      // Return random mock recommendation
      const randomStore = stores?.[Math.floor(Math.random() * (stores?.length || 1))];
      return NextResponse.json({
        storeId: randomStore?.id,
        reason: `基于你的收藏偏好，推荐你试试 ${randomStore?.name || '暂无'}`,
      });
    }

    const storeList = (stores || [])
      .map(
        (s: Record<string, unknown>) =>
          `- [ID:${s.id}] ${s.name} (${s.category}, ${s.city}, 评分:${s.rating || '无'}, 状态:${s.status})`
      )
      .join('\n');

    const typeDesc: Record<string, string> = {
      today: '今天吃什么',
      delivery: '外卖推荐',
      dinein: '到店推荐',
      city: `城市推荐${currentCity ? `(${currentCity})` : ''}`,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content:
              '你是一个美食推荐助手。根据用户的收藏数据推荐餐厅。必须从列表中选一家，返回其 ID。每次推荐不同的店。回复 JSON 格式：{"storeId": "对应店铺的ID", "reason": "推荐理由"}',
          },
          {
            role: 'user',
            content: `用户收藏的店铺：\n${storeList}\n\n请为用户推荐一家店铺用于"${typeDesc[type] || '推荐'}"场景。${currentCity ? `用户当前在${currentCity}。` : ''}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const result = JSON.parse(content || '{}');

    // Verify the returned storeId exists in the stores list
    const matchedStore = (stores || []).find(
      (s: Record<string, unknown>) => s.id === result.storeId
    );

    if (matchedStore) {
      return NextResponse.json({
        storeId: result.storeId,
        reason: result.reason,
      });
    }

    // Fallback: pick a random store
    const randomStore = stores?.[Math.floor(Math.random() * (stores?.length || 1))];
    return NextResponse.json({
      storeId: randomStore?.id,
      reason: result.reason || `推荐你试试 ${randomStore?.name}`,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
