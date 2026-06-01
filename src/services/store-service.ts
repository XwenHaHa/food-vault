import { createClient } from './supabase';
import type { Store, StoreFilters } from '@/types';

function getSupabase() {
  return createClient();
}

export async function getStores(userId: string): Promise<Store[]> {
  const { data, error } = await getSupabase()
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapFromDB);
}

export async function getStoreById(id: string): Promise<Store | null> {
  const { data, error } = await getSupabase()
    .from('stores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? mapFromDB(data) : null;
}

export async function addStore(
  store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Store> {
  // Ensure profile exists (fallback if trigger didn't fire)
  await ensureProfile(store.userId);

  const { data, error } = await getSupabase()
    .from('stores')
    .insert(mapToDB(store))
    .select()
    .single();

  if (error) throw error;
  return mapFromDB(data);
}

async function ensureProfile(userId: string): Promise<void> {
  const { data } = await getSupabase()
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!data) {
    await getSupabase()
      .from('profiles')
      .insert({ id: userId, nickname: '用户' });
  }
}

export async function updateStore(
  id: string,
  updates: Partial<Store>
): Promise<Store> {
  const { data, error } = await getSupabase()
    .from('stores')
    .update({ ...mapToDB(updates), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapFromDB(data);
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await getSupabase().from('stores').delete().eq('id', id);
  if (error) throw error;
}

export async function searchStores(
  userId: string,
  filters: StoreFilters
): Promise<Store[]> {
  let query = getSupabase()
    .from('stores')
    .select('*')
    .eq('user_id', userId);

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,category.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query.order('created_at', {
    ascending: false,
  });
  if (error) throw error;
  return (data || []).map(mapFromDB);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFromDB(row: any): Store {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    city: row.city,
    address: row.address,
    rating: row.rating,
    averageCost: row.average_cost,
    note: row.note,
    tags: row.tags,
    source: row.source,
    status: row.status,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToDB(store: any): any {
  const mapped: Record<string, unknown> = {};
  if (store.userId !== undefined) mapped.user_id = store.userId;
  if (store.name !== undefined) mapped.name = store.name;
  if (store.category !== undefined) mapped.category = store.category;
  if (store.city !== undefined) mapped.city = store.city;
  if (store.address !== undefined) mapped.address = store.address;
  if (store.rating !== undefined) mapped.rating = store.rating;
  if (store.averageCost !== undefined) mapped.average_cost = store.averageCost;
  if (store.note !== undefined) mapped.note = store.note;
  if (store.tags !== undefined) mapped.tags = store.tags;
  if (store.source !== undefined) mapped.source = store.source;
  if (store.status !== undefined) mapped.status = store.status;
  if (store.latitude !== undefined) mapped.latitude = store.latitude;
  if (store.longitude !== undefined) mapped.longitude = store.longitude;
  return mapped;
}
