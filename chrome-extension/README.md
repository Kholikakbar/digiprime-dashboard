# DigiPrime Shopee Sync - Chrome Extension

Extension untuk sinkronisasi otomatis pesanan Shopee ke Dashboard DigiPrime.

## 📦 Cara Install

### Langkah 1: Download Extension
1. Download folder `chrome-extension` dari repository ini
2. Atau clone repository dan masuk ke folder `chrome-extension`

### Langkah 2: Install ke Chrome
1. Buka Chrome
2. Ketik di address bar: `chrome://extensions/`
3. Aktifkan **"Developer mode"** (toggle di pojok kanan atas)
4. Klik tombol **"Load unpacked"**
5. Pilih folder `chrome-extension` yang sudah di-download
6. Extension akan muncul di toolbar Chrome!

### Langkah 3: Gunakan Extension
1. Buka **Shopee Seller Centre** (https://seller.shopee.co.id)
2. Masuk ke halaman **"Pesanan Saya"**
3. Akan muncul tombol **"🚀 Sync to DigiPrime"** di pojok kanan bawah
4. **Klik tombol tersebut** untuk sync pesanan ke dashboard
5. Tunggu alert konfirmasi sukses!

## ✨ Fitur
- ✅ Tombol sync otomatis muncul di halaman Shopee
- ✅ Ekstraksi data pesanan otomatis
- ✅ Sinkronisasi ke dashboard dengan 1 klik
- ✅ Tidak ada CORS error
- ✅ Tidak perlu Console atau script manual

## 🔧 Troubleshooting

### Tombol tidak muncul?
1. Pastikan extension sudah terinstall dan aktif (cek di `chrome://extensions/`)
2. Refresh halaman Shopee
3. Buka Console (F12) dan cek apakah ada pesan error

### Sync gagal?
1. Cek koneksi internet
2. Pastikan URL dashboard benar: `https://digiprime-dashboard.vercel.app`
3. Lihat Console untuk detail error

## 📝 Notes
- Extension ini hanya berjalan di domain `seller.shopee.co.id`
- Data yang dikirim: Order SN, Buyer Name, Price, Status
- Tidak ada data yang disimpan di extension (langsung ke dashboard)

## 🚀 Update Extension
Jika ada update:
1. Download versi terbaru
2. Buka `chrome://extensions/`
3. Klik icon **reload** di card extension DigiPrime
4. Atau hapus extension lama dan install ulang

---

**Dibuat oleh DigiPrime Team** 🎉
