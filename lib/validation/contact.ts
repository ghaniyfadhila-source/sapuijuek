import { z } from "zod";

export type ContactMessage = {
  id: string;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  status: "baru" | "dibaca" | "diarsipkan";
  created_at: string;
};

export const contactSchema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(100, "Email maksimal 100 karakter"),
  subjek: z.string().trim().min(2, "Subjek minimal 2 karakter").max(150, "Subjek maksimal 150 karakter"),
  pesan: z.string().trim().min(10, "Pesan minimal 10 karakter").max(3000, "Pesan maksimal 3000 karakter"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactSearchSchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  status: z.enum(["baru", "dibaca", "diarsipkan"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type ContactSearchQuery = z.infer<typeof contactSearchSchema>;

export const contactUpdateSchema = z.object({
  status: z.enum(["baru", "dibaca", "diarsipkan"]),
});

export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;

export function sanitizeSearchTerm(q: string): string {
  return q.replace(/[%_]/g, "");
}