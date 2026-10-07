import { z } from "zod";

export type Organization = {
  id: string;
  posisi: string;
  urutan: number;
  member_id: string;
  created_at: string;
  // joined fields
  nama?: string;
  foto_url?: string;
  kelas_paralel?: string;
};

export const organizationSchema = z.object({
  posisi: z.string().trim().min(1, "Posisi wajib diisi").max(80, "Posisi maksimal 80 karakter"),
  urutan: z.coerce.number().int().min(0, "Urutan minimal 0").optional().default(0),
  member_id: z.uuid("ID anggota tidak valid"),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export function sanitizeSearchTerm(q: string): string {
  return q.replace(/[%_]/g, "");
}