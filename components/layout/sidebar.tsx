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
    return (
        <aside className="hidden md:flex h-screen w-[270px] flex-col bg-[#020410] text-white border-r border-[#1a1f36] select-none font-sans">
            {/* 1. BRAND HEADER - Fixed Height */}
            <div className="flex h-[90px] items-center px-7">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB] shadow-[0_4px_20px_-4px_rgba(37,99,235,0.6)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_25px_-4px_rgba(37,99,235,0.8)]">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            width={22}
                            height={22}
                            className="invert brightness-0"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[19px] font-extrabold tracking-tight text-white leading-none">
                            DigiPrime
                        </h1>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#556987] mt-1.5">
                            Workspace
                        </span>
                    </div>
                </Link>
            </div>

            {/* 2. NAVIGATION - Flex Grow to fill space, minimal gap */}
            <nav className="flex flex-1 flex-col px-5 py-4 gap-2 overflow-hidden">
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`group flex items-center justify-between rounded-[16px] px-4 py-3.5 text-[13px] font-semibold transition-all duration-300 ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]'
                                    : 'text-[#8E94A3] hover:bg-white/[0.04] hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <route.icon
                                    className={`h-[18px] w-[18px] transition-transform duration-300 ${isActive ? 'scale-105 stroke-[2.5px]' : 'stroke-2 group-hover:scale-110'
                                        }`}
                                />
                                <span>{route.label}</span>
                            </div>

                            {/* Optional Badge - Styled like Ref */}
                            {route.badge && (
                                <span
                                    className={`flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${isActive
                                            ? 'bg-white/20 text-white backdrop-blur-sm'
                                            : 'bg-[#1a1f36] text-[#2563EB]'
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
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl bg-[#121522] border border-[#1e2336] p-4 text-[13px] font-semibold text-[#8E94A3] transition-all duration-300 hover:bg-[#1a1f36] hover:text-white group"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2336] group-hover:bg-[#2563EB] transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
