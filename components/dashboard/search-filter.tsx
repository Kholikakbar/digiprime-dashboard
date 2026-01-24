'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface SearchFilterProps {
    placeholder?: string
    className?: string
}

export function SearchFilter({ placeholder = "Search...", className = "" }: SearchFilterProps) {
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
        <div className={`relative ${className}`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? 'text-primary animate-pulse' : 'text-slate-400'}`} />
            <input
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm w-full outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
        </div>
    )
}
