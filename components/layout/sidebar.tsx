'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Send,
    Receipt,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    HelpCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const navigation = [
    {
        name: 'Overview',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
            { label: 'Products', icon: Package, href: '/products' },
            { label: 'Stock Management', icon: Layers, href: '/stock' },
            { label: 'Orders', icon: ShoppingCart, href: '/orders' },
        ]
    },
    {
        name: 'Operations',
        items: [
            { label: 'Distribution', icon: Send, href: '/distribution' },
            { label: 'Transactions', icon: Receipt, href: '/transactions' },
            { label: 'User Access', icon: Users, href: '/users' },
        ]
    },
    {
        name: 'System',
        items: [
            { label: 'Settings', icon: Settings, href: '/settings' },
            { label: 'Help & Support', icon: HelpCircle, href: '/support' },
        ]
    }
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <aside className="group/sidebar flex flex-col h-screen w-[280px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative z-50">
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/60">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={20}
                            height={20}
                            className="object-contain invert brightness-0"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                            DigiPrime
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                            Workspace
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {navigation.map((section) => (
                    <div key={section.name} className="space-y-2">
                        <h3 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {section.name}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'stroke-[2.5px]' : 'stroke-2 group-hover:stroke-slate-900 dark:group-hover:stroke-white'}`} />
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                        {isActive && (
                                            <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full opacity-50" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-white dark:border-slate-700 shadow-sm">
                        <div className="bg-gradient-to-br from-primary to-indigo-600 w-full h-full flex items-center justify-center text-white text-xs font-bold">
                            AP
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            Admin Prime
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                            admin@digiprime.com
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
