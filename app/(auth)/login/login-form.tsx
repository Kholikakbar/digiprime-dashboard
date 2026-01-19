'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Loader2 } from 'lucide-react'

const initialState = {
    error: '',
}

export function LoginForm() {
    const [state, action, isPending] = useActionState(login, initialState)

    return (
        <form action={action} className="space-y-6 mt-6">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@digiprime.store"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="password"
                    name="password"
                    type="password"
                    required
                />
            </div>

            {state?.error && (
                <div className="text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20 text-center">
                    {state.error}
                </div>
            )}

            <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full shadow-md"
                type="submit"
                disabled={isPending}
            >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
            </button>
        </form>
    )
}
