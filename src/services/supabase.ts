import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'your_supabase_url_here') {
    return createMockClient();
  }

  client = createSupabaseClient(url, key);
  return client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockClient(): any {
  const mockBuilder = {
    select: () => mockBuilder,
    eq: () => mockBuilder,
    or: () => mockBuilder,
    order: () => mockBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    insert: () => mockBuilder,
    update: () => mockBuilder,
    delete: () => mockBuilder,
    then: (resolve: (value: { data: unknown[]; error: null }) => void) =>
      resolve({ data: [], error: null }),
  };

  return {
    from: () => mockBuilder,
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}
