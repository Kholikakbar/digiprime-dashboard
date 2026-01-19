'use server'

import { createClient } from '@/lib/supabase/server'

export async function generateReport() {
    const supabase = await createClient()

    // Fetch orders for the current month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { data: orders } = await supabase
        .from('orders')
        .select(`
      shopee_order_no,
      buyer_username,
      total_price,
      status,
      order_date,
      products (name, type)
    `)
        .gte('order_date', firstDayOfMonth)
        .order('order_date', { ascending: false })

    if (!orders || orders.length === 0) {
        return null
    }

    // Generate CSV Header
    const header = ['Order No', 'Date', 'Buyer', 'Product', 'Type', 'Price (Rp)', 'Status']

    // Generate Rows
    const rows = orders.map(order => [
        order.shopee_order_no,
        new Date(order.order_date).toLocaleDateString('id-ID'),
        order.buyer_username,
        // @ts-ignore
        order.products?.name || 'Unknown',
        // @ts-ignore
        order.products?.type || '-',
        Number(order.total_price || 0).toString(),
        order.status
    ])

    // Combine to CSV String
    const csvContent = [
        header.join(','),
        ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return csvContent
}
