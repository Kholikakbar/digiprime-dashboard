import { Settings as SettingsIcon, Save } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-slate-600">Settings</h2>
                <p className="text-muted-foreground mt-1">Configure global application settings.</p>
            </div>

            <div className="grid gap-8 max-w-2xl">
                <div className="space-y-4 rounded-xl border border-border/40 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg border-b border-border/40 pb-2 mb-4">Store Profile</h3>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Store Name</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" defaultValue="DigiPrime" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Shopee Shop ID</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" placeholder="e.g. 12345678" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-xl border border-border/40 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg border-b border-border/40 pb-2 mb-4">Automation</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Auto-Send Orders</label>
                            <p className="text-xs text-muted-foreground">Automatically send credentials via Shopee Chat upon payment.</p>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-green-500 relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"></div>
                        </div>
                    </div>
                </div>

                <button className="bg-primary text-primary-foreground h-10 px-4 rounded-lg font-medium text-sm flex items-center justify-center w-fit shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </button>
            </div>
        </div>
    )
}
