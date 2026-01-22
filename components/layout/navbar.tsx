'use client'

import { createClient } from '@/lib/supabase/client'
import { Notifications } from '@/components/layout/notifications'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Send,
    Receipt,
    Users,
    Settings
} from 'lucide-react'

import Image from 'next/image'

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

export function Navbar({ user }: { user: any }) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex items-center justify-between border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="relative w-10 h-10">
                            <Image
                                src="/logo.png"
                                alt="DigiPrime"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            DigiPrime
                        </span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-muted rounded-md">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/60 rounded-xl transition-all ${pathname === route.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={`h-5 w-5 mr-3 ${pathname === route.href ? route.color : 'text-muted-foreground'}`} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="p-4 border-t border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{user?.user_metadata?.full_name || 'Admin'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="flex items-center px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40 mb-2">
                <button
                    className="md:hidden mr-4 p-2 -ml-2 hover:bg-muted rounded-md text-muted-foreground"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    // @ts-ignore
                    const query = e.target.search.value
                    if (query) router.push(`/search?q=${query}`)
                }} className="hidden md:flex items-center bg-muted/40 rounded-xl px-4 py-2 border border-border/50 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Search className="h-4 w-4 text-muted-foreground mr-3" />
                    <input
                        name="search"
                        placeholder="Search orders, products, or stock..."
                        className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-muted-foreground"
                    />
                </form>

                <div className="ml-auto flex items-center gap-2 sm:gap-4">
                    <Notifications />

                    <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-medium leading-none mb-1">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                            <span className="text-xs text-muted-foreground">Full Access</span>
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20 ring-2 ring-background overflow-hidden relative">
                            {user?.user_metadata?.avatar_url ? (
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
