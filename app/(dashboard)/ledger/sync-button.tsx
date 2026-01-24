'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { syncOrdersToLedger } from './actions'
import { useRouter } from 'next/navigation'

export function SyncOrdersButton() {
    const [isSyncing, setIsSyncing] = useState(false)
    const router = useRouter()

    const handleSync = async () => {
        if (!confirm('This will import all completed orders to the ledger. Continue?')) {
            return
        }

        setIsSyncing(true)

        const result = await syncOrdersToLedger()

        if (result.error) {
            alert(`Error: ${result.error}`)
        } else {
            alert(result.message || `Successfully synced ${result.synced} orders!`)
            router.refresh()
        }

        setIsSyncing(false)
    }

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Orders'}
        </button>
    )
}
