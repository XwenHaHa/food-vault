'use client';

import { useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function SettingsPage() {
  const [flavorWeight, setFlavorWeight] = useState(70);
  const [distanceWeight, setDistanceWeight] = useState(40);
  const [ratingWeight, setRatingWeight] = useState(85);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoClassify, setAutoClassify] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold">设置</h1>
          <p className="text-xs text-gray-400">个性化你的美食系统</p>
        </div>
        <Settings size={24} className="text-gray-600" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {/* AI Preference */}
        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} />
            <span className="text-sm font-medium">AI 偏好模式</span>
          </div>
          <p className="text-xs text-gray-300">
            当前：均衡推荐（口味 + 距离 + 评分）
          </p>
        </div>

        {/* Preference Controls */}
        <Slider label="口味偏好权重" value={flavorWeight} onChange={setFlavorWeight} />
        <Slider label="距离优先级" value={distanceWeight} onChange={setDistanceWeight} />
        <Slider label="评分权重" value={ratingWeight} onChange={setRatingWeight} />

        {/* Toggles */}
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <p className="text-xs">启用 AI 推荐</p>
            <Toggle enabled={aiEnabled} onChange={setAiEnabled} />
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <p className="text-xs">记录自动分类</p>
            <Toggle enabled={autoClassify} onChange={setAutoClassify} />
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <p className="text-xs">位置自动识别</p>
            <Toggle enabled={locationEnabled} onChange={setLocationEnabled} />
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-gray-50 rounded-2xl p-3">
          <p className="text-xs font-medium mb-2">数据管理</p>
          <div className="space-y-2">
            <button className="w-full bg-white p-2 rounded-xl text-xs text-left">
              导出我的美食数据
            </button>
            <button className="w-full bg-white p-2 rounded-xl text-xs text-left">
              清理缓存数据
            </button>
            <button className="w-full bg-red-50 text-red-500 p-2 rounded-xl text-xs text-left">
              删除所有记录
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 pt-2">
        FoodVault v1.0 · Personal Food Memory System
      </p>

      <BottomNav />
    </>
  );
}
