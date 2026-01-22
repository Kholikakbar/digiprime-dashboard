'use client'

import { useState, useEffect } from 'react'
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
    Legend
} from 'recharts'
import { getRevenueData, TimeRange } from '@/app/(dashboard)/chart-actions'
import { Loader2 } from 'lucide-react'

const COLORS = ['#0ea5e9', '#d946ef', '#8b5cf6', '#f59e0b', '#10b981'] // Sky, Fuschia, Violet, Amber, Emerald

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
                <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                        <span className="font-medium">
                            {entry.name === 'revenue'
                                ? `Rp ${Number(entry.value).toLocaleString('id-ID')}`
                                : entry.value
                            }
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

interface DashboardChartsProps {
    initialRevenueData: any[]
    initialProductData: any[]
    initialStockData: any[]
}

export function DashboardCharts({
    initialRevenueData,
    initialProductData,
    initialStockData
}: DashboardChartsProps) {
    const [revenueData, setRevenueData] = useState(initialRevenueData)
    const [timeRange, setTimeRange] = useState<TimeRange>('7d')
    const [isLoading, setIsLoading] = useState(false)

    const handleRangeChange = async (range: TimeRange) => {
        setIsLoading(true)
        setTimeRange(range)
        try {
            const data = await getRevenueData(range)
            setRevenueData(data)
        } catch (error) {
            console.error('Failed to fetch chart data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ROW 1: SALES CHART */}
            <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            {timeRange === '7d' ? 'Weekly Sales' : timeRange === '30d' ? 'Monthly Sales' : 'Yearly Sales'}
                        </h3>
                        <p className="text-sm text-muted-foreground">Revenue performance over time</p>
                    </div>

                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                        {(['7d', '30d', '1y'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => handleRangeChange(range)}
                                disabled={isLoading}
                                className={`
                                    px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                                    ${timeRange === range
                                        ? 'bg-white dark:bg-background text-primary shadow-sm ring-1 ring-border/20'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5'
                                    }
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '1 Month' : '1 Year'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[350px] w-full relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(value) => `Rp${value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}k`}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                                animationDuration={1000}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ROW 2: PIE & BAR CHARTS */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Distribution */}
                <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-1">Product Distribution</h3>
                    <p className="text-sm text-muted-foreground mb-6">Sales breakdown by product</p>

                    <div className="flex-1 min-h-[300px] relative">
                        {initialProductData.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                                No sales data available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={initialProductData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {initialProductData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        content={(props) => {
                                            const { payload } = props;
                                            return (
                                                <ul className="flex flex-wrap justify-center gap-4 mt-4">
                                                    {payload?.map((entry: any, index: number) => (
                                                        <li key={`item-${index}`} className="flex items-center text-xs font-medium text-muted-foreground">
                                                            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                                                            {entry.value}: {initialProductData[index]?.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            );
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Stock Status -> Now Order Status */}
                <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-1">Order Status</h3>
                    <p className="text-sm text-muted-foreground mb-6">Overview of order processing</p>

                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={initialStockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={1000}
                                    barSize={60}
                                >
                                    {initialStockData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

