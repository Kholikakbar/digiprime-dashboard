'use client'

import { useState } from 'react'
import { addStockAccount, addStockCredit } from './actions'
import { Plus, X, Loader2 } from 'lucide-react'

export function AddStockDialog({ products }: { products: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState('ACCOUNT') // ACCOUNT or CREDIT
    const [isPending, setIsPending] = useState(false)

    // Filter products based on selected type
    const activeProducts = products.filter(p => p.type === type)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        if (type === 'ACCOUNT') {
            await addStockAccount(null, formData)
        } else {
            await addStockCredit(null, formData)
        }
        setIsPending(false)
        setIsOpen(false)
    }

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
        </button>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border/50">
                <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
                    <h3 className="font-semibold">Add New Stock</h3>
                    <button onClick={() => setIsOpen(false)}><X className="h-5 w-5" /></button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
                        <button
                            onClick={() => setType('ACCOUNT')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'ACCOUNT' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        >
                            Account
                        </button>
                        <button
                            onClick={() => setType('CREDIT')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'CREDIT' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        >
                            Credit
                        </button>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Product</label>
                            <select name="product_id" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                {activeProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {type === 'ACCOUNT' ? (
                            <>
                                <div>
                                    <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Email</label>
                                    <input name="email" type="email" required className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="user@example.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Password</label>
                                    <input name="password" type="text" required className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="secret123" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Additional Info</label>
                                    <input name="additional_info" type="text" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. Recovery Email" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Amount</label>
                                    <input name="amount" type="number" required className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="100" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium uppercase text-muted-foreground mb-1 block">Code / Token</label>
                                    <input name="code" type="text" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="XXXX-YYYY-ZZZZ" />
                                </div>
                            </>
                        )}

                        <button type="submit" disabled={isPending} className="w-full bg-primary text-primary-foreground h-10 rounded-md font-medium text-sm flex items-center justify-center mt-4">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Stock'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
