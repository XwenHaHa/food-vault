'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MapPin } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { RatingBadge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/bottom-nav';
import type { Store } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  stores?: Store[];
}

const QUICK_PROMPTS = [
  '不知道吃啥，帮我选',
  '想吃辣的',
  '50 元以内吃啥好',
  '推荐个适合聚餐的',
  '有没有没去过的待吃店',
  '想吃点清淡的',
];

export default function ChatPage() {
  const { stores } = useStores();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是你的美食助手 🍽️ 告诉我你想吃什么，或者让我帮你推荐～',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all cities
  const allCities = [...new Set(stores.map((s) => s.city).filter(Boolean))];

  // Auto-detect city
  useEffect(() => {
    if (allCities.length > 0) {
      setCurrentCity(allCities[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Filter stores by current city
      const cityStores = currentCity
        ? stores.filter((s) => s.city === currentCity)
        : stores;

      // Build conversation history for context
      const history = messages
        .filter((m) => m.role !== 'assistant' || m.content !== messages[0]?.content)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          stores: cityStores,
          currentCity,
          history,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `抱歉，出了点问题：${data.error}` },
        ]);
      } else {
        // Try to find recommended stores from the response
        const recommendedStores: Store[] = [];
        if (data.storeNames && Array.isArray(data.storeNames)) {
          for (const name of data.storeNames) {
            const found = cityStores.find(
              (s) => s.name.includes(name) || name.includes(s.name)
            );
            if (found) recommendedStores.push(found);
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            stores: recommendedStores.length > 0 ? recommendedStores : undefined,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '网络出了点问题，请稍后再试' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold">美食助手</h1>
          <p className="text-xs text-gray-400">告诉我你想吃什么</p>
        </div>
        <div className="flex items-center gap-2">
          {allCities.length > 1 && (
            <select
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              className="text-[10px] bg-gray-50 rounded-lg px-2 py-1 outline-none"
            >
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
          <Sparkles size={20} className="text-gray-600" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-black text-white rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%]">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={12} className="text-gray-500" />
                </div>
                <div className="max-w-[85%]">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {/* Recommended store cards */}
                  {msg.stores && msg.stores.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.stores.map((store) => (
                        <div
                          key={store.id}
                          className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{store.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {store.category} · {store.averageCost ? `人均${store.averageCost}元` : ''}
                              {store.note ? ` · ${store.note.slice(0, 15)}` : ''}
                            </p>
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
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <Sparkles size={12} className="text-gray-500" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
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
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="shrink-0 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm outline-none"
          placeholder="说说你想吃什么..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="mt-3">
        <BottomNav />
      </div>
    </>
  );
}
