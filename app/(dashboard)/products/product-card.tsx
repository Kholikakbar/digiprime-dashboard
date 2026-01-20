'use client'

import { useState } from 'react'
import { Tag, Box, Eye, Edit, Trash2 } from 'lucide-react'
import { deleteProduct } from './actions'
import { ViewProductDialog } from './view-product-dialog'
import { ProductDialog } from './product-dialog'

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    type: string
    is_active: boolean
    stock_count: number
}

export function ProductCard({ product }: { product: Product }) {
    const [showView, setShowView] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            await deleteProduct(product.id)
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Failed to delete product')
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-all">
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg p-1 border border-border/50 shadow-sm">
                    <button
                        onClick={() => setShowView(true)}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 text-muted-foreground"
                        title="View details"
                    >
                        <Eye className="h-4 w-4" />
                    </button>

                    <ProductDialog
                        product={product}
                        trigger={
                            <button
                                className="p-2 hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-all duration-200 text-muted-foreground"
                                title="Edit"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                        }
                    />

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                    >
                        <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>

                <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${product.type === 'ACCOUNT' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                            {product.type === 'ACCOUNT' ? <Box className="h-6 w-6" /> : <Tag className="h-6 w-6" />}
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.is_active ? 'bg-green-500/10 text-green-700 ring-green-600/20' : 'bg-gray-500/10 text-gray-700 ring-gray-600/20'}`}>
                                {product.is_active ? 'Active' : 'Draft'}
                            </span>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {product.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                        <div>
                            <span className="text-xs text-muted-foreground block">Price</span>
                            <span className="font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Stock</span>
                            <span className={`font-bold ${product.stock_count === 0 ? 'text-destructive' : ''}`}>
                                {product.stock_count} units
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {showView && <ViewProductDialog product={product} onClose={() => setShowView(false)} />}
        </>
    )
}
