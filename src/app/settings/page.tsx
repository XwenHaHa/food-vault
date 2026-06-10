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
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">设置</h1>
            <p className="text-xs text-gray-400">个性化你的美食系统</p>
          </div>
          <Settings size={20} className="text-gray-400" />
        </div>

        <div className="bg-black text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} />
            <span className="text-sm font-medium">AI 偏好模式</span>
          </div>
          <p className="text-xs text-gray-300">当前：均衡推荐（口味 + 距离 + 评分）</p>
        </div>

        <Slider label="口味偏好权重" value={flavorWeight} onChange={setFlavorWeight} />
        <Slider label="距离优先级" value={distanceWeight} onChange={setDistanceWeight} />
        <Slider label="评分权重" value={ratingWeight} onChange={setRatingWeight} />

        <div className="space-y-2">
          {[
            { label: '启用 AI 推荐', value: aiEnabled, onChange: setAiEnabled },
            { label: '记录自动分类', value: autoClassify, onChange: setAutoClassify },
            { label: '位置自动识别', value: locationEnabled, onChange: setLocationEnabled },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3.5 flex justify-between items-center">
              <p className="text-sm">{item.label}</p>
              <Toggle enabled={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm font-medium mb-3">数据管理</p>
          <div className="space-y-2">
            {['导出我的美食数据', '清理缓存数据'].map((label) => (
              <button key={label} className="w-full bg-white p-3 rounded-xl text-sm text-left active:bg-gray-50">{label}</button>
            ))}
            <button className="w-full bg-red-50 text-red-500 p-3 rounded-xl text-sm text-left active:bg-red-100">删除所有记录</button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 pt-2">FoodVault v1.0 · Personal Food Memory System</p>
      </div>

      <BottomNav />
    </div>
  );
}
