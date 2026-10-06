import { createClient } from "@supabase/supabase-js";

/**
 * Hanya untuk route handler server — memakai service_role key.
 * Jangan pernah import file ini dari komponen client.
 */
export async function ensureAdminExists(
  email: string,
  password: string,
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum di-set");
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: list, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  const exists = list?.users?.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (exists) return;

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  // "already registered" dianggap sukses (race/seed ganda)
  if (createError && !/already/i.test(createError.message)) throw createError;
}
