import { LoginForm } from './login-form'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-background">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-purple-500/20 via-background to-background pointer-events-none" />
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-in fade-in duration-1000" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-in fade-in duration-1000" />

            <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-2xl space-y-8">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4 group">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500 scale-75" />
                            <div className="relative glass-card w-full h-full rounded-2xl flex items-center justify-center border border-white/40 dark:border-white/20 p-2">
                                <Image
                                    src="/logo.png"
                                    alt="DigiPrime"
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                            DigiPrime Admin
                        </h1>
                        <p className="text-sm text-muted-foreground/80 font-medium">
                            Secure access for authorized personnel only.
                        </p>
                    </div>

                    <LoginForm />

                    <div className="pt-4 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                            &copy; 2026 DigiPrime Portal v2.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

