import { z } from "zod";

export type Project = {
  id: string;
  judul: string;
  jenis_karya: string;
  deskripsi: string;
  tim_member_ids: string[];
  images: string[];
  video_url: string;
  demo_url: string;
  created_at: string;
};

export const projectSchema = z.object({
  judul: z.string().trim().min(2, "Judul minimal 2 karakter").max(150, "Judul maksimal 150 karakter"),
  jenis_karya: z.string().trim().min(1, "Jenis karya wajib diisi").max(50, "Jenis karya maksimal 50 karakter"),
  deskripsi: z.string().trim().max(3000, "Deskripsi maksimal 3000 karakter").optional().default(""),
  tim_member_ids: z.array(z.uuid("ID anggota tidak valid")).optional().default([]),
  images: z.array(z.string().url("URL gambar tidak valid")).optional().default([]),
  video_url: z.string().trim().max(500, "URL video maksimal 500 karakter").optional().default(""),
  demo_url: z.string().trim().max(500, "URL demo maksimal 500 karakter").optional().default(""),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  jenis: z.string().trim().max(50).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validatePhoto(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; error: string } {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, error: "Format foto harus JPG, PNG, atau WebP" };
  }
  if (file.size <= 0) return { ok: false, error: "File foto kosong" };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Ukuran foto maksimal 5MB" };
  return { ok: true };
}

export function sanitizeSearchTerm(q: string): string {
  return q.replace(/[%_]/g, "");
}