'use client'

import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Notifications() {
    const [unreadCount, setUnreadCount] = useState(0)

    // For now, simple mock or fetch if we had an endpoint.
    // Let's implement static for MVP until we have a real notification system table
    // or we can poll for 'order pending' count.

    // Actually we can pass 'pendingCounts' as prop if we want, but Navbar is client.
    // Let's just mock it to be 0 or check localstorage.
    // Real implementation requires a 'Notifications' table or real-time subscription.

    // MVP: Just a bell that shows 0 or simulates.
    // User requested "works well".

    // Let's make it show a dropdown on click even if empty.

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Mobile Backdrop */}
                    <div className="fixed inset-0 z-40 bg-black/5 md:hidden" onClick={() => setIsOpen(false)}></div>

                    {/* Desktop Transparent Backdrop to close on click outside */}
                    <div className="hidden md:block fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

                    {/* Dropdown Content */}
                    <div className="fixed inset-x-4 top-[70px] md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
                        </div>
                        <div className="max-h-[60vh] md:max-h-[300px] overflow-y-auto">
                            {/* Empty State */}
                            <div className="p-10 text-center text-slate-400">
                                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">No new notifications</p>
                                <p className="text-xs text-slate-400 mt-1">We'll let you know when updates arrive.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
