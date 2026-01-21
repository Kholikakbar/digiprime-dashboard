'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('orders')
        .select('*, products(name)')
        .order('order_date', { ascending: false })

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

    const stock_account_id = formData.get('stock_account_id') as string
    const fulfillment_info = formData.get('fulfillment_info') as string

    if (!shopee_order_no || !buyer_username || !product_id) {
        return { error: 'Missing required fields' }
    }

    // Prepare Insert Data
    const insertData: any = {
        shopee_order_no,
        buyer_username: fulfillment_info ? `${buyer_username} (Ref: ${fulfillment_info})` : buyer_username,
        product_id,
        total_price: Number(total_price),
        status,
        quantity: 1
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

    revalidatePath('/orders')
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