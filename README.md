# 🏫 Presensiku — Multi-Tenant School Attendance PWA (SaaS)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%26%20R2-F38020?style=for-the-badge&logo=cloudflare)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%26%20Auth-3FCF8E?style=for-the-badge&logo=supabase)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Presensiku** adalah platform *Progressive Web App* (PWA) presensi sekolah multi-tenant berbasis SaaS. Berjalan di atas infrastruktur *Modern Edge Computing* terkini, aplikasi ini dirancang untuk kecepatan latensi rendah, fleksibilitas metode absensi, keandalan isolasi data multi-sekolah, notifikasi *real-time* ke orang tua tanpa biaya pesan, serta efisiensi biaya **100% Free & Legal Tier Strategy** hingga melayani puluhan ribu siswa secara simultan.

---

## 📋 Daftar Isi

1. [Fitur Utama & Keunggulan](#-fitur-utama--keunggulan)
2. [Tech Stack & Ekosistem](#-tech-stack--ekosistem)
3. [Arsitektur Domain & Routing Multi-Tenancy](#-arsitektur-domain--routing-multi-tenancy)
4. [Sistem Notifikasi Real-Time (Zero-Cost)](#-sistem-notifikasi-real-time-zero-cost-architecture)
5. [Hirarki User Roles & Matrix Akses](#-hirarki-user-roles--matrix-akses)
6. [Metode Presensi & Teknologi Anti-Kecurangan](#-metode-presensi--teknologi-anti-kecurangan)
7. [Arsitektur Keamanan & Isolasi Data](#-arsitektur-keamanan--isolasi-data)
8. [Strategi Optimasi 100% Free Tier ($0/Bulan)](#-strategi-optimasi-100-free-tier-0bulan)
9. [Struktur Proyek](#-struktur-proyek)
10. [Panduan Instalasi & Pengembangan Lokal](#-panduan-instalasi--pengembangan-lokal)
11. [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
12. [Lisensi](#-lisensi)

---

## ✨ Fitur Utama & Keunggulan

* **Multi-Tenant SaaS Architecture**: Isolasi data ketat antar-sekolah menggunakan PostgreSQL *Row Level Security* (RLS).
* **Multi-Method Attendance Engine**:
  * **Selfie + Geofencing**: Deteksi lokasi GPS server-side + upload foto terkompresi.
  * **Dynamic QR Code**: QR Token berubah tiap 5-10 detik (Anti-screenshot).
  * **RFID / Tap Card Reader**: Integrasi terminal fisik berbasis WebSerial/API.
  * **Delegated Manual Attendance**: Akses fleksibel bagi Guru Piket atau Karyawan khusus untuk input presensi manual.
* **Unlimited PWA Push Notification**: Notifikasi langsung ke HP orang tua saat siswa presensi tanpa biaya kirim pesan API.
* **Granular Permission Control**: Admin Sekolah dapat membagikan izin khusus (*permissions*) kepada peran tertentu tanpa menaikkan struktur role dasar.
* **Offline-First PWA**: Terinstal layaknya aplikasi native Android/iOS, cepat dimuat, dan hemat data internet.
* **Audit Trail System**: Log permanen (*append-only*) untuk merekam setiap aktivitas perbaikan data presensi manual.

---

## 🚀 Tech Stack & Ekosistem

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **IDE / Versioning** | VS Code + GitHub | Pengembangan lokal & otomatisasi CI/CD via GitHub Actions. |
| **Framework Frontend** | Next.js 15 (App Router) + React | Web application framework dengan React Server Components (RSC). |
| **PWA & Push Notification** | Serwist + Web Push API | Service Worker management, offline caching, PWA Manifest, & VAPID Push Alert. |
| **Edge Runtime / Hosting** | Cloudflare Workers & Pages | Runtime tanpa server di lokasi terdekat pengguna (ultra low latency). |
| **Database & Auth** | Supabase (PostgreSQL) | Managed Postgres DB + Supabase Auth + Realtime WebSockets. |
| **ORM** | Drizzle ORM | Type-safe, ultra fast ORM tanpa cold-start kompatibel dengan Edge Runtime. |
| **Storage Engine** | Cloudflare R2 | S3-compatible Object Storage tanpa biaya transfer egress data. |
| **UI & Styling** | Tailwind CSS + Shadcn UI | Design system responsif, modern, dan accessible. |
| **Bot Defense** | Cloudflare Turnstile | Proteksi login/form dari bot spam secara cepat & ramah pengguna. |

---

## 🌐 Arsitektur Domain & Routing Multi-Tenancy

Aplikasi dipisahkan secara tegas antara landing page publik/pemasaran dan aplikasi web SaaS utama:

```
                                  TRAFFIC USER
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
        [ https://presensi.app ]              [ https://presensiku.app ]
      +--------------------------+          +--------------------------+
      |  Marketing Landing Page  |          |    Main SaaS PWA App     |
      |  • Pricing & Features    |          |  • Multi-Tenant Routing   |
      |  • Tenant Registration   |          |  • Dashboard & Attendance|
      +--------------------------+          +------------+-------------+
                                                         |
                                                         v
                                          +------------------------------+
                                          | Tenant Dynamic Resolver:     |
                                          | • {sekolah}.presensiku.app   |
                                          |   (atau /app/{sekolah_slug}) |
                                          +------------------------------+
```

1. **`presensi.app` (Marketing & Onboarding)**: Dideploy pada Cloudflare Pages / Vercel (Static Site) untuk edukasi calon klien, pendaftaran sekolah baru, dan modul pendaftaran SaaS.
2. **`presensiku.app` (Web Application Utama)**: Aplikasi PWA utama yang menggunakan mekanisme routing tenant dinamis berbasis subdomain atau path resolution yang diproteksi oleh Supabase RLS.

---

## 📲 Sistem Notifikasi Real-Time (Zero-Cost Architecture)

Untuk menangani notifikasi kedatangan & kepulangan siswa skala besar (misal: **50.000 siswa = 2,2 Juta notifikasi/bulan**) tanpa membengkakkan biaya operasional, sistem menerapkan strategi notifikasi bertingkat:

```
                            [ Event Presensi Siswa ]
                                       |
                                       v
                    +------------------------------------+
                    |  Apakah PWA Terinstal di HP Ortu?  |
                    +------------------+-----------------+
                                       |
                      +----------------+----------------+
                      | YA                              | TIDAK / ADD-ON
                      v                                 v
          [ PWA Web Push Notification ]     [ Optional WA Gateway (BYON) ]
          • Direct Push ke Screen HP        • Menggunakan Nomor Sekolah
          • Latensi < 1 Detik               • Diproses via Queue (BullMQ)
          • Biaya: Rp 0 / Gratis!           • Tambahan Biaya Paket Tenant
```

1. **Primary Notification (PWA Native Web Push Notification - $0/Bulan)**:
   * Menggunakan **Web Push API** standar W3C.
   * Saat orang tua memasang PWA *Presensiku* di smartphone (Android/iOS), aplikasi meminta izin notifikasi.
   * Ketika siswa melakukan presensi (masuk/pulang), server mengirimkan *push alert* seketika ke layar HP orang tua secara **100% GRATIS tanpa batas jumlah pesan**.
2. **Secondary / Add-On Notification (WhatsApp Gateway - BYON)**:
   * Fitur opsional untuk sekolah yang mewajibkan pesan WhatsApp.
   * Menggunakan skema *Bring Your Own Number (BYON)* di mana sekolah mendaftarkan nomor WA resmi sekolah masing-masing via provider lokal (Fonnte/Wablas) atau Self-Hosted Baileys.

---

## 👥 Hirarki User Roles & Matrix Akses

### 👑 1. Super Admin (Platform SaaS Owner)
* **Dashboard Global**: Ringkasan Total Tenant (Sekolah), MRR, Server Health, dan Total Log Presensi.
* **Manajemen Tenant**: Tambah, bekukan, edit kuota murid/staf, dan atur Subdomain / Custom Domain sekolah.
* **Billing & Package**: Pengaturan Tier Berlangganan (Basic, Pro, Enterprise) dan Payment Gateway.
* **System Log & Maintenance**: Audit log global, konfigurasi API Key (WhatsApp Gateway, Email SMTP).

### 🏫 2. Admin Sekolah (Tenant Admin)
* **Dashboard Sekolah**: Real-time statistik kehadiran murid, guru, dan karyawan.
* **Data Master**: Management Tahun Ajaran, Semester, Hari Libur, Kelas, Jurusan, dan Mata Pelajaran.
* **User Management**: Import/Export Excel data Guru, Karyawan, Wali Kelas, dan Murid. Mapping UID RFID.
* **Granular Permission Matrix**: Mengaktifkan penugasan izin **Presensi Manual** kepada Guru atau Karyawan terpilih (seperti Guru Piket atau Staf Tata Usaha).
* **Konfigurasi Presensi**: Penentuan Titik Koordinat GPS, Radius Geofencing, Jam Masuk/Pulang, & Terminal QR.
* **Override & Perizinan**: Presensi manual global dan persetujuan surat izin/sakit/cuti.

### 👩‍🏫 3. Guru (Pengajar)
* **Dashboard Guru**: Jadwal mengajar harian dan status presensi pribadi.
* **Presensi Mandiri**: Masuk/Pulang via Selfie + Geofencing, Dynamic QR, atau RFID.
* **Presensi Kelas (Per Jam Pelajaran)**: Input daftar hadir murid di kelas saat jam pelajaran berlangsung.
* **Presensi Manual Terdelegasi** *(Fitur Khusus jika diizinkan Admin)*: Menginput presensi manual murid atau guru lain (Role: Guru Piket).
* **Pengajuan Cuti / Izin**: Form pengajuan izin pribadi beserta dokumen pendukung.

### 👨‍🏫 4. Wali Kelas
* *(Memiliki seluruh fitur pada role Guru)* +
* **Monitoring Kelas Binaan**: Pantau statistik kehadiran *real-time* siswa di kelasnya.
* **Presensi Manual Kelas Binaan**: Penginputan atau koreksi status presensi harian siswa kelas binaan.
* **Approval Izin Siswa**: Validation & approval surat izin/sakit siswa di kelasnya.

### 🧑‍💼 5. Karyawan (Staf TU / Keamanan / Operasional)
* **Dashboard Karyawan**: Status jam kerja, shift, dan presensi pribadi.
* **Presensi Mandiri**: Masuk/Pulang via Selfie + Geofencing, Dynamic QR, atau RFID.
* **Presensi Manual Terdelegasi** *(Fitur Khusus jika diizinkan Admin)*: Menginput presensi manual murid/staf terlambat di gerbang sekolah (Role: Petugas Piket / Resepsionis).

### 🎓 6. Murid & Orang Tua
* **Dashboard Murid/Ortu**: Status presensi hari ini, jadwal pelajaran, dan pengumuman.
* **Presensi Mandiri Murid**:
  * Tampilkan **Kartu QR Digital** pribadi untuk di-scan oleh scanner/guru.
  * **Scan Dynamic QR Code** terminal sekolah menggunakan HP pribadi.
  * **Selfie + Geofencing** jika di dalam radius sekolah.
* **PWA Push Notification Manager**: Konfigurasi izin notifikasi lansung ke screen HP orang tua.
* **Pengajuan Izin / Sakit**: Form unggah surat keterangan orang tua/dokter.

---

## 🔒 Metode Presensi & Teknologi Anti-Kecurangan

```
                       +----------------------------------+
                       |   Metode Presensi yang Dipilih   |
                       +----------------+-----------------+
                                        |
      +------------------+--------------+------------------+------------------+
      |                  |                                 |                  |
[Selfie + Geofencing]  [Dynamic QR Code]             [Tap Card RFID]    [Presensi Manual]
      |                  |                                 |                  |
• Cek Koordinat GPS    • QR Token berubah per N detik    • Reader UID Card  • Admin Sekolah
• Validasi Jarak       • Scan via Kamera App             • Tap ke Terminal  • Wali Kelas
• Foto & Upload R2     • Validasi Token Backend Edge     • API Worker Request• Guru/Karyawan Terpilih
      |                  |                                 |                  |
      +------------------+--------------+------------------+------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |  Simpan Database & Audit Trail System |
                    |      (Supabase Postgres via Drizzle)  |
                    +---------------------------------------+
```

1. **Selfie + Geofencing (Server-Side Haversine)**:
   * Perhitungan jarak GPS dikalkulasi penuh di **Cloudflare Worker/Backend** menggunakan rumus *Haversine*, bukan di browser pengguna untuk memblokir teknik manipulasi data (*Fake GPS*).
   * Verifikasi metadata `accuracy` dari HTML5 Geolocation API.
2. **Dynamic QR Code (TOTP / HMAC Expiration)**:
   * QR Code yang ditampilkan di TV/Terminal sekolah menggunakan token terenkripsi HMAC yang kedaluwarsa dalam **5–10 detik**.
   * Menghindari kecurangan berbagi *screenshot* QR Code antar-siswa via obrolan aplikasi.
3. **Optimasi Foto Selfie & Presigned URLs (Cloudflare R2)**:
   * Foto dikompresi di sisi browser (*Client Canvas*) menjadi format `.webp` dengan ukuran **~30 KB**.
   * Upload menggunakan **Presigned URL** berumur singkat (30 detik) yang dihasilkan oleh Cloudflare Workers.

---

## 🛡️ Arsitektur Keamanan & Isolasi Data

1. **PostgreSQL Row Level Security (RLS)**:
   Setiap query ke tabel diproteksi langsung pada tingkat basis data Supabase:
   ```sql
   CREATE POLICY "Tenant Data Isolation" ON attendances
   FOR ALL USING (
     tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
   );
   ```
2. **Immutable Audit Trail Log**:
   Setiap aksi penginputan presensi manual oleh Admin, Wali Kelas, atau Guru Piket akan dicatat secara permanen pada tabel `audit_logs` (termasuk `operator_id`, `reason`, `ip_address`, `timestamp`, `old_status`, `new_status`).
3. **Cloudflare Rate Limiting & Turnstile**:
   Mencegah serangan *brute-force* pada endpoint sensitif seperti `/api/attendance/submit` dan `/api/auth/login`.

---

## 💰 Strategi Optimasi 100% Free Tier ($0/Bulan)

Aplikasi ini dioptimalkan penuh agar tetap legal dan berjalan **$0/bulan** di tingkat awal pengembangan:

| Provider | Batas Free Tier | Taktik Optimasi Aplikasi |
| :--- | :--- | :--- |
| **Cloudflare Pages / Workers** | 100.000 Requests / Hari | Frontend Next.js di-build sebagai Client-Side Rendered (CSR/SPA) sehingga request file statis **0 ke Workers** (Unlimited free). Workers hanya menangani API kritis. |
| **Cloudflare R2 Storage** | 10 GB Storage, $0 Egress | **Kompresi Client WebP (~30KB)** + **Object Lifecycle Rule**: Foto selfie otomatis dihapus dari R2 setelah **30 Hari** setelah rekapitulasi bulanan terbit. *Menampung s.d 300.000 foto/bulan secara gratis.* |
| **Supabase Postgres DB** | 500 MB DB Space | Skema database teroptimasi dengan tipe data integer/enum, tanpa gambar dalam DB, dan penggunaan *Column Projection* (`SELECT id, status...`). *Cukup untuk >4 Juta baris log presensi.* |
| **Supabase Auth** | 50.000 Monthly Active Users | Sangat mencukupi untuk puluhan sekolah menengah tanpa biaya tambahan. |
| **Supabase Keep-Alive** | Mencegah Auto-Pause DB | **GitHub Actions Scheduled Cron** berjalan 1x sehari memanggil endpoint ringan agar Supabase DB tidak aktif-otomatis (*auto-pause*) saat libur sekolah. |
| **Web Push API** | Unlimited Free | Pengiriman notifikasi kehadiran ke HP orang tua secara gratis langsung melalui browser Service Worker. |

---

## 📁 Struktur Proyek

```text
presensiku-app/
├── .github/
│   └── workflows/
│       ├── deploy.yml            # CI/CD Deployment pipeline
│       └── keep-alive.yml        # Cron job anti auto-pause Supabase
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Halaman Login / Reset Password
│   │   ├── (dashboard)/          # Dashboard per role
│   │   │   ├── admin/            # Dashboard Admin Sekolah
│   │   │   ├── teacher/          # Dashboard Guru & Guru Piket
│   │   │   ├── student/          # Dashboard Murid & Ortu
│   │   │   └── super-admin/      # Dashboard Pemilik SaaS
│   │   └── api/                  # Edge API Routes (Workers Runtime)
│   ├── components/               # UI Components (Shadcn UI & Custom)
│   │   ├── attendance/           # Camera, QR Scanner, Location Picker
│   │   └── ui/                   # Reusable Primitive Components
│   ├── db/                       # Drizzle ORM Schema & Migrations
│   │   ├── schema/               # Database tables definition
│   │   └── index.ts              # Supabase Client connection
│   ├── lib/                      # Helper Functions
│   │   ├── geofence.ts           # Server-side Haversine formula
│   │   ├── r2.ts                 # Cloudflare R2 Presigned URL Generator
│   │   ├── push.ts               # Web Push Notification VAPID Sender
│   │   └── permissions.ts        # Granular Permission checker
│   └── types/                    # TypeScript interfaces & types
├── drizzle.config.ts             # Drizzle ORM Configuration
├── wrangler.json                 # Cloudflare Workers configuration
└── package.json
```

---

## 🛠️ Panduan Instalasi & Pengembangan Lokal

### 1. Prasyarat Sistem
* **Node.js**: `v20.x` atau lebih baru
* **Package Manager**: `pnpm` (direkomendasikan)
* **VS Code Extensions**: Tailwind CSS, ESLint, Drizzle ORM

### 2. Langkah-Langkah

```bash
# 1. Clone repositori ini
git clone https://github.com/username/presensiku-app.git
cd presensiku-app

# 2. Install dependensi
pnpm install

# 3. Salin file environment variables
cp .env.example .env.local

# 4. Jalankan migrasi database via Drizzle
pnpm drizzle-kit push

# 5. Jalankan server pengembangan lokal
pnpm dev
```

Akses aplikasi melalui browser di `http://localhost:3000`.

---

## 🔑 Konfigurasi Environment Variables

Buat berkas `.env.local` dan isi parameter berikut:

```env
# APP CONFIGURATION
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SAAS_DOMAIN=presensiku.app

# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# DATABASE CONNECTION (DRIZZLE ORM)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# WEB PUSH NOTIFICATION (VAPID KEYS)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# CLOUDFLARE R2 STORAGE CONFIGURATION
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_R2_BUCKET_NAME=presensiku-photos
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key

# CLOUDFLARE TURNSTILE (CAPTCHA)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk kepentingan komersial maupun non-komersial.