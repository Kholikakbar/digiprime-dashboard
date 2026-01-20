'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ShoppingCart, User, Hash, Wallet, Calendar, Info, Package, Globe } from 'lucide-react'

interface Order {
    id: string
    shopee_order_no: string
    buyer_username: string
    product_id: string
    total_price: number
    status: string
    order_date: string
    products?: {
        name: string
    }
}

interface ViewOrderDialogProps {
    order: Order
    onClose: () => void
}

export function ViewOrderDialog({ order, onClose }: ViewOrderDialogProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const statusColors: Record<string, string> = {
        'COMPLETED': 'bg-green-500/10 text-green-700 ring-green-600/20',
        'PENDING': 'bg-yellow-500/10 text-yellow-700 ring-yellow-600/20',
        'PROCESSING': 'bg-blue-500/10 text-blue-700 ring-blue-600/20',
        'CANCELLED': 'bg-red-500/10 text-red-700 ring-red-600/20',
    }

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
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-orange-500/5 to-amber-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">Full transaction record from Shopee.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Order Status</p>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold mt-0.5 ring-1 ring-inset ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Order Date</p>
                            <p className="text-sm font-semibold mt-0.5">{new Date(order.order_date).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border/50 bg-card/50">
                            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5">
                                <Hash className="h-3 w-3" /> Shopee Order No
                            </span>
                            <p className="text-sm font-mono font-bold text-foreground">{order.shopee_order_no}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/50 bg-card/50">
                            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5">
                                <User className="h-3 w-3" /> Buyer Username
                            </span>
                            <p className="text-sm font-bold text-foreground">{order.buyer_username}</p>
                        </div>
                    </div>

                    {/* Product & Price */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-border/50 bg-card/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Product</p>
                                    <p className="text-sm font-bold">{order.products?.name || 'Unknown Product'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Total Amount</p>
                                <p className="text-lg font-bold text-primary">Rp {order.total_price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="h-3.5 w-3.5" />
                            <span>System Record: {order.id.slice(0, 12)}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25"
                        >
                            Close Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null

    return mounted && dialogContent && createPortal(dialogContent, document.body)
}
