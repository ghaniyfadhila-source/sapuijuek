-- Tambahan settings untuk halaman lain (update dari ticket #8)
insert into public.site_settings (key, value) values
  ('prestasi_tagline', 'Prestasi Gemilang Kelas PPLG'),
  ('portfolio_tagline', 'Karya-Karya Unggulan Siswa PPLG'),
  ('kegiatan_tagline', 'Momen Bersama Kelas PPLG'),
  ('struktur_tagline', 'Pengurus Kelas PPLG'),
  ('visi', ''),
  ('misi', ''),
  ('kontak_email', ''),
  ('kontak_instagram', ''),
  ('kontak_whatsapp', ''),
  ('kontak_tiktok', ''),
  ('kontak_youtube', '')
on conflict (key) do nothing;