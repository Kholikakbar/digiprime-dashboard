import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const body = await request.json()

        // Example: Validate Shopee signature (Pseudo-code)
        // if (!isValidShopeeSignature(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Insert order into Supabase
        // This is an example integration point for external webhooks
        const { data, error } = await supabase
            .from('orders')
            .insert({
                shopee_order_no: body.order_sn,
                buyer_username: body.buyer_username,
                // map other fields...
                status: 'PENDING'
            })
            .select()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, order_id: data[0].id })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}
