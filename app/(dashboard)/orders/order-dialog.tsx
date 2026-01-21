'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Loader2, Package, X, Calendar, User, Hash, Wallet } from 'lucide-react'
import { createOrder, updateOrder } from './actions'
import { getAvailableStockAccounts } from '../stock/actions'

interface Product {
    id: string
    name: string
    price: number
    type: string
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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [availableStocks, setAvailableStocks] = useState<any[]>([])
    const [isWarranty, setIsWarranty] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isEditing = !!order?.id

    const handleProductChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prod = products.find(p => p.id === e.target.value) || null
        setSelectedProduct(prod)
        setIsWarranty(false) // Reset warranty toggle when product changes

        if (prod) {
            const priceInput = document.getElementById('price-input') as HTMLInputElement
            if (priceInput) priceInput.value = prod.price.toString()

            if (prod.type === 'ACCOUNT') {
                const stocks = await getAvailableStockAccounts(prod.id)
                setAvailableStocks(stocks)
            } else {
                setAvailableStocks([])
            }
        } else {
            setAvailableStocks([])
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
                                        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Warranty Toggle */}
                        {selectedProduct?.type === 'ACCOUNT' && !isEditing && (
                            <div className="col-span-1 md:col-span-2 flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="is_warranty"
                                    name="is_warranty"
                                    checked={isWarranty}
                                    onChange={(e) => setIsWarranty(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="is_warranty" className="text-sm font-medium text-yellow-600 dark:text-yellow-400 cursor-pointer select-none">
                                    Is Warranty Replacement? (Garansi)
                                </label>
                            </div>
                        )}

                        {/* Warranty Fields */}
                        {isWarranty ? (
                            <div className="col-span-1 md:col-span-2 space-y-4 animate-in fade-in slide-in-from-top-2 p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                                <h4 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 border-b border-yellow-500/10 pb-2 mb-2">
                                    Replacement Account Details (Manual Input)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Replacement Email</label>
                                        <input
                                            name="replacement_email"
                                            type="email"
                                            required={isWarranty}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 outline-none"
                                            placeholder="new.account@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Replacement Password</label>
                                        <input
                                            name="replacement_password"
                                            type="text"
                                            required={isWarranty}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 outline-none"
                                            placeholder="password123"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium">Warranty Note</label>
                                        <textarea
                                            name="warranty_note"
                                            rows={2}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 outline-none"
                                            placeholder="Reason for replacement (e.g. Incorrect password, Account locked)"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Normal Stock Selection */
                            selectedProduct?.type === 'ACCOUNT' && !isEditing && (
                                <div className="col-span-1 md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                        <Package className="h-3.5 w-3.5 text-muted-foreground" /> Select Stock (Auto-Assign)
                                    </label>
                                    <select
                                        name="stock_account_id"
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer"
                                    >
                                        <option value="">Auto-select oldest available</option>
                                        {availableStocks.map(stock => (
                                            <option key={stock.id} value={stock.id}>
                                                {stock.email} {stock.additional_info ? `(${stock.additional_info})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-muted-foreground">Found {availableStocks.length} available accounts.</p>
                                </div>
                            )
                        )}

                        {selectedProduct?.type === 'CREDIT' && (
                            <div className="col-span-1 md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                    <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Referral Link / Code / Target ID
                                </label>
                                <input
                                    name="fulfillment_info"
                                    placeholder="e.g. https://instagram.com/username or PromoCode123"
                                    className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                />
                            </div>
                        )}

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
