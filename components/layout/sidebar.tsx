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

    const sidebarVariants = {
        expanded: { width: 260 },
        collapsed: { width: 80 }
    }

    const textVariants = {
        expanded: { opacity: 1, width: 'auto', display: 'block', x: 0 },
        collapsed: { opacity: 0, width: 0, transitionEnd: { display: 'none' }, x: -10 }
    }

    return (
        <motion.aside
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:flex h-screen flex-col bg-white text-slate-900 border-r border-slate-200 select-none font-sans overflow-hidden relative z-20"
        >
            {/* 1. BRAND HEADER */}
            <div className={`flex h-16 items-center shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6 justify-between'}`}>
                <Link href="/" className="flex items-center gap-3 group overflow-hidden">
                    <motion.div
                        layout
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)]"
                    >
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            width={20}
                            height={20}
                            className="invert brightness-0"
                        />
                    </motion.div>

                    <motion.div
                        variants={textVariants}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col whitespace-nowrap overflow-hidden"
                    >
                        <h1 className="text-[18px] font-extrabold tracking-tight text-slate-900 leading-none">
                            DigiPrime
                        </h1>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                            Workspace
                        </span>
                    </motion.div>
                </Link>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`h-6 w-6 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors absolute ${isCollapsed ? 'top-20 left-1/2 -translate-x-1/2 mt-2 z-50' : 'relative ml-auto'}`}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Spacer for button when collapsed */}
            {isCollapsed && <div className="h-8"></div>}

            {/* 2. NAVIGATION */}
            <nav className="flex flex-1 flex-col px-3 py-2 gap-1 overflow-x-hidden overflow-y-auto no-scrollbar">
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            title={isCollapsed ? route.label : ''}
                            className={`group flex items-center rounded-[14px] py-2.5 transition-all duration-200 relative ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                } ${isCollapsed ? 'justify-center px-0' : 'px-4 justify-start'}`}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <route.icon
                                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-2 group-hover:scale-110'
                                        }`}
                                />
                                <motion.span
                                    variants={textVariants}
                                    transition={{ duration: 0.2 }}
                                    className="whitespace-nowrap overflow-hidden font-semibold text-[13px]"
                                >
                                    {route.label}
                                </motion.span>
                            </div>

                            {/* Active Indicator for Collapsed Mode */}
                            {isActive && isCollapsed && (
                                <motion.div
                                    layoutId="active-dot"
                                    className="absolute right-1 w-1 h-1 rounded-full bg-white"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* 3. FOOTER */}
            <div className="p-4 shrink-0 mt-auto">
                <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className={`flex w-full items-center gap-3 rounded-xl bg-white border border-slate-200 p-3 text-[12px] font-semibold text-slate-500 transition-all duration-300 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 group shadow-sm ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 group-hover:bg-red-50 transition-colors">
                        <LogOut className="h-3.5 w-3.5 group-hover:text-red-500 transition-colors" />
                    </div>
                    <motion.span
                        variants={textVariants}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                    >
                        Sign Out Account
                    </motion.span>
                </button>
            </div>
        </motion.aside>
    )
}
