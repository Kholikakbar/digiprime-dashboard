'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function OrderSearchInput() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="relative flex-1 sm:w-72 md:w-80 lg:w-96 transition-all duration-300">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            <input
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search order ID or buyer..."
                className="pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-sm w-full outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>
    )
}
