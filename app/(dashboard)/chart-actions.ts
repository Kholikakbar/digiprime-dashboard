'use server'

import { createClient } from '@/lib/supabase/server'

export type TimeRange = '7d' | '30d' | '1y'

export async function getRevenueData(range: TimeRange) {
    const supabase = await createClient()

    const formatDateKey = (date: Date) => {
        // More robust way to get WIB date parts
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(date);

        const year = parts.find(p => p.type === 'year')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const day = parts.find(p => p.type === 'day')?.value;
        return `${year}-${month}-${day}`;
    }

    const formatMonthKey = (date: Date) => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit'
        }).formatToParts(date);

        const year = parts.find(p => p.type === 'year')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        return `${year}-${month}`;
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
    // Include product type to assign consistent colors
    const { data } = await supabase
        .from('orders')
        .select('quantity, products(name, type)')
        .eq('status', 'COMPLETED')

    const map = new Map<string, { value: number, type: string }>()

    data?.forEach((order: any) => {
        const name = order.products?.name || 'Unknown'
        const type = order.products?.type || 'UNKNOWN'
        // FIX: Handle null/undefined quantity - default to 1
        const qty = Number(order.quantity) || 1

        if (!map.has(name)) {
            map.set(name, { value: 0, type })
        }
        const current = map.get(name)!
        current.value += qty
    })

    // Transform to chart data with fixed colors per type
    // CREDIT = Blue (#0ea5e9), ACCOUNT = Pink (#d946ef)
    const colorMap: Record<string, string> = {
        'CREDIT': '#0ea5e9',   // Blue
        'ACCOUNT': '#d946ef',  // Pink/Magenta
        'UNKNOWN': '#8b5cf6'   // Violet (fallback)
    }

    return Array.from(map)
        .map(([name, data]) => ({
            name,
            value: data.value,
            fill: colorMap[data.type] || '#8b5cf6'
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5
}

export async function getOrderStatusData() {
    const supabase = await createClient()

    // Fetch all orders with their status
    const { data } = await supabase
        .from('orders')
        .select('status')

    // Group by status
    const statusMap = new Map<string, number>()
    // Initialize standard statuses to ensure consistent colors/order
    statusMap.set('PENDING', 0)
    statusMap.set('PROCESSING', 0)
    statusMap.set('COMPLETED', 0)
    statusMap.set('CANCELLED', 0)

    data?.forEach((order: any) => {
        const status = (order.status || '').toUpperCase()
        if (statusMap.has(status)) {
            statusMap.set(status, (statusMap.get(status) || 0) + 1)
        }
    })

    const chartData = [
        { name: 'Pending', value: statusMap.get('PENDING') || 0, fill: '#f59e0b' },    // Amber
        { name: 'Processing', value: statusMap.get('PROCESSING') || 0, fill: '#3b82f6' }, // Blue
        { name: 'Completed', value: statusMap.get('COMPLETED') || 0, fill: '#10b981' }, // Emerald
        { name: 'Cancelled', value: statusMap.get('CANCELLED') || 0, fill: '#ef4444' }  // Red
    ]

    // Return only statuses that have values or keep all for consistency? 
    // Keeping all for a nice bar chart comparison.
    return chartData
}
