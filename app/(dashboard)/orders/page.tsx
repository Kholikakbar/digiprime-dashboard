import { getOrders, getProductsForOrder } from './actions'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { CreateOrderDialog } from './order-dialog'

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
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input placeholder="Search order ID..." className="pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-sm w-full outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <button className="p-2 border border-border bg-card rounded-lg hover:bg-muted shrink-0">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* New Order Button */}
                    <div className="w-full sm:w-auto">
                        <CreateOrderDialog products={products} />
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ShoppingCart className="h-10 w-10 mb-3 opacity-20" />
                                            <p>No orders found yet.</p>
                                            <p className="text-xs">Orders from Shopee will appear here automatically.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium">{order.shopee_order_no}</td>
                                        <td className="px-6 py-4">{order.buyer_username}</td>
                                        <td className="px-6 py-4">{order.products?.name || 'Unknown Product'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-700' :
                                                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">
                                            {new Date(order.order_date).toLocaleDateString()}
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
