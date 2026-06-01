export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  category: string;
  city: string;
  address?: string;
  rating?: number;
  averageCost?: number;
  note?: string;
  tags?: string[];
  source: 'delivery' | 'dinein' | 'travel';
  status: 'visited' | 'wishlist';
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'today' | 'delivery' | 'dinein' | 'city';
  storeId: string;
  reason: string;
  createdAt: string;
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface CityStat {
  city: string;
  count: number;
  percentage: number;
}

export interface StoreFilters {
  status?: 'visited' | 'wishlist' | 'all';
  category?: string;
  city?: string;
  search?: string;
}

export interface AIRecommendation {
  store: Store;
  reason: string;
  confidence: number;
}

export type StoreSource = 'delivery' | 'dinein' | 'travel';
export type StoreStatus = 'visited' | 'wishlist';
