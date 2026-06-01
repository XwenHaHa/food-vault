'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';

export function useRecommendation(type: 'today' | 'delivery' | 'dinein' | 'city' = 'today') {
  const { recommendation, recommendLoading, fetchRecommendation, stores } = useAppStore();

  useEffect(() => {
    if (stores.length > 0 && !recommendation) {
      fetchRecommendation(type);
    }
  }, [stores, recommendation, fetchRecommendation, type]);

  const refresh = () => fetchRecommendation(type);

  return { recommendation, loading: recommendLoading, refresh };
}
