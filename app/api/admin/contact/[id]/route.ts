import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { contactUpdateSchema } from "@/lib/validation/contact";

const idSchema = z.uuid("ID pesan tidak valid");

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID pesan tidak valid" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = contactUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const { data, error } = await getServiceClient()
    .from("contact_messages")
    .update({ status: parsed.data.status })
    .eq("id", parsedId.data)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "Pesan tidak ditemukan atau gagal diubah" }, { status: 404 });
  }
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID pesan tidak valid" }, { status: 400 });
  }

  const { error } = await getServiceClient().from("contact_messages").delete().eq("id", parsedId.data);
  if (error) {
    return NextResponse.json({ error: "Gagal menghapus pesan" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}