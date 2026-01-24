'use client'

import { useMemo, useState } from 'react'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { OrderDialog } from './order-dialog'
import { OrderRow } from './order-row'

export default function OrdersClient({ orders, products }: any) {
    const [search, setSearch] = useState('')

    const filteredOrders = useMemo(() => {
        return orders.filter((order: any) =>
            order.orderNo?.toLowerCase().includes(search.toLowerCase()) ||
            order.buyer?.toLowerCase().includes(search.toLowerCase())
        )
    }, [orders, search])

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                        Orders
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Track and manage Shopee orders.
                    </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72 md:w-80 lg:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search order ID / buyer..."
                                className="pl-9 pr-4 py-2 rounded-lg border w-full"
                            />
                        </div>
                        <button className="p-2 border rounded-lg">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>

                    <OrderDialog products={products} />
                </div>
            </div>

            <table className="w-full text-sm">
                <tbody>
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td className="py-10 text-center text-muted-foreground">
                                Order tidak ditemukan
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order: any) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                products={products}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
