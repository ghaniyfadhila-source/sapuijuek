import { z } from "zod";

export const siteSettingsKeys = [
  // Home / general
  "tagline",
  "deskripsi_kelas",
  "guru_pembimbing",
  "tahun_berdiri",
  "visi",
  "misi",
  // Page-specific taglines
  "prestasi_tagline",
  "portfolio_tagline",
  "kegiatan_tagline",
  "struktur_tagline",
  // Contact
  "kontak_email",
  "kontak_instagram",
  "kontak_whatsapp",
  "kontak_tiktok",
  "kontak_youtube",
] as const;

export type SiteSettingsKey = (typeof siteSettingsKeys)[number];

export const siteSettingSchema = z.object({
  key: z.enum(siteSettingsKeys),
  value: z.string().max(2000, "Nilai maksimal 2000 karakter").optional().default(""),
});

export type SiteSettingInput = z.infer<typeof siteSettingSchema>;

export type SiteSettings = Record<SiteSettingsKey, string>;

export const settingsSchema = z.object({
  tagline: z.string().max(150).optional().default(""),
  deskripsi_kelas: z.string().max(2000).optional().default(""),
  guru_pembimbing: z.string().max(100).optional().default(""),
  tahun_berdiri: z.string().max(10).optional().default(""),
  visi: z.string().max(2000).optional().default(""),
  misi: z.string().max(2000).optional().default(""),
  prestasi_tagline: z.string().max(150).optional().default(""),
  portfolio_tagline: z.string().max(150).optional().default(""),
  kegiatan_tagline: z.string().max(150).optional().default(""),
  struktur_tagline: z.string().max(150).optional().default(""),
  kontak_email: z.string().email("Email tidak valid").max(100).optional().default(""),
  kontak_instagram: z.string().max(100).optional().default(""),
  kontak_whatsapp: z.string().max(50).optional().default(""),
  kontak_tiktok: z.string().max(100).optional().default(""),
  kontak_youtube: z.string().max(100).optional().default(""),
});

export type SettingsInput = z.infer<typeof settingsSchema>;