'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Sparkles, X } from 'lucide-react';
import { useAppStore } from '@/store';
import { CATEGORIES, RATING_OPTIONS } from '@/constants';

export default function AddStorePage() {
  const router = useRouter();
  const { addStore, userId } = useAppStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [averageCost, setAverageCost] = useState('');
  const [note, setNote] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleQuickParse = () => {
    // Simple natural language parsing: "海底捞 火锅 上海 4.5"
    const parts = quickInput.trim().split(/\s+/);
    if (parts.length >= 1) setName(parts[0]);
    if (parts.length >= 2) setCategory(parts[1]);
    if (parts.length >= 3) setCity(parts[2]);
    if (parts.length >= 4) {
      const r = parseFloat(parts[3]);
      if (!isNaN(r)) setRating(r);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !category || !city.trim()) return;
    if (!userId) {
      setError('未登录，请先登录');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await addStore({
        userId,
        name: name.trim(),
        category,
        city: city.trim(),
        rating,
        averageCost: averageCost ? parseFloat(averageCost) : undefined,
        note: note.trim() || undefined,
        source: 'dinein',
        status: 'wishlist',
      });
      router.push('/');
    } catch (err) {
      setError((err as Error).message || '保存失败');
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed Header + Quick Input */}
      <div className="shrink-0 px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">新增店铺</h1>
            <p className="text-xs text-gray-400">10 秒快速记录</p>
          </div>
          <button onClick={() => router.back()}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} />
            <span className="text-sm font-medium">极速输入</span>
          </div>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder-gray-400"
            placeholder="例如：海底捞 火锅 上海 4.5"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onBlur={handleQuickParse}
          />
          <p className="text-xs text-gray-400 mt-2">支持自然语言快速解析</p>
        </div>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        {/* Structured Form */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500">店名</label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm outline-none"
              placeholder="输入店铺名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">分类</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {CATEGORIES.slice(0, 9).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs transition-colors ${
                    category === cat ? 'bg-black text-white' : 'bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">城市</label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm outline-none"
              placeholder="例如 上海"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">评分</label>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
              {RATING_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs transition-colors ${
                    rating === r ? 'bg-black text-white' : 'bg-gray-100'
                  }`}
                >
                  ⭐ {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">人均消费</label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm outline-none"
              placeholder="例如 80"
              type="number"
              value={averageCost}
              onChange={(e) => setAverageCost(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">备注</label>
            <textarea
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl text-sm outline-none resize-none"
              placeholder="喜欢的菜、体验、环境、服务..."
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* AI Assist Hint */}
        {category === '火锅' && (
          <div className="mt-3 bg-gray-50 rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} />
              <span className="text-xs font-medium">AI 补全建议</span>
            </div>
            <p className="text-xs text-gray-500">
              检测到：火锅店，是否自动补充标签「聚餐 / 热门」？
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mt-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSave}
          disabled={!name.trim() || !category || !city.trim() || saving}
          className="mt-4 bg-black text-white py-3 rounded-2xl text-sm w-full disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存店铺'}
        </button>
      </div>
    </div>
  );
}
