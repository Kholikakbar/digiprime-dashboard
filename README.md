# DigiPrime Admin Dashboard

Website dashboard admin untuk mengelola produk digital (Pipit AI Akun & Kredit) yang dijual di Shopee.

## Identitas Toko
- **Nama Toko**: DigiPrime
- **Platform**: Shopee
- **Produk**: Pipit AI (Akun & Kredit)

## Teknologi
- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel

## Fitur
1. **Authentication**: Login aman untuk Super Admin & Admin.
2. **Dashboard Overview**: Ringkasan penjualan dan stok real-time.
3. **Produk Management**: Pengelolaan jenis produk.
4. **Stok Management**: Manajemen inventaris akun dan kredit.
5. **Pesanan (Orders)**: Integrasi data pesanan Shopee.
6. **Distribusi**: Otomatisasi pengiriman produk digital.

## Setup Project

### 1. Prerequisites
- Node.js 18+
- Akun Supabase
- Akun Vercel

### 2. Instalasi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup Database
Jalankan script SQL yang ada di `supabase/schema.sql` pada SQL Editor di Dashboard Supabase Anda.
Script ini akan membuat tabel:
- `users`, `products`, `stock_accounts`, `stock_credits`, `orders`, `transactions`, `admin_logs`
- Mengaktifkan Row Level Security (RLS)

### 5. Menjalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) untuk mengakses dashboard.

## Struktur Project
- `app/`: Source code utama (App Router).
  - `(auth)`: Halaman login.
  - `(dashboard)`: Halaman utama dashboard (Overview, Products, Stocks, dll).
  - `api/`: API endpoints.
- `components/`: Komponen UI reusable (Tailwind).
- `lib/`: Helper functions (Supabase client).
- `supabase/`: SQL Schema.

## Deployment
Project ini siap dideploy ke Vercel:
1. Push code ke GitHub.
2. Import project di Vercel.
3. Masukkan Environment Variables (SUPABASE_URL, SUPABASE_ANON_KEY).
4. Deploy.

---
**DigiPrime Internal Tools**
