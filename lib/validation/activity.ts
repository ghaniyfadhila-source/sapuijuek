import { z } from "zod";

export type Activity = {
  id: string;
  nama_acara: string;
  deskripsi: string;
  tanggal: string;
  photos: string[];
  created_at: string;
};

export const activitySchema = z.object({
  nama_acara: z.string().trim().min(2, "Nama acara minimal 2 karakter").max(150, "Nama acara maksimal 150 karakter"),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid (YYYY-MM-DD)"),
  deskripsi: z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter").optional().default(""),
  photos: z.array(z.string().url("URL foto tidak valid")).optional().default([]),
});

export type ActivityInput = z.infer<typeof activitySchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
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