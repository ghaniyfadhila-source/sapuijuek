import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { contactSearchSchema, sanitizeSearchTerm } from "@/lib/validation/contact";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = contactSearchSchema.safeParse({
    q: req.nextUrl.searchParams.get("q") ?? undefined,
    status: req.nextUrl.searchParams.get("status") ?? undefined,
    page: req.nextUrl.searchParams.get("page") ?? undefined,
    perPage: req.nextUrl.searchParams.get("perPage") ?? undefined,
  });
  if (!params.success) {
    return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
  }
  const { page, perPage } = params.data;
  const term = sanitizeSearchTerm(params.data.q);
  const status = params.data.status;

  const supabase = getServiceClient();
  let query = supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (term) {
    query = query.or(`nama.ilike.%${term}%,email.ilike.%${term}%,subjek.ilike.%${term}%,pesan.ilike.%${term}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil pesan kontak" }, { status: 500 });
  }
  return NextResponse.json({
    data: data ?? [],
    count: count ?? 0,
    page,
    perPage,
  });
}