// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Type definitions untuk database
export type Order = {
  id: string;
  user_id: string | null;
  product_name: string;
  status: string;
  current_progress: number;
  created_at: string;
  category?: string;
  price?: number;
  quantity?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  notes?: string;
};

export type OrderProgress = {
  id: string;
  order_id: string;
  title: string;
  description: string;
  progress: number;
  images: string[];
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  created_at: string;
};