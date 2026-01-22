'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/', color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    { label: 'Products', icon: Package, href: '/products', color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
    { label: 'Stock', icon: Layers, href: '/stock', color: 'text-pink-600', bgColor: 'bg-pink-600/10' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders', color: 'text-orange-600', bgColor: 'bg-orange-600/10' },
    { label: 'Distribution', icon: Send, href: '/distribution', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Transactions', icon: Receipt, href: '/transactions', color: 'text-green-600', bgColor: 'bg-green-600/10' },
    { label: 'Users', icon: Users, href: '/users', color: 'text-blue-600', bgColor: 'bg-blue-600/10' },
    { label: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
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
        <div className="space-y-4 py-4 flex flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/40 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] w-64 hidden md:flex z-50 transition-all duration-300">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-10 mt-2 group">
                    <div className="relative w-12 h-12 mr-3 animate-in zoom-in-50 duration-500">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 group-hover:opacity-80 transition-opacity">
                        DigiPrime
                    </span>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        const isActive = pathname === route.href
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`relative flex items-center p-3 w-full text-sm font-medium rounded-xl transition-all duration-200 group overflow-hidden ${isActive
                                    ? route.color
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-tab"
                                        className={`absolute inset-0 rounded-xl ${route.bgColor} border border-border/50`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <div className="flex items-center flex-1 relative z-10">
                                    <route.icon className={`h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                                    {route.label}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="px-3 pb-6 space-y-4">
                <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-2xl p-4 border border-border/50 backdrop-blur-sm group hover:shadow-inner transition-all duration-500">
                    <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest mb-2 px-1">System Health</h3>
                    <div className="flex items-center gap-2 px-1">
                        <div className="relative">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping absolute inset-0 opacity-75"></div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 relative"></div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">OPERATIONAL</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
