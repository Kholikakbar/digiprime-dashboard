import { getOrders, getProductsForOrder } from './actions'
import { ShoppingCart, Filter } from 'lucide-react'
import { OrderDialog } from './order-dialog'
import { OrderRow } from './order-row'
import { OrderSearchInput } from './search-input'
import Link from 'next/link'

export default async function OrdersPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined
    const status = typeof searchParams.status === 'string' ? searchParams.status : undefined

    const orders = await getOrders(query, status)
    const products = await getProductsForOrder()

    const statuses = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Orders</h2>
                    <p className="text-muted-foreground mt-1">Track and manage Shopee orders.</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <OrderSearchInput />
                    </div>

                    {/* New Order Button */}
                    <div className="w-full sm:w-auto">
                        <OrderDialog products={products} />
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {statuses.map((s) => {
                    const isActive = (s === 'ALL' && !status) || status === s
                    return (
                        <Link
                            key={s}
                            href={`/orders?${new URLSearchParams({
                                ...(query ? { q: query } : {}),
                                ...(s !== 'ALL' ? { status: s } : {})
                            }).toString()}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50'
                                }`}
                        >
                            {s === 'ALL' ? 'All Orders' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </Link>
                    )
                })}
            </div>

            <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-xs text-muted-foreground uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Order No</th>
                                <th className="px-6 py-4 text-left">Buyer</th>
                                <th className="px-6 py-4 text-left">Product</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Warranty</th>
                                <th className="px-6 py-4 text-right">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ShoppingCart className="h-10 w-10 mb-3 opacity-20" />
                                            <p>No orders found yet.</p>
                                            <p className="text-xs">Orders from Shopee will appear here automatically.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <OrderRow key={order.id} order={order} products={products} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
