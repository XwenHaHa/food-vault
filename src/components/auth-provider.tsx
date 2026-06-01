'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, onAuthStateChange } from '@/services/auth-service';
import { useAppStore } from '@/store';

const PUBLIC_PATHS = ['/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUserId = useAppStore((s) => s.setUserId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      } else if (!PUBLIC_PATHS.includes(pathname)) {
        router.push('/login');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (user) {
        setUserId((user as { id: string }).id);
      } else {
        setUserId(null);
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.push('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, setUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
