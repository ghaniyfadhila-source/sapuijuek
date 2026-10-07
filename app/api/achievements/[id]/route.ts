import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { achievementSchema, type Achievement } from "@/lib/validation/achievement";

const idSchema = z.uuid("ID prestasi tidak valid");

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID prestasi tidak valid" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("achievements")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Prestasi tidak ditemukan atau gagal diubah" }, { status: 404 });
  }
  return NextResponse.json({ data: data as Achievement });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID prestasi tidak valid" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Hapus bukti foto tersimpan (best-effort, path deterministik achievements/{id}.{ext})
  const { data: row } = await supabase.from("achievements").select("bukti_url").eq("id", parsedId.data).single();
  if (row?.bukti_url) {
    const exts = ["jpg", "jpeg", "png", "webp"];
    await supabase.storage.from("public").remove(exts.map((e) => `achievements/${parsedId.data}.${e}`));
  }

  const { error } = await supabase.from("achievements").delete().eq("id", parsedId.data);
  if (error) {
    return NextResponse.json({ error: "Gagal menghapus prestasi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}