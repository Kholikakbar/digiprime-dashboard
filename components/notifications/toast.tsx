'use client'

import { useEffect, useState } from 'react'
import { X, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react'

type Notification = {
    id: string
    type: 'order' | 'stock' | 'system'
    title: string
    message: string
    timestamp: Date
    read: boolean
    data?: any
}

type ToastProps = {
    notification: Notification
    onClose: () => void
}

export function Toast({ notification, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => {
            setIsVisible(true)
        })
    }, [])

    const handleClose = () => {
        setIsLeaving(true)
        setTimeout(onClose, 300)
    }

    const getIcon = () => {
        switch (notification.type) {
            case 'order':
                return <ShoppingCart className="h-5 w-5" />
            case 'stock':
                return <AlertCircle className="h-5 w-5" />
            default:
                return <CheckCircle className="h-5 w-5" />
        }
    }

    const getColors = () => {
        switch (notification.type) {
            case 'order':
                return 'from-primary/20 via-primary/10 to-transparent border-primary/30 text-primary'
            case 'stock':
                return 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30 text-amber-500'
            default:
                return 'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-500'
        }
    }

    return (
        <div
            className={`
                w-full max-w-sm bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden
                transform transition-all duration-300 ease-out
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${getColors()} pointer-events-none`} />

            <div className="relative p-4">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${getColors()}`}>
                        {getIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-foreground">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {notification.timestamp.toLocaleTimeString('id-ID')}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted/30">
                <div
                    className="h-full bg-primary animate-shrink-width"
                    style={{ animationDuration: '5s' }}
                />
            </div>
        </div>
    )
}
