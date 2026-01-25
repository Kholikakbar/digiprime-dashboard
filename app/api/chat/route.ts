'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Get store analytics for AI context
async function getStoreAnalytics() {
    const supabase = await createClient()

    // Get total revenue (all completed orders)
    const { data: completedOrders } = await supabase
        .from('orders')
        .select('total_price, order_date, products(name)')
        .eq('status', 'COMPLETED')

    const totalRevenue = completedOrders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0

    // Get order counts by status
    const { data: allOrders } = await supabase.from('orders').select('status')
    const pendingCount = allOrders?.filter(o => o.status === 'PENDING').length || 0
    const completedCount = allOrders?.filter(o => o.status === 'COMPLETED').length || 0

    // Get stock counts
    const { count: accountStock } = await supabase
        .from('stock_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE')

    const { count: creditStock } = await supabase
        .from('stock_credits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE')

    // Get expenses from ledger
    const { data: expenses } = await supabase
        .from('financial_ledger')
        .select('amount, category')
        .eq('transaction_type', 'EXPENSE')

    const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    // Get top products
    const productSales: Record<string, number> = {}
    completedOrders?.forEach((order: any) => {
        const name = order.products?.name || 'Unknown'
        productSales[name] = (productSales[name] || 0) + 1
    })

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => `${name}: ${count} terjual`)

    // Calculate profit
    const netProfit = totalRevenue - totalExpenses

    return {
        totalRevenue,
        totalExpenses,
        netProfit,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        accountStock: accountStock || 0,
        creditStock: creditStock || 0,
        topProducts
    }
}

// Build system prompt with store context
function buildSystemPrompt(analytics: any) {
    return `Kamu adalah AI Asisten Bisnis untuk toko digital "DigiPrime" di Shopee. Tugasmu adalah menganalisis data toko dan memberikan saran bisnis yang actionable.

DATA TOKO SAAT INI:
- Total Pendapatan: Rp ${analytics.totalRevenue.toLocaleString('id-ID')}
- Total Pengeluaran: Rp ${analytics.totalExpenses.toLocaleString('id-ID')}
- Laba Bersih: Rp ${analytics.netProfit.toLocaleString('id-ID')}
- Order Pending: ${analytics.pendingOrders}
- Order Selesai: ${analytics.completedOrders}
- Stok Akun Tersedia: ${analytics.accountStock} unit
- Stok Kredit Tersedia: ${analytics.creditStock} unit
- Produk Terlaris: ${analytics.topProducts.length > 0 ? analytics.topProducts.join(', ') : 'Belum ada data'}

PANDUAN RESPON:
1. Jawab dalam Bahasa Indonesia yang friendly dan profesional
2. Berikan analisis yang spesifik berdasarkan data di atas
3. Saran harus konkret dan bisa langsung diterapkan
4. Gunakan emoji untuk membuat respon lebih menarik
5. Jika ditanya tentang data spesifik, kutip angka dari data di atas
6. Fokus pada: optimasi penjualan, manajemen stok, efisiensi pengeluaran, dan strategi marketing

Kamu siap membantu pemilik toko mengembangkan bisnisnya!`
}

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
        }

        // Get store analytics for context
        const analytics = await getStoreAnalytics()
        const systemPrompt = buildSystemPrompt(analytics)

        // Check if API key is configured
        const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY

        if (!apiKey) {
            // Demo mode - return helpful template responses
            const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

            let response = ''

            if (lastMessage.includes('pendapatan') || lastMessage.includes('revenue') || lastMessage.includes('omset')) {
                response = `📊 **Analisis Pendapatan Toko**

Total pendapatan saat ini: **Rp ${analytics.totalRevenue.toLocaleString('id-ID')}**
Laba bersih setelah pengeluaran: **Rp ${analytics.netProfit.toLocaleString('id-ID')}**

💡 **Saran untuk meningkatkan pendapatan:**
1. Tingkatkan iklan Shopee untuk produk terlaris
2. Buat bundle produk untuk meningkatkan nilai order
3. Manfaatkan fitur Flash Sale Shopee
4. Respon chat pembeli lebih cepat untuk meningkatkan conversion`
            } else if (lastMessage.includes('stok') || lastMessage.includes('stock') || lastMessage.includes('inventory')) {
                response = `📦 **Status Stok Anda**

Stok Akun tersedia: **${analytics.accountStock} unit**
Stok Kredit tersedia: **${analytics.creditStock} unit**

${analytics.accountStock < 5 || analytics.creditStock < 5 ? '⚠️ **Perhatian:** Stok Anda menipis! Segera restock untuk menghindari kehabisan.' : '✅ Stok Anda masih aman.'}

💡 **Saran manajemen stok:**
1. Monitor stok harian untuk antisipasi lonjakan order
2. Siapkan supplier cadangan
3. Gunakan fitur "Pre-order" jika stok habis`
            } else if (lastMessage.includes('order') || lastMessage.includes('pesanan')) {
                response = `🛒 **Status Order Anda**

Order pending: **${analytics.pendingOrders}**
Order selesai: **${analytics.completedOrders}**

${analytics.pendingOrders > 5 ? '⚠️ Banyak order pending! Prioritaskan pemrosesan segera.' : '✅ Order terkelola dengan baik.'}

💡 **Tips pemrosesan order:**
1. Proses order dalam 1x24 jam untuk rating bagus
2. Kirim pesan follow-up setelah order selesai
3. Minta review dari pembeli yang puas`
            } else if (lastMessage.includes('pengeluaran') || lastMessage.includes('expense') || lastMessage.includes('biaya')) {
                response = `💸 **Analisis Pengeluaran**

Total pengeluaran: **Rp ${analytics.totalExpenses.toLocaleString('id-ID')}**
Rasio pengeluaran vs pendapatan: **${analytics.totalRevenue > 0 ? ((analytics.totalExpenses / analytics.totalRevenue) * 100).toFixed(1) : 0}%**

${(analytics.totalExpenses / analytics.totalRevenue) > 0.3 ? '⚠️ Rasio pengeluaran cukup tinggi. Pertimbangkan optimasi.' : '✅ Pengeluaran terkontrol dengan baik.'}

💡 **Saran efisiensi:**
1. Evaluasi ROI iklan Shopee secara berkala
2. Negosiasi harga dengan supplier
3. Hindari pengeluaran tidak penting`
            } else if (lastMessage.includes('saran') || lastMessage.includes('tips') || lastMessage.includes('rekomendasi') || lastMessage.includes('strategi')) {
                response = `🚀 **Rekomendasi Strategi Bisnis**

Berdasarkan data toko Anda, berikut saran utama saya:

1. **Fokus Produk Terlaris**
   ${analytics.topProducts.length > 0 ? `Produk: ${analytics.topProducts[0]} adalah yang paling laris. Tingkatkan stok dan promosi!` : 'Mulai dengan produk yang paling diminati pasar.'}

2. **Optimasi Margin**
   Laba bersih: Rp ${analytics.netProfit.toLocaleString('id-ID')}
   ${analytics.netProfit < 0 ? '⚠️ Bisnis masih rugi. Review harga jual dan kurangi pengeluaran.' : 'Bagus! Pertahankan dan tingkatkan margin.'}

3. **Manajemen Order**
   ${analytics.pendingOrders > 0 ? `Ada ${analytics.pendingOrders} order pending. Prioritaskan penyelesaian!` : 'Semua order sudah terselesaikan. Mantap!'}

4. **Persiapan Stok**
   Total stok: ${analytics.accountStock + analytics.creditStock} unit
   ${(analytics.accountStock + analytics.creditStock) < 10 ? 'Stok menipis, segera restock!' : 'Stok mencukupi.'}

Ada yang ingin Anda tanyakan lebih detail? 😊`
            } else {
                response = `👋 Halo! Saya AI Asisten DigiPrime.

Saya sudah menganalisis data toko Anda:
- 💰 Revenue: Rp ${analytics.totalRevenue.toLocaleString('id-ID')}
- 📦 Order selesai: ${analytics.completedOrders}
- 🏪 Stok tersedia: ${analytics.accountStock + analytics.creditStock} unit

Apa yang ingin Anda ketahui? Anda bisa tanya tentang:
• Analisis pendapatan
• Status stok
• Review order
• Pengeluaran & efisiensi
• Saran strategi bisnis

Ketik pertanyaan Anda! 😊`
            }

            return NextResponse.json({
                message: response,
                mode: 'demo'
            })
        }

        // If Google AI key is available, use Gemini Pro (Stable)
        if (process.env.GOOGLE_AI_API_KEY) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: systemPrompt }] },
                            { role: 'model', parts: [{ text: 'Siap! Saya AI Asisten DigiPrime. Saya sudah menganalisis data toko dan siap membantu Anda. Ada yang bisa saya bantu?' }] },
                            ...messages.map((m: any) => ({
                                role: m.role === 'assistant' ? 'model' : 'user',
                                parts: [{ text: m.content }]
                            }))
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024
                        }
                    })
                }
            )

            const data = await response.json()

            // Better Error Handling
            if (data.error) {
                console.error('Gemini API Error:', data.error)
                return NextResponse.json({
                    message: `⚠️ Google AI Error: ${data.error.message || 'Unknown error'}`,
                    mode: 'gemini-error'
                })
            }

            const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text

            if (!aiMessage) {
                return NextResponse.json({
                    message: '⚠️ AI tidak memberikan respon. Coba pertanyaan lain.',
                    mode: 'gemini-empty'
                })
            }

            return NextResponse.json({ message: aiMessage, mode: 'gemini' })
        }

        // If OpenAI key is available
        if (process.env.OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            })

            const data = await response.json()
            const aiMessage = data.choices?.[0]?.message?.content || 'Maaf, terjadi kesalahan.'

            return NextResponse.json({ message: aiMessage, mode: 'openai' })
        }

        return NextResponse.json({ error: 'No AI API key configured' }, { status: 500 })

    } catch (error) {
        console.error('Chat API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
