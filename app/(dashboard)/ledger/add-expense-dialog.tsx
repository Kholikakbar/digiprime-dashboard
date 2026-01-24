'use client'

import { useState } from 'react'
import { X, DollarSign, FileText, Tag } from 'lucide-react'
import { addExpense } from './actions'
import { useRouter } from 'next/navigation'

export function AddExpenseDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

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

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-sm hover:shadow-md"
            >
                <DollarSign className="h-4 w-4" />
                Add Expense
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setIsOpen(false)}></div>

                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Add New Expense</h3>
                                    <p className="text-sm text-slate-500 mt-1">Record a business expense or cost.</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Tag className="h-4 w-4 text-slate-400" />
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-sm"
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
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <DollarSign className="h-4 w-4 text-slate-400" />
                                        Amount (IDR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            required
                                            min="1"
                                            step="1"
                                            placeholder="0"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="e.g., Shopee Ads campaign for January"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all resize-none text-sm"
                                    ></textarea>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add Expense'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
