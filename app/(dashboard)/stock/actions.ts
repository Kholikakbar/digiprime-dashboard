'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
        status: 'AVAILABLE'
    })

    // Update product stock count (denormalized)
    if (!error) {
        await supabase.rpc('increment_stock', { p_id: product_id })
        // Note: we might need to create this RPC or just rely on count queries. 
        // For simplicity in this mvp, we might skip the denormalized update or do it manually.
        // Let's just revalidate.
    }

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
        status: 'AVAILABLE'
    })

    if (error) return { error: error.message }
    revalidatePath('/stock')
    return { success: true }
}
