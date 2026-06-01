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
      // Return mock recommendation
      const store = stores?.[0];
      return NextResponse.json({
        storeId: store?.id,
        reason: `基于你的收藏偏好，推荐 ${store?.name || '暂无'}`,
      });
    }

    const storeList = (stores || [])
      .map(
        (s: Record<string, unknown>) =>
          `- ${s.name} (${s.category}, ${s.city}, 评分:${s.rating || '无'}, 状态:${s.status})`
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
              '你是一个美食推荐助手。根据用户的收藏数据推荐餐厅。回复 JSON 格式：{"storeId": "xxx", "reason": "推荐理由"}',
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

    return NextResponse.json({
      storeId: result.storeId,
      reason: result.reason,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
