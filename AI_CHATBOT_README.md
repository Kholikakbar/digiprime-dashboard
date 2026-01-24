# AI Chatbot Feature

## Fitur AI Business Assistant

AI Chatbot telah ditambahkan ke dashboard DigiPrime! Chatbot ini akan menganalisis data toko Anda secara real-time dan memberikan saran bisnis yang optimal.

### Fitur Utama:
- 📊 **Analisis Real-time**: Menganalisis revenue, orders, stock, dan expenses
- 💡 **Business Insights**: Memberikan saran strategis berdasarkan data
- 🤖 **AI-Powered**: Menggunakan Google AI (Gemini) atau OpenAI
- 🎯 **Contextual**: Memahami kondisi bisnis Anda saat ini
- 💬 **Conversational**: Chat natural dalam Bahasa Indonesia

### Mode Operasi:

#### 1. Demo Mode (Default - Tanpa API Key)
Chatbot akan bekerja dengan template responses yang cerdas berdasarkan data toko Anda. Cocok untuk testing dan development.

#### 2. AI Mode (Dengan API Key)
Untuk pengalaman AI yang lebih canggih, tambahkan API key:

**Google AI (Gemini) - GRATIS:**
1. Kunjungi: https://makersuite.google.com/app/apikey
2. Login dengan Google Account
3. Klik "Create API Key"
4. Copy API key
5. Tambahkan ke `.env.local`:
   ```
   GOOGLE_AI_API_KEY=your_api_key_here
   ```

**OpenAI (GPT) - Berbayar:**
1. Kunjungi: https://platform.openai.com/api-keys
2. Create API key
3. Tambahkan ke `.env.local`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Cara Menggunakan:

1. **Buka Dashboard** - Chatbot button muncul di pojok kanan bawah
2. **Klik Button** - Window chat akan terbuka
3. **Mulai Chat** - Tanya tentang:
   - Analisis pendapatan
   - Status stok
   - Review order
   - Pengeluaran & efisiensi
   - Saran strategi bisnis

### Contoh Pertanyaan:
- "Bagaimana performa toko saya?"
- "Berapa total pendapatan bulan ini?"
- "Produk apa yang paling laris?"
- "Apakah stok saya cukup?"
- "Berikan saran untuk meningkatkan penjualan"
- "Analisis pengeluaran saya"

### Data yang Dianalisis:
- Total Revenue (All-time)
- Total Expenses
- Net Profit
- Pending Orders
- Completed Orders
- Available Stock (Accounts & Credits)
- Top Selling Products
- Expense Categories

### Keamanan:
- API key disimpan di server-side (.env.local)
- Tidak ada data sensitif yang dikirim ke AI
- Hanya statistik agregat yang digunakan untuk context

### Troubleshooting:

**Chatbot tidak muncul?**
- Pastikan Anda sudah login
- Refresh halaman dashboard

**Error saat chat?**
- Cek koneksi internet
- Jika menggunakan API key, pastikan valid
- Cek console browser untuk error details

**Ingin mengubah behavior AI?**
- Edit system prompt di `app/api/chat/route.ts`
- Sesuaikan temperature dan max_tokens

---

Selamat menggunakan AI Business Assistant! 🚀
