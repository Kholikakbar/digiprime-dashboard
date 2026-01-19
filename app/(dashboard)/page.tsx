import { createClient } from '@/lib/supabase/server'
import { DollarSign, Package, ShoppingCart, Activity, TrendingUp, Users } from 'lucide-react'

async function getStats() {
    const supabase = await createClient()

    // Placeholder for real data fetching
    // const { count: stockAccounts } = await supabase.from('stock_accounts').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE')

    return {
        salesToday: 450000,
        salesMonth: 12500000,
        stockAccounts: 42,
        stockCredits: 156,
        pendingOrders: 5,
        completedOrders: 128
    }
}

export default async function DashboardPage() {
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Dashboard Overview</h2>
                    <p className="text-muted-foreground mt-1">Real-time updates for DigiPrime store performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground">Total Revenue (Month)</span>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1 relative">Rp {stats.salesMonth.toLocaleString('id-ID')}</div>
                    <p className="text-xs text-green-600 flex items-center font-medium">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +20.1% from last month
                    </p>
                </div>

                {/* Card 2 */}
                <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground">Active Orders</span>
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1 relative">{stats.pendingOrders} <span className="text-sm font-normal text-muted-foreground">pending</span></div>
                    <p className="text-xs text-muted-foreground">
                        {stats.completedOrders} completed orders
                    </p>
                </div>

                {/* Card 3 */}
                <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground">Account Stock</span>
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1 relative">{stats.stockAccounts} <span className="text-sm font-normal text-muted-foreground">units</span></div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">45% capacity</p>
                </div>

                {/* Card 4 */}
                <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground">Credit Stock</span>
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1 relative">{stats.stockCredits} <span className="text-sm font-normal text-muted-foreground">units</span></div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">High availability</p>
                </div>
            </div>

            {/* Recent Activity / Charts Section */}
            <div className="grid gap-6 md:grid-cols-7">
                <div className="col-span-4 rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Recent Orders</h3>
                        <button className="text-sm text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {/* Mock List */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        PA
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Order #23049{i}</p>
                                        <p className="text-xs text-muted-foreground">Pipit AI Premium Account</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">Rp 45,000</p>
                                    <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-3 rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Stock Alerts</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="h-4 w-4 text-red-600" />
                                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">Low Stock Warning</h4>
                            </div>
                            <p className="text-xs text-red-600/80 dark:text-red-300">
                                Pipit AI Account (Basic) is running low (Only 2 left).
                            </p>
                            <button className="mt-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors dark:bg-red-900/40 dark:text-red-300">
                                Replenish Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
