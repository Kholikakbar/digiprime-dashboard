'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    ChevronRight,
    Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/', color: 'text-primary', activeColor: 'text-white', bgColor: 'bg-primary' },
    { label: 'Products', icon: Package, href: '/products', color: 'text-violet-500', activeColor: 'text-white', bgColor: 'bg-violet-600' },
    { label: 'Stock', icon: Layers, href: '/stock', color: 'text-pink-600', activeColor: 'text-white', bgColor: 'bg-pink-600' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders', color: 'text-amber-600', activeColor: 'text-white', bgColor: 'bg-amber-600' },
    { label: 'Distribution', icon: Send, href: '/distribution', color: 'text-emerald-500', activeColor: 'text-white', bgColor: 'bg-emerald-600' },
    { label: 'Transactions', icon: Receipt, href: '/transactions', color: 'text-green-600', activeColor: 'text-white', bgColor: 'bg-green-600' },
    { label: 'Users', icon: Users, href: '/users', color: 'text-blue-600', activeColor: 'text-white', bgColor: 'bg-blue-600' },
    { label: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-500', activeColor: 'text-white', bgColor: 'bg-slate-600' },
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
        <div className="flex flex-col h-screen w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden relative">
            {/* Background Accent Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Logo Section */}
            <div className="px-8 pt-8 pb-6 flex flex-col gap-1 select-none relative z-10">
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="relative w-10 h-10 bg-gradient-to-tr from-primary to-purple-600 p-2 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            fill
                            className="object-contain p-2 invert brightness-0"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            DigiPrime
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5" /> Dashboard v2
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-hidden relative z-10 pt-1">
                <p className="px-4 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Main Menu</p>
                {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`group relative flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300 overflow-hidden ${isActive
                                ? 'shadow-lg shadow-black/5 ring-1 ring-slate-200/50 dark:ring-slate-700/50'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`absolute inset-0 ${route.bgColor} opacity-[0.03] dark:opacity-[0.08]`}
                                    />
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-3.5 relative z-10">
                                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive
                                    ? `${route.bgColor} text-white shadow-lg shadow-${route.bgColor}/30 scale-105`
                                    : `bg-slate-100 dark:bg-slate-800/60 ${route.color} group-hover:scale-105`
                                    }`}>
                                    <route.icon className="h-4.5 w-4.5" />
                                </div>
                                <span className={`text-[13px] font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-white' : 'group-hover:text-slate-900 dark:group-hover:text-white'
                                    }`}>
                                    {route.label}
                                </span>
                            </div>

                            <ChevronRight className={`h-3.5 w-3.5 transition-all duration-500 ${isActive
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
                                } ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />

                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-line"
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${route.bgColor}`}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section - Profile & Logout */}
            <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800/60 relative z-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
                <div className="mb-3 px-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px] shadow-md shadow-primary/20">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-950">
                            AD
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">Admin Prime</span>
                        <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Full Access Account</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-[12px] font-bold text-red-500 hover:text-white bg-red-500/5 hover:bg-red-500 border border-red-500/10 hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-500/30 group"
                >
                    <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Sign Out Account
                </button>
            </div>
        </div>
    )
}

