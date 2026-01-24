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
    HelpCircle,
    ChevronRight,
    Sparkles,
    Inbox
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
        <aside className="flex flex-col h-screen w-[280px] bg-[#0c111d] border-r border-[#1f2937] text-white transition-all duration-300 relative z-50">
            {/* Header / Logo */}
            <div className="h-20 flex items-center px-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9 flex items-center justify-center bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={22}
                            height={22}
                            className="object-contain invert brightness-0"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-white leading-none">
                            DigiPrime
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                                <Sparkles className="w-2 h-2" /> PRO
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-hidden px-4 py-6 space-y-8">
                {navigation.map((section) => (
                    <div key={section.name} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {section.name}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block relative"
                                    >
                                        <div
                                            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-100' : 'group-hover:scale-110'}`} />
                                            <span className={`text-[13px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                                                {item.label}
                                            </span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-indicator"
                                                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                />
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
            <div className="p-4 border-t border-[#1f2937] bg-[#0c111d]">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-[#1f2937] flex items-center justify-center border border-[#374151]">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                            AP
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">
                            Admin Prime
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 truncate">
                            admin@digiprime.store
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 px-3 py-2.5 mt-1 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all duration-200"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Account
                </button>
            </div>
        </aside>
    )
}
