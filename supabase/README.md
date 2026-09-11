# Supabase setup untuk Presensiku

Panduan cepat untuk menyiapkan project Supabase dan menghubungkannya dengan aplikasi ini.

## 1. Buat project Supabase

1. Buka https://supabase.com
2. Buat project baru
3. Catat nilai berikut dari dashboard project Anda:
   - Project URL
   - anon key
   - service role key

## 2. Siapkan environment variables

Salin file `.env.example` menjadi `.env.local` lalu isi nilai:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Jika Anda ingin setup production, juga dapat menyalin `.env.production.example` ke `.env.production` atau mengisi variabel di panel hosting.

## 3. Jalankan schema SQL

1. Buka SQL Editor di dashboard Supabase
2. Copy isi `supabase/schema.sql`
3. Jalankan SQL tersebut

Schema ini akan membuat tabel:
- `profiles`
- `classes`
- `students`
- `attendance_logs`

## 4. Seed data awal

Setelah schema berhasil dibuat, jalankan endpoint seed untuk membuat data awal:

```bash
curl -X POST http://localhost:3000/api/seed
```

Atau buka endpoint tersebut lewat browser saat development server berjalan.

## 5. Login dengan Supabase Auth

Apabila Anda ingin memakai Auth real:

1. Aktifkan email/password auth di Supabase
2. Buat user lewat Supabase Auth
3. Pastikan `user_metadata.role` dan `user_metadata.full_name` terisi
4. Jalankan login dari halaman `/login`

## 6. Verifikasi live setup

Untuk memeriksa apakah konfigurasi Supabase berfungsi:

```bash
curl http://localhost:3000/api/health
```

Hasil response akan menunjukkan:
- `supabaseConfigured`
- `serviceRoleConfigured`
- `demoMode`

## 7. Catatan penting

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dipakai oleh frontend
- `SUPABASE_SERVICE_ROLE_KEY` dipakai untuk kebutuhan admin/server-side
- Saat env belum tersedia, aplikasi tetap aman karena sudah memiliki fallback ke mock data
