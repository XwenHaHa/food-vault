'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MapPin, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/search', icon: Search, label: '搜索' },
  { href: '/nearby', icon: MapPin, label: '附近' },
  { href: '/settings', icon: Settings, label: '设置' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center mt-4 pt-3 border-t">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? 'text-black' : 'text-gray-400'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
