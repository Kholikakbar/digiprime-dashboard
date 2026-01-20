'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createProduct, updateProduct } from './actions'
import { Plus, X, Loader2, Tag, Box, Info } from 'lucide-react'

interface Product {
    id?: string
    name: string
    type: string
    price: number
    description: string | null
}

interface ProductDialogProps {
    product?: Product
    trigger?: React.ReactNode
    onClose?: () => void
}

export function ProductDialog({ product, trigger, onClose }: ProductDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isEditing = !!product?.id

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError('')

        const res = isEditing
            ? await updateProduct(product.id!, formData)
            : await createProduct(null, formData)

        if (res?.error) {
            setError(res.error)
            setIsPending(false)
        } else {
            setIsPending(false)
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
                className="bg-card w-full max-w-lg rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing ? 'Update your digital product catalog.' : 'Create a new entry in your digital catalog.'}
                        </p>
                    </div>
                </div>

                <form action={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium block text-foreground">Product Name</label>
                        <input
                            name="name"
                            required
                            defaultValue={product?.name}
                            placeholder="e.g. Pipit AI Premium Account"
                            className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium block text-foreground">Type</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    required
                                    defaultValue={product?.type || 'ACCOUNT'}
                                    className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none transition-all hover:border-border/80 cursor-pointer"
                                >
                                    <option value="ACCOUNT">Account (Email/Pass)</option>
                                    <option value="CREDIT">Credit (Code/Topup)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium block text-foreground">Price (Rp)</label>
                            <input
                                name="price"
                                type="number"
                                required
                                defaultValue={product?.price}
                                placeholder="50000"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium block text-foreground">Description</label>
                        <textarea
                            name="description"
                            defaultValue={product?.description || ''}
                            placeholder="Detailed product information..."
                            className="w-full min-h-[100px] bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 resize-none"
                        />
                    </div>

                    {error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-4 border border-destructive/20 rounded-xl flex items-start gap-3">
                            <Info className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
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
                            {isEditing ? 'Update Product' : 'Save Product'}
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
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </button>
                )}
            </div>
            {mounted && dialogContent && createPortal(dialogContent, document.body)}
        </>
    )
}
