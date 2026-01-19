import { Receipt } from 'lucide-react'

export default function TransactionsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-lime-600">Transactions</h2>
                <p className="text-muted-foreground mt-1">Financial history of DigiPrime.</p>
            </div>

            <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                    <Receipt className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium">No transactions recorded yet.</p>
                    <p className="text-xs mt-1">Financial data will populate as orders are processed.</p>
                </div>
            </div>
        </div>
    )
}
