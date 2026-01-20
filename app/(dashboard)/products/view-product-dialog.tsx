'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Box, Tag, Info, ShoppingCart, History } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    type: string
    is_active: boolean
    stock_count: number
}

interface ViewProductDialogProps {
    product: Product
    onClose: () => void
}

export function ViewProductDialog({ product, onClose }: ViewProductDialogProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const dialogContent = mounted ? (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
            style={{ position: 'fixed', inset: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                className="bg-card w-full max-w-lg rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Product Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">Review full product information and stats.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className={`p-4 rounded-2xl ${product.type === 'ACCOUNT' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                            {product.type === 'ACCOUNT' ? <Box className="h-8 w-8" /> : <Tag className="h-8 w-8" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${product.is_active ? 'bg-green-500/10 text-green-700 ring-green-600/20' : 'bg-gray-500/10 text-gray-700 ring-gray-600/20'}`}>
                                    {product.is_active ? 'Active' : 'Draft'}
                                </span>
                                <span className="text-sm text-muted-foreground">• ID: {product.id.slice(0, 8)}...</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border/50 bg-card/50">
                            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5">
                                <Info className="h-3 w-3" /> Price
                            </span>
                            <p className="text-lg font-bold text-foreground">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/50 bg-card/50">
                            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5">
                                <ShoppingCart className="h-3 w-3" /> Current Stock
                            </span>
                            <p className={`text-lg font-bold ${product.stock_count === 0 ? 'text-destructive' : 'text-foreground'}`}>
                                {product.stock_count} Units
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5" /> Description
                        </label>
                        <div className="p-4 rounded-xl border border-border/50 bg-muted/10 text-sm leading-relaxed text-muted-foreground">
                            {product.description || 'No description provided for this product.'}
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null

    return mounted && dialogContent && createPortal(dialogContent, document.body)
}
