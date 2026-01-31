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

const DELETED_NOTIFS_KEY = 'digiprime_deleted_notifications'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [toasts, setToasts] = useState<Notification[]>([])
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
    const supabase = createClient()

    // Load deleted IDs from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(DELETED_NOTIFS_KEY)
            if (saved) {
                setDeletedIds(new Set(JSON.parse(saved)))
            }
        } catch (e) {
            console.error('Failed to load deleted notifications', e)
        }
    }, [])

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
            if (deletedIds.size === 0 && localStorage.getItem(DELETED_NOTIFS_KEY)) {
                // Wait for deletedIds to load if key exists
                return
            }

            const { data } = await supabase
                .from('orders')
                .select('id, shopee_order_no, buyer_username, total_price, order_date')
                .in('status', ['PENDING', 'PROCESSING'])
                .order('order_date', { ascending: false })
                .limit(10)

            if (data && data.length > 0) {
                const newNotifs: Notification[] = []

                data.forEach(order => {
                    // Skip if this order ID (or a derived ID logic) was deleted
                    // Since we use random UUIDs for notifs, we need to track by data ID (order ID)
                    if (deletedIds.has(order.id)) return

                    newNotifs.push({
                        id: order.id, // Use order ID as notification ID for persistence logic
                        type: 'order' as const,
                        title: '⏳ Order Pending',
                        message: `Order #${order.shopee_order_no} menunggu diproses`,
                        timestamp: new Date(order.order_date),
                        read: false,
                        data: order,
                    })
                })

                setNotifications(prev => {
                    // Filter duplicates
                    const existingIds = new Set(prev.map(n => n.id))
                    const uniqueNew = newNotifs.filter(n => !existingIds.has(n.id))
                    return [...prev, ...uniqueNew]
                })
            }
        }

        loadPendingOrders()
    }, [supabase, deletedIds])

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications(prev => {
            // Add all current notification IDs (which are order IDs for pending ones) to deleted list
            const newDeleted = new Set(deletedIds)
            prev.forEach(n => {
                // If it's a persistent order notification, save its ID (n.id is order.id here)
                if (n.data?.id) newDeleted.add(n.data.id)
            })

            setDeletedIds(newDeleted)
            localStorage.setItem(DELETED_NOTIFS_KEY, JSON.stringify(Array.from(newDeleted)))

            return []
        })
    }, [deletedIds])

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
