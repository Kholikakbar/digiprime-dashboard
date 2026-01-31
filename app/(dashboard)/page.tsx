import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DollarSign, Package, ShoppingCart, Activity, TrendingUp, Users } from 'lucide-react'

import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { DownloadReportButton } from '@/components/dashboard/download-button'
import { RealTimeClock } from '@/components/dashboard/real-time-clock'

export const dynamic = 'force-dynamic'

async function getStats() {
    const supabase = await createClient()
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // 1. Total Revenue (ALL TIME) - Sum of ALL completed orders
    const { data: allCompletedOrders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'COMPLETED')

    const totalRevenue = allCompletedOrders?.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0) || 0

    // Revenue this month for comparison
    const { data: monthOrders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'COMPLETED')
        .gte('order_date', firstDayOfMonth)

    const salesMonth = monthOrders?.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0) || 0

    // 2. Active Orders (Pending/Processing)
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['PENDING', 'PROCESSING'])

    // 3. Completed Orders (All time)
    const { count: completedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED')

    // 4. Stock Counts
    const { count: stockAccounts } = await supabase
        .from('stock_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE')

    const { count: stockCredits } = await supabase
        .from('stock_credits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'AVAILABLE')

    return {
        totalRevenue,
        salesMonth,
        stockAccounts: stockAccounts || 0,
        stockCredits: stockCredits || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0
    }
}

async function getChartsData() {
    const supabase = await createClient()

    // 1. Revenue Trend (Last 7 Days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_price, order_date, status')
        .eq('status', 'COMPLETED')
        .gte('order_date', sevenDaysAgo.toISOString())
        .order('order_date', { ascending: true })

    // Process daily revenue
    const revenueMap = new Map<string, number>()
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // Format: 'Jan 20' or '20 Jan'
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        revenueMap.set(key, 0)
    }

    recentOrders?.forEach(order => {
        const d = new Date(order.order_date)
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        if (revenueMap.has(key)) {
            revenueMap.set(key, (revenueMap.get(key) || 0) + Number(order.total_price))
        }
    })

    const revenueData = Array.from(revenueMap).map(([date, revenue]) => ({ date, revenue }))


    // 2. Sales by Product
    const { data: productSales } = await supabase
        .from('orders')
        .select('quantity, products(name)')
        .eq('status', 'COMPLETED')

    const productMap = new Map<string, number>()
    productSales?.forEach((order: any) => {
        const productName = order.products?.name || 'Unknown'
        productMap.set(productName, (productMap.get(productName) || 0) + order.quantity)
    })

    const salesByProductData = Array.from(productMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5) // Top 5

    // 3. Order Status Distribution
    const { data: statusData } = await supabase
        .from('orders')
        .select('status')

    const statusMap = new Map<string, number>()
    statusData?.forEach(order => {
        const status = order.status
        statusMap.set(status, (statusMap.get(status) || 0) + 1)
    })

    const orderStatusData = Array.from(statusMap).map(([name, value]) => ({ name, value }))

    return { revenueData, salesByProductData, orderStatusData }
}

async function getRecentOrders() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('orders')
        .select('id, shopee_order_no, total_price, status, order_date, products(name, type)')
        .order('order_date', { ascending: false })
        .limit(3)

    return data || []
}

async function getStockAlerts() {
    // Determine low stock by checking actual counts in stock tables
    // This is a bit heavy, strictly for MVP we might just check 'products' if we had a count trigger.
    // For now, let's just fetch products and their counts if possible, or skip complex logic.
    // Let's rely on the 'stock_count' column in products table, assuming we will add a trigger later.
    const supabase = await createClient()
    const { data } = await supabase
        .from('products')
        .select('id, name, stock_count, type')
        .lt('stock_count', 10)
        .eq('is_active', true)
        .limit(3)

    return data || []
}

import { getRevenueData, getOrderStatusData, getProductDistributionData } from './chart-actions'

// ... existing imports

export default async function DashboardPage() {
    const stats = await getStats()
    const recentOrders = await getRecentOrders()
    const lowStockProducts = await getStockAlerts()

    // Initial Chart Data (7 Days default)
    const revenueData = await getRevenueData('7d')
    const orderStatusData = await getOrderStatusData()
    const productDistributionData = await getProductDistributionData()

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative">
                    <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-in fade-in slide-in-from-bottom-2">
                        Dashboard Overview
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-lg text-lg">
                        Real-time updates for <span className="font-semibold text-foreground">DigiPrime</span> store performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <RealTimeClock />
                    <DownloadReportButton />
                </div>
            </div>

            <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="glass-panel p-4 sm:p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div
                        className="text-lg sm:text-2xl font-bold mb-1 relative tracking-tight"
                        title={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
                    >
                        Rp {stats.totalRevenue.toLocaleString('id-ID')}
                    </div>
                    <p className="text-xs text-green-600 flex items-center font-medium">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        All-time revenue
                    </p>
                </div>

                {/* Card 2 */}
                <div className="glass-panel p-4 sm:p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Active Orders</span>
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500 shrink-0">
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold mb-1 relative tracking-tight" title={`${stats.pendingOrders} pending`}>
                        {stats.pendingOrders} <span className="text-sm font-normal text-muted-foreground">pending</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.completedOrders} completed orders
                    </p>
                </div>

                {/* Card 3 */}
                <div className="glass-panel p-4 sm:p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Akun Stock</span>
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500 shrink-0">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold mb-1 relative tracking-tight">
                        {stats.stockAccounts} <span className="text-sm font-normal text-muted-foreground">units</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Available for sale</p>
                </div>

                {/* Card 4 */}
                <div className="glass-panel p-4 sm:p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex items-center justify-between space-y-0 pb-3 relative">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Kredit Stock</span>
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 shrink-0">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold mb-1 relative tracking-tight">
                        {stats.stockCredits} <span className="text-sm font-normal text-muted-foreground">units</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Available for sale</p>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <DashboardCharts
                initialRevenueData={revenueData}
                initialProductData={productDistributionData}
                initialStockData={orderStatusData}
            />

            {/* Recent Activity / Charts Section */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <div className="col-span-1 lg:col-span-4 rounded-3xl border border-white/20 bg-white/60 dark:bg-card/50 backdrop-blur-md p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Recent Orders</h3>
                        <Link href="/orders" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-8">No recent orders found.</p>
                        ) : (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${order.products?.type === 'ACCOUNT' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                            {order.products?.type === 'ACCOUNT' ? 'AC' : 'CR'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Order #{order.shopee_order_no}</p>
                                            <p className="text-xs text-muted-foreground">{order.products?.name || 'Unknown Product'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${order.status === 'COMPLETED' ? 'bg-green-400/10 text-green-500 ring-green-400/20' :
                                            order.status === 'PENDING' ? 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20' :
                                                'bg-gray-400/10 text-gray-500 ring-gray-400/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-3 rounded-3xl border border-white/20 bg-white/60 dark:bg-card/50 backdrop-blur-md p-6 shadow-lg">
                    <h3 className="font-semibold text-lg mb-4">Stock Alerts</h3>
                    <div className="space-y-4">
                        {lowStockProducts.length === 0 ? (
                            <div className="p-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">All Good</h4>
                                </div>
                                <p className="text-xs text-green-600/80 dark:text-green-300">
                                    Stock levels are healthy.
                                </p>
                            </div>
                        ) : (
                            lowStockProducts.map((product) => (
                                <div key={product.id} className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity className="h-4 w-4 text-red-600" />
                                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">Low Stock Warning</h4>
                                    </div>
                                    <p className="text-xs text-red-600/80 dark:text-red-300">
                                        {product.name} is running low ({product.stock_count} left).
                                    </p>
                                    <Link href="/stock" className="mt-3 inline-block text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors dark:bg-red-900/40 dark:text-red-300">
                                        Replenish Stock
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
