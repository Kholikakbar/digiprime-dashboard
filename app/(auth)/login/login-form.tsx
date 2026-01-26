'use client'

import { useState, useActionState, useEffect } from 'react'
import { login } from './actions'
import { Loader2, Eye, EyeOff, Check } from 'lucide-react'

const initialState = {
    error: '',
}

const STORAGE_KEY = 'digiprime_saved_credentials'

export function LoginForm() {
    const [state, action, isPending] = useActionState(login, initialState)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    // Load saved credentials on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const { email: savedEmail, password: savedPassword } = JSON.parse(saved)
                if (savedEmail) setEmail(savedEmail)
                if (savedPassword) setPassword(savedPassword)
                setRememberMe(true)
            }
        } catch (e) {
            console.error('Failed to load saved credentials')
        }
    }, [])

    // Save or clear credentials when rememberMe changes or form submits
    const handleSubmit = (formData: FormData) => {
        if (rememberMe) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            }))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
        action(formData)
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="flex h-12 w-full rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/20 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none backdrop-blur-sm"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@digiprime.store"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1" htmlFor="password">
                        Password
                    </label>
                    <div className="relative group/pass">
                        <input
                            className="flex h-12 w-full rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/20 pl-4 pr-12 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none backdrop-blur-sm"
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                            rememberMe 
                                ? 'bg-primary border-primary text-white' 
                                : 'border-white/40 dark:border-white/20 bg-white/20 dark:bg-black/20'
                        }`}
                    >
                        {rememberMe && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>
                    <label 
                        onClick={() => setRememberMe(!rememberMe)}
                        className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    >
                        Ingat Saya (Simpan Email & Password)
                    </label>
                </div>
            </div>

            {state?.error && (
                <div className="text-destructive text-xs font-bold p-4 bg-destructive/10 rounded-2xl border border-destructive/20 text-center animate-in shake-in-1 duration-300">
                    {state.error}
                </div>
            )}

            <button
                className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                type="submit"
                disabled={isPending}
            >
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <span className="flex items-center">
                        Login
                    </span>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform translate-y-full group-hover:translate-y-0" />
            </button>
        </form>
    )
}

