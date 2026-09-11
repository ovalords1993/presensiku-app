# 🏫 Presensiku

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%26%20R2-F38020?style=for-the-badge&logo=cloudflare)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%26%20Auth-3FCF8E?style=for-the-badge&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Presensiku adalah aplikasi presensi sekolah berbasis Next.js yang sudah mencakup dashboard multi-role, integrasi Supabase, API attendance, dan UI login serta presensi manual yang siap dikembangkan lebih lanjut.

## Status proyek saat ini

- ✅ Dashboard `admin`, `guru`, `murid`, dan `super-admin`
- ✅ Login demo dengan session berbasis localStorage
- ✅ Integrasi Supabase live dengan fallback mock data
- ✅ API `attendance`, `students`, `health`, dan `seed`
- ✅ Fitur presensi manual dan approval izin di dashboard admin
- ✅ Manifest PWA, icon, dan konfigurasi deployment Vercel
- ⚠️ Fitur lanjutan seperti multi-tenant routing penuh, push notification, geofencing, dan billing SaaS masih dalam roadmap

## Deployment

Proyek ini menggunakan kombinasi layanan berikut:

- **Vercel** sebagai hosting utama aplikasi Next.js
- **Supabase** untuk database, auth, dan data live
- **Cloudflare** untuk layanan pendukung seperti R2, Workers, Turnstile, DNS, dan edge features

> Catatan penting: meskipun deploy utama aplikasi dilakukan di Vercel, Anda tetap menggunakan Cloudflare untuk kebutuhan tambahan seperti storage, keamanan, dan layanan edge. Jadi, Vercel dan Cloudflare bekerja secara bersamaan, bukan saling menggantikan.

### Langkah deploy ke Vercel

1. Pastikan repository sudah terkoneksi ke GitHub.
2. Masuk ke dashboard Vercel, lalu pilih **Add New Project**.
3. Import repository `presensiku-app`.
4. Pada konfigurasi project, pilih:
   - Framework Preset: `Next.js`
   - Root Directory: `presensiku-app`
5. Tambahkan environment variables sesuai `.env.example` atau `.env.production.example`.
6. Jalankan deploy.
7. Setelah deploy selesai, gunakan domain yang diberikan Vercel untuk mengakses aplikasi.

### Environment variables yang perlu diatur di Vercel

Gunakan variabel berikut secara lengkap dari file `.env.example` atau `.env.production.example`:

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SAAS_DOMAIN=presensiku.app
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Peran Cloudflare di arsitektur ini

Cloudflare tetap dipakai untuk:

- **R2 Storage** untuk foto selfie dan dokumen
- **Workers** untuk logic edge / API pendukung
- **Turnstile** untuk proteksi bot pada form login atau submit
- **DNS / CDN / caching** untuk performa tambahan

### Deployment checklist

- [ ] Repository sudah terhubung ke Vercel
- [ ] Semua environment variables sudah diisi
- [ ] Supabase URL dan keys sudah benar
- [ ] Cloudflare R2 / Turnstile sudah dikonfigurasi bila dipakai
- [ ] Build berhasil dan preview domain aktif

### Deployment rekomendasi

Untuk saat ini, gunakan arsitektur berikut:

- **Vercel** = aplikasi utama
- **Supabase** = database dan auth
- **Cloudflare** = storage, edge, dan keamanan pendukung

Dengan pola ini, Anda tetap mendapatkan deploy yang cepat di Vercel tanpa meninggalkan manfaat Cloudflare.

## Fitur utama

- Multi-role dashboard untuk admin, guru, murid, dan super admin
- Login dengan akun demo dan route yang otomatis sesuai role
- Data source otomatis: live Supabase atau mock fallback
- API attendance dan student data
- Panel approval izin dan input presensi manual
- PWA support dengan manifest dan icon

## Tech stack

- Next.js 16.3.4
- React 19
- Supabase
- Tailwind CSS
- Vercel
- Cloudflare R2 / Workers / Turnstile

## Instalasi lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Akses aplikasi di `http://localhost:3000`.

## Environment variables

Buat file `.env.local` dengan referensi dari `.env.example`.

Contoh minimal:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Struktur proyek

```text
presensiku-app/
├── src/
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

## Roadmap

- Multi-tenant routing per sekolah
- Real-time push notification ke orang tua
- Selfie + geofencing verification
- Billing dan tenant management
- Audit trail dan monitoring lebih lengkap

## Lisensi

Proyek ini dilisensikan di bawah MIT License.
