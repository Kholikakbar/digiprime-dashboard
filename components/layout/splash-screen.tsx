'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Package, Sparkles, TrendingUp, ArrowRight, X } from 'lucide-react'

const features = [
    {
        title: "Smart Inventory",
        desc: "Manage account and credit stocks with real-time tracking.",
        icon: Package,
        color: "from-blue-500 to-cyan-400"
    },
    {
        title: "Auto-Fulfillment",
        desc: "Instant delivery of digital assets to your Shopee customers.",
        icon: Sparkles,
        color: "from-purple-600 to-pink-500"
    },
    {
        title: "Advanced Analytics",
        desc: "Analyze store revenue and order distribution performance.",
        icon: TrendingUp,
        color: "from-emerald-500 to-teal-400"
    }
]

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)
    const [currentStep, setCurrentStep] = useState(-1) // -1 is Logo Intro
    const [isAnimatingOut, setIsAnimatingOut] = useState(false)

    useEffect(() => {
        // Initial logo animation delay
        const timer = setTimeout(() => {
            setCurrentStep(0)
        }, 2200)

        // Auto-skip or persistent check
        const hasSeenOnboarding = localStorage.getItem('onboarding_seen')
        if (hasSeenOnboarding) {
            handleComplete()
        }

        return () => clearTimeout(timer)
    }, [])

    const handleNext = () => {
        if (currentStep === features.length - 1) {
            handleComplete()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        setIsAnimatingOut(true)
        localStorage.setItem('onboarding_seen', 'true')
        setTimeout(() => {
            setIsVisible(false)
        }, 800)
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-700 ease-in-out ${isAnimatingOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-background pointer-events-none" />

            {/* Skip Button */}
            {currentStep >= 0 && (
                <button
                    onClick={handleComplete}
                    className="absolute top-8 right-8 flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors z-20"
                >
                    SKIP TOUR <X className="h-4 w-4" />
                </button>
            )}

            <div className="relative w-full max-w-lg px-6 flex flex-col items-center">

                {/* STEP -1: LOGO INTRO */}
                {currentStep === -1 && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                        <div className="relative w-24 h-24 mb-6 animate-pulse">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping" />
                            <div className="relative glass-panel w-full h-full rounded-[2rem] flex items-center justify-center border border-white/40 p-4 shadow-2xl">
                                <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" priority />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            DIGIPRIME
                        </h1>
                        <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
                        </div>
                    </div>
                )}

                {/* STEPS 0-2: FEATURE HIGHLIGHTS */}
                {currentStep >= 0 && (
                    <div key={currentStep} className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${features[currentStep].color} flex items-center justify-center mb-10 shadow-2xl shadow-primary/20 relative`}>
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-75 animate-pulse" />
                            {(() => {
                                const Icon = features[currentStep].icon
                                return <Icon className="h-14 w-14 text-white relative z-10" />
                            })()}
                        </div>

                        <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
                            {features[currentStep].title}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xs mb-12">
                            {features[currentStep].desc}
                        </p>

                        <div className="flex items-center gap-2 mb-12">
                            {features.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="bg-primary text-white h-16 w-full rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {currentStep === features.length - 1 ? "GET STARTED" : "CONTINUE TOUR"}
                            <ArrowRight className="h-6 w-6" />
                        </button>
                    </div>
                )}
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
