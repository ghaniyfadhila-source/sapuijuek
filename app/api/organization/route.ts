import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/verify";
import { getAnonClient, getServiceClient } from "@/lib/supabase/db";
import {
  organizationSchema,
  searchQuerySchema,
  type Organization,
} from "@/lib/validation/organization";

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

  const supabase = getAnonClient();
  const query = supabase
    .from("organization")
    .select("*, members!inner(nama, foto_url, kelas_paralel)", { count: "exact" })
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: true })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data struktur organisasi" }, { status: 500 });
  }

  // Flatten member data
  type OrgRow = {
    id: string;
    posisi: string;
    urutan: number;
    member_id: string;
    created_at: string;
    members?: { nama: string; foto_url: string; kelas_paralel: string } | null;
  };
  const flattened = (data ?? []).map((row: OrgRow) => ({
    ...row,
    nama: row.members?.nama,
    foto_url: row.members?.foto_url,
    kelas_paralel: row.members?.kelas_paralel,
  })) as Organization[];

  return NextResponse.json({
    data: flattened,
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
  const parsed = organizationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("organization")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Posisi sudah digunakan" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menyimpan struktur organisasi" }, { status: 500 });
  }
  return NextResponse.json({ data: data as Organization }, { status: 201 });
}