import { createClient } from './supabase';

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function signUpWithEmail(email: string, password: string, nickname?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname: nickname || email.split('@')[0] },
    },
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export function onAuthStateChange(callback: (user: unknown) => void) {
  const supabase = createClient();
  return supabase.auth.onAuthStateChange((_event: string, session: { user: unknown } | null) => {
    callback(session?.user ?? null);
  });
}
