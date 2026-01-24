import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    TrendingUp,
    DollarSign
} from 'lucide-react'
import { getLedgerStats, getLedgerEntries } from './actions'
import { AddExpenseDialog } from './add-expense-dialog'
import { SyncOrdersButton } from './sync-button'

export default async function LedgerPage() {
    const stats = await getLedgerStats()
    const entries = await getLedgerEntries()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">
                        Financial Ledger
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        Track your business cash flow and manage expenses efficiently.
                    </p>
                </div>
                <div className="flex gap-3">
                    <SyncOrdersButton />
                    <AddExpenseDialog />
                </div>
            </div>

            {/* Stats Cards - Premium Design */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Net Balance */}
                <div className="group relative rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Net Balance</p>
                        <h3 className="text-3xl font-black text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.balance)}
                        </h3>
                    </div>
                </div>

                {/* Total Income */}
                <div className="group relative rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/30">
                                <ArrowUpCircle className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">+</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Income</p>
                        <h3 className="text-3xl font-black text-emerald-600">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.income)}
                        </h3>
                    </div>
                </div>

                {/* Total Expenses */}
                <div className="group relative rounded-3xl border border-slate-200 bg-gradient-to-br from-rose-50 via-white to-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/30">
                                <ArrowDownCircle className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-full">-</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Expenses</p>
                        <h3 className="text-3xl font-black text-rose-600">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.expense)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Transactions Table - Modern Design */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl">
                            <History className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-slate-900">Transaction History</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 50 transactions</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-100 rounded-full">
                                                <DollarSign className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">No transactions recorded yet</p>
                                            <p className="text-xs text-slate-400">Start by adding your first expense</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry, index) => (
                                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-10 bg-slate-200 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                                <span className="text-xs font-mono text-slate-500">
                                                    {new Date(entry.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-sm text-slate-900">{entry.description || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const cat = entry.category.toUpperCase();
                                                let style = "bg-slate-100 text-slate-700 border-slate-200";

                                                if (cat === 'SALES') style = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                                if (cat.includes('ADS')) style = "bg-blue-50 text-blue-700 border-blue-200";
                                                if (cat.includes('STOCK')) style = "bg-amber-50 text-amber-700 border-amber-200";
                                                if (cat === 'MARKETING') style = "bg-purple-50 text-purple-700 border-purple-200";
                                                if (cat === 'OPERATIONAL') style = "bg-rose-50 text-rose-700 border-rose-200";

                                                return (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style}`}>
                                                        {entry.category.replace(/_/g, ' ')}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`inline-flex items-center gap-1.5 font-black text-sm ${entry.transaction_type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {entry.transaction_type === 'INCOME' ? (
                                                    <ArrowUpCircle className="h-4 w-4" />
                                                ) : (
                                                    <ArrowDownCircle className="h-4 w-4" />
                                                )}
                                                {entry.transaction_type === 'INCOME' ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(entry.amount)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
