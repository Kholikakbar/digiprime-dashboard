import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { AIChatbot } from '@/components/ai-chatbot'
import { NotificationProvider } from '@/components/notifications'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <NotificationProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none z-0" />
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />

                    <Navbar user={user} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-2 z-0 pb-20 scroll-smooth">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>

                    {/* AI Chatbot - Available on all dashboard pages */}
                    <AIChatbot />
                </div>
            </div>
        </NotificationProvider>
    )
}

