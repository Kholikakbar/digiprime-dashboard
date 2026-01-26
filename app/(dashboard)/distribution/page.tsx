import { Send, CheckCircle2, CloudLightning, Activity, Clock, AlertCircle } from 'lucide-react'
import { getDistributionStats, getRecentDeliveries } from './actions'

export default async function DistributionPage() {
    const stats = await getDistributionStats()
    const deliveries = await getRecentDeliveries()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Distribution Monitor</h2>
                <p className="text-muted-foreground mt-1">Real-time automated delivery system status and logs.</p>
            </div>

            {/* System Status Card */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card p-1 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="bg-card/50 backdrop-blur-xl rounded-[20px] p-5 sm:p-8 relative">
                    <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
                                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 relative z-10">
                                    <CloudLightning className="h-8 w-8 sm:h-10 sm:w-10" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-emerald-500 rounded-full border-[3px] border-card z-20 flex items-center justify-center">
                                    <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white animate-spin-slow" />
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-2 sm:mb-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Auto-Distribution Engine</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Operational
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto sm:mx-0">
                                    System is actively polling for new paid orders. Digital products are being assigned and dispatched via chat API with 99.9% uptime.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:gap-6 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/50 lg:pl-10">
                            <div className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                <span className="text-xl sm:text-3xl font-black text-foreground">{stats.delivered}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Delivered</span>
                            </div>

                            <div className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 transition-colors relative">
                                <span className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/60"></span>
                                <span className="text-xl sm:text-3xl font-black text-amber-500">{stats.pending}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Pending</span>
                            </div>

                            <div className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 transition-colors relative">
                                <span className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/60"></span>
                                <span className="text-xl sm:text-3xl font-black text-blue-500">{stats.processing}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Process</span>
                            </div>

                            <div className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 transition-colors relative">
                                <span className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/60"></span>
                                <span className="text-xl sm:text-3xl font-black text-red-500">{stats.failed}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Failed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6">
                <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border/40 flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Send className="h-4 w-4 text-primary" />
                            Recent Dispatch Log
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 text-xs text-muted-foreground uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 text-left">Timestamp</th>
                                    <th className="px-6 py-4 text-left">Order ID</th>
                                    <th className="px-6 py-4 text-left">Product</th>
                                    <th className="px-6 py-4 text-left">Buyer</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {deliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            No automated deliveries recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    deliveries.map((delivery: any) => (
                                        <tr key={delivery.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(delivery.processed_at || delivery.order_date).toLocaleString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-foreground">
                                                {delivery.shopee_order_no}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                                                {Array.isArray(delivery.products)
                                                    ? delivery.products[0]?.name
                                                    : delivery.products?.name || 'Unknown Product'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md text-xs font-bold border border-blue-500/20">
                                                    @{delivery.buyer_username}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {delivery.status === 'COMPLETED' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Sent
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm">
                                                        <Activity className="h-3 w-3 animate-pulse" />
                                                        Sending...
                                                    </span>
                                                )}
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
    )
}

