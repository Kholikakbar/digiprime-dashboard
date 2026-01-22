'use server'

import { createClient } from '@/lib/supabase/server'

export type TimeRange = '7d' | '30d' | '1y'

export async function getRevenueData(range: TimeRange) {
    const supabase = await createClient()
    const now = new Date()
    let startDate = new Date()

    if (range === '7d') {
        startDate.setDate(now.getDate() - 7)
    } else if (range === '30d') {
        startDate.setDate(now.getDate() - 30)
    } else if (range === '1y') {
        startDate.setFullYear(now.getFullYear() - 1)
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('total_price, order_date')
        .eq('status', 'COMPLETED')
        .gte('order_date', startDate.toISOString())
        .order('order_date', { ascending: true })

    if (!orders) return []

    // Grouping logic
    const dataMap = new Map<string, number>()

    // Initialize map based on range to ensure continuous line
    if (range === '7d' || range === '30d') {
        const days = range === '7d' ? 7 : 30
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
            dataMap.set(key, 0)
        }
    } else {
        // For 1 year, group by Month
        for (let i = 11; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit', timeZone: 'Asia/Jakarta' })
            dataMap.set(key, 0)
        }
    }

    orders.forEach(order => {
        const d = new Date(order.order_date)
        let key = ''
        if (range === '1y') {
            key = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit', timeZone: 'Asia/Jakarta' })
        } else {
            key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
        }

        if (dataMap.has(key)) {
            dataMap.set(key, (dataMap.get(key) || 0) + Number(order.total_price))
        } else if (range !== '7d' && range !== '30d') {
            // specific handling if map init didn't cover exact date logic or timezone drift
            // but for simplicty, allow accumulating if key matches format
            dataMap.set(key, (dataMap.get(key) || 0) + Number(order.total_price))
        }
    })

    return Array.from(dataMap).map(([date, revenue]) => ({ date, revenue }))
}

export async function getStockStatusData() {
    const supabase = await createClient()

    // Get counts
    const { count: accountsAvailable } = await supabase.from('stock_accounts').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE')
    const { count: accountsSold } = await supabase.from('stock_accounts').select('*', { count: 'exact', head: true }).eq('status', 'SOLD')
    const { count: accountsReserved } = await supabase.from('stock_accounts').select('*', { count: 'exact', head: true }).eq('status', 'RESERVED')

    const { count: creditsAvailable } = await supabase.from('stock_credits').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE')
    const { count: creditsSold } = await supabase.from('stock_credits').select('*', { count: 'exact', head: true }).eq('status', 'SOLD')

    // Aggregate
    const available = (accountsAvailable || 0) + (creditsAvailable || 0)
    const sold = (accountsSold || 0) + (creditsSold || 0)
    const issue = (accountsReserved || 0) // Treat Reserved as "Issue" or potential issue for now, or just use 0 if "Issue" means something else.

    return [
        { name: 'Available', value: available, fill: '#10b981' }, // Green
        { name: 'Sold', value: sold, fill: '#f59e0b' },      // Amber/Orange
        { name: 'Issue', value: issue, fill: '#ef4444' }      // Red
    ]
}

export async function getProductDistributionData() {
    const supabase = await createClient()

    // Get order counts by product for Completed orders
    // Since we don't have a direct aggregation query in Supabase client without Views or RPC,
    // we fetch fields and aggregate in JS. For larger apps, use RPC.
    const { data } = await supabase
        .from('orders')
        .select('quantity, products(name)')
        .eq('status', 'COMPLETED')

    const map = new Map<string, number>()

    data?.forEach((order: any) => {
        const name = order.products?.name || 'Unknown'
        map.set(name, (map.get(name) || 0) + order.quantity)
    })

    // Transform to chart data
    return Array.from(map)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5
}
