'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell, Search, Menu } from 'lucide-react'

export function Navbar({ user }: { user: any }) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <div className="flex items-center px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40 mb-2">
            <button className="md:hidden mr-4 p-2 hover:bg-muted rounded-md text-muted-foreground">
                <Menu className="h-5 w-5" />
            </button>

            <div className="hidden md:flex items-center bg-muted/40 rounded-xl px-4 py-2 border border-border/50 w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="h-4 w-4 text-muted-foreground mr-3" />
                <input
                    placeholder="Search orders, products, or stock..."
                    className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-muted-foreground"
                />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium leading-none mb-1">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                        <span className="text-xs text-muted-foreground">Full Access</span>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20 ring-2 ring-background">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all ml-1"
                    title="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
