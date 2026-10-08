# Panduan Website Sapu Ijuek

Panduan lengkap website portofolio kelas **PPLG (Pengembangan Perangkat Lunak dan Gim) SMKN 9 Semarang** — cara menjalankan, mengelola konten, API, keamanan, dan deploy.

- Produksi: <https://sapuijuek.vercel.app>
- Repo: <https://github.com/ghaniyfadhila-source/sapuijuek>
- PRD: [`PRD.md`](PRD.md)

---

## Daftar Isi

1. [Ringkasan](#1-ringkasan)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Menjalankan Lokal](#4-menjalankan-lokal)
5. [Panduan Panel Admin](#5-panduan-panel-admin)
6. [Pengaturan Situs](#6-pengaturan-situs)
7. [Halaman Publik](#7-halaman-publik)
8. [Referensi API](#8-referensi-api)
9. [Validasi & Aturan Input](#9-validasi--aturan-input)
10. [Autentikasi & Keamanan](#10-autentikasi--keamanan)
11. [Database & Storage](#11-database--storage)
12. [Desain & UI](#12-desain--ui)
13. [Testing & Lint](#13-testing--lint)
14. [Deploy ke Vercel](#14-deploy-ke-vercel)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Ringkasan

Website menampilkan identitas kelas, profil anggota, prestasi, portofolio karya, dokumentasi kegiatan, struktur organisasi, dan form kontak. Semua konten dikelola lewat **panel admin** tanpa seed data — data diisi manual.

| Aspek | Ketentuan |
|---|---|
| Bahasa | Indonesia (konten & routing) |
| Routing | `/profil`, `/prestasi`, `/portfolio`, `/kegiatan`, `/struktur-organisasi`, `/kontak`, `/admin` |
| Admin | Single admin, seed otomatis dari env |
| Data | Tanpa ORM — langsung `supabase-js` |
| Validasi | `zod` di route handler + unit test Vitest |

**Tidak ada di v1** (keputusan sadar, jangan ditambahkan lagi tanpa diskusi): email notifikasi form kontak, kategori prestasi, rating/like, embed peta, drag-drop upload, multi-admin, rich text editor, activity log, E2E test.

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.3.8 (App Router, Turbopack) |
| Bahasa | TypeScript 5 (strict) |
| UI | React 19.2, Tailwind CSS v4 |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage), tanpa ORM |
| Validasi | zod v4 |
| Ikon | lucide-react |
| Test | Vitest 5 |
| Lint | ESLint 9 (`eslint-config-next`) |
| Package manager | pnpm 12.8.1 |
| Hosting | Vercel |

---

## 3. Struktur Proyek

```
sapuijuek/
├── app/
│   ├── layout.tsx            # Root layout: font, metadata, navbar, footer
│   ├── page.tsx              # Beranda (hero + bento grid)
│   ├── globals.css           # Design token + utilitas glassmorphism
│   ├── profil/               # Halaman publik
│   ├── prestasi/
│   ├── portfolio/
│   ├── kegiatan/
│   ├── struktur-organisasi/
│   ├── kontak/
│   └── admin/
│       ├── login/            # Form login
│       ├── anggota/          # CRUD anggota
│       ├── prestasi/
│       ├── portfolio/
│       ├── kegiatan/
│       ├── struktur/
│       ├── kontak/           # Pesan masuk
│       └── pengaturan/       # Site settings
├── app/api/                  # Route handler (lihat §8)
├── components/               # Komponen UI (navbar, footer, glass-card, dll.)
├── lib/
│   ├── auth/                 # cookies, session, verify, login-schema
│   ├── supabase/             # client anon (db.ts) & service_role (admin.ts)
│   └── validation/           # Skema zod per entitas
├── supabase/migrations/      # 9 file SQL (skema + RLS + seed settings)
├── proxy.ts                  # Middleware guard area /admin
├── tests/                    # Unit test Vitest
└── next.config.ts            # remotePatterns untuk gambar Supabase
```

---

## 4. Menjalankan Lokal

### Prasyarat

- Node.js 20+ dan pnpm 12
- Proyek Supabase (hosted) — atau `supabase start` untuk lokal
- File `.env.local` (tidak di-commit, sudah ada di `.gitignore`)

### Variabel environment

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key publik (client + password grant) |
| `SUPABASE_SERVICE_ROLE_KEY` | Key admin — **rahasia**, hanya dipakai di server |
| `ADMIN_EMAIL` | Email admin untuk seed otomatis |
| `ADMIN_PASSWORD` | Password admin untuk seed otomatis |

> ⚠️ Jangan pernah commit `.env.local`, dan jangan tulis password admin di issue/README publik.

### Langkah

```powershell
# 1. Install dependensi
pnpm install

# 2. Jalankan migrasi SQL (urut, di SQL Editor Supabase)
#    supabase/migrations/20261006000001_members.sql
#    ... sampai 20261007000006_contact_messages.sql

# 3. Dev server
pnpm dev          # http://localhost:3000

# 4. Verifikasi
pnpm lint         # ESLint, harus 0 error
pnpm test         # 29 test harus lulus
pnpm build        # Build produksi, 22 route
```

> **PowerShell:** `&&` tidak valid — jalankan perintah terpisah. Port 3000 bentrok? `Get-NetTCPConnection -LocalPort 3000` lalu stop PID-nya.

### Seed admin

Tidak perlu buat akun manual. Login pertama dengan `ADMIN_EMAIL`/`ADMIN_PASSWORD` akan otomatis membuat akun di Supabase Auth (`email_confirm=true`) lewat `service_role`, lalu login diulang. Lihat `app/api/auth/login/route.ts`.

---

## 5. Panduan Panel Admin

Akses: tombol **Masuk** di pojok kanan navbar → `/admin/login`.

> Area `/admin/*` (kecuali `/admin/login`) dijaga `proxy.ts` — tanpa session valid akan di-redirect 307 ke `/admin/login`.

### 5.1 Anggota (`/admin/anggota`)

| Field | Aturan |
|---|---|
| `nama` | wajib, 2–100 karakter |
| `nis` | wajib, 4–20 digit angka (disimpan sebagai teks, leading zero aman) |
| `kelas_paralel` | wajib, maks 30 karakter |
| `kontak` | opsional, maks 50 karakter |
| `foto_url` | opsional — upload lewat kolom foto |

Foto tampil di `/profil` dan `/struktur-organisasi`.

### 5.2 Prestasi (`/admin/prestasi`)

| Field | Aturan |
|---|---|
| `judul` | wajib, 2–150 karakter |
| `tanggal` | wajib, format `YYYY-MM-DD` |
| `deskripsi` | opsional, maks 2000 karakter |
| `bukti_url` | opsional, maks 500 karakter (tautan bukti) |
| foto | opsional — upload |

### 5.3 Portfolio (`/admin/portfolio`)

| Field | Aturan |
|---|---|
| `judul` | wajib, 2–150 karakter |
| `jenis_karya` | wajib, maks 50 karakter (mis. "Aplikasi Web", "Gim") |
| `deskripsi` | opsional, maks 3000 karakter |
| `images` | daftar URL gambar — upload multi-gambar |
| `video_url` | opsional, maks 500 karakter |
| `demo_url` | opsional, maks 500 karakter |

### 5.4 Kegiatan (`/admin/kegiatan`)

| Field | Aturan |
|---|---|
| `nama_acara` | wajib, 2–150 karakter |
| `tanggal` | wajib, `YYYY-MM-DD` |
| `deskripsi` | opsional, maks 2000 karakter |
| `photos` | daftar URL — upload multi-foto |

### 5.5 Struktur Organisasi (`/admin/struktur`)

Relasi ke tabel `members`. Pilih anggota → tentukan `posisi` (wajib, maks 80 karakter). Foto diambil otomatis dari foto anggota.

### 5.6 Pesan Masuk (`/admin/kontak`)

Pesan dari form `/kontak` masuk ke `contact_messages`. Fitur: pencarian (`q`), filter status (`baru` / `dibaca` / `diarsipkan`), ubah status, hapus. **Tidak ada email notifikasi** — cek manual lewat panel.

### 5.7 Upload Foto (semua entitas)

| Aturan | Nilai |
|---|---|
| Tipe | `image/jpeg`, `image/png`, `image/webp` |
| Ukuran maks | 5 MB (`5242880` byte) |
| Bucket | `public` (read publik, tulis via `service_role`) |
| URL | `https://<ref>.supabase.co/storage/v1/object/public/public/<entitas>/<uuid>.<ext>` |

---

## 6. Pengaturan Situs

`/admin/pengaturan` mengelola tabel `site_settings` (key → value).

| Key | Fungsi | Default |
|---|---|---|
| `tagline` | Tagline beranda/profil | Portal Digital Kelas PPLG SMKN 9 Semarang |
| `deskripsi_kelas` | Deskripsi kelas | (kosong) |
| `guru_pembimbing` | Nama guru pembimbing | (kosong) |
| `tahun_berdiri` | Tahun berdiri kelas | (kosong) |
| `visi`, `misi` | Visi & misi halaman profil | (kosong) |
| `prestasi_tagline` | Tagline halaman prestasi | Prestasi Gemilang Kelas PPLG |
| `portfolio_tagline` | Tagline halaman portfolio | Karya-Karya Unggulan Siswa PPLG |
| `kegiatan_tagline` | Tagline halaman kegiatan | Momen Bersama Kelas PPLG |
| `struktur_tagline` | Tagline halaman struktur | Pengurus Kelas PPLG |
| `kontak_email` | Email tampilan di `/kontak` | (kosong) |
| `kontak_instagram` | Akun Instagram | (kosong) |
| `kontak_whatsapp` | Nomor WhatsApp | (kosong) |
| `kontak_tiktok` | Akun TikTok | (kosong) |
| `kontak_youtube` | Kanal YouTube | (kosong) |

Nilai maksimal 2000 karakter; `kontak_email` divalidasi sebagai email.

---

## 7. Halaman Publik

| Rute | Isi |
|---|---|
| `/` | Hero + bento grid keunggulan |
| `/profil` | Tentang kelas, visi/misi, data anggota |
| `/prestasi` | Daftar prestasi (pencarian) |
| `/portfolio` | Karya siswa (filter jenis karya) |
| `/kegiatan` | Dokumentasi kegiatan |
| `/struktur-organisasi` | Bagan pengurus + foto anggota |
| `/kontak` | Form kontak (masuk ke `contact_messages`) |

Navbar: logo "Sapu Ijuek" di kiri, menu di kanan, tombol **Masuk** kecil di pojok kanan (di `/admin/*` berubah jadi **Keluar**, disembunyikan di `/admin/login`). Judul tab: **Sapu Ijuek**.

---

## 8. Referensi API

Semua endpoint di bawah diawali `/api`. Endpoint bertanda **🔒** wajib session admin (cookie `sb-access-token` valid).

### Auth

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/login` | Body `{email, password}` → set cookie httpOnly |
| POST | `/api/auth/logout` | Hapus cookie session |

### Publik (baca saja)

| Method | Endpoint | Query |
|---|---|---|
| GET | `/api/members` | `q`, `page`, `perPage` |
| GET | `/api/achievements` | `q`, `page`, `perPage` |
| GET | `/api/projects` | `q`, `jenis`, `page`, `perPage` |
| GET | `/api/activities` | `q`, `page`, `perPage` |
| GET | `/api/organization` | `q`, `page`, `perPage` |
| GET | `/api/site-settings` | — |
| POST | `/api/contact` | Kirim pesan kontak |

### Admin 🔒

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/members` | Tambah anggota |
| PATCH | `/api/members/[id]` | Ubah anggota |
| DELETE | `/api/members/[id]` | Hapus anggota |
| POST | `/api/members/[id]/photo` | Upload foto (`multipart/form-data`, field `file`) |
| POST · PATCH · DELETE | `/api/achievements`, `/api/achievements/[id]` | Prestasi |
| POST | `/api/achievements/[id]/photo` | Foto prestasi |
| POST · PATCH · DELETE | `/api/projects`, `/api/projects/[id]` | Portfolio |
| POST | `/api/projects/[id]/images` | Tambah gambar karya |
| DELETE | `/api/projects/[id]/images` | Hapus gambar karya |
| POST · PATCH · DELETE | `/api/activities`, `/api/activities/[id]` | Kegiatan |
| POST | `/api/activities/[id]/photos` | Tambah foto kegiatan |
| DELETE | `/api/activities/[id]/photos` | Hapus foto kegiatan |
| POST · PATCH · DELETE | `/api/organization`, `/api/organization/[id]` | Struktur organisasi |
| GET | `/api/admin/contact` | Daftar pesan (`q`, `status`) |
| PATCH · DELETE | `/api/admin/contact/[id]` | Ubah status / hapus pesan |
| PATCH | `/api/site-settings` | Simpan pengaturan |

Respons sukses: `{ "data": ... }` atau `{ "ok": true }`. Gagal: `{ "error": "..." }` + status HTTP:

| Status | Kapan |
|---|---|
| 400 | Body/query tak valid, ID rusak, file salah tipe/ukuran (>5MB) |
| 401 | Belum login / session kedaluwarsa (`requireAdmin`) |
| 404 | `PATCH` pada row yang tidak ada |
| 409 | Posisi struktur organisasi sudah dipakai |
| 500 | Kegagalan Supabase (query/upload) |

> Catatan: `DELETE` tidak membedakan "tidak ada" vs "gagal" — balik 500 bila row tak terhapus. Ukuran file >5MB memakai 400, bukan 413.

---

## 9. Validasi & Aturan Input

Semua request body divalidasi `zod` di route handler — tidak ada yang langsung masuk DB.

- Panjang teks: lihat §5 (per entitas)
- Tanggal: regex `^\d{4}-\d{2}-\d{2}$`
- URL: `z.string().url()` untuk `images`/`photos`
- File: tipe & ukuran dicek di `lib/validation/*` sebelum upload
- Cek NIS: hanya digit, 4–20 karakter

---

## 10. Autentikasi & Keamanan

| Aspek | Implementasi |
|---|---|
| Session | Cookie httpOnly `sb-access-token` + `sb-refresh-token` |
| Guard halaman | `proxy.ts` (middleware) — cek `exp` JWT, redirect 307 ke `/admin/login?next=...` |
| Guard API | `requireAdmin()` di `lib/auth/verify.ts` |
| RLS | Tabel: `public read` saja. Tulis/hapus **hanya** lewat `service_role` di route handler server |
| Storage | Bucket `public` read-only; upload/hapus via `service_role` |
| Seed admin | Login pertama cocok `ADMIN_EMAIL`/`ADMIN_PASSWORD` → akun dibuat otomatis |
| Validasi | zod di setiap route (trust boundary) |
| Gambar | `next/image` dibatasi `remotePatterns` → hanya `*.supabase.co/storage/v1/object/public/**` |

**Ganti password admin:** update di Supabase Auth (admin API `PUT /auth/v1/admin/users/{id}`), lalu samakan `ADMIN_PASSWORD` di `.env.local` **dan** Vercel env. Cek: login baru harus 200, lama harus 401.

---

## 11. Database & Storage

9 migrasi SQL di `supabase/migrations/` (jalankan urut):

| File | Isi |
|---|---|
| `20261006000001_members.sql` | Tabel `members` + index + RLS |
| `20261006000002_site_settings.sql` | Tabel `site_settings` + seed awal |
| `20261006000003_storage_public.sql` | Bucket `public` (5MB, jpg/png/webp) |
| `20261007000001_achievements.sql` | Tabel `achievements` |
| `20261007000002_projects.sql` | Tabel `projects` |
| `20261007000003_activities.sql` | Tabel `activities` |
| `20261007000004_organization.sql` | Tabel `organization` → relasi `members` |
| `20261007000005_site_settings_extra.sql` | Key tagline + visi/misi + kontak sosial |
| `20261007000006_contact_messages.sql` | Tabel `contact_messages` |

Pola konsisten: `id uuid`, `created_at timestamptz default now()`, index kolom pencarian, RLS enable + policy `for select using (true)`.

---

## 12. Desain & UI

### Palet

| Token | Nilai | Pemakaian |
|---|---|---|
| Primary | `#2563EB` | Aksi utama, tautan |
| Primary dark | `#1D4ED8` | Hover/gradasi |
| Accent | `#EA580C` | Penekanan sekunder |
| Accent strong | `#C2410C` | Aksen kontras |
| Navbar | `#111844` | `.glass-dark` |

### Glassmorphism (`app/globals.css`)

| Class | Opacity | Blur | Dipakai di |
|---|---|---|---|
| `.glass` | putih 78% | 40px saturate 200% | Kartu, topbar admin |
| `.glass-strong` | putih 90/72% | 44px saturate 220% | Panel tebal |
| `.glass-dark` | `#111844` 96/90% | 44px saturate 220% | Navbar, panel mobile |

Setiap permukaan kaca punya: border semi-transparan, `inset` specular highlight, drop shadow berlapis.

### Aturan aksesibilitas

- Kontras teks ≥ 4.5:1 (sudah diverifikasi terhadap permukaan)
- `cursor-pointer` + focus ring pada semua interaktif
- Layout responsif diuji pada **375 / 768 / 1280** px
- Ikon SVG dari lucide-react, `aria-hidden` dekoratif
- Skip-link "Lewati ke konten utama" di root layout

### Warna custom wajib via `@theme`

Utility Tailwind (`text-primary`, `bg-accent-soft`, dll.) hanya ter-generate kalau token didefinisikan di blok `@theme` `globals.css`. Jangan pakai hex literal di JSX untuk warna brand.

---

## 13. Testing & Lint

```powershell
pnpm lint    # ESLint — harus 0 error
pnpm test    # Vitest — 29 test, 2 file
pnpm build   # Next build — 22 route, TypeScript harus lolos
```

Test mencakup: logika session (`lib/auth/session.ts`), guard path admin, dan skema validasi. **Sebelum commit:** lint bersih → test lulus → build sukses.

---

## 14. Deploy ke Vercel

### Sekali jalan

1. `vercel link` (project `sapuijuek`)
2. Set env di dashboard Vercel (Production):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
3. Jalankan semua migrasi di Supabase

### Rutin (setiap perubahan)

```powershell
# 1. Verifikasi lokal
npx eslint .
npx vitest run
npx next build

# 2. Commit & push (repo publik — pastikan .env.local TIDAK ikut)
git add <file>
git commit -m "jenis: pesan singkat"
git push origin main

# 3. Deploy
vercel --prod --yes

# 4. WAJIB: Skew Protection aktif → alias tidak pindah otomatis
vercel alias set "https://sapuijuek-<kode>-ghaniyfadhila-sources-projects.vercel.app" sapuijuek.vercel.app

# 5. Verifikasi live
#    - cek route utama 200
#    - hard-reload Ctrl+Shift+R
```

> **Skew Protection:** tanpa `vercel alias set`, `sapuijuek.vercel.app` tetap menunjuk deployment lama. Ini sering terlupa.

### Checklist sebelum deploy

- [ ] `.env.local` tidak ter-stage (`git status` bersih dari file itu)
- [ ] Tidak ada kredensial di pesan commit / issue publik
- [ ] `pnpm lint`, `pnpm test`, `pnpm build` lulus
- [ ] `vercel alias set` dijalankan setelah deploy

---

## 15. Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| Foto siswa tidak tampil (error 400) | `next.config.ts` tanpa `remotePatterns` | Pastikan ada `hostname: "*.supabase.co"` + `pathname: "/storage/v1/object/public/**"` |
| Utility warna tidak muncul di build | Token tidak di `@theme` | Pindahkan definisi warna ke blok `@theme` `globals.css` |
| Deploy tidak kelihatan di production | Skew Protection | Jalankan `vercel alias set` |
| Login 401 padahal env benar | Password Supabase Auth ≠ env | Sinkronkan lewat admin API + update env di 3 tempat (Auth, `.env.local`, Vercel) |
| `/admin` redirect terus | Cookie session kedaluwarsa | Login ulang di `/admin/login` |
| Foto upload gagal | Melebihi 5MB atau tipe tak diizinkan | Kompres ke jpg/png/webp, maks 5MB |
| `EADDRINUSE` port 3000 | Dev server lama | Stop proses yang listen port 3000 |
| `&&` error di PowerShell | PowerShell ≠ bash | Pisahkan jadi beberapa perintah |
| CSS tidak berubah di production | Cache chunk immutable | Hard-reload `Ctrl+Shift+R` |

---

## Catatan Kontribusi

- Commit langsung ke `main` (trunk-based).
- Pesan commit: `feat:`, `fix:`, `style:`, `docs:`, `test:` — bahasa Indonesia.
- Review manual di localhost dulu sebelum deploy.
- Setelah ubah kode: `graphify update .` agar knowledge graph tetap akurat.
