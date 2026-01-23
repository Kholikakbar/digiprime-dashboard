'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
    HelpCircle,
    ChevronRight,
    Sparkles
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
        <aside className="group/sidebar flex flex-col h-screen w-[290px] bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 transition-all duration-300 relative z-50">
            {/* Header / Logo */}
            <div className="h-[88px] flex items-center px-8 border-b border-slate-100 dark:border-slate-800/60">
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="object-contain invert brightness-0"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                            DigiPrime
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded-md">
                                PRO
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                                Workspace
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-5 py-8 space-y-9 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {navigation.map((section) => (
                    <div key={section.name} className="space-y-3">
                        <h3 className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                            {section.name}
                        </h3>
                        <div className="space-y-1.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block relative"
                                    >
                                        <div
                                            className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                                                ? "text-white shadow-lg shadow-primary/25"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}

                                            <item.icon className={`relative z-10 w-[18px] h-[18px] transition-transform duration-300 ${isActive ? 'stroke-[2.5px] scale-105' : 'stroke-2 group-hover:scale-110'}`} />
                                            <span className={`relative z-10 text-sm font-medium transition-all duration-300 ${isActive ? 'translate-x-0.5 font-semibold' : 'group-hover:translate-x-0.5'}`}>
                                                {item.label}
                                            </span>

                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="relative z-10 ml-auto"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-5">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-0.5 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white text-xs font-bold shadow-inner">
                                AP
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                Admin Prime
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 truncate">
                                Full Access
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Settings className="w-3.5 h-3.5" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
