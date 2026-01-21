'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)
    const [isAnimatingOut, setIsAnimatingOut] = useState(false)

    useEffect(() => {
        // Show splash for 2 seconds, then start exit animation
        const timer = setTimeout(() => {
            setIsAnimatingOut(true)
            // Wait for animation to finish before removing from DOM
            setTimeout(() => {
                setIsVisible(false)
            }, 800)
        }, 2200)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-700 ease-in-out ${isAnimatingOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Background elements to match the theme */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-background pointer-events-none" />

            <div className="relative flex flex-col items-center">
                {/* Logo with pulse and zoom effect */}
                <div className={`relative w-24 h-24 mb-6 transition-all duration-1000 ${isAnimatingOut ? 'scale-150 blur-xl opacity-0' : 'scale-100 animate-pulse'
                    }`}>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping" />
                    <div className="relative glass-panel w-full h-full rounded-[2rem] flex items-center justify-center border border-white/40 p-4 shadow-2xl shadow-primary/20">
                        <Image
                            src="/logo.png"
                            alt="DigiPrime"
                            width={80}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Text branding */}
                <div className={`text-center transition-all duration-700 delay-100 ${isAnimatingOut ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
                    }`}>
                    <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        DIGIPRIME
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-primary rounded-full" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
                            Admin Portal
                        </span>
                        <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-primary rounded-full" />
                    </div>
                </div>

                {/* Loading bar at the bottom */}
                <div className="absolute bottom-[-60px] w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-600 animate-[loading_2s_ease-in-out_infinite]" />
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; left: -100%; }
                    50% { width: 100%; left: 0%; }
                    100% { width: 0%; left: 100%; }
                }
            `}</style>
        </div>
    )
}
