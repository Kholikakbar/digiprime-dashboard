// Content Script - Runs on Shopee Seller Centre pages
const DASHBOARD_URL = 'https://digiprime-dashboard.vercel.app/api/shopee/sync';

// Add sync button to page
function addSyncButton() {
    if (document.getElementById('digiprime-sync-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'digiprime-sync-btn';
    btn.innerHTML = '🚀 Sync to DigiPrime';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        padding: 14px 28px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: bold;
        font-size: 15px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.5);
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'scale(1.05) translateY(-2px)';
        btn.style.boxShadow = '0 6px 25px rgba(255, 107, 53, 0.7)';
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'scale(1) translateY(0)';
        btn.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.5)';
    });

    btn.addEventListener('click', syncOrders);

    document.body.appendChild(btn);
    console.log('✅ DigiPrime Sync button added!');
}

// Extract orders from page
function extractOrders() {
    const orders = [];

    // Get all text content
    const bodyText = document.body.innerText;

    // Find order numbers (pattern: alphanumeric 10+ chars)
    const orderMatches = bodyText.matchAll(/\b([A-Z0-9]{10,})\b/g);
    const orderSNs = new Set();

    for (const match of orderMatches) {
        orderSNs.add(match[1]);
    }

    // For each unique order SN, try to extract details
    orderSNs.forEach((sn, idx) => {
        // Find price near this order number
        const priceRegex = new RegExp(`${sn}[\\s\\S]{0,200}Rp\\s*([\\d.,]+)`, 'i');
        const priceMatch = bodyText.match(priceRegex);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/[.,]/g, '')) : 0;

        orders.push({
            order_sn: sn,
            buyer_name: `Buyer-${idx + 1}`,
            item_name: 'Produk Shopee',
            order_status: 'PENDING',
            total_amount: price,
            quantity: 1,
            create_time: Math.floor(Date.now() / 1000)
        });
    });

    return orders.slice(0, 50); // Limit to 50 orders
}

// Sync orders to dashboard
async function syncOrders() {
    const btn = document.getElementById('digiprime-sync-btn');
    btn.innerHTML = '⏳ Syncing...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
        const orders = extractOrders();

        if (orders.length === 0) {
            alert('⚠️ Tidak ada pesanan yang terdeteksi.\n\nPastikan Anda berada di halaman "Pesanan Saya".');
            return;
        }

        console.log('📦 Sending orders:', orders);

        const response = await fetch(DASHBOARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders })
        });

        const result = await response.json();
        console.log('✅ Sync result:', result);

        if (response.ok) {
            alert(`✅ Sinkronisasi Berhasil!\n\n` +
                `• Tersinkron: ${result.stats.synced}\n` +
                `• Dilewati: ${result.stats.skipped}\n` +
                `• Gagal: ${result.stats.failed}`);
        } else {
            throw new Error(result.error || 'Sync failed');
        }

    } catch (error) {
        console.error('❌ Sync error:', error);
        alert('❌ Gagal sync ke Dashboard.\n\nCek koneksi internet Anda.');
    } finally {
        btn.innerHTML = '🚀 Sync to DigiPrime';
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// Initialize
setTimeout(addSyncButton, 2000);
setInterval(addSyncButton, 5000); // Re-add if removed by page updates
