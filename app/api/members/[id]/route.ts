import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { memberSchema, type Member } from "@/lib/validation/member";

const idSchema = z.uuid("ID anggota tidak valid");

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID anggota tidak valid" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = memberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("members")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Anggota tidak ditemukan atau gagal diubah" }, { status: 404 });
  }
  return NextResponse.json({ data: data as Member });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID anggota tidak valid" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Hapus foto tersimpan (best-effort, path deterministik members/{id}.{ext})
  const { data: row } = await supabase.from("members").select("foto_url").eq("id", parsedId.data).single();
  if (row?.foto_url) {
    const exts = ["jpg", "jpeg", "png", "webp"];
    await supabase.storage.from("public").remove(exts.map((e) => `members/${parsedId.data}.${e}`));
  }

  const { error } = await supabase.from("members").delete().eq("id", parsedId.data);
  if (error) {
    return NextResponse.json({ error: "Gagal menghapus anggota" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
