import { getStocks } from './actions'
import { AddStockDialog } from './stock-dialog'
import { Layers, Mail, Key, Hash, CircleDollarSign } from 'lucide-react'

export default async function StockPage() {
    const { accounts, credits, products } = await getStocks()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">Stock Management</h2>
                    <p className="text-muted-foreground mt-1">Monitor and replenish your digital inventory.</p>
                </div>
                <AddStockDialog products={products} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* ACCOUNTS SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Mail className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-bold">Accounts</h3>
                        <span className="ml-auto text-xs font-mono bg-muted px-2 py-1 rounded-md">{accounts.length} items</span>
                    </div>

                    <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Email</th>
                                        {/* <th className="px-4 py-3">Password</th> */}
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {accounts.length === 0 ? (
                                        <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No accounts in stock.</td></tr>
                                    ) : (
                                        accounts.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{item.products?.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                                                {/* <td className="px-4 py-3 font-mono text-xs opacity-50">******</td> */}
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* CREDITS SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                            <CircleDollarSign className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-bold">Credits</h3>
                        <span className="ml-auto text-xs font-mono bg-muted px-2 py-1 rounded-md">{credits.length} items</span>
                    </div>

                    <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {credits.length === 0 ? (
                                        <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No credits in stock.</td></tr>
                                    ) : (
                                        credits.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{item.products?.name}</td>
                                                <td className="px-4 py-3 font-mono">{item.amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
