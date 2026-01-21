import { createClient } from '@/lib/supabase/server'
import { Save, Store, Sparkles } from 'lucide-react'
import { ProfileSettings } from '@/components/dashboard/profile-settings'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-in fade-in slide-in-from-bottom-2">
                    Settings
                </h2>
                <p className="text-muted-foreground mt-2 max-w-lg">
                    Configure your <span className="font-semibold text-foreground">DigiPrime</span> account and global application preferences.
                </p>
            </div>

            <div className="grid gap-8 max-w-3xl">
                {/* User Profile Section */}
                <ProfileSettings user={user} />

                {/* Store Profile Section */}
                <div className="space-y-4 rounded-3xl border border-white/20 bg-white/60 dark:bg-card/50 backdrop-blur-md p-6 shadow-lg">
                    <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-4">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                            <Store className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg">Store Profile</h3>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Store Name
                            <input className="mt-1 flex h-11 w-full rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-normal normal-case tracking-normal focus:ring-2 focus:ring-primary/20 transition-all outline-none" defaultValue="DigiPrime" />
                        </div>
                        <div className="grid gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Shopee Shop ID
                            <input className="mt-1 flex h-11 w-full rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-normal normal-case tracking-normal focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="e.g. 12345678" />
                        </div>
                    </div>
                </div>

                {/* Automation Section */}
                <div className="space-y-4 rounded-3xl border border-white/20 bg-white/60 dark:bg-card/50 backdrop-blur-md p-6 shadow-lg">
                    <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-4">
                        <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg">Automation</h3>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="space-y-0.5">
                            <label className="text-sm font-bold">Auto-Send Orders</label>
                            <p className="text-xs text-muted-foreground">Automatically send credentials via Shopee Chat upon payment.</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer ring-2 ring-primary/20">
                            <div className="absolute right-0.6 top-0.5 h-5 w-5 rounded-full bg-white shadow-md"></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground italic">
                        All configuration changes are applied immediately to your active instance.
                    </p>
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl font-bold text-sm flex items-center shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Save className="h-4 w-4 mr-2" />
                        Save Store Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

