import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    TrendingUp
} from 'lucide-react'
import { getLedgerStats, getLedgerEntries } from './actions'

export default async function LedgerPage() {
    const stats = await getLedgerStats()
    const entries = await getLedgerEntries()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Financial Ledger
                </h2>
                <p className="text-slate-500 mt-1">
                    Complete history of your business cash flow and transactions.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Net Balance</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.balance)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <ArrowUpCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Income</p>
                            <h3 className="text-2xl font-bold text-emerald-600">
                                + {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.income)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                            <ArrowDownCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-rose-600">
                                - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.expense)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800">
                        <History className="h-4 w-4 text-slate-500" />
                        Transaction History
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Category</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No transactions recorded in the ledger yet.
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                            {new Date(entry.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {entry.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                {entry.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${entry.transaction_type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            {entry.transaction_type === 'INCOME' ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(entry.amount)}
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
