'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DollarSign, X, Tag, FileText } from 'lucide-react'
import { addExpense } from './actions'
import { useRouter } from 'next/navigation'

export function AddExpenseDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const result = await addExpense(formData)

        if (result.success) {
            setIsOpen(false)
            router.refresh()
        } else {
            alert(result.error || 'Failed to add expense')
        }

        setIsSubmitting(false)
    }

    if (!mounted) return (
        <button
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-sm hover:shadow-md"
        >
            <DollarSign className="h-4 w-4" />
            Add Expense
        </button>
    )

    const modalContent = isOpen ? (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setIsOpen(false)
                }
            }}
        >
            <div
                className="bg-card w-full max-w-lg md:max-w-xl rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Add New Expense</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Record a business expense or cost.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-6 space-y-5">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Category
                            </label>
                            <select
                                name="category"
                                required
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer appearance-none"
                            >
                                <option value="">Select a category...</option>
                                <option value="SHOPEE_ADS">Shopee Ads</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="OPERATIONAL">Operational</option>
                                <option value="STOCK_PURCHASE">Stock Purchase</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Amount (IDR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    min="1"
                                    step="1"
                                    placeholder="0"
                                    className="w-full bg-background border-2 border-border rounded-lg pl-12 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="e.g., Shopee Ads campaign for January"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border/50 bg-muted/20 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-sm hover:shadow-md"
            >
                <DollarSign className="h-4 w-4" />
                Add Expense
            </button>
            {mounted && modalContent && createPortal(modalContent, document.body)}
        </>
    )
}
