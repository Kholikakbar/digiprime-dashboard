'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAvailableStockAccounts(productId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('stock_accounts')
        .select('id, email, additional_info')
        .eq('product_id', productId)
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: true }) // FIFO

    return data || []
}

export async function getStocks() {
    const supabase = await createClient()

    // Fetch accounts with product details
    const { data: accounts } = await supabase
        .from('stock_accounts')
        .select('*, products(name)')
        .order('created_at', { ascending: false })

    // Fetch credits with product details 
    const { data: credits } = await supabase
        .from('stock_credits')
        .select('*, products(name)')
        .order('created_at', { ascending: false })

    // Fetch products for dropdown
    const { data: products } = await supabase
        .from('products')
        .select('id, name, type')
        .eq('is_active', true)

    return { accounts: accounts || [], credits: credits || [], products: products || [] }
}

export async function addStockAccount(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const product_id = formData.get('product_id') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const additional_info = formData.get('additional_info') as string

    const { error } = await supabase.from('stock_accounts').insert({
        product_id,
        email,
        password,
        additional_info,
        status: 'AVAILABLE',
        buyer_name: '' // Default empty
    })

    // Update product stock count (denormalized)
    // For simplicity in this mvp, we rely on revalidating data which will show correct counts.

    if (error) return { error: error.message }
    revalidatePath('/stock')
    return { success: true }
}

export async function addStockCredit(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const product_id = formData.get('product_id') as string
    const amount = Number(formData.get('amount'))
    const code = formData.get('code') as string

    const { error } = await supabase.from('stock_credits').insert({
        product_id,
        amount,
        code,
        status: 'AVAILABLE',
        buyer_name: '' // Default empty
    })

    if (error) return { error: error.message }
    revalidatePath('/stock')
    return { success: true }
}

export async function updateStockAccount(id: string, formData: FormData) {
    const supabase = await createClient()

    const product_id = formData.get('product_id') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const additional_info = formData.get('additional_info') as string
    const status = formData.get('status') as string

    const { error } = await supabase
        .from('stock_accounts')
        .update({
            product_id,
            email,
            password,
            additional_info,
            status,
            buyer_name: formData.get('buyer_name') as string
        })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/stock')
    return { success: true }
}

export async function updateStockCredit(id: string, formData: FormData) {
    const supabase = await createClient()

    const product_id = formData.get('product_id') as string
    const amount = Number(formData.get('amount'))
    const code = formData.get('code') as string
    const status = formData.get('status') as string

    const { error } = await supabase
        .from('stock_credits')
        .update({
            product_id,
            amount,
            code,
            status,
            buyer_name: formData.get('buyer_name') as string
        })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/stock')
    return { success: true }
}

export async function deleteStockAccount(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('stock_accounts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/stock')
}

export async function deleteStockCredit(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('stock_credits').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/stock')
}
