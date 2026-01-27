'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers() {
    const supabase = await createClient()

    // Fetch all orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('buyer_username, total_price, status, order_date, shopee_order_no, quantity')
        .order('order_date', { ascending: false })

    if (error || !orders) return []

    // Group by buyer_username
    const customerMap = new Map<string, {
        username: string
        totalSpent: number
        orderSets: Set<string> // Count unique order IDs
        totalItems: number
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

        // Enforce normalization to merge 'User' and 'user '
        cleanName = cleanName.trim().toLowerCase()

        if (!cleanName) return

        if (!customerMap.has(cleanName)) {
            customerMap.set(cleanName, {
                username: cleanName,
                totalSpent: 0,
                orderSets: new Set(),
                totalItems: 0,
                lastOrder: order.order_date,
                status: 'ACTIVE'
            })
        }

        const current = customerMap.get(cleanName)!

        if (order.status === 'COMPLETED') {
            current.totalSpent += Number(order.total_price)
        }

        current.orderSets.add(order.shopee_order_no)
        current.totalItems += (order.quantity || 1)

        // Update last order if this one is newer
        if (new Date(order.order_date) > new Date(current.lastOrder)) {
            current.lastOrder = order.order_date
        }
    })

    // Convert to array and sort by Unique Order Count (Frequency)
    return Array.from(customerMap.values())
        .map(c => ({
            ...c,
            orderCount: c.orderSets.size // Convert Set to number for frontend
        }))
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
