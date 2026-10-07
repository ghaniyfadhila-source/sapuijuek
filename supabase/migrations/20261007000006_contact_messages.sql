-- Contact Messages / Pesan Kontak
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 100),
  email text not null check (char_length(email) between 5 and 100 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subjek text not null check (char_length(subjek) between 2 and 150),
  pesan text not null check (char_length(pesan) between 10 and 3000),
  status text not null default 'baru' check (status in ('baru', 'dibaca', 'diarsipkan')),
  created_at timestamptz not null default now()
);

create index if not exists contact_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_status_idx on public.contact_messages (status);

-- Public INSERT only (form submit); admin read/update/delete via service_role
alter table public.contact_messages enable row level security;
drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages
  for insert with check (true);

-- Admin read all (service_role bypasses RLS anyway, but keep for completeness)
drop policy if exists "service_role all contact" on public.contact_messages;
create policy "service_role all contact" on public.contact_messages
  for all using (auth.role() = 'service_role');