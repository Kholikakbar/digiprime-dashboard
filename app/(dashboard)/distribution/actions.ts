'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDistributionStats() {
    const supabase = await createClient()

    // Get completed orders (Assuming COMPLETED means distributed)
    const { count: deliveredCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED')

    // Get pending orders (waiting to be processed)
    const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING')

    // Get processing orders (currently being processed)
    const { count: processingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PROCESSING')

    // Get cancelled orders (failed)
    const { count: cancelledCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'CANCELLED')

    return {
        delivered: deliveredCount || 0,
        pending: pendingCount || 0,
        processing: processingCount || 0,
        failed: cancelledCount || 0
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
            order_date,
            processed_at,
            status,
            products (name)
        `)
        .in('status', ['COMPLETED', 'PROCESSING']) // Tampilkan Completed dan Processing
        .order('order_date', { ascending: false })
        .limit(20)

    return data || []
}
