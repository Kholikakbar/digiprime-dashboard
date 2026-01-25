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
    return `Kamu adalah AI Asisten Bisnis untuk toko digital "DigiPrime".
DATA TOKO:
- Omset: Rp ${analytics.totalRevenue.toLocaleString('id-ID')}
- Profit: Rp ${analytics.netProfit.toLocaleString('id-ID')}
- Order Pending: ${analytics.pendingOrders}
- Order Selesai: ${analytics.completedOrders}
- Stok Akun: ${analytics.accountStock}
- Stok Kredit: ${analytics.creditStock}
- Produk Top: ${analytics.topProducts.join(', ')}

INSTRUKSI:
Jawab pertanyaan user berdasarkan data di atas. Berikan saran bisnis singkat, padat, dan gunakan emoji.`
}

// EMERGENCY FALLBACK RESPONSE (No AI Code)
function getFallbackResponse(message: string, analytics: any) {
    const lowerMsg = message.toLowerCase()

    if (lowerMsg.includes('pendapatan') || lowerMsg.includes('revenue') || lowerMsg.includes('omset')) {
        return `📊 **Info Pendapatan (Mode Offline)**\n\nTotal Omset: **Rp ${analytics.totalRevenue.toLocaleString('id-ID')}**\nProfit Bersih: **Rp ${analytics.netProfit.toLocaleString('id-ID')}**`
    }
    if (lowerMsg.includes('stok') || lowerMsg.includes('stock')) {
        return `📦 **Info Stok (Mode Offline)**\n\nAkun: **${analytics.accountStock}**\nKredit: **${analytics.creditStock}**\n${analytics.accountStock < 5 ? '⚠️ Stok Akun Menipis!' : '✅ Stok Aman'}`
    }
    return `👋 **Halo (Mode Offline)**\n\nSaya mendeteksi koneksi ke AI sedang gangguan, tapi ini data Anda saat ini:\n\n� Omset: Rp ${analytics.totalRevenue.toLocaleString('id-ID')}\n📦 Stok: ${analytics.accountStock + analytics.creditStock} Total\n🛒 Order Pending: ${analytics.pendingOrders}`
}

export async function POST(request: NextRequest) {
    let analyticsData;
    let fallbackMode = false;

    try {
        const { messages } = await request.json()
        const analytics = await getStoreAnalytics()
        analyticsData = analytics; // Save for fallback

        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json({ message: getFallbackResponse(messages[messages.length - 1].content, analytics), mode: 'demo-fallback' })
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY.trim()
        const systemPrompt = buildSystemPrompt(analytics)
        const userMessage = messages[messages.length - 1].content

        // TRY 1: GEMINI 1.5 FLASH (Standard)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + userMessage }] }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
                })
            }
        )

        const data = await response.json()

        if (data.error) {
            console.error("AI Error:", data.error)
            // Fallback to manual logic if AI fails
            return NextResponse.json({
                message: getFallbackResponse(userMessage, analytics) + `\n\n*(Info Teknis: Google AI Error - ${data.error.message})*`,
                mode: 'fallback-error'
            })
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!aiText) {
            return NextResponse.json({
                message: getFallbackResponse(userMessage, analytics) + `\n\n*(Info Teknis: Empty Response from AI)*`,
                mode: 'fallback-empty'
            })
        }

        return NextResponse.json({ message: aiText, mode: 'gemini-1.5-flash' })

    } catch (error: any) {
        console.error('Server Error:', error)
        // Ultimate fallback
        return NextResponse.json({
            message: analyticsData
                ? getFallbackResponse('halo', analyticsData) + `\n\n*(Sistem Error: ${error.message})*`
                : "⚠️ Sistem sedang gangguan total. Coba refresh halaman.",
            mode: 'server-error'
        })
    }
}
