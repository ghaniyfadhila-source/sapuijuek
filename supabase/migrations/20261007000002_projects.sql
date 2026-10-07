-- Projects / Karya Portfolio
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 2 and 150),
  jenis_karya text not null check (char_length(jenis_karya) between 1 and 50),
  deskripsi text not null default '' check (char_length(deskripsi) <= 3000),
  tim_member_ids uuid[] not null default '{}',
  images text[] not null default '{}', -- array of public URLs
  video_url text not null default '' check (char_length(video_url) <= 500),
  demo_url text not null default '' check (char_length(demo_url) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_jenis_karya_idx on public.projects (jenis_karya);
create index if not exists projects_judul_idx on public.projects (judul);

-- Public read-only; tulis/hapus hanya lewat service_role di route handler server
alter table public.projects enable row level security;
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select using (true);