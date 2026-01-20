import { getOrders, getProductsForOrder } from './actions'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { OrderDialog } from './order-dialog'
import { OrderRow } from './order-row'

export default async function OrdersPage() {
    const orders = await getOrders()
    const products = await getProductsForOrder()

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Orders</h2>
                    <p className="text-muted-foreground mt-1">Track and manage Shopee orders.</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72 md:w-80 lg:w-96 transition-all duration-300">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input placeholder="Search order ID..." className="pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-sm w-full outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <button className="p-2 border border-border bg-card rounded-lg hover:bg-muted shrink-0">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* New Order Button */}
                    <div className="w-full sm:w-auto">
                        <OrderDialog products={products} />
                    </div>
                </div>
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
