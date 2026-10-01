# Product Requirements Document (PRD)

## Website Portofolio Kelas PPLG SMKN 9 Semarang

### Document Metadata

- **Versi:** 1.0
- **Status:** Draft untuk Review
- **Tim Pengembang:** Ghaniy Fadhil Altaf

---

## 1. Executive Summary

Website Portofolio Kelas PPLG adalah sebuah platform digital yang dirancang untuk menampilkan identitas, prestasi, dan karya-karya siswa kelas PPLG SMKN 9 Semarang. Website ini berfungsi sebagai media informasi kepada guru, wali murid, calon siswa, dan publik umum tentang keunggulan kelas.

Platform ini dilengkapi dengan sistem admin yang memungkinkan anggota kelas untuk mengelola konten secara mandiri tanpa perlu mengubah kode program. Website akan menampilkan profil kelas, prestasi siswa, karya-karya terbaik dalam format multimedia, dokumentasi kegiatan, dan informasi kontak.

## 2. Latar Belakang & Tujuan

### 2.1 Latar Belakang

Kelas PPLG (Pengembangan Perangkat Lunak dan Gim) adalah kelas yang fokus pada pengembangan software dan game. Untuk meningkatkan visibilitas dan memberikan gambaran komprehensif tentang kelas kepada berbagai stakeholder, diperlukan sebuah platform digital yang dapat menampilkan profil kelas, prestasi siswa, dan portofolio karya-karya terbaik secara profesional.

### 2.2 Tujuan Utama

Tujuan website ini adalah:

- **Portofolio Digital:** Menjadi portofolio digital kelas PPLG yang menampilkan prestasi dan karya siswa
- **Media Informasi:** Memberikan media informasi yang mudah diakses bagi stakeholder (guru, wali murid, calon siswa, publik)
- **Identitas Digital:** Membangun identitas digital kelas PPLG SMKN 9 Semarang yang profesional dan menarik
- **Manajemen Konten:** Menyediakan sistem manajemen konten yang memudahkan anggota kelas untuk update informasi tanpa technical knowledge

## 3. Target Audiens & User Personas

Audiens website ini terdiri dari berbagai kelompok:

| Audiens | Deskripsi |
| --- | --- |
| Guru/Wali Kelas | Untuk monitoring prestasi dan karya siswa, media evaluasi portofolio |
| Wali Murid | Untuk mengetahui perkembangan dan prestasi anak di sekolah |
| Calon Siswa | Untuk melihat keunggulan kelas PPLG sebelum mendaftar |
| Publik Umum | Untuk mengetahui reputasi dan karya dari kelas PPLG SMKN 9 Semarang |
| Admin (Siswa) | Untuk melakukan CRUD (Create, Read, Update, Delete) konten website |

## 4. Fitur & Functional Requirements

### 4.1 Fitur Publik (Dapat Diakses Semua Pengunjung)

#### 1. Halaman Beranda (Home)

- Hero section dengan tagline dan logo kelas
- Quick overview keunggulan kelas (3-4 poin utama dengan icon)
- Preview recent achievements dan projects (latest 3-4 items)
- Call-to-action buttons (Lihat Prestasi, Lihat Portfolio, Hubungi Kami)

#### 2. Halaman Profil Kelas

- Visi & Misi kelas
- Daftar lengkap anggota kelas dengan foto profil dan nama
- Informasi guru pembimbing
- Statistics: Jumlah siswa, tahun berdiri, dll

#### 3. Halaman Struktur Organisasi

- Bagan organisasi kelas visual (ketua, wakil, sekretaris, bendahara, dll)
- Photo dan nama setiap posisi

#### 4. Halaman Galeri Prestasi

- Daftar prestasi dengan kategori (akademik, non-akademik, kompetisi)
- Setiap prestasi menampilkan: judul, tanggal, deskripsi, bukti (sertifikat/foto)
- Filter dan search functionality
- Sorting: terbaru, kategori, popularitas

#### 5. Halaman Portfolio/Showcase Karya

- Gallery karya siswa dalam berbagai format:
  - Gambar (screenshot aplikasi, design mockup)
  - Video (demo aplikasi, gameplay game)
  - Link demo project (live URL)
- Deskripsi singkat teknis & tujuan project
- Detail view untuk setiap karya
- Rating/like functionality (optional)

#### 6. Halaman Galeri Kegiatan

- Dokumentasi foto kegiatan kelas (study tour, workshop, gathering, team building, dll)
- Album-based gallery dengan deskripsi
- Lightbox viewer untuk melihat foto fullscreen

#### 7. Halaman Kontak

- Form kontak sederhana (nama, email, pesan)
- Contact information (email kelas, Instagram, WhatsApp, TikTok, YouTube)
- Embedded map lokasi sekolah (optional)
- Email notification ketika ada pesan masuk

### 4.2 Fitur Admin Panel (Restricted Access)

Admin panel dapat diakses hanya dengan login (username & password) yang terpisah dari halaman publik. Akses URL: `/admin`

#### Fitur Admin:

**Dashboard**
- Welcome message
- Overview statistik (jumlah members, projects, achievements, visitors)
- Recent activities
- Quick links ke semua manajemen features

**Manajemen Anggota Kelas (CRUD)**
- List semua anggota dengan pagination
- Form tambah anggota baru
- Form edit data anggota (nama, NIS, kelas paralel, kontak)
- Upload/change foto profil
- Delete anggota dengan konfirmasi
- Search dan filter anggota

**Manajemen Prestasi (CRUD)**
- List semua prestasi dengan kategori
- Form tambah prestasi baru
- Field: judul, kategori, tanggal, deskripsi, siswa yang terlibat
- Upload bukti prestasi (sertifikat/foto)
- Form edit dan delete
- Preview sebelum publish

**Manajemen Karya/Projects (CRUD)**
- List semua projects
- Form tambah project baru
- Field: judul, jenis karya (aplikasi/game/design/etc), deskripsi, tim developer
- Upload media (multiple images, video, atau link ke video hosting)
- Input link demo/live URL
- Form edit dan delete
- Preview sebelum publish

**Manajemen Galeri Kegiatan (CRUD)**
- List semua album kegiatan
- Form buat album baru
- Upload multiple photos untuk 1 album
- Edit deskripsi album
- Delete album dan photo
- Drag-and-drop untuk reorder photo

**Manajemen Struktur Organisasi (CRUD)**
- Form untuk edit posisi struktur (ketua, wakil, sekretaris, bendahara, dll)
- Link anggota ke posisi dengan dropdown
- Preview struktur organisasi yang akan ditampilkan

**Manajemen Konten Lainnya**
- Edit Visi & Misi kelas (text editor rich text)
- Edit daftar guru pembimbing
- Edit informasi lainnya (tahun berdiri, jumlah siswa, dll)

**Settings**
- Change password admin
- Manage admin accounts (add/remove admin user - optional)
- Website settings (site title, description, dll)

## 5. Design & Branding

### 5.1 Design Style

- **Gaya:** Glassmorphism + Minimalis dengan aksen Teknologi
- **Warna Dominan:** Putih (sesuai dengan branding kelas yang sudah ada)
- **Aksen:** Biru atau warna tech (bisa `#4472C4` atau `#2563EB`) untuk elemen interaktif dan menunjukkan teknologi
- **Typography:** Sans-serif modern (Inter, Poppins, atau Helvetica Neue)
- **Spacing:** Generous padding dan margin untuk kemudahan navigasi

### 5.2 Brand Elements

- **Logo Kelas:** Ditempatkan di navbar, hero section, dan footer
- **Iconography:** Icon set yang konsisten untuk kategori (prestasi akademik, kompetisi, project, dll)
- **Imagery:** Foto profesional anggota kelas, dokumentasi kegiatan, screenshot project
- **Glassmorphism Elements:** Kartu dengan background blur dan semi-transparent untuk modernitas

## 6. Technical Specifications

### 6.1 Tech Stack Rekomendasi

| Komponen | Teknologi | Alasan |
| --- | --- | --- |
| Frontend | React + Next.js 14 | Modern, SEO-friendly, glassmorphism support mudah, fast rendering |
| Styling | TailwindCSS + CSS Modules | Flexible, utility-first, custom glassmorphism effect, production-ready |
| Backend | Next.js API Routes | Ringan, cepat, mudah untuk CRUD operations, integrated dengan frontend |
| Database | PostgreSQL + Supabase | Reliable, free tier generous, built-in auth support, realtime capabilities |
| File Storage | Supabase Storage atau Cloudinary | Upload gambar dan video, free tier adequate, CDN included |
| Hosting | Vercel | Gratis untuk hobby projects, CI/CD otomatis, Next.js native support |
| Authentication | NextAuth.js atau Supabase Auth | Secure login untuk admin panel, session management |
| Image Optimization | Next.js Image + Sharp | Automatic optimization, lazy loading, WebP support |
| Video Hosting | YouTube Embed atau Cloudinary | Untuk video demo project dan kegiatan |

### 6.2 Arsitektur Sistem (High Level)

```
┌─────────────────────────────────────────────────────────┐
│ PUBLIC WEBSITE (Vercel)                                 │
│ - Home, Profile, Prestasi, Portfolio, Kegiatan          │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ NEXT.JS API ROUTES (Backend)                            │
│ - Handle requests, CRUD operations, auth                │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ DATABASE (Supabase PostgreSQL) + STORAGE                │
│ - All data & media files                                │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ ADMIN PANEL (/admin - Protected Route)                  │
│ - Manage all content via UI                             │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Database Schema (Entities)

- **Users** (untuk admin): `id`, `username`, `password_hash`, `email`, `created_at`
- **Members** (anggota kelas): `id`, `nama`, `nis`, `kelas_paralel`, `foto`, `kontak`, `created_at`
- **Achievements** (prestasi): `id`, `judul`, `kategori`, `tanggal`, `deskripsi`, `bukti_url`, `member_ids`, `created_at`
- **Projects** (karya): `id`, `judul`, `jenis_karya`, `deskripsi`, `tim_member_ids`, `images`, `video_url`, `demo_url`, `created_at`
- **Activities** (kegiatan): `id`, `nama_acara`, `deskripsi`, `tanggal`, `photos`, `created_at`
- **Organization** (struktur): `id`, `posisi`, `member_id`, `urutan`, `created_at`
- **Site_Settings** (pengaturan): `id`, `visi_misi`, `guru_pembimbing`, etc

### 6.4 Non-Functional Requirements

- **Performance:** Page load time < 3 detik, Lighthouse score > 85
- **Responsiveness:** Mobile-first design, support semua ukuran device (320px - 2560px)
- **Security:** HTTPS, password hashing (bcrypt), SQL injection prevention, CSRF protection, XSS protection
- **Scalability:** Architecture siap untuk growth (banyak media, banyak visitors)
- **Maintainability:** Code clean, dokumentasi lengkap, mudah di-scale oleh developer lain
- **Accessibility:** WCAG 2.1 AA compliance (alt text, semantic HTML, color contrast)
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)

## 7. Timeline & Milestones

**Target:** Selesai secepatnya dengan kualitas baik. Karena ini solo project, timeline fleksibel tapi fokus pada MVP yang fully functional.

| Fase | Deliverable | Durasi Estimasi |
| --- | --- | --- |
| 1. Planning & Design | Wireframe, UI mockup, Database schema, Figma design | 3-5 hari |
| 2. Setup Infrastructure | Project structure, Supabase setup, NextAuth setup, repository | 2-3 hari |
| 3. Frontend Public Pages | Home, Profile, Prestasi, Portfolio, Kegiatan, Contact pages | 7-10 hari |
| 4. Backend & API | API endpoints untuk semua entities, database relations, validation | 5-7 hari |
| 5. Admin Panel Development | Dashboard, CRUD interfaces, auth guards, file upload | 7-10 hari |
| 6. Testing & Optimization | Unit tests, E2E tests, QA, browser testing, performance optimization | 3-5 hari |
| 7. Deployment & Launch | Deploy ke Vercel, setup domain, DNS, final checks, documentation | 1-2 hari |

**Total Estimasi:** 4-6 minggu untuk MVP yang fully functional dan ready untuk production

## 8. Success Metrics & KPI

Kesuksesan project dapat diukur dari:

- ✓ Website sudah live dan accessible di internet (domain aktif)
- ✓ Semua halaman publik berfungsi sempurna tanpa error
- ✓ Admin panel dapat digunakan untuk CRUD semua konten tanpa error
- ✓ Website responsif di semua device (mobile, tablet, desktop)
- ✓ Performa baik: Lighthouse score ≥ 85, load time < 3 detik
- ✓ Security: Login admin bekerja dengan aman, data terlindungi
- ✓ Dokumentasi lengkap: Deployment guide, usage guide, code documentation
- ✓ Semua anggota kelas bisa menggunakan admin panel dengan mudah
- ✓ Referensi design (https://smk.prestasiprima.sch.id/) sudah diterjemahkan ke dalam design kelas

## 9. Risks & Mitigation Strategy

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Scope creep (fitur terus bertambah) | Deadline meleset, quality down | Tetap fokus MVP, fitur tambahan di v2, dokumentasi requirement |
| Data loss/corruption | Informasi penting hilang | Regular backup database, file storage redundant, version control |
| Server downtime | Website tidak accessible | Pilih hosting reliable (Vercel + Supabase), monitoring uptime, alerting |
| Admin password lupa/bocor | Akses tidak authorized | Implement password reset feature, email verification, 2FA di v2 |
| Performance issue saat banyak content | Website slow, bad UX | Image optimization, lazy loading, CDN, database indexing, pagination |
| Security vulnerability | Data breach | Security headers (CORS, CSP), input validation, sanitization, dependency updates |

## 10. Future Enhancements (v2, v3, dll)

Untuk pengembangan jangka panjang setelah MVP selesai, bisa ditambahkan:

- **Blog/Artikel:** Siswa bisa share artikel, tutorial, atau write-up project
- **Student Profile Pages:** Halaman profil detail per siswa dengan portfolio individual
- **Testimonials/Reviews:** Quote dari alumni atau guru tentang pengalaman di kelas
- **Newsletter Signup:** Email subscriber untuk update terbaru tentang kelas
- **Social Media Integration:** Link to Instagram, YouTube, TikTok, GitHub kelas
- **Analytics Dashboard:** Lihat traffic, visitor analytics, popular content
- **Multi-language Support:** English version untuk exposure internasional
- **Dark Mode:** Theme toggle untuk user preference
- **Comments/Discussions:** Di project atau achievement untuk engagement
- **Search Functionality:** Global search untuk semua konten
- **Export to PDF:** Resume atau portfolio export
- **Mobile App:** Native iOS/Android app (React Native)

## Kesimpulan

Website Portofolio Kelas PPLG SMKN 9 Semarang adalah project yang *ambitious namun achievable* dengan tech stack yang tepat, planning yang matang, dan eksekusi terstruktur.

Dengan tech stack modern (Next.js, React, Supabase, Vercel), website ini akan:

- ✨ Terlihat professional dan modern dengan design glassmorphism
- ⚡ Performa tinggi dan SEO-friendly
- 🔒 Aman dan scalable untuk pertumbuhan future
- 📱 Fully responsive di semua device
- 🛠️ Mudah di-maintain dan di-update oleh anggota kelas melalui admin panel

Admin panel yang user-friendly memastikan konten bisa terus di-update oleh anggota kelas tanpa technical knowledge yang mendalam. Sukses dari project ini tidak hanya terletak pada website yang lancar, tapi juga pada kemampuan tim untuk maintain dan terus improve platform seiring waktu.

Dokumen ini adalah draft dan dapat di-revise sesuai feedback dan kebutuhan tambahan dari siswa dan guru pembimbing.
