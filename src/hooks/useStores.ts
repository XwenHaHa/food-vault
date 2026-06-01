'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';

export function useStores() {
  const { stores, loading, error, fetchStores, addStore, updateStore, deleteStore } =
    useAppStore();
  const userId = useAppStore((s) => s.userId);

  useEffect(() => {
    if (userId) {
      fetchStores();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { stores, loading, error, addStore, updateStore, deleteStore };
}

export function useStoreStats() {
  const { stores } = useAppStore();

  const total = stores.length;
  const visited = stores.filter((s) => s.status === 'visited').length;
  const wishlist = stores.filter((s) => s.status === 'wishlist').length;

  const categoryStats = getCategoryStats(stores);
  const cityStats = getCityStats(stores);

  return { total, visited, wishlist, categoryStats, cityStats };
}

function getCategoryStats(stores: import('@/types').Store[]) {
  const map = new Map<string, number>();
  stores.forEach((s) => map.set(s.category, (map.get(s.category) || 0) + 1));
  return Array.from(map.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: stores.length > 0 ? Math.round((count / stores.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function getCityStats(stores: import('@/types').Store[]) {
  const map = new Map<string, number>();
  stores.forEach((s) => map.set(s.city, (map.get(s.city) || 0) + 1));
  return Array.from(map.entries())
    .map(([city, count]) => ({
      city,
      count,
      percentage: stores.length > 0 ? Math.round((count / stores.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}
