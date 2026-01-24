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
    Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

// Consolidated navigation without headers to match reference style
const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Products', icon: Package, href: '/products' },
    { label: 'Stock', icon: Layers, href: '/stock' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders', badge: '12' }, // Added badge example
    { label: 'Distribution', icon: Send, href: '/distribution' },
    { label: 'Transactions', icon: Receipt, href: '/transactions', badge: '5' }, // Added badge example
    { label: 'Users', icon: Users, href: '/users' },
    { label: 'Settings', icon: Settings, href: '/settings' },
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
        <aside className="group flex flex-col h-screen w-[260px] bg-[#020412] text-white transition-all duration-300 relative z-50 overflow-hidden font-sans border-r border-white/5">
            {/* Header / Logo */}
            <div className="h-24 flex flex-col justify-center px-6 mb-2">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-[#2563EB] rounded-2xl shadow-[0_0_20px_-5px_#2563EB] group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="object-contain invert brightness-0"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-[19px] font-bold tracking-tight text-white leading-none mb-1">
                            DigiPrime
                        </h1>
                        <p className="text-[10px] font-medium text-white/40 tracking-wider uppercase">
                            Admin Space
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-hidden">
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className="block relative"
                        >
                            <div
                                className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-[#2563EB] text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]"
                                    : "text-[#8A8F9F] hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <route.icon className={`w-[20px] h-[20px] transition-transform duration-300 ${isActive ? 'scale-105 stroke-[2.5px]' : 'stroke-2'}`} />
                                    <span className="text-[14px] font-semibold tracking-wide">
                                        {route.label}
                                    </span>
                                </div>

                                {route.badge && !isActive && (
                                    <span className="bg-[#1A1F36] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {route.badge}
                                    </span>
                                )}

                                {route.badge && isActive && (
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {route.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mb-2">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-semibold text-[#8A8F9F] hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                        <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
