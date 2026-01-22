'use server'

import { createClient } from '@/lib/supabase/server'

export type TimeRange = '7d' | '30d' | '1y'

export async function getRevenueData(range: TimeRange) {
    const supabase = await createClient()

    // Helper to get Date object shifted to WIB (UTC+7)
    // We use this to reliably determine "YYYY-MM-DD" in Jakarta time
    const getWIBDate = (date: Date) => {
        // Create date from input, convert to Jakarta time string, then parse back
        const jakartaStr = date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
        return new Date(jakartaStr)
    }

    const formatDateKey = (date: Date) => {
        const d = getWIBDate(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const formatMonthKey = (date: Date) => {
        const d = getWIBDate(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    }

    const now = new Date()
    let startDate = new Date()

    if (range === '7d') {
        startDate.setDate(now.getDate() - 7)
    } else if (range === '30d') {
        startDate.setDate(now.getDate() - 30)
    } else if (range === '1y') {
        startDate.setFullYear(now.getFullYear() - 1)
    }

    // Set to beginning of the day in UTC for query safety, or calculate offset carefully.
    // Simplifying: just go back 1 extra day to be safe, then filter in JS
    startDate.setDate(startDate.getDate() - 1)

    const { data: orders } = await supabase
        .from('orders')
        .select('total_price, order_date')
        .eq('status', 'COMPLETED')
        .gte('order_date', startDate.toISOString())
        .order('order_date', { ascending: true })

    if (!orders) return []

    // Grouping logic using ISO Key (YYYY-MM-DD)
    const dataMap = new Map<string, number>()

    // Initialize map
    if (range === '1y') {
        for (let i = 11; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = formatMonthKey(d)
            dataMap.set(key, 0)
        }
    } else {
        const days = range === '7d' ? 7 : 30
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const key = formatDateKey(d)
            dataMap.set(key, 0)
        }
    }

    orders.forEach(order => {
        const d = new Date(order.order_date)
        let key = ''
        if (range === '1y') {
            key = formatMonthKey(d)
        } else {
            key = formatDateKey(d)
        }

        if (dataMap.has(key)) {
            dataMap.set(key, (dataMap.get(key) || 0) + Number(order.total_price))
        }
    })

    // Convert keys back to readable labels
    return Array.from(dataMap).map(([key, revenue]) => {
        let label = ''
        if (range === '1y') {
            // key is YYYY-MM
            const [y, m] = key.split('-')
            // Create date using UTC to avoid shift, then format
            const d = new Date(Number(y), Number(m) - 1, 1)
            label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        } else {
            // key is YYYY-MM-DD
            const [y, m, d] = key.split('-')
            const dateObj = new Date(Number(y), Number(m) - 1, Number(d))
            label = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }
        return {
            date: label,
            revenue
        }
    })
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
