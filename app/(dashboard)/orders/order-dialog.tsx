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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border animation-scale-in max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border/50">
                    <h2 className="text-xl font-bold">Create New Order</h2>
                    <p className="text-sm text-muted-foreground">Manually record an offline or external order.</p>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1.5 block">Shopee Order No</label>
                            <input
                                name="shopee_order_no"
                                required
                                placeholder="e.g. 230101ABC123"
                                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1.5 block">Buyer Username</label>
                            <input
                                name="buyer_username"
                                required
                                placeholder="e.g. johndoe"
                                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1.5 block">Product</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <select
                                    name="product_id"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
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
                            <label className="text-sm font-medium mb-1.5 block">Total Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-sm text-muted-foreground">Rp</span>
                                <input
                                    id="price-input"
                                    name="total_price"
                                    type="number"
                                    required
                                    placeholder="0"
                                    className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Status</label>
                            <select
                                name="status"
                                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                defaultValue="COMPLETED"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
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
