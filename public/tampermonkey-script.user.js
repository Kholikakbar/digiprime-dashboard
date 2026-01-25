// ==UserScript==
// @name         DigiPrime Shopee Auto Sync
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically sync Shopee orders to DigiPrime Dashboard
// @author       DigiPrime
// @match        https://seller.shopee.co.id/*
// @grant        GM_xmlhttpRequest
// @connect      digiprime-dashboard.vercel.app
// ==/UserScript==

(function () {
    'use strict';

    const DASHBOARD_URL = 'https://digiprime-dashboard.vercel.app/api/shopee/sync';

    // Add Sync Button to Shopee UI
    function addSyncButton() {
        // Check if button already exists
        if (document.getElementById('digiprime-sync-btn')) return;

        // Create button
        const btn = document.createElement('button');
        btn.id = 'digiprime-sync-btn';
        btn.innerHTML = '🚀 Sync to DigiPrime';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            transition: all 0.3s ease;
        `;

        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.6)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
        };

        btn.onclick = syncOrders;

        document.body.appendChild(btn);
        console.log('✅ DigiPrime Sync button added!');
    }

    // Extract order data from page
    function extractOrders() {
        const orders = [];

        // Try to find order elements (this selector might need adjustment based on Shopee's current HTML structure)
        const orderRows = document.querySelectorAll('[class*="order-item"], [class*="order-card"], tr[class*="order"]');

        console.log(`Found ${orderRows.length} potential order elements`);

        orderRows.forEach((row, idx) => {
            try {
                const text = row.innerText || row.textContent || '';

                // Extract Order SN (usually starts with numbers/letters)
                const snMatch = text.match(/\b([A-Z0-9]{10,})\b/);
                if (!snMatch) return;

                const orderSN = snMatch[1];

                // Extract price (Rp format)
                const priceMatch = text.match(/Rp\s*([\d.,]+)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/[.,]/g, '')) : 0;

                // Extract buyer name (heuristic: look for username-like patterns)
                const buyerMatch = text.match(/([a-z0-9_]{3,20})/i);
                const buyer = buyerMatch ? buyerMatch[1] : `Buyer-${idx}`;

                // Determine status
                let status = 'PENDING';
                if (text.includes('Selesai') || text.includes('Completed')) status = 'COMPLETED';
                if (text.includes('Batal') || text.includes('Cancelled')) status = 'CANCELLED';

                orders.push({
                    order_sn: orderSN,
                    buyer_name: buyer,
                    item_name: 'Produk Shopee',
                    order_status: status,
                    total_amount: price,
                    quantity: 1,
                    create_time: Math.floor(Date.now() / 1000)
                });

            } catch (e) {
                console.warn('Failed to parse order:', e);
            }
        });

        return orders;
    }

    // Sync orders to dashboard
    function syncOrders() {
        const btn = document.getElementById('digiprime-sync-btn');
        btn.innerHTML = '⏳ Syncing...';
        btn.disabled = true;

        const orders = extractOrders();

        if (orders.length === 0) {
            alert('⚠️ Tidak ada pesanan yang terdeteksi di halaman ini.\n\nPastikan Anda berada di halaman "Pesanan Saya" dan ada pesanan yang ditampilkan.');
            btn.innerHTML = '🚀 Sync to DigiPrime';
            btn.disabled = false;
            return;
        }

        console.log('📦 Sending orders:', orders);

        GM_xmlhttpRequest({
            method: 'POST',
            url: DASHBOARD_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ orders: orders }),
            onload: function (response) {
                try {
                    const result = JSON.parse(response.responseText);
                    console.log('✅ Sync result:', result);

                    alert(`✅ Sinkronisasi Berhasil!\n\n` +
                        `• Tersinkron: ${result.stats.synced}\n` +
                        `• Dilewati: ${result.stats.skipped}\n` +
                        `• Gagal: ${result.stats.failed}`);

                } catch (e) {
                    alert('⚠️ Sync berhasil tapi response tidak valid.');
                }

                btn.innerHTML = '🚀 Sync to DigiPrime';
                btn.disabled = false;
            },
            onerror: function (error) {
                console.error('❌ Sync failed:', error);
                alert('❌ Gagal terhubung ke Dashboard.\n\nCek koneksi internet Anda.');
                btn.innerHTML = '🚀 Sync to DigiPrime';
                btn.disabled = false;
            }
        });
    }

    // Initialize
    setTimeout(addSyncButton, 2000); // Wait for page to load

    // Re-add button if page changes (SPA navigation)
    setInterval(addSyncButton, 5000);

})();
