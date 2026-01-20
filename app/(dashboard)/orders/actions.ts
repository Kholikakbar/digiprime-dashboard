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
    const { data } = await supabase.from('products').select('id, name, price').eq('is_active', true)
    return data || []
}

export async function createOrder(formData: FormData) {
    const supabase = await createClient()

    const shopee_order_no = formData.get('shopee_order_no') as string
    const buyer_username = formData.get('buyer_username') as string
    const product_id = formData.get('product_id') as string
    const total_price = formData.get('total_price') as string
    const status = formData.get('status') as string

    if (!shopee_order_no || !buyer_username || !product_id) {
        return { error: 'Missing required fields' }
    }

    const { error } = await supabase.from('orders').insert({
        shopee_order_no,
        buyer_username,
        product_id,
        total_price: Number(total_price),
        status,
        quantity: 1
    })

    if (error) {
        console.error('Error creating order:', error)
        return { error: error.message }
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
        return { error: error.message }
    }

    revalidatePath('/orders')
    revalidatePath('/')
    return { success: true }
}