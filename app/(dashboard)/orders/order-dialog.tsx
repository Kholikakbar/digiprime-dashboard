'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Loader2, Package, X, Calendar, User, Hash, Wallet } from 'lucide-react'
import { createOrder, updateOrder } from './actions'

interface Product {
    id: string
    name: string
    price: number
}

interface Order {
    id: string
    shopee_order_no: string
    buyer_username: string
    product_id: string
    total_price: number
    status: string
}

interface OrderDialogProps {
    products: Product[]
    order?: Order
    trigger?: React.ReactNode
    onClose?: () => void
}

export function OrderDialog({ products, order, trigger, onClose }: OrderDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isEditing = !!order?.id

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prod = products.find(p => p.id === e.target.value)
        if (prod) {
            const priceInput = document.getElementById('price-input') as HTMLInputElement
            if (priceInput) priceInput.value = prod.price.toString()
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const res = isEditing
            ? await updateOrder(order.id, formData)
            : await createOrder(formData)
        setLoading(false)

        if (res?.error) {
            alert(res.error)
        } else {
            setIsOpen(false)
            if (onClose) onClose()
        }
    }

    const dialogContent = isOpen && mounted ? (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
            style={{ position: 'fixed', inset: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setIsOpen(false)
                    if (onClose) onClose()
                }
            }}
        >
            <div
                className="bg-card w-full max-w-lg md:max-w-xl rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Edit Order' : 'Create New Order'}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing ? 'Update recorded order information.' : 'Manually record an offline or external order.'}
                        </p>
                    </div>
                    <button onClick={() => { setIsOpen(false); if (onClose) onClose(); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Shopee Order No
                            </label>
                            <input
                                name="shopee_order_no"
                                required
                                defaultValue={order?.shopee_order_no}
                                placeholder="e.g. 230101ABC123"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <User className="h-3.5 w-3.5 text-muted-foreground" /> Buyer Username
                            </label>
                            <input
                                name="buyer_username"
                                required
                                defaultValue={order?.buyer_username}
                                placeholder="e.g. johndoe"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <Package className="h-3.5 w-3.5 text-muted-foreground" /> Product
                            </label>
                            <div className="relative">
                                <select
                                    name="product_id"
                                    required
                                    defaultValue={order?.product_id}
                                    className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none transition-all hover:border-border/80 cursor-pointer"
                                    onChange={handleProductChange}
                                >
                                    <option value="">Select a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <Wallet className="h-3.5 w-3.5 text-muted-foreground" /> Total Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none z-10">Rp</span>
                                <input
                                    id="price-input"
                                    name="total_price"
                                    type="number"
                                    required
                                    defaultValue={order?.total_price}
                                    placeholder="0"
                                    className="w-full bg-background border-2 border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Status
                            </label>
                            <select
                                name="status"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer"
                                defaultValue={order?.status || 'COMPLETED'}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
                            className="px-5 py-2.5 text-sm font-medium bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditing ? 'Update Order' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        New Order
                    </button>
                )}
            </div>
            {mounted && dialogContent && createPortal(dialogContent, document.body)}
        </>
    )
}
