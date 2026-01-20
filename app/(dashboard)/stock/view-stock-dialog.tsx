'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Key, Info, Package, Hash, CircleDollarSign } from 'lucide-react'

interface StockItem {
    id: string
    type: 'ACCOUNT' | 'CREDIT'
    status: string
    created_at: string
    products?: {
        name: string
    }
    // Account fields
    email?: string
    password?: string
    additional_info?: string
    // Credit fields
    amount?: number
    code?: string
}

interface ViewStockDialogProps {
    item: StockItem
    onClose: () => void
}

export function ViewStockDialog({ item, onClose }: ViewStockDialogProps) {
    const [mounted, setMounted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isAccount = !!item.email

    const dialogContent = mounted ? (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
            style={{ position: 'fixed', inset: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                className="bg-card w-full max-w-md rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-2 border-border animate-in zoom-in-95 duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Stock Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">Full inventory record information.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Item Type & Status */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isAccount ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                {isAccount ? <Mail className="h-5 w-5" /> : <CircleDollarSign className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">{item.products?.name}</p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold mt-0.5 ring-1 ring-inset ${item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-700 ring-green-600/20' : 'bg-red-500/10 text-red-700 ring-red-600/20'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {isAccount ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                                    <Mail className="h-3 w-3" /> Email Address
                                </label>
                                <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 font-medium break-all">
                                    {item.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                                    <Key className="h-3 w-3" /> Password
                                </label>
                                <div className="relative group">
                                    <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 font-mono text-sm pr-12">
                                        {showPassword ? item.password : '••••••••••••'}
                                    </div>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {item.additional_info && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                                        <Info className="h-3 w-3" /> Additional Info
                                    </label>
                                    <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 text-sm">
                                        {item.additional_info}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                                    <Hash className="h-3 w-3" /> Credit Amount
                                </label>
                                <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 font-bold text-xl">
                                    {item.amount}
                                </div>
                            </div>
                            {item.code && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                                        <Key className="h-3 w-3" /> Code / Token
                                    </label>
                                    <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 font-mono text-sm break-all">
                                        {item.code}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <p className="text-[10px] text-muted-foreground">Added on {new Date(item.created_at).toLocaleDateString()}</p>
                        <button
                            onClick={onClose}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null

    return mounted && dialogContent && createPortal(dialogContent, document.body)
}

// Reuse Eye icon but need to import properly if not available in scope
import { Eye } from 'lucide-react'
