import { getCustomers, getAdminUsers } from './actions'
import { Users as UsersIcon, ShieldCheck, Crown, ShoppingBag, Trophy } from 'lucide-react'
import Link from 'next/link'

export default async function UsersPage(props: {
    searchParams: Promise<{ view?: string }>
}) {
    const searchParams = await props.searchParams
    const view = searchParams.view || 'customers' // Default to customers as requested

    const customers = await getCustomers()
    const admins = await getAdminUsers()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">User Management</h2>
                    <p className="text-muted-foreground mt-1">
                        {view === 'customers' ? 'Customer Relationship Management (CRM) and Loyalty Tracking.' : 'Manage system administrators and staff access.'}
                    </p>
                </div>

                <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50">
                    <Link
                        href="/users?view=customers"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'customers' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Customers (CRM)
                    </Link>
                    <Link
                        href="/users?view=admins"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'admins' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Admins
                    </Link>
                </div>
            </div>

            {view === 'customers' ? (
                <div className="space-y-6">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                            <h3 className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-1">Most Loyal</h3>
                            {customers.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{customers[0].username}</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-bold text-amber-600">{customers[0].orderCount} Orders</span>
                                            <span className="text-muted-foreground">• {formatCurrency(customers[0].totalSpent)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border/50">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Customers</h3>
                            <p className="text-3xl font-black">{customers.length}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border/50">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Active Whales</h3>
                            <p className="text-3xl font-black">{customers.filter(c => c.totalSpent > 500000).length}</p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-xs text-muted-foreground uppercase font-bold tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4 text-center">Orders</th>
                                        <th className="px-6 py-4 text-right">Total Spent</th>
                                        <th className="px-6 py-4 text-right">Last Seen</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {customers.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No customer data available yet.</td></tr>
                                    ) : (
                                        customers.map((customer, index) => {
                                            const isWhale = customer.totalSpent > 500000 // > 500 Ribu
                                            const isVip = customer.orderCount > 5

                                            return (
                                                <tr key={customer.username} className={`hover:bg-muted/30 transition-colors group ${index < 3 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                                                            index === 1 ? 'bg-slate-300 text-slate-600' :
                                                                index === 2 ? 'bg-orange-700/20 text-orange-700' :
                                                                    'bg-muted text-muted-foreground'
                                                            }`}>
                                                            #{index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                                {customer.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold flex items-center gap-2">
                                                                    {customer.username}
                                                                    {isWhale && <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                                    {isWhale ? <span className="text-amber-600 font-medium">Whale Customer</span> : 'Standard'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-foreground">
                                                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                                                            {customer.orderCount}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="font-bold text-base">{formatCurrency(customer.totalSpent)}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-muted-foreground font-mono">
                                                        {new Date(customer.lastOrder).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600">
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {admins?.map((user: any) => (
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
                    <div className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                            <UsersIcon className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-sm">Add New Admin</p>
                    </div>
                </div>
            )}
        </div>
    )
}
