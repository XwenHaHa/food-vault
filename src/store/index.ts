import { create } from 'zustand';
import type { Store, StoreFilters, AIRecommendation } from '@/types';
import * as storeService from '@/services/store-service';
import { getRecommendation } from '@/services/ai-service';

interface AppState {
  // User
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Stores
  stores: Store[];
  loading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
  addStore: (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;

  // Search
  filters: StoreFilters;
  searchResults: Store[];
  setFilters: (filters: StoreFilters) => void;
  search: () => Promise<void>;

  // Recommendation
  recommendation: AIRecommendation | null;
  recommendLoading: boolean;
  fetchRecommendation: (type: 'today' | 'delivery' | 'dinein' | 'city', city?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  userId: null,
  setUserId: (id) => set({ userId: id }),

  // Stores
  stores: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    const { userId } = get();
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const stores = await storeService.getStores(userId);
      set({ stores, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addStore: async (storeData) => {
    set({ loading: true, error: null });
    try {
      const newStore = await storeService.addStore(storeData);
      set((state) => ({ stores: [newStore, ...state.stores], loading: false }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  updateStore: async (id, updates) => {
    try {
      const updated = await storeService.updateStore(id, updates);
      set((state) => ({
        stores: state.stores.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  deleteStore: async (id) => {
    try {
      await storeService.deleteStore(id);
      set((state) => ({ stores: state.stores.filter((s) => s.id !== id) }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  // Search
  filters: { status: 'all' },
  searchResults: [],

  setFilters: (filters) => set({ filters }),

  search: async () => {
    const { userId, filters } = get();
    if (!userId) return;
    set({ loading: true });
    try {
      const results = await storeService.searchStores(userId, filters);
      set({ searchResults: results, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  // Recommendation
  recommendation: null,
  recommendLoading: false,

  fetchRecommendation: async (type, city) => {
    const { stores } = get();
    set({ recommendLoading: true });
    try {
      const rec = await getRecommendation(stores, type, city);
      set({ recommendation: rec, recommendLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, recommendLoading: false });
    }
  },
}));
