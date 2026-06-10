'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, MapPin, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/search', icon: Search, label: '搜索' },
  { href: '/chat', icon: Sparkles, label: 'AI' },
  { href: '/nearby', icon: MapPin, label: '附近' },
  { href: '/settings', icon: Settings, label: '设置' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-lg safe-bottom">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-black scale-105'
                  : 'text-gray-400 active:scale-95'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] ${isActive ? 'font-medium' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
