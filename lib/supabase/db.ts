import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anonClient: SupabaseClient | null = null;

/** Client public (anon key) — untuk read publik yang diizinkan RLS. */
export function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / ANON_KEY belum di-set");
    anonClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonClient;
}

let serviceClient: SupabaseClient | null = null;

/**
 * Client service_role — HANYA untuk route handler server setelah verifikasi
 * session admin. Jangan import dari komponen client.
 */
export function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SERVICE_ROLE_KEY belum di-set");
    serviceClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}
