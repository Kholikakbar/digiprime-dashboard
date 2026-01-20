'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { deleteOrder } from './actions'
import { OrderDialog } from './order-dialog'
import { ViewOrderDialog } from './view-order-dialog'

interface OrderRowProps {
    order: any
    products: any[]
}

export function OrderRow({ order, products }: OrderRowProps) {
    const [showView, setShowView] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete order ${order.shopee_order_no}? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        await deleteOrder(order.id)
        setIsDeleting(false)
    }

    return (
        <>
            <tr className="hover:bg-muted/30 transition-colors group">
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
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setShowView(true)}
                            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                            title="View"
                        >
                            <Eye className="h-4 w-4" />
                        </button>

                        <OrderDialog
                            order={order}
                            products={products}
                            trigger={
                                <button
                                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                                    title="Edit"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            }
                        />

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive disabled:opacity-50"
                            title="Delete"
                        >
                            <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </td>
            </tr>

            {showView && <ViewOrderDialog order={order} onClose={() => setShowView(false)} />}
        </>
    )
}
