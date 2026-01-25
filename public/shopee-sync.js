/**
 * DIGIPRIME AUTO-SYNC SCRIPT
 * ==========================
 * Copy seluruh kode ini dan paste di Console Browser (F12) saat membuka Shopee Seller Centre > Pesanan Saya.
 */

(async function syncShopeeOrders() {

    // Konfigurasi URL - Ganti jika domain Anda berubah
    const DASHBOARD_URL = 'https://digiprime-dashboard.vercel.app/api/shopee/sync';

    console.clear();
    console.log("%c 🚀 MEMULAI SINKRONISASI DIGIPRIME...", "color: #ff5722; font-size: 16px; font-weight: bold;");

    // -------------------------------------------------------------
    // 1. Selector Mapping (Sesuaikan jika Shopee update tampilan)
    // -------------------------------------------------------------
    // Tips: Gunakan Inspect Element untuk mencari class yang tepat
    // Ini adalah tebakan selector berdasarkan layout umum Shopee
    // Karena class sering di-obfuscate (diacak), kita coba cari pola atribut

    function extractOrders() {
        const payload = [];

        // Cari semua container produk/order
        // Shopee biasanya pakai div yg punya atribut data-v-xxxx atau class grid
        // Opsi terbaik: cari elemen yang mengandung teks "No. Pesanan" dan traverse ke atas
        const allDivs = document.querySelectorAll('div');
        let orderContainers = [];

        // Strategi Pencarian Cerdas: Cari elemen baris order
        // Biasanya setiap baris order punya checkbox dan tombol aksi
        allDivs.forEach(div => {
            if (div.innerText && div.innerText.includes('No. Pesanan')) {
                // Ini kemungkinan header order, ambil parent-nya
                let parent = div.closest('.order-panel-header')?.parentElement || div.parentElement?.parentElement;
                if (parent && !orderContainers.includes(parent)) orderContainers.push(parent);
            }
        });

        console.log(`🔍 Mendeteksi ${orderContainers.length} potensi blok order...`);

        orderContainers.forEach((el, idx) => {
            try {
                const text = el.innerText || "";

                // PARSING MANUAL DARI TEKS (Lebih tahan banting drpd selector class)
                // Format teks biasanya: "No. Pesanan 230514U0G... \n Produk A \n Rp 50.000 ..."

                // 1. Ambil No Pesanan
                const snMatch = text.match(/No\.\s*Pesanan\s*([A-Z0-9]+)/i);
                if (!snMatch) return; // Bukan baris order valid
                const sn = snMatch[1];

                // 2. Ambil Nama User
                // Biasanya ada di dekat tombol chat
                const buyerMatch = text.match(/Chat\s+([a-zA-Z0-9_]+)/i) ||
                    text.match(/^([a-zA-Z0-9_]+)\s*Chat/m);
                const buyer = buyerMatch ? buyerMatch[1] : `Buyer-${idx}`;

                // 3. Ambil Harga
                // Cari format Rp10.000
                const priceMatch = text.match(/Rp\s*([0-9.]+)/i);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/\./g, '')) : 0;

                // 4. Ambil Status
                // Cek kata kunci status
                let status = "PENDING";
                if (text.includes("Selesai") || text.includes("Telah Dinilai")) status = "COMPLETED";
                if (text.includes("Batal")) status = "CANCELLED";
                if (text.includes("Perlu Dikirim") || text.includes("Sedang Dikirim")) status = "PENDING";

                // 5. Nama Produk (Ambil baris pertama yang panjang, asumsi nama produk)
                // Ini agak tricky, kita ambil string default dulu
                const product = "Produk Shopee (Auto)";

                payload.push({
                    order_sn: sn,
                    buyer_name: buyer,
                    item_name: product, // Nanti dicocokkan di backend
                    order_status: status,
                    total_amount: price,
                    quantity: 1,
                    create_time: Math.floor(Date.now() / 1000)
                });

            } catch (e) {
                console.warn("Skip per baris:", e);
            }
        });

        return payload;
    }

    // Eksekusi
    const orders = extractOrders();

    if (orders.length === 0) {
        console.log("%c ⚠️ Tidak ada data yang bisa diambil. Cek struktur halaman.", "color: red");
        alert("Gagal membaca data order. Pastikan Anda buka di tab 'Pesanan Saya'.");
        return;
    }

    console.log(`📦 Siap mengirim ${orders.length} pesanan...`);
    console.table(orders);

    // 2. Kirim ke Dashboard
    try {
        const res = await fetch(DASHBOARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders: orders })
        });

        const result = await res.json();

        if (res.ok) {
            console.log("%c ✅ SINKRONISASI SUKSES!", "color: green; font-size: 14px");
            console.log(result);
            alert(`✅ Sukses! ${result.stats.synced} Data baru/update masuk.`);
        } else {
            throw new Error(result.error || "Server Error");
        }

    } catch (err) {
        console.error("❌ Gagal Sync:", err);
        alert("Gagal kirim data ke Dashboard.");
    }

})();
