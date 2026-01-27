'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers() {
    const supabase = await createClient()

    // Fetch all orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('buyer_username, total_price, status, order_date')
        .order('order_date', { ascending: false })

    if (error || !orders) return []

    // Group by buyer_username
    const customerMap = new Map<string, {
        username: string
        totalSpent: number
        orderCount: number
        lastOrder: string
        status: string // 'ACTIVE' | 'INACTIVE'
    }>()

    orders.forEach(order => {
        // Clean username (sometimes has formatting like [WARRANTY])
        let cleanName = order.buyer_username
        if (cleanName.includes('[WARRANTY]')) {
            cleanName = cleanName.split(')')[0].split('(')[0].replace('[WARRANTY]', '').trim()
        } else if (cleanName.includes('(Info:')) {
            cleanName = cleanName.split('(Info:')[0].trim()
        }

        if (!cleanName) return

        const current = customerMap.get(cleanName) || {
            username: cleanName,
            totalSpent: 0,
            orderCount: 0,
            lastOrder: order.order_date,
            status: 'ACTIVE'
        }

        if (order.status === 'COMPLETED') {
            current.totalSpent += Number(order.total_price)
        }

        current.orderCount += 1

        // Update last order if this one is newer (though we sorted desc, so first hit is newest usually)
        if (new Date(order.order_date) > new Date(current.lastOrder)) {
            current.lastOrder = order.order_date
        }

        customerMap.set(cleanName, current)
    })

    // Convert to array and sort by Order Count (Frequency) then Total Spent
    return Array.from(customerMap.values())
        .sort((a, b) => {
            if (b.orderCount === a.orderCount) {
                return b.totalSpent - a.totalSpent
            }
            return b.orderCount - a.orderCount
        })
        .slice(0, 50) // Top 50 customers
}

export async function getAdminUsers() {
    const supabase = await createClient()
    const { data: users } = await supabase.from('users').select('*')
    return users || []
}
