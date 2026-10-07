import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/verify";
import { getAnonClient, getServiceClient } from "@/lib/supabase/db";
import {
  activitySchema,
  sanitizeSearchTerm,
  searchQuerySchema,
  type Activity,
} from "@/lib/validation/activity";

export async function GET(req: NextRequest) {
  const params = searchQuerySchema.safeParse({
    q: req.nextUrl.searchParams.get("q") ?? undefined,
    page: req.nextUrl.searchParams.get("page") ?? undefined,
    perPage: req.nextUrl.searchParams.get("perPage") ?? undefined,
  });
  if (!params.success) {
    return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
  }
  const { page, perPage } = params.data;
  const term = sanitizeSearchTerm(params.data.q);

  const supabase = getAnonClient();
  let query = supabase
    .from("activities")
    .select("*", { count: "exact" })
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);
  if (term) {
    query = query.or(`nama_acara.ilike.%${term}%,deskripsi.ilike.%${term}%`);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data kegiatan" }, { status: 500 });
  }
  return NextResponse.json({
    data: (data ?? []) as Activity[],
    count: count ?? 0,
    page,
    perPage,
  });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("activities")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan kegiatan" }, { status: 500 });
  }
  return NextResponse.json({ data: data as Activity }, { status: 201 });
}