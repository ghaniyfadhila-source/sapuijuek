import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { activitySchema, type Activity } from "@/lib/validation/activity";

const idSchema = z.uuid("ID kegiatan tidak valid");

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID kegiatan tidak valid" }, { status: 400 });
  }

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
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan atau gagal diubah" }, { status: 404 });
  }
  return NextResponse.json({ data: data as Activity });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID kegiatan tidak valid" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Hapus foto-foto tersimpan (best-effort)
  const { data: row } = await supabase.from("activities").select("photos").eq("id", parsedId.data).single();
  if (row?.photos?.length) {
    const paths = row.photos
      .map((url: string) => {
        try {
          const u = new URL(url);
          const parts = u.pathname.split("/");
          const idx = parts.indexOf("public");
          if (idx >= 0 && idx + 1 < parts.length) {
            return parts.slice(idx + 1).join("/");
          }
        } catch {}
        return null;
      })
      .filter((p: string | null): p is string => p !== null);
    if (paths.length) await supabase.storage.from("public").remove(paths);
  }

  const { error } = await supabase.from("activities").delete().eq("id", parsedId.data);
  if (error) {
    return NextResponse.json({ error: "Gagal menghapus kegiatan" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}