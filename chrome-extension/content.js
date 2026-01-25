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

// Extract orders from page (Smart Scraper Logic)
function extractOrders() {
    const orders = [];

    // Strategy: Find all elements containing "No. Pesanan" (Order SN)
    // This allows us to find the specific "Card" for each order
    const allDivs = document.querySelectorAll('div, span, p');
    const processedNodes = new Set(); // Prevent duplicates

    allDivs.forEach(el => {
        // Check if element has "No. Pesanan" text directly
        if (el.innerText && el.innerText.includes('No. Pesanan') && !processedNodes.has(el)) {

            // Try to find the parent container (The Order Card)
            // We traverse up 5 levels to find the comprehensive wrapper
            let card = el.parentElement;
            let foundCard = false;

            // Heuristic: The card usually contains the Product Name and Price too
            for (let i = 0; i < 6; i++) {
                if (!card) break;
                if (card.innerText.includes('Rp') || card.innerText.includes('Total')) {
                    foundCard = true;
                    break;
                }
                card = card.parentElement;
            }

            if (foundCard && card) {
                const text = card.innerText;

                // EXTRACT SN
                const snMatch = text.match(/No\.\s*Pesanan\s*([A-Z0-9]{10,})/i);
                if (!snMatch) return;
                const sn = snMatch[1];

                // Prevent duplicate scanning of the same card
                if (orders.find(o => o.order_sn === sn)) return;

                // EXTRACT PRICE
                const priceMatch = text.match(/Rp\s*([0-9.]+)/) || text.match(/Total\s*.*?([0-9.]+)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/\./g, '')) : 0;

                // EXTRACT STATUS
                // Priority: Check specific status keywords strictly
                let status = 'PENDING'; // Default fallback

                // 1. Check PROCESSING first (Perlu Dikirim)
                if (text.includes('Perlu diproses') || text.includes('Perlu Dikirim') || text.includes('Sedang Dikemas')) {
                    status = 'PROCESSING';
                }
                // 2. Check PENDING (Dikirim)
                else if (text.includes('Telah Dikirim') || text.includes('Sedang Dikirim') || text.includes('Dikirim')) {
                    status = 'PENDING';
                }
                // 3. Check COMPLETED (Selesai/Dinilai)
                else if (text.includes('Selesai') || text.includes('Telah Dinilai')) {
                    status = 'COMPLETED';
                }
                // 4. Check CANCELLED
                else if (text.includes('Batal') || text.includes('Pengajuan')) {
                    status = 'CANCELLED';
                }

                // EXTRACT BUYER
                // Buyer name is usually the first alphanumeric text in the card, or near "Chat"
                // Strategy: Find the text *immediately before* the word "Chat" inside the card header
                let buyer = "Shopee Buyer";
                const lines = text.split('\n');
                for (let line of lines) {
                    if (line.includes('Chat')) {
                        // Usually format is: "Username Chat"
                        const parts = line.split('Chat');
                        if (parts[0] && parts[0].trim().length > 2) {
                            buyer = parts[0].trim();
                            break;
                        }
                    }
                }

                // Fallback: simple username regex
                if (buyer === "Shopee Buyer") {
                    const userMatch = text.match(/^([a-zA-Z0-9_]{3,15})/m);
                    if (userMatch) buyer = userMatch[1];
                }

                // EXTRACT ITEM NAME
                // Strategy: Look for the longest text line that DOES NOT contain metadata
                let product = "Produk Shopee";
                let maxLen = 0;

                // Blacklist keywords that seem like UI elements, not product names
                const ignoreWords = [
                    'Variasi:', 'No. Pesanan', 'Total', 'Rp', 'Chat',
                    'Pesanan Saya', 'Daftar Pesanan', 'Manajemen', 'Produk',
                    'Semua', 'Perlu Dikirim', 'Dikirim', 'Selesai',
                    'Batalkan', 'Rincian', 'Penilaian', 'Hubungi',
                    'Jasa Kirim', 'Lacak', 'Paket', 'Hemat', 'Reguler'
                ];

                // Use DOM traversal for better product name accuracy
                const productEl = card.querySelector('a[href*="/product/"], .product-name, .item-name');
                if (productEl) {
                    product = productEl.innerText.trim();
                } else {
                    // Fallback: Text heuristic
                    for (let line of lines) {
                        const cleanLine = line.trim();

                        // Check against ignore list
                        const isIgnored = ignoreWords.some(word => cleanLine.includes(word));

                        // Heuristic: Product names are usually long (> 15 chars) but not a paragraph (< 150)
                        if (!isIgnored && cleanLine.length > 15 && cleanLine.length < 150) {
                            if (cleanLine.length > maxLen) {
                                maxLen = cleanLine.length;
                                product = cleanLine;
                            }
                        }
                    }
                }

                // Final cleanup for Buyer Name "Manajemen" false positive
                if (buyer === 'Manajemen' || buyer.includes('Pesanan')) {
                    buyer = "Shopee Buyer";
                }

                orders.push({
                    order_sn: sn,
                    buyer_name: buyer,
                    item_name: product,
                    order_status: status,
                    total_amount: price,
                    quantity: 1,
                    create_time: Math.floor(Date.now() / 1000)
                });

                processedNodes.add(el);
            }
        }
    });

    return orders;
}

// Sync orders to dashboard
async function syncOrders() {
    const btn = document.getElementById('digiprime-sync-btn');
    btn.innerHTML = '⏳ Extracting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
        const orders = extractOrders();

        if (orders.length === 0) {
            alert('⚠️ Tidak ada pesanan yang terdeteksi.\n\nPastikan Anda berada di halaman "Pesanan Saya".');
            return;
        }

        console.log('📦 Extracted orders:', orders);

        // Encode data into URL Hash (Cross-domain safe)
        const syncData = { orders };
        const encodedData = encodeURIComponent(JSON.stringify(syncData));

        // Open sync page with data in hash
        const targetUrl = 'https://digiprime-dashboard.vercel.app/sync#data=' + encodedData;
        window.open(targetUrl, '_blank');

        // Show success message
        setTimeout(() => {
            alert(`✅ Data ${orders.length} pesanan berhasil diekstrak!\n\nTab baru akan terbuka. Data sudah otomatis terisi.\nSilakan klik tombol "Sync Orders" di sana.`);
        }, 500);

    } catch (error) {
        console.error('❌ Extract error:', error);
        alert('❌ Gagal mengekstrak data pesanan.\n\nCoba refresh halaman dan ulangi.');
    } finally {
        btn.innerHTML = '🚀 Sync to DigiPrime';
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// Initialize
setTimeout(addSyncButton, 2000);
setInterval(addSyncButton, 5000); // Re-add if removed by page updates
