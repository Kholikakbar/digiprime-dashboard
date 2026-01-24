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
