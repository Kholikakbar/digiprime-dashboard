'use client'

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart
} from 'recharts'
import { TrendingUp, Package, ShoppingCart, PieChart as PieIcon } from 'lucide-react'

const COLORS = {
    revenue: ['#8b5cf6', '#a78bfa'],
    orders: ['#f43f5e', '#fb7185'],
    stock: ['#f97316', '#fb923c'],
    success: ['#22c55e', '#4ade80'],
    donut: ['#8b5cf6', '#f43f5e', '#f97316', '#22c55e', '#3b82f6']
}

const CustomTooltip = ({ active, payload, label, currency = false }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">{label}</p>
                <div className="flex items-center gap-2">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: payload[0].color || payload[0].fill }}
                    />
                    <p className="text-sm font-bold text-foreground">
                        {currency
                            ? `Rp ${Number(payload[0].value).toLocaleString('id-ID')}`
                            : `${payload[0].value} units`}
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function DashboardCharts({
    revenueData,
    salesByProductData,
    orderStatusData
}: {
    revenueData: any[]
    salesByProductData: any[]
    orderStatusData: any[]
}) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Area Chart: Revenue Trend */}
            <div className="col-span-full lg:col-span-2 rounded-2xl border border-border/40 bg-card p-6 shadow-sm group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Revenue Dynamics</h3>
                            <p className="text-xs text-muted-foreground">Earnings performance over last 7 days</p>
                        </div>
                    </div>
                </div>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                tickFormatter={(value) => `${(value / 1000)}k`}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip currency={true} />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Donut Chart: Order Status */}
            <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-[#f43f5e1a] rounded-xl text-[#f43f5e]">
                        <PieIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">Order Status</h3>
                        <p className="text-xs text-muted-foreground">Distribution by lifecycle</p>
                    </div>
                </div>
                <div className="h-[280px] w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                                animationBegin={0}
                                animationDuration={1500}
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS.donut[index % COLORS.donut.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Horizontal Bar Chart: Sales by Product */}
            <div className="col-span-full rounded-2xl border border-border/40 bg-card p-6 shadow-sm group hover:shadow-md transition-all duration-300 mt-2">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#f973161a] rounded-xl text-[#f97316]">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Market Leaderboards</h3>
                            <p className="text-xs text-muted-foreground">Top 5 digital products by volume</p>
                        </div>
                    </div>
                </div>
                <div className="h-[350px] w-full px-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={salesByProductData}
                            margin={{ top: 0, right: 40, left: 20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="barGradient" x1="1" y1="0" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" opacity={0.3} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={120}
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            />
                            <Bar
                                dataKey="sales"
                                fill="url(#barGradient)"
                                radius={[0, 8, 8, 0]}
                                barSize={32}
                                animationDuration={1800}
                                background={{ fill: '#f8fafc', radius: 8 }}
                                label={{ position: 'right', fill: '#64748b', fontSize: 13, fontWeight: 700, offset: 12 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
