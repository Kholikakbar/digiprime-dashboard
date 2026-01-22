'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTransactions() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('transactions')
        .select(`
            *,
            orders (
                shopee_order_no,
                buyer_username,
                products (
                    name
                )
            )
        `)
        .order('created_at', { ascending: false })

    return data || []
}

export async function getTransactionStats() {
    const supabase = await createClient()

    const { data: incomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'INCOME')

    const { data: refundData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'REFUND')

    const totalIncome = incomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const totalRefund = refundData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const netProfit = totalIncome - totalRefund

    return {
        totalIncome,
        totalRefund,
        netProfit
    }
}
