'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDistributionStats() {
    const supabase = await createClient()

    // Get completed orders (Assuming COMPLETED means distributed)
    const { count: deliveredCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED')

    // Get processing orders
    const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PROCESSING')

    return {
        delivered: deliveredCount || 0,
        pending: pendingCount || 0,
        failed: 0 // Mock for now
    }
}

export async function getRecentDeliveries() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('orders')
        .select(`
            id,
            shopee_order_no,
            buyer_username,
            updated_at,
            status,
            products (name)
        `)
        .eq('status', 'COMPLETED')
        .order('updated_at', { ascending: false })
        .limit(10)

    return data || []
}
