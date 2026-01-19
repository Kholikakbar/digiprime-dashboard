import { Send, CheckCircle2 } from 'lucide-react'

export default function DistributionPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Distribution</h2>
                <p className="text-muted-foreground mt-1">Automated product delivery system.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/40 bg-card p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px] gap-4">
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 animate-pulse">
                        <Send className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">Auto-Distribution Active</h3>
                    <p className="text-muted-foreground max-w-sm">
                        The system is currently monitoring for new paid orders. Products will be automatically assigned and sent to chat.
                    </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Recent Deliveries
                    </h3>
                    <div className="space-y-4">
                        {/* Mock Data */}
                        <div className="text-sm text-center text-muted-foreground py-10">
                            No recent deliveries logged.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
