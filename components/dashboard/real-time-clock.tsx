'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function RealTimeClock() {
    const [time, setTime] = useState<Date | null>(null)

    useEffect(() => {
        setTime(new Date())
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (!time) return null // Avoid hydration mismatch by rendering nothing initially

    return (
        <div className="hidden md:flex flex-col items-end mr-2 animate-in fade-in duration-500">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Clock className="h-3 w-3" /> Live Time
            </span>
            <span className="font-mono text-sm font-semibold text-foreground/80 tabular-nums">
                {time.toLocaleTimeString('id-ID', { hour12: false })}
            </span>
        </div>
    )
}
