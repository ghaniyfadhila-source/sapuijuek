-- Organization / Struktur Organisasi Kelas
create table if not exists public.organization (
  id uuid primary key default gen_random_uuid(),
  posisi text not null check (char_length(posisi) between 1 and 80),
  urutan integer not null default 0,
  member_id uuid not null references public.members(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists org_posisi_unique on public.organization (posisi);
create index if not exists org_urutan_idx on public.organization (urutan);
create index if not exists org_member_id_idx on public.organization (member_id);

-- Public read-only; tulis/hapus hanya lewat service_role
alter table public.organization enable row level security;
drop policy if exists "public read organization" on public.organization;
create policy "public read organization" on public.organization
  for select using (true);