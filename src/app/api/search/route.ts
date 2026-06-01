import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase';

const supabase = createClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    let query = supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (city) {
      query = query.eq('city', city);
    }
    if (q) {
      query = query.or(
        `name.ilike.%${q}%,category.ilike.%${q}%,city.ilike.%${q}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
