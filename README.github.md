# 🏫 Presensiku — Multi-Tenant School Attendance PWA (SaaS)

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%26%20R2-F38020?style=for-the-badge&logo=cloudflare)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%26%20Auth-3FCF8E?style=for-the-badge&logo=supabase)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Presensiku** adalah aplikasi presensi sekolah berbasis Next.js yang sudah memiliki dashboard multi-role, integrasi Supabase, API attendance, serta UI login dan presensi manual yang siap dipakai untuk pengembangan lebih lanjut. Proyek ini fokus pada pengalaman kerja yang cepat untuk admin, guru, murid, dan super admin, dengan arsitektur yang siap dikembangkan menjadi platform SaaS.

## Status Proyek Saat Ini

Berikut status implementasi yang sudah ada pada kode saat ini:

- ✅ Dashboard utama dan navigasi role: `admin`, `guru`, `murid`, `super-admin`
- ✅ Halaman login dan session demo berdasarkan localStorage
- ✅ Integrasi Supabase live dengan fallback mock data
- ✅ API `attendance`, `students`, `health`, dan `seed`
- ✅ Fitur presensi manual dan panel persetujuan izin di dashboard admin
- ✅ Manifest PWA, ikon, dan konfigurasi deployment `vercel.json`
- ✅ Deploy utama aplikasi Next.js dapat dilakukan di Vercel
- ⚠️ Fitur lanjutan seperti multi-tenant routing penuh, push notification real-time, geofencing advanced, dan billing SaaS masih perlu dikembangkan lebih lanjut

---

## 🚀 Deployment Saat Ini

Proyek ini sudah siap dideploy ke **Vercel** sebagai hosting utama untuk aplikasi Next.js.

### Pilihan deployment yang disarankan

- **Vercel**: hosting utama aplikasi web, otomatis dari GitHub, cocok untuk Next.js App Router.
- **Cloudflare**: digunakan untuk layanan pendukung seperti R2, Workers, Turnstile, dan fitur edge tambahan.

### Langkah deploy ke Vercel

1. Hubungkan repository ke Vercel.
2. Set `Framework Preset` menjadi `Next.js`.
3. Tambahkan environment variables sesuai `.env.example` atau `.env.production.example`.
4. Deploy dan gunakan domain hasil produksi dari Vercel.

> Untuk proyek ini, Vercel menjadi target deploy utama, sementara Supabase dan Cloudflare tetap dipakai untuk database, auth, storage, dan layanan pendukung.

---

## ✨ Fitur yang Sudah Ada Saat Ini

- **Multi-role dashboard**: halaman `admin`, `guru`, `murid`, dan `super-admin` sudah dibuat.
- **Login & session management**: alur login demo dan session berbasis localStorage sudah diterapkan.
- **Supabase integration**: aplikasi mampu membaca data dari Supabase bila environment variable sudah diisi, dengan fallback ke data mock saat belum siap.
- **Attendance APIs**: endpoint `/api/attendance`, `/api/students`, `/api/health`, dan `/api/seed` sudah tersedia.
- **Manual attendance**: admin dapat menambahkan presensi manual dari dashboard.
- **Approval panel**: dashboard admin menampilkan daftar izin yang menunggu persetujuan.
- **PWA support**: manifest dan ikon PWA sudah ditambahkan.
- **Deployment notes**: file `vercel.json`, `README.deploy.md`, dan `.env.production.example` sudah dibuat.

## 🔜 Fitur yang Masih Dalam Roadmap

- Multi-tenant routing yang benar-benar dinamis per sekolah
- Push notification real-time ke orang tua
- Selfie + geofencing verification yang lebih lengkap
- Billing, package, dan tenant management untuk SaaS
- Audit trail sistem yang lebih matang untuk seluruh aktivitas admin

---

## 🚀 Tech Stack & Ekosistem

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **IDE / Versioning** | VS Code + GitHub | Pengembangan lokal & otomatisasi CI/CD via GitHub Actions. |
| **Framework Frontend** | Next.js 16.3.4 (App Router) + React 19.2.8 | Web application framework dengan App Router dan React terbaru. |
| **PWA & Push Notification** | Serwist + Web Push API | Service Worker management, offline caching, PWA Manifest, & VAPID Push Alert. |
| **Hosting & Deployment** | Vercel + Cloudflare Workers & Pages | Aplikasi Next.js di-deploy ke Vercel untuk pengalaman deploy yang cepat; Cloudflare Workers & Pages dipakai untuk edge runtime dan layanan pendukung. |
| **Database & Auth** | Supabase (PostgreSQL) | Managed Postgres DB + Supabase Auth + Realtime WebSockets. |
| **ORM** | Drizzle ORM | Type-safe, ultra fast ORM tanpa cold-start kompatibel dengan Edge Runtime. |
| **Storage Engine** | Cloudflare R2 | S3-compatible Object Storage tanpa biaya transfer egress data. |
| **UI & Styling** | Tailwind CSS + Shadcn UI | Design system responsif, modern, dan accessible. |
| **Bot Defense** | Cloudflare Turnstile | Proteksi login/form dari bot spam secara cepat & ramah pengguna. |

---

## 🛠️ Panduan Instalasi & Pengembangan Lokal

### 1. Prasyarat Sistem

- **Node.js**: `v20.x` atau lebih baru
- **Package Manager**: `npm` (direkomendasikan untuk repositori ini)
- **VS Code Extensions**: Tailwind CSS, ESLint, Drizzle ORM

### 2. Langkah-Langkah

```bash
# 1. Clone repositori ini
git clone https://github.com/username/presensiku-app.git
cd presensiku-app

# 2. Install dependensi
npm install

# 3. Salin file environment variables
cp .env.example .env.local

# 4. Jalankan server pengembangan lokal
npm run dev
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

## 📁 Struktur Proyek

```text
presensiku-app/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── keep-alive.yml
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── guru/
│   │   ├── murid/
│   │   ├── super-admin/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
├── supabase/
├── .env.example
├── .env.production.example
├── README.md
├── README.github.md
├── package.json
├── vercel.json
└── next.config.ts
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk kepentingan komersial maupun non-komersial.
