import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { validatePhoto } from "@/lib/validation/member";

const idSchema = z.uuid("ID anggota tidak valid");

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID anggota tidak valid" }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Body harus multipart/form-data" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Field file tidak ditemukan" }, { status: 400 });
  }

  const check = validatePhoto({ type: file.type, size: file.size });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: existing } = await supabase
    .from("members")
    .select("id")
    .eq("id", parsedId.data)
    .single();
  if (!existing) {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }

  // Path deterministik → foto lama otomatis tertimpa, tanpa file yatim
  const ext = EXT_BY_TYPE[file.type];
  const path = `members/${parsedId.data}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("public")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (uploadError) {
    return NextResponse.json({ error: "Upload foto gagal" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("public").getPublicUrl(path);
  const fotoUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from("members")
    .update({ foto_url: fotoUrl })
    .eq("id", parsedId.data);
  if (updateError) {
    return NextResponse.json({ error: "Gagal menyimpan URL foto" }, { status: 500 });
  }

  // Bersihkan sisa foto format lain (best-effort)
  const leftovers = Object.values(EXT_BY_TYPE)
    .filter((e) => e !== ext)
    .map((e) => `members/${parsedId.data}.${e}`);
  await supabase.storage.from("public").remove(leftovers);

  return NextResponse.json({ foto_url: fotoUrl });
}
