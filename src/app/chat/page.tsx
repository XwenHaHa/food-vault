'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { RatingBadge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/bottom-nav';
import type { Store } from '@/types';

interface Message { role: 'user' | 'assistant'; content: string; stores?: Store[]; }

const QUICK_PROMPTS = ['不知道吃啥，帮我选', '想吃辣的', '50 元以内吃啥好', '推荐个适合聚餐的', '有没有没去过的待吃店', '想吃点清淡的'];

export default function ChatPage() {
  const { stores } = useStores();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的美食助手 🍽️ 告诉我你想吃什么，或者让我帮你推荐～' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allCities = [...new Set(stores.map((s) => s.city).filter(Boolean))];
  useEffect(() => { if (allCities.length > 0 && !currentCity) setCurrentCity(allCities[0]); }, []); // eslint-disable-line
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text.trim() }]);
    setInput('');
    setLoading(true);
    try {
      const cityStores = currentCity ? stores.filter((s) => s.city === currentCity) : stores;
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text.trim(), stores: cityStores, currentCity, history }) });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `抱歉：${data.error}` }]);
      } else {
        const rec: Store[] = [];
        if (data.storeNames) for (const name of data.storeNames) { const f = cityStores.find((s) => s.name.includes(name) || name.includes(s.name)); if (f) rec.push(f); }
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, stores: rec.length > 0 ? rec : undefined }]);
      }
    } catch { setMessages((prev) => [...prev, { role: 'assistant', content: '网络出了点问题' }]); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">美食助手</h1>
          <p className="text-xs text-gray-400">告诉我你想吃什么</p>
        </div>
        <div className="flex items-center gap-2">
          {allCities.length > 1 && (
            <select value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} className="text-xs bg-gray-50 rounded-lg px-2 py-1 outline-none">
              {allCities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Sparkles size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-black text-white rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={13} className="text-gray-500" />
                </div>
                <div className="max-w-[85%]">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-2.5">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.stores && msg.stores.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.stores.map((store) => (
                        <div key={store.id} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{store.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{store.category} · {store.averageCost ? `人均${store.averageCost}元` : ''}</p>
                          </div>
                          {store.rating && <RatingBadge rating={store.rating} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-gray-500" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="shrink-0 px-5 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map((p) => (
            <button key={p} onClick={() => sendMessage(p)} className="shrink-0 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600 active:bg-gray-100">{p}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-5 pb-2 flex gap-2 items-center">
        <input
          className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm outline-none"
          placeholder="说说你想吃什么..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          disabled={loading}
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-30 active:scale-90 transition-transform">
          <Send size={16} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
