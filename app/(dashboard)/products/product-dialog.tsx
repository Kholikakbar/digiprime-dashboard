'use client'

import { useState } from 'react'
import { createProduct } from './actions'
import { Plus, X, Loader2 } from 'lucide-react'

export function ProductDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError('')

        const res = await createProduct(null, formData)

        if (res?.error) {
            setError(res.error)
        } else {
            setIsOpen(false)
        }
        setIsPending(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-primary/25"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
                    <h3 className="font-semibold text-lg">Add New Product</h3>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name</label>
                        <input
                            name="name"
                            required
                            placeholder="e.g. Pipit AI Premium Account"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                name="type"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="ACCOUNT">Account (Email/Pass)</option>
                                <option value="CREDIT">Credit (Code/Topup)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (Rp)</label>
                            <input
                                name="price"
                                type="number"
                                required
                                placeholder="50000"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            placeholder="Product details..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                    </div>

                    {error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center"
                        >
                            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
