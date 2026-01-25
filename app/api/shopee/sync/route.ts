import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orders } = body

        if (!Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid data format. Expected array of orders.' }, { status: 400, headers: corsHeaders })
        }

        const supabase = await createClient()
        const results = {
            synced: 0,
            skipped: 0,
            failed: 0,
            errors: [] as string[]
        }

        // 1. Get all active products for matching
        const { data: products } = await supabase
            .from('products')
            .select('id, name, price')
            .eq('is_active', true)

        for (const order of orders) {
            try {
                // Validate required fields
                if (!order.order_sn || !order.buyer_name) {
                    console.warn(`Skipping invalid order:`, order)
                    results.skipped++
                    continue
                }

                // 2. Check if order already exists
                const { data: existing } = await supabase
                    .from('orders')
                    .select('id, status')
                    .eq('shopee_order_no', order.order_sn)
                    .single()

                // Map Shopee Status to Our Status
                // Requested Mapping:
                // 'Perlu Dikirim' (TO_SHIP) -> 'PROCESSING'
                // 'Dikirim' (SHIPPED) -> 'PENDING'

                let ourStatus = 'PENDING' // Default fallback
                const sStatus = order.order_status?.toUpperCase() || ''

                if (sStatus === 'COMPLETED') ourStatus = 'COMPLETED'
                else if (sStatus === 'CANCELLED') ourStatus = 'CANCELLED'
                else if (['TO_SHIP', 'READY_TO_SHIP', 'PROCESSED'].includes(sStatus)) ourStatus = 'PROCESSING'
                else if (sStatus === 'SHIPPED') ourStatus = 'PENDING'

                if (existing) {
                    // UPDATE existing order status if changed
                    if (existing.status !== ourStatus) {
                        await supabase
                            .from('orders')
                            .update({ status: ourStatus })
                            .eq('id', existing.id)
                    }
                    results.synced++
                    continue // Don't insert duplicates
                }

                // 3. Find matching product based on name similarity
                // This is a naive match - in production, you'd use a mapping table
                let matchedProductId = null
                let productName = order.item_name || 'Unknown Product'

                if (products) {
                    // Try exact match first
                    const exact = products.find(p => p.name.toLowerCase() === productName.toLowerCase())
                    if (exact) matchedProductId = exact.id
                    else {
                        // Try partial match
                        const partial = products.find(p => productName.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(productName.toLowerCase()))
                        if (partial) matchedProductId = partial.id
                    }
                }

                // If no product matched, use a placeholder or the first active product (fallback)
                // In a real scenario, you might want to create a "Unmapped Product"
                if (!matchedProductId && products && products.length > 0) {
                    matchedProductId = products[0].id // Fallback to first product
                }

                // 4. Insert new order
                const { error } = await supabase.from('orders').insert({
                    shopee_order_no: order.order_sn,
                    buyer_username: order.buyer_name,
                    product_id: matchedProductId, // Might be null, handle constraint if strictly required
                    total_price: Number(order.total_amount || 0),
                    status: ourStatus,
                    quantity: Number(order.quantity || 1),
                    order_date: order.create_time ? new Date(order.create_time * 1000).toISOString() : new Date().toISOString() // Shopee uses unix timestamp
                })

                if (error) throw error

                results.synced++

            } catch (err: any) {
                console.error(`Failed to sync order ${order.order_sn}:`, err)
                results.failed++
                results.errors.push(`${order.order_sn}: ${err.message}`)
            }
        }

        return NextResponse.json({
            message: 'Sync process completed',
            stats: results
        }, { headers: corsHeaders })

    } catch (error: any) {
        console.error('Sync API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}
