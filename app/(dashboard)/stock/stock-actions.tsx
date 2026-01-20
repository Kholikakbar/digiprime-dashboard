'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { deleteStockAccount, deleteStockCredit } from './actions'
import { ViewStockDialog } from './view-stock-dialog'
import { StockDialog } from './stock-dialog'

export function StockActions({ item, type, products }: { item: any, type: 'ACCOUNT' | 'CREDIT', products: any[] }) {
    const [showView, setShowView] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this stock item?')) return

        setIsDeleting(true)
        if (type === 'ACCOUNT') {
            await deleteStockAccount(item.id)
        } else {
            await deleteStockCredit(item.id)
        }
        setIsDeleting(false)
    }

    return (
        <>
            <div className="flex items-center justify-end gap-1">
                <button
                    onClick={() => setShowView(true)}
                    className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-md text-muted-foreground transition-colors"
                    title="View"
                >
                    <Eye className="h-3.5 w-3.5" />
                </button>

                <StockDialog
                    products={products}
                    item={{ ...item, type }}
                    trigger={
                        <button
                            className="p-1.5 hover:bg-blue-500/10 hover:text-blue-600 rounded-md text-muted-foreground transition-colors"
                            title="Edit"
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </button>
                    }
                />

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
                    title="Delete"
                >
                    <Trash2 className={`h-3.5 w-3.5 ${isDeleting ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            {showView && <ViewStockDialog item={{ ...item, type }} onClose={() => setShowView(false)} />}
        </>
    )
}
