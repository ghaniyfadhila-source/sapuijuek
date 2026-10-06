import { z } from "zod";

export type Member = {
  id: string;
  nama: string;
  nis: string;
  kelas_paralel: string;
  kontak: string;
  foto_url: string;
  created_at: string;
};

export const memberSchema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  nis: z
    .string()
    .trim()
    .regex(/^\d{4,20}$/, "NIS harus 4-20 digit angka"),
  kelas_paralel: z.string().trim().min(1, "Kelas paralel wajib diisi").max(30, "Kelas maksimal 30 karakter"),
  kontak: z.string().trim().max(50, "Kontak maksimal 50 karakter").optional().default(""),
});

export type MemberInput = z.infer<typeof memberSchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

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

/** Buang karakter wildcard LIKE (% _) dari istilah pencarian. */
export function sanitizeSearchTerm(q: string): string {
  return q.replace(/[%_]/g, "");
}
