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
    Sparkles,
    ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

// Professional, minimal route structure
const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/' },
    { label: 'All Products', icon: Package, href: '/products' },
    { label: 'Inventory', icon: Layers, href: '/stock' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders' },
    { label: 'Distribution', icon: Send, href: '/distribution' },
    { label: 'Transactions', icon: Receipt, href: '/transactions' },
    { label: 'User Management', icon: Users, href: '/users' },
    { label: 'Settings', icon: Settings, href: '/settings' },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <aside
            className={`hidden md:flex h-screen flex-col bg-white text-slate-900 border-r border-slate-200 select-none font-sans transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'
                }`}
        >
            {/* 1. BRAND HEADER */}
            <div className={`flex h-16 items-center shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6 justify-between'}`}>
                <Link href="/" className="flex items-center gap-3 group overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)] transition-all duration-300">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            width={20}
                            height={20}
                            className="invert brightness-0"
                        />
                    </div>
                    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                        <h1 className="text-[18px] font-extrabold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                            DigiPrime
                        </h1>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1 whitespace-nowrap">
                            Workspace
                        </span>
                    </div>
                </Link>

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="h-6 w-6 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                )}
            </div>

            {/* Toggle Button for Collapsed State (Centered) */}
            {isCollapsed && (
                <div className="flex justify-center mb-2">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="h-6 w-6 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* 2. NAVIGATION - Tighter spacing to fit all items */}
            <nav className="flex flex-1 flex-col px-3 py-2 gap-1 overflow-x-hidden">
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            title={isCollapsed ? route.label : ''}
                            className={`group flex items-center justify-between rounded-[14px] py-2.5 transition-all duration-200 ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                        >
                            <div className="flex items-center gap-3">
                                <route.icon
                                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${isActive ? 'scale-105 stroke-[2.5px]' : 'stroke-2 group-hover:scale-110'
                                        }`}
                                />
                                <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>
                                    {route.label}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* 3. FOOTER / LOGOUT - Compact */}
            <div className="p-4 shrink-0 mt-auto">
                <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className={`flex w-full items-center gap-3 rounded-xl bg-white border border-slate-200 p-3 text-[12px] font-semibold text-slate-500 transition-all duration-300 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 group shadow-sm ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 group-hover:bg-red-50 transition-colors">
                        <LogOut className="h-3.5 w-3.5 group-hover:text-red-500 transition-colors" />
                    </div>
                    <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>
                        Sign Out Account
                    </span>
                </button>
            </div>
        </aside>
    )
}
