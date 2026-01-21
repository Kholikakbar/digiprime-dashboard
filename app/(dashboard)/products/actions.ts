'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function createProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const price = Number(formData.get('price'))
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('products')
        .insert({
            name,
            type,
            price,
            description,
            stock_count: 0 // Initial stock is 0
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/products')
    return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const price = Number(formData.get('price'))
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('products')
        .update({
            name,
            type,
            price,
            description
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/products')
    return { success: true }
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()

    // Delete related stock accounts
    const { error: stockAccountsError } = await supabase
        .from('stock_accounts')
        .delete()
        .eq('product_id', id)

    if (stockAccountsError) {
        console.error('Error deleting stock accounts:', stockAccountsError)
        throw new Error('Failed to delete related stock accounts')
    }

    // Delete related stock credits
    const { error: stockCreditsError } = await supabase
        .from('stock_credits')
        .delete()
        .eq('product_id', id)

    if (stockCreditsError) {
        console.error('Error deleting stock credits:', stockCreditsError)
        throw new Error('Failed to delete related stock credits')
    }

    // Delete related orders
    const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .eq('product_id', id)

    if (ordersError) {
        console.error('Error deleting orders:', ordersError)
        throw new Error('Failed to delete related orders')
    }

    // specific delete for the product itself
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/products')
}
