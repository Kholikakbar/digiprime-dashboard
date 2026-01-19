import { LoginForm } from './login-form'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6 bg-card p-8 shadow-2xl rounded-xl border border-border/50 glass-card">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">DigiPrime Admin</h1>
                    <p className="text-sm text-muted-foreground">
                        Secure access for authorized personnel only (Super Admin, Admin).
                    </p>
                </div>
                <LoginForm />
                <div className="mt-4 text-center text-xs text-muted-foreground">
                    &copy; 2026 DigiPrime. All rights reserved.
                </div>
            </div>
        </div>
    )
}
