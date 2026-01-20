'use client'

import { useState } from 'react'
import { Plus, Loader2, Calendar as CalendarIcon, Package, DollarSign } from 'lucide-react'
import { createOrder } from './actions'

interface Product {
    id: string
    name: string
    price: number
}

export function CreateOrderDialog({ products }: { products: Product[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<string>('')

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProduct(e.target.value)
        const prod = products.find(p => p.id === e.target.value)
        if (prod) {
            // Auto fill price if possible, but form doesn't expose dom ref easily here without ref
            // We'll let user check price or maybe controlled input for price
            // For simplicity, let's just keep price manual or force default
            const priceInput = document.getElementById('price-input') as HTMLInputElement
            if (priceInput) priceInput.value = prod.price.toString()
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const res = await createOrder(formData)
        setLoading(false)

        if (res?.error) {
            alert(res.error)
        } else {
            setIsOpen(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
                <Plus className="h-4 w-4" />
                New Order
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg md:max-w-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-border/50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto relative">
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <h2 className="text-xl font-bold text-foreground">Create New Order</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manually record an offline or external order.</p>
                </div>

                <form action={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground">Shopee Order No</label>
                            <input
                                name="shopee_order_no"
                                required
                                placeholder="e.g. 230101ABC123"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground">Buyer Username</label>
                            <input
                                name="buyer_username"
                                required
                                placeholder="e.g. johndoe"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="text-sm font-medium mb-2 block text-foreground">Product</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                                <select
                                    name="product_id"
                                    required
                                    className="w-full bg-background border-2 border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none transition-all hover:border-border/80 cursor-pointer"
                                    onChange={handleProductChange}
                                >
                                    <option value="">Select a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground">Total Price</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none z-10">Rp</span>
                                <input
                                    id="price-input"
                                    name="total_price"
                                    type="number"
                                    required
                                    placeholder="0"
                                    className="w-full bg-background border-2 border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground">Status</label>
                            <select
                                name="status"
                                className="w-full bg-background border-2 border-border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all hover:border-border/80 cursor-pointer"
                                defaultValue="COMPLETED"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2.5 text-sm font-medium bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
