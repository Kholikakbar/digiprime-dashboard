'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Send,
    Receipt,
    Users,
    Settings
} from 'lucide-react'

const routes = [
    { label: 'Overview', icon: LayoutDashboard, href: '/', color: 'text-sky-500' },
    { label: 'Products', icon: Package, href: '/products', color: 'text-violet-500' },
    { label: 'Stock', icon: Layers, href: '/stock', color: 'text-pink-600' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders', color: 'text-orange-600' },
    { label: 'Distribution', icon: Send, href: '/distribution', color: 'text-emerald-500' },
    { label: 'Transactions', icon: Receipt, href: '/transactions', color: 'text-green-600' },
    { label: 'Users', icon: Users, href: '/users', color: 'text-blue-600' },
    { label: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-500' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r border-border/40 shadow-xl w-64 hidden md:flex z-50">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-10 mt-2">
                    <div className="relative w-9 h-9 mr-3 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-sm">DP</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        DigiPrime
                    </span>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/60 rounded-xl transition-all duration-200 ${pathname === route.href ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground'
                                }`}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={`h-5 w-5 mr-3 transition-colors ${pathname === route.href ? route.color : 'text-muted-foreground group-hover:text-foreground'}`} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 pb-4">
                <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-4 border border-border/50 backdrop-blur-sm">
                    <h3 className="font-semibold text-xs mb-2">DigiPrime System</h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-xs text-muted-foreground">Operational</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
