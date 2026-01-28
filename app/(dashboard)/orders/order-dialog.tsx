'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Loader2, Package, X, Calendar, User, Hash, Wallet, ShieldCheck, RefreshCw, History, CheckCircle2, ChevronRight, Mail, Key } from 'lucide-react'
import { createOrder, updateOrder, processRefill } from './actions'
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
    notes?: string
    order_date: string
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
    const [isRefillModalOpen, setIsRefillModalOpen] = useState(false)
    const [refillLoading, setRefillLoading] = useState(false)
    const [refills, setRefills] = useState<any[]>([])

    useEffect(() => {
        if (order?.notes) {
            try {
                const parsed = JSON.parse(order.notes)
                if (Array.isArray(parsed)) setRefills(parsed)
            } catch (e) {
                setRefills([])
            }
        }
    }, [order?.notes])

    useEffect(() => {
        setMounted(true)
        if (order?.product_id && isOpen) {
            const prod = products.find(p => p.id === order.product_id) || null
            setSelectedProduct(prod)
        }
        return () => setMounted(false)
    }, [isOpen, order?.product_id, products])

    const maxQuota = selectedProduct?.type === 'ACCOUNT' ? 10 : 1

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

    const handleRefillSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!order?.id) return

        setRefillLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get('refill_email') as string,
            password: formData.get('refill_password') as string,
            referral_code: formData.get('refill_referral') as string
        }

        const res = await processRefill(order.id, data)
        setRefillLoading(false)

        if (res?.error) {
            alert(res.error)
        } else {
            if (res.history) setRefills(res.history)
            setIsRefillModalOpen(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)

        // FIX: Convert local time input to UTC ISO String to prevent timezone shifts
        // The input returns "YYYY-MM-DDTHH:mm" (Local Time)
        // If we send this directly, Supabase treats it as UTC (shifting it +7 hours for ID users when viewed back)
        const rawDate = formData.get('order_date') as string
        if (rawDate) {
            const dateObj = new Date(rawDate)
            // Send the exact Moment in Time (UTC)
            formData.set('order_date', dateObj.toISOString())
        }

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

    // Helper to format UTC database date to Local "YYYY-MM-DDTHH:mm" for input
    const getLocalValue = (isoString?: string) => {
        if (!isoString) return ''
        const date = new Date(isoString)
        const offset = date.getTimezoneOffset()
        const local = new Date(date.getTime() - (offset * 60 * 1000))
        return local.toISOString().slice(0, 16)
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
                className={`bg-card w-full ${isEditing ? 'max-w-4xl lg:max-w-5xl' : 'max-w-lg md:max-w-xl'} rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative outline-none`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Manage Order' : 'Create New Order'}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing ? 'View details, manage warranties, and process refills.' : 'Manually record an offline or external order.'}
                        </p>
                    </div>
                    <button onClick={() => { setIsOpen(false); if (onClose) onClose(); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form action={handleSubmit} className="flex flex-col">
                    <div className={`p-6 ${isEditing ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-5'}`}>
                        {/* LEFT COLUMN: Order Details */}
                        <div className="space-y-6">
                            {isEditing && (
                                <div className="flex items-center gap-2 pb-2 border-b border-border/50 mb-4">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold text-foreground">Order Details</h3>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:block lg:space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                        <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Shopee Order ID
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Order Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="order_date"
                                        defaultValue={isEditing && order?.notes?.includes('"date"') ? '' : getLocalValue(order?.['order_date'] as any)} // Handle loose typing, check if order_date exists
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty to use current date/time</p>
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
                        </div>

                        {/* RIGHT COLUMN: Warranty & Refills (Only when editing) */}
                        {isEditing && (
                            <div className="space-y-6 lg:border-l lg:border-border/50 lg:pl-8">
                                <div className="flex items-center gap-2 pb-2 border-b border-border/50 mb-4">
                                    <ShieldCheck className="h-5 w-5 text-green-500" />
                                    <h3 className="font-bold text-foreground">Warranty & Refills</h3>
                                </div>

                                {/* Quota Usage Card */}
                                <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quota Usage</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-foreground">{refills.length}</span>
                                                <span className="text-sm text-muted-foreground">/{maxQuota}</span>
                                            </div>
                                        </div>
                                        <div className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-1.5 leading-none">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            ACTIVE
                                        </div>
                                    </div>

                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/20">
                                        <div
                                            className="h-full bg-primary/40 rounded-full transition-all duration-1000"
                                            style={{ width: `${(refills.length / maxQuota) * 100}%` }}
                                        ></div>
                                    </div>

                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> Until: 22/2/2026
                                    </p>
                                </div>

                                {/* Process Refill Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsRefillModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-3 p-4 bg-white dark:bg-muted/10 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all group font-semibold text-primary"
                                >
                                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    Process New Refill
                                </button>

                                {/* Refill History */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground italic">
                                        <History className="h-4 w-4" /> Refill History
                                    </div>
                                    {refills.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dotted border-border rounded-xl bg-muted/20 text-muted-foreground">
                                            <History className="h-8 w-8 mb-2 opacity-20" />
                                            <p className="text-xs">No refills yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                            {refills.map((refill, i) => (
                                                <div key={refill.id || i} className="p-3 bg-muted/30 border border-border/50 rounded-xl space-y-2 text-[11px] relative group hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center justify-between text-muted-foreground border-b border-border/20 pb-1.5 mb-1.5">
                                                        <span className="flex items-center gap-1 font-mono">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(refill.date).toLocaleDateString()} {new Date(refill.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-bold">#{refills.length - i}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-1.5">
                                                        {refill.email && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-muted-foreground w-10">Email:</span>
                                                                <span className="font-medium text-foreground select-all">{refill.email}</span>
                                                            </div>
                                                        )}
                                                        {refill.password && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-muted-foreground w-10">Pass:</span>
                                                                <span className="font-medium text-foreground select-all">{refill.password}</span>
                                                            </div>
                                                        )}
                                                        {refill.referral_code && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-muted-foreground w-10">Ref:</span>
                                                                <span className="font-medium text-blue-600 dark:text-blue-400 select-all">{refill.referral_code}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )).reverse()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end lg:justify-start gap-3 p-6 border-t border-border/30 bg-muted/10">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
                            className="px-8 md:px-12 py-3 text-sm font-bold bg-muted-foreground/10 hover:bg-muted-foreground/20 text-foreground border border-border rounded-xl transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-12 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] min-w-[160px]"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            {isEditing ? 'Save Changes' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null

    const refillModal = isRefillModalOpen && mounted ? (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.5)] border border-border animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" /> Process Refill
                    </h3>
                    <button onClick={() => setIsRefillModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleRefillSubmit} className="p-6 space-y-4">
                    {selectedProduct?.type === 'ACCOUNT' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> New Email
                                </label>
                                <input
                                    name="refill_email"
                                    required
                                    placeholder="new.email@example.com"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Key className="h-3 w-3" /> New Password
                                </label>
                                <input
                                    name="refill_password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                            <Hash className="h-3 w-3" /> Referral Code / Target ID
                        </label>
                        <input
                            name="refill_referral"
                            required
                            placeholder="e.g. REF123456"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsRefillModalOpen(false)}
                            className="flex-1 px-4 py-3 text-sm font-bold bg-muted hover:bg-muted/80 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={refillLoading}
                            className="flex-1 px-4 py-3 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {refillLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Confirm
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
            {mounted && refillModal && createPortal(refillModal, document.body)}
        </>
    )
}
