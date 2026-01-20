'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { deleteStockAccount, deleteStockCredit } from './actions'
import { ViewStockDialog } from './view-stock-dialog'

export function StockActions({ item, type }: { item: any, type: 'ACCOUNT' | 'CREDIT' }) {
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
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setShowView(true)}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                    title="View"
                >
                    <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => alert('Editing stock is not supported yet. Please delete and recreate if needed.')}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                    title="Edit"
                >
                    <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive disabled:opacity-50"
                    title="Delete"
                >
                    <Trash2 className={`h-3.5 w-3.5 ${isDeleting ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            {showView && <ViewStockDialog item={{ ...item, type }} onClose={() => setShowView(false)} />}
        </>
    )
}
