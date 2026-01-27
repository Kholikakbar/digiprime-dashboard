'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2, Copy, Check } from 'lucide-react'
import { deleteOrder } from './actions'
import { OrderDialog } from './order-dialog'
import { ViewOrderDialog } from './view-order-dialog'

interface OrderRowProps {
    order: any
    products: any[]
}

export function OrderRow({ order, products }: OrderRowProps) {
    const [showView, setShowView] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        // Extract buyer name (clean version)
        let buyerName = order.buyer_username || 'Kak'
        if (buyerName.includes('[WARRANTY]')) {
            buyerName = buyerName.split(')')[0].split('(')[0].replace('[WARRANTY]', '').trim()
        } else if (buyerName.includes('(Info:')) {
            buyerName = buyerName.split('(Info:')[0].trim()
        }

        // Extract account details if available
        let accountDetails = ''
        const raw = order.buyer_username || ''
        if (raw.includes('(Info:')) {
            const infoPart = raw.split('(Info:')[1]?.slice(0, -1) || ''
            const items = infoPart.split('|').map((s: string) => s.trim())
            items.forEach((item: string) => {
                const [label, ...valParts] = item.split(':')
                const val = valParts.join(':').trim()
                if (label.toLowerCase().includes('rep') || label.toLowerCase().includes('email')) {
                    accountDetails += `Email: ${val}\n`
                } else if (label.toLowerCase().includes('pass')) {
                    accountDetails += `Password: ${val}\n`
                }
            })
        }

        // Build the template message
        const productName = order.products?.name || 'Produk Digital'
        const isWarranty = raw.includes('[WARRANTY]')

        let template = `Halo Kak ${buyerName}! 👋\n\n`
        template += `Terima kasih sudah order di toko kami! ✨\n\n`
        template += `📦 Pesanan: ${productName}\n`
        template += `🔢 No. Order: ${order.shopee_order_no}\n\n`

        if (accountDetails) {
            template += `🔐 Detail Akun:\n${accountDetails}\n`
        }

        if (isWarranty) {
            template += `⚠️ Ini adalah pesanan WARRANTY/Garansi.\n\n`
        }

        template += `📌 Garansi berlaku sesuai deskripsi produk.\n`
        template += `⭐ Jangan lupa beri Bintang 5 ya Kak!\n\n`
        template += `Terima kasih! 🙏`

        try {
            await navigator.clipboard.writeText(template)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
            alert('Gagal meng-copy. Silakan coba lagi.')
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete order ${order.shopee_order_no}? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            await deleteOrder(order.id)
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Failed to delete order')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <tr className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4 font-mono font-medium">{order.shopee_order_no}</td>
                <td className="px-6 py-4">
                    {(() => {
                        const raw = order.buyer_username || ''

                        // 1. Warranty Case
                        if (raw.includes('(Info:')) {
                            const [mainPart, infoPart] = raw.split('(Info:')
                            const cleanName = mainPart.replace('[WARRANTY]', '').trim()
                            const details = infoPart.slice(0, -1) // remove trailing ')'
                            const items = details.split('|').map((s: string) => s.trim())

                            return (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 shadow-sm">
                                            WARRANTY
                                        </span>
                                        <span className="font-semibold">{cleanName}</span>
                                    </div>
                                    <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50 text-xs space-y-1.5 min-w-[240px]">
                                        {items.map((item: string, i: number) => {
                                            const [label, ...valParts] = item.split(':')
                                            const val = valParts.join(':').trim()
                                            return (
                                                <div key={i} className="grid grid-cols-[35px_1fr] gap-2">
                                                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{label}</span>
                                                    <span className="font-medium break-all select-all">{val}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }

                        // 2. Fulfillment/Ref Case
                        if (raw.includes('(Ref:')) {
                            const [mainPart, refPart] = raw.split('(Ref:')
                            const ref = refPart.slice(0, -1).trim()
                            return (
                                <div>
                                    <div className="font-semibold">{mainPart.trim()}</div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">REF</span>
                                        <code className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded text-[11px] border border-blue-500/20">{ref}</code>
                                    </div>
                                </div>
                            )
                        }

                        // 3. Normal Case
                        return <span className="font-semibold">{raw}</span>
                    })()}
                </td>
                <td className="px-6 py-4">{order.products?.name || 'Unknown Product'}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {order.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                    {(() => {
                        const maxQuota = order.products?.type === 'ACCOUNT' ? 10 : 1
                        let currentRefills = 0
                        try {
                            const parsed = order.notes ? JSON.parse(order.notes) : []
                            currentRefills = Array.isArray(parsed) ? parsed.length : 0
                        } catch (e) {
                            currentRefills = 0
                        }

                        const percentage = Math.min((currentRefills / maxQuota) * 100, 100)

                        return (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[11px] font-bold text-green-500 uppercase tracking-tight">Active</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground mb-1">{currentRefills}/{maxQuota}</span>
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden border border-border/30">
                                        <div
                                            className="h-full bg-green-500/40 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                    {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-md transition-colors ${copied ? 'bg-green-500/10 text-green-600' : 'hover:bg-emerald-500/10 hover:text-emerald-600 text-muted-foreground'}`}
                            title="Copy Template Pesanan"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={() => setShowView(true)}
                            className="p-2 hover:bg-primary/10 hover:text-primary rounded-md text-muted-foreground transition-colors"
                            title="View"
                        >
                            <Eye className="h-4 w-4" />
                        </button>

                        <OrderDialog
                            order={order}
                            products={products}
                            trigger={
                                <button
                                    className="p-2 hover:bg-blue-500/10 hover:text-blue-600 rounded-md text-muted-foreground transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            }
                        />

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </td>
            </tr>

            {showView && <ViewOrderDialog order={order} onClose={() => setShowView(false)} />}
        </>
    )
}
