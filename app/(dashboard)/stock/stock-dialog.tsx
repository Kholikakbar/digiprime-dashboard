'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { addStockAccount, addStockCredit, updateStockAccount, updateStockCredit } from './actions'
import { Plus, Loader2, X } from 'lucide-react'

interface StockDialogProps {
    products: any[]
    item?: any
    initialType?: 'ACCOUNT' | 'CREDIT'
    trigger?: React.ReactNode
    onClose?: () => void
}

export function StockDialog({ products, item, initialType = 'ACCOUNT', trigger, onClose }: StockDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState(item?.type || initialType)
    const [isPending, setIsPending] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isEditing = !!item?.id
    const activeProducts = products.filter(p => p.type === type)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            if (isEditing) {
                if (type === 'ACCOUNT') {
                    await updateStockAccount(item.id, formData)
                } else {
                    await updateStockCredit(item.id, formData)
                }
            } else {
                if (type === 'ACCOUNT') {
                    await addStockAccount(null, formData)
                } else {
                    await addStockCredit(null, formData)
                }
            }
            setIsOpen(false)
            if (onClose) onClose()
        } catch (error) {
            console.error('Submit failed:', error)
            alert('Failed to save stock')
        } finally {
            setIsPending(false)
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
                className="bg-card w-full max-w-lg rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Edit Stock' : 'Add New Stock'}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing ? 'Update your inventory record details.' : 'Add account or credit stock to your inventory.'}
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {!isEditing && (
                        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg border border-border/30">
                            <button
                                type="button"
                                onClick={() => setType('ACCOUNT')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${type === 'ACCOUNT'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    }`}
                            >
                                Account
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('CREDIT')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${type === 'CREDIT'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    }`}
                            >
                                Credit
                            </button>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={isEditing ? 'col-span-1' : 'col-span-2'}>
                                <label className="text-sm font-medium mb-2 block text-foreground">Product</label>
                                <select
                                    name="product_id"
                                    required
                                    defaultValue={item?.product_id}
                                    className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer"
                                >
                                    <option value="">Select product...</option>
                                    {activeProducts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {isEditing && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Status</label>
                                    <select
                                        name="status"
                                        required
                                        defaultValue={item?.status}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer"
                                    >
                                        <option value="AVAILABLE">AVAILABLE</option>
                                        <option value="SOLD">SOLD</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {type === 'ACCOUNT' ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        defaultValue={item?.email}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Password</label>
                                    <input
                                        name="password"
                                        type="text"
                                        required
                                        defaultValue={item?.password}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                        placeholder="secret123"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Additional Info</label>
                                    <input
                                        name="additional_info"
                                        type="text"
                                        defaultValue={item?.additional_info}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                        placeholder="e.g. Recovery Email"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Amount</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        required
                                        defaultValue={item?.amount}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                        placeholder="100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-foreground">Code / Token</label>
                                    <input
                                        name="code"
                                        type="text"
                                        defaultValue={item?.code}
                                        className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                        placeholder="XXXX-YYYY-ZZZZ"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false)
                                    if (onClose) onClose()
                                }}
                                className="px-5 py-2.5 text-sm font-medium bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Update Stock' : 'Save Stock'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ) : null

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Add Stock
                    </button>
                )}
            </div>
            {mounted && dialogContent && createPortal(dialogContent, document.body)}
        </>
    )
}
