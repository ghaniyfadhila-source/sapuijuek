import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/verify";
import { getAnonClient, getServiceClient } from "@/lib/supabase/db";
import {
  projectSchema,
  sanitizeSearchTerm,
  searchQuerySchema,
  type Project,
} from "@/lib/validation/project";

export async function GET(req: NextRequest) {
  const params = searchQuerySchema.safeParse({
    q: req.nextUrl.searchParams.get("q") ?? undefined,
    jenis: req.nextUrl.searchParams.get("jenis") ?? undefined,
    page: req.nextUrl.searchParams.get("page") ?? undefined,
    perPage: req.nextUrl.searchParams.get("perPage") ?? undefined,
  });
  if (!params.success) {
    return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
  }
  const { page, perPage } = params.data;
  const term = sanitizeSearchTerm(params.data.q);
  const jenis = params.data.jenis?.trim();

  const supabase = getAnonClient();
  let query = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);
  if (term) {
    query = query.or(`judul.ilike.%${term}%,deskripsi.ilike.%${term}%,jenis_karya.ilike.%${term}%`);
  }
  if (jenis) {
    query = query.eq("jenis_karya", jenis);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data karya" }, { status: 500 });
  }
  return NextResponse.json({
    data: (data ?? []) as Project[],
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
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("projects")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan karya" }, { status: 500 });
  }
  return NextResponse.json({ data: data as Project }, { status: 201 });
}