'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOrders() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('orders')
        .select('*, products(name)')
        .order('order_date', { ascending: false })

    return data || []
}
