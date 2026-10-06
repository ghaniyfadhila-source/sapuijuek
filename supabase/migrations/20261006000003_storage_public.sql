-- Bucket publik untuk foto/gambar (anggota, prestasi, karya, kegiatan)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public', 'public', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Public read; upload/hapus hanya via service_role (bypass RLS, tanpa policy insert)
drop policy if exists "public read storage objects" on storage.objects;
create policy "public read storage objects" on storage.objects
  for select using (bucket_id = 'public');
