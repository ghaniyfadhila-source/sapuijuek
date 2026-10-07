import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/verify";
import { getServiceClient } from "@/lib/supabase/db";
import { validatePhoto } from "@/lib/validation/project";

const idSchema = z.uuid("ID karya tidak valid");
const deleteSchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

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
    return NextResponse.json({ error: "ID karya tidak valid" }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Body harus multipart/form-data" }, { status: 400 });
  }

  const files = form.getAll("files");
  if (!files.length || !(files[0] instanceof File)) {
    return NextResponse.json({ error: "Field files tidak ditemukan" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: existing } = await supabase
    .from("projects")
    .select("images")
    .eq("id", parsedId.data)
    .single();
  if (!existing) {
    return NextResponse.json({ error: "Karya tidak ditemukan" }, { status: 404 });
  }

  const currentImages = existing.images ?? [];
  const newUrls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    const check = validatePhoto({ type: file.type, size: file.size });
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    const ext = EXT_BY_TYPE[file.type];
    const uniqueName = `${parsedId.data}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `projects/${uniqueName}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (uploadError) {
      return NextResponse.json({ error: "Upload foto gagal" }, { status: 500 });
    }
    const { data: urlData } = supabase.storage.from("public").getPublicUrl(path);
    newUrls.push(urlData.publicUrl);
  }

  const updatedImages = [...currentImages, ...newUrls];
  const { error: updateError } = await supabase
    .from("projects")
    .update({ images: updatedImages })
    .eq("id", parsedId.data);
  if (updateError) {
    return NextResponse.json({ error: "Gagal menyimpan URL foto" }, { status: 500 });
  }

  return NextResponse.json({ images: newUrls });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID karya tidak valid" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "URL gambar tidak valid" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: row } = await supabase
    .from("projects")
    .select("images")
    .eq("id", parsedId.data)
    .single();
  if (!row) {
    return NextResponse.json({ error: "Karya tidak ditemukan" }, { status: 404 });
  }

  const currentImages = row.images ?? [];
  const toDelete = parsed.data.urls;

  // Remove from array
  const updatedImages = currentImages.filter((url: string) => !toDelete.includes(url));

  // Delete from storage (best-effort)
  const paths = toDelete
    .map((url) => {
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
    .filter((p): p is string => p !== null);
  if (paths.length) await supabase.storage.from("public").remove(paths);

  const { error: updateError } = await supabase
    .from("projects")
    .update({ images: updatedImages })
    .eq("id", parsedId.data);
  if (updateError) {
    return NextResponse.json({ error: "Gagal memperbarui daftar gambar" }, { status: 500 });
  }

  return NextResponse.json({ images: updatedImages });
}