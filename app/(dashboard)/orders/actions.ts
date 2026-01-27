'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrders(search?: string, status?: string) {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*, products(name, type)')
        .order('order_date', { ascending: false })

    if (search) {
        query = query.or(`shopee_order_no.ilike.%${search}%,buyer_username.ilike.%${search}%`)
    }

    if (status && status !== 'ALL') {
        query = query.eq('status', status)
    }

    const { data } = await query

    return data || []
}

export async function getOrderById(id: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('orders')
        .select('*, products(name)')
        .eq('id', id)
        .single()

    return data || null
}

export async function getProductsForOrder() {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('id, name, price, type').eq('is_active', true)
    return data || []
}

export async function createOrder(formData: FormData) {
    const supabase = await createClient()

    const shopee_order_no = formData.get('shopee_order_no') as string
    const buyer_username = formData.get('buyer_username') as string
    const product_id = formData.get('product_id') as string
    const total_price = formData.get('total_price') as string
    const status = formData.get('status') as string
    const order_date = formData.get('order_date') as string // Custom date field

    const stock_account_id = formData.get('stock_account_id') as string
    const fulfillment_info = formData.get('fulfillment_info') as string

    // Warranty Fields
    const is_warranty = formData.get('is_warranty') === 'on'
    const replacement_email = formData.get('replacement_email') as string
    const replacement_password = formData.get('replacement_password') as string
    const warranty_note = formData.get('warranty_note') as string

    if (!shopee_order_no || !buyer_username || !product_id) {
        return { error: 'Missing required fields' }
    }

    let final_buyer_username = buyer_username
    let final_fulfillment_info = fulfillment_info

    if (is_warranty) {
        final_buyer_username = `[WARRANTY] ${buyer_username}`
        const warranty_details = `Rep: ${replacement_email} | Pass: ${replacement_password} | Note: ${warranty_note}`
        final_fulfillment_info = final_fulfillment_info ? `${final_fulfillment_info} | ${warranty_details}` : warranty_details
    }

    // Prepare Insert Data
    const insertData: any = {
        shopee_order_no,
        buyer_username: final_fulfillment_info ? `${final_buyer_username} (Info: ${final_fulfillment_info})` : final_buyer_username,
        product_id,
        total_price: Number(total_price),
        status,
        quantity: 1
    }

    // Add custom order_date if provided, otherwise use default (now)
    if (order_date) {
        insertData.order_date = order_date
    }

    // Insert Order
    const { error } = await supabase.from('orders').insert(insertData)

    if (error) {
        console.error('Error creating order:', error)
        return { error: error.message }
    }

    // Handle Stock Assignment (if Account)
    if (stock_account_id) {
        const { error: stockError } = await supabase
            .from('stock_accounts')
            .update({
                status: 'SOLD',
                buyer_name: buyer_username
            })
            .eq('id', stock_account_id)

        if (stockError) {
            console.error('Error updating stock account:', stockError)
            // Warning: Order created but stock not updated. In real app, consider transaction.
        }
    }

    revalidatePath('/orders')
    revalidatePath('/')
    return { success: true }
}

export async function updateOrder(id: string, formData: FormData) {
    const supabase = await createClient()

    const shopee_order_no = formData.get('shopee_order_no') as string
    const buyer_username = formData.get('buyer_username') as string
    const product_id = formData.get('product_id') as string
    const total_price = formData.get('total_price') as string
    const status = formData.get('status') as string

    if (!shopee_order_no || !buyer_username || !product_id) {
        return { error: 'Missing required fields' }
    }

    const { error } = await supabase
        .from('orders')
        .update({
            shopee_order_no,
            buyer_username,
            product_id,
            total_price: Number(total_price),
            status
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating order:', error)
        return { error: error.message }
    }

    // IF COMPLETED, Log Transaction automatically
    if (status === 'COMPLETED') {
        // Check if transaction already exists to avoid duplicates
        const { data: existing } = await supabase
            .from('transactions')
            .select('id')
            .eq('order_id', id)
            .limit(1)

        if (!existing || existing.length === 0) {
            await supabase.from('transactions').insert({
                order_id: id,
                type: 'INCOME',
                amount: Number(total_price),
                description: `Income from Shopee Order: ${shopee_order_no}`
            })
        }
    }

    revalidatePath('/orders')
    revalidatePath('/transactions')
    revalidatePath('/')
    return { success: true }
}

export async function deleteOrder(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting order:', error)
        throw new Error(error.message)
    }

    revalidatePath('/orders')
    revalidatePath('/')
}

export async function processRefill(orderId: string, data: { email?: string; password?: string; referral_code?: string }) {
    const supabase = await createClient()

    // 1. Fetch current order to get existing notes (for history) and buyer_username
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

    if (fetchError || !order) return { error: 'Order not found' }

    // 2. Parse existing refill history from notes
    let refillHistory = []
    try {
        refillHistory = order.notes ? JSON.parse(order.notes) : []
        if (!Array.isArray(refillHistory)) refillHistory = []
    } catch (e) {
        refillHistory = []
    }

    // 3. Add new refill to history
    const newRefill = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        ...data
    }
    refillHistory.push(newRefill)

    // 4. Update order with new history and potentially update buyer_username display
    // We'll keep the historic buyer_username but update the Info part to the latest refill for display
    const rawBuyer = order.buyer_username || ''
    const mainName = rawBuyer.includes('[WARRANTY]')
        ? rawBuyer.split(')')[0].split('(')[0].trim()
        : rawBuyer.split('(')[0].trim()

    const infoParts = []
    if (data.email) infoParts.push(`Rep: ${data.email}`)
    if (data.password) infoParts.push(`Pass: ${data.password}`)
    if (data.referral_code) infoParts.push(`Ref: ${data.referral_code}`)

    const newBuyerUsername = `${mainName} (Info: ${infoParts.join(' | ')})`

    const { error: updateError } = await supabase
        .from('orders')
        .update({
            notes: JSON.stringify(refillHistory),
            buyer_username: newBuyerUsername
        })
        .eq('id', orderId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/orders')
    revalidatePath('/')
    return { success: true, history: refillHistory }
}