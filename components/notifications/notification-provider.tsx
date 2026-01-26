'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/notifications/toast'

type Notification = {
    id: string
    type: 'order' | 'stock' | 'system'
    title: string
    message: string
    timestamp: Date
    read: boolean
    data?: any
}

type NotificationContextType = {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider')
    }
    return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [toasts, setToasts] = useState<Notification[]>([])
    const supabase = createClient()

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
        }

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep last 50
        setToasts(prev => [...prev, newNotification])

        // Auto remove toast after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newNotification.id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    // Subscribe to real-time order changes
    useEffect(() => {
        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const order = payload.new as any
                    addNotification({
                        type: 'order',
                        title: '🛒 Order Baru!',
                        message: `Order #${order.shopee_order_no} dari ${order.buyer_username} - Rp ${Number(order.total_price).toLocaleString('id-ID')}`,
                        data: order,
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const order = payload.new as any
                    const oldOrder = payload.old as any

                    // Notify when order status changes to COMPLETED
                    if (oldOrder.status !== 'COMPLETED' && order.status === 'COMPLETED') {
                        addNotification({
                            type: 'order',
                            title: '✅ Order Selesai!',
                            message: `Order #${order.shopee_order_no} telah selesai diproses`,
                            data: order,
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, addNotification])

    // Load initial pending orders count
    useEffect(() => {
        async function loadPendingOrders() {
            const { data } = await supabase
                .from('orders')
                .select('id, shopee_order_no, buyer_username, total_price, order_date')
                .in('status', ['PENDING', 'PROCESSING'])
                .order('order_date', { ascending: false })
                .limit(10)

            if (data && data.length > 0) {
                data.forEach(order => {
                    setNotifications(prev => {
                        // Don't add duplicates
                        if (prev.some(n => n.data?.id === order.id)) return prev
                        return [...prev, {
                            id: crypto.randomUUID(),
                            type: 'order' as const,
                            title: '⏳ Order Pending',
                            message: `Order #${order.shopee_order_no} menunggu diproses`,
                            timestamp: new Date(order.order_date),
                            read: true, // Mark initial ones as read
                            data: order,
                        }]
                    })
                })
            }
        }
        loadPendingOrders()
    }, [supabase])

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        notification={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    )
}
