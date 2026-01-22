import { Receipt, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react'
import { getTransactions, getTransactionStats } from './actions'

export default async function TransactionsPage() {
    const transactions = await getTransactions()
    const stats = await getTransactionStats()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Financial Ledger</h2>
                    <p className="text-muted-foreground mt-1">Real-time financial history and profit analysis.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="group rounded-3xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="h-24 w-24 text-green-600" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                            <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalIncome)}</h3>
                        </div>
                    </div>
                </div>

                <div className="group rounded-3xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <TrendingDown className="h-24 w-24 text-red-600" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <ArrowDownRight className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Refunds</p>
                            <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRefund)}</h3>
                        </div>
                    </div>
                </div>

                <div className="group rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
                        <Wallet className="h-24 w-24 text-primary" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary italic uppercase tracking-wider">Net Profit</p>
                            <h3 className="text-2xl font-black text-foreground">{formatCurrency(stats.netProfit)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/5">
                <div className="p-6 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        Transaction History
                    </h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search description or ID..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs text-muted-foreground uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">Date & Time</th>
                                <th className="px-6 py-4 text-left">Order Reference</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-3xl py-12 border-2 border-dashed border-border/40 mx-4">
                                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <Receipt className="h-10 w-10 opacity-20" />
                                            </div>
                                            <p className="font-bold text-lg">No transactions recorded</p>
                                            <p className="text-sm max-w-[250px] mt-2">Financial data will automatically appear as your orders are processed.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">
                                                    {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.orders ? (
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-xs font-bold text-primary">{t.orders.shopee_order_no}</span>
                                                    <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">{t.orders.products?.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">Internal Sync</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${t.type === 'INCOME'
                                                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                }`}>
                                                {t.type === 'INCOME' ? (
                                                    <TrendingUp className="h-3 w-3" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3" />
                                                )}
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-muted-foreground font-medium italic">
                                                {t.description || 'Order processing completion.'}
                                            </p>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-black text-base ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length > 0 && (
                    <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <p>Showing {transactions.length} entries</p>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500"></div> Income Verified</span>
                            <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Payout Balanced</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

