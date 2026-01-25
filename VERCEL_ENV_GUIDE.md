# Cara Set API Key di Vercel

Karena file `.env` bersifat rahasia dan tidak di-push ke GitHub, Anda perlu memasukkan API Key secara manual di Vercel agar Chatbot AI bisa berjalan di versi live (online).

## Langkah-langkah:

1.  **Buka Vercel Dashboard**
    *   Login ke [vercel.com](https://vercel.com)
    *   Pilih project aplikasi anda (misal: `digiprime-dashboard`)

2.  **Masuk ke Settings**
    *   Klik tab **"Settings"** di bagian atas menu project.
    *   Di menu sebelah kiri, pilih **"Environment Variables"**.

3.  **Tambahkan Variable Baru**
    *   Isi kolom **Key** dengan:
        `GOOGLE_AI_API_KEY`
    *   Isi kolom **Value** dengan API Key Anda:
        `AIzaSyAawjCE0zn3WjQsBW1pvfemNFJFpfnNFrs`
    *   Centang semua pilihan (Production, Preview, Development).
    *   Klik tombol **"Add"** atau **"Save"**.

4.  **Redeploy (Wajib)**
    *   Agar perubahan environment variable ini terbaca, Anda harus melakukan redeploy.
    *   Pergi ke tab **"Deployments"**.
    *   Klik tombol titik tiga (`...`) di deployment paling atas (yang statusnya Ready).
    *   Pilih **"Redeploy"**.
    *   Klik **"Redeploy"** lagi pada konfirmasi.

5.  **Selesai!**
    *   Tunggu proses build selesai (biasanya 1-2 menit).
    *   Setelah selesai, Chatbot AI di website live Anda akan mulai berfungsi dengan "otak" barunya! 🚀
