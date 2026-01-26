'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Check, Trash2, ShoppingCart, AlertCircle, Clock } from 'lucide-react'
import { useNotifications } from './notification-provider'
import Link from 'next/link'

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications()

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <ShoppingCart className="h-4 w-4" />
            case 'stock':
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case 'order':
                return 'bg-primary/10 text-primary'
            case 'stock':
                return 'bg-amber-500/10 text-amber-500'
            default:
                return 'bg-emerald-500/10 text-emerald-500'
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Baru saja'
        if (minutes < 60) return `${minutes} menit lalu`
        if (hours < 24) return `${hours} jam lalu`
        return `${days} hari lalu`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-border/40 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all shadow-sm"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute -right-16 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[90vw] bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-border/40 flex items-center justify-between bg-gradient-to-r from-primary/5 to-purple-500/5">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <Bell className="h-4 w-4 text-primary" />
                            Notifikasi
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded-full">
                                    {unreadCount} baru
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    title="Tandai semua sudah dibaca"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-xs text-muted-foreground hover:text-foreground"
                                    title="Hapus semua"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">Tidak ada notifikasi</p>
                                <p className="text-xs mt-1">Notifikasi akan muncul saat ada order baru</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`p-4 border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${getIconColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-sm text-foreground truncate">
                                                    {notification.title}
                                                </h4>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(notification.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-border/40 bg-muted/20">
                            <Link
                                href="/orders"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Lihat Semua Orders →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
