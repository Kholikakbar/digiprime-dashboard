'use server'

import { createClient } from '@/lib/supabase/server'

export type LedgerEntry = {
    id: string
    created_at: string
    transaction_type: 'INCOME' | 'EXPENSE'
    amount: number
    description: string
    category: string
    reference_id?: string
}

export async function getLedgerStats() {
    const supabase = await createClient()

    // Calculate Total Income
    const { data: incomeData } = await supabase
        .from('financial_ledger')
        .select('amount')
        .eq('transaction_type', 'INCOME')

    const totalIncome = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0

    // Calculate Total Expense
    const { data: expenseData } = await supabase
        .from('financial_ledger')
        .select('amount')
        .eq('transaction_type', 'EXPENSE')

    const totalExpense = expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0

    return {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
    }
}

export async function getLedgerEntries() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('financial_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    return (data as LedgerEntry[]) || []
}

export async function addExpense(formData: FormData) {
    const supabase = await createClient()

    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!amount || amount <= 0) {
        return { error: 'Invalid amount' }
    }

    const { error } = await supabase
        .from('financial_ledger')
        .insert({
            transaction_type: 'EXPENSE',
            amount,
            description,
            category,
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function syncOrdersToLedger() {
    const supabase = await createClient()

    // Get all COMPLETED orders
    const { data: completedOrders } = await supabase
        .from('orders')
        .select('id, shopee_order_no, total_price, order_date, buyer_username')
        .eq('status', 'COMPLETED')

    if (!completedOrders || completedOrders.length === 0) {
        return { success: true, synced: 0, message: 'No completed orders to sync' }
    }

    // Get existing ledger entries with reference_ids
    const { data: existingEntries } = await supabase
        .from('financial_ledger')
        .select('reference_id')
        .eq('transaction_type', 'INCOME')

    const existingRefs = new Set(existingEntries?.map(e => e.reference_id) || [])

    // Prepare new entries for orders not yet in ledger
    const newEntries = completedOrders
        .filter(order => !existingRefs.has(order.id))
        .map(order => ({
            transaction_type: 'INCOME',
            amount: Number(order.total_price),
            description: `Order #${order.shopee_order_no} - ${order.buyer_username}`,
            category: 'SALES',
            reference_id: order.id,
            created_at: order.order_date // Use order date instead of current time
        }))

    if (newEntries.length === 0) {
        return { success: true, synced: 0, message: 'All orders already synced' }
    }

    // Insert new entries
    const { error } = await supabase
        .from('financial_ledger')
        .insert(newEntries)

    if (error) {
        return { error: error.message }
    }

    return { success: true, synced: newEntries.length, message: `Synced ${newEntries.length} orders to ledger` }
}
