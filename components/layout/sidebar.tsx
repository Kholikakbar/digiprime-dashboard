'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
    Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

// Professional, minimal route structure
const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/' },
    { label: 'All Products', icon: Package, href: '/products' },
    { label: 'Inventory', icon: Layers, href: '/stock' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders', badge: '12' },
    { label: 'Distribution', icon: Send, href: '/distribution' },
    { label: 'Transactions', icon: Receipt, href: '/transactions' },
    { label: 'User Management', icon: Users, href: '/users' },
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
        <aside className="hidden md:flex h-screen w-[280px] flex-col bg-[#0f172a] text-white border-r border-[#1e293b] select-none">
            {/* 1. BRAND HEADER - Fixed Height */}
            <div className="flex h-24 items-center px-8">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-transform duration-300 group-hover:scale-110">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            width={24}
                            height={24}
                            className="invert brightness-0"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            DigiPrime
                        </h1>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <Sparkles className="h-3 w-3 text-blue-400" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-blue-400">
                                PRO ADMIN
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* 2. NAVIGATION - Flex Grow to fill space, minimal gap */}
            <nav className="flex flex-1 flex-col px-4 py-6 gap-1.5 overflow-hidden">
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' // Active: Solid Blue + Shadow
                                    : 'text-slate-400 hover:bg-[#1e293b] hover:text-white' // Inactive: Slate + Dark Hover
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <route.icon
                                    className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-110'
                                        }`}
                                />
                                <span>{route.label}</span>
                            </div>

                            {/* Optional Badge */}
                            {route.badge && (
                                <span
                                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-md px-1.5 text-[10px] font-bold ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-[#1e293b] text-blue-400'
                                        }`}
                                >
                                    {route.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* 3. FOOTER / LOGOUT - Fixed at bottom */}
            <div className="p-6">
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#1e293b]/50 p-3 border border-[#1e293b]">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-600 p-0.5">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0f172a] text-xs font-bold text-white">
                            AD
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Admin Prime</p>
                        <p className="text-[10px] text-slate-400">Full Access</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-900/20"
                >
                    <LogOut className="h-4 w-4" />
                    SIGN OUT
                </button>
            </div>
        </aside>
    )
}
