import { createClient } from '@/lib/supabase/server'
import { Users as UsersIcon, ShieldCheck } from 'lucide-react'

export default async function UsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase.from('users').select('*')

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">User Management</h2>
                <p className="text-muted-foreground mt-1">Manage admin access and roles.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((user: any) => (
                    <div key={user.id} className="p-6 rounded-2xl border border-border/40 bg-card shadow-sm flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-lg">{user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h4 className="font-bold">{user.full_name || 'Admin'}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
