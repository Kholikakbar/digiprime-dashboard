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
    AreaChart,
    LabelList
} from 'recharts'
import { TrendingUp, Package, PieChart as PieIcon, Activity, Flame, ChevronRight } from 'lucide-react'

const COLORS = [
    '#6366f1', // Indigo
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
]

const CustomTooltip = ({ active, payload, label, currency = false }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">{label}</p>
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: payload[0].color || payload[0].fill }}
                    />
                    <p className="text-sm font-bold text-slate-900">
                        {currency
                            ? `Rp ${Number(payload[0].value).toLocaleString('id-ID')}`
                            : `${payload[0].value} Units`}
                    </p>
                </div>
            </div>
        )
    }
    return null
}

// Vertical Arrow Bar Shape
const VerticalArrowBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    if (height <= 0) return null;

    // The tip is at the top (lowest y value)
    const arrowHeight = Math.min(height * 0.2, 15);

    return (
        <g>
            <path
                d={`M${x},${y + height} L${x + width},${y + height} L${x + width},${y + arrowHeight} L${x + width / 2},${y} L${x},${y + arrowHeight} Z`}
                fill={fill}
                className="transition-all duration-500 hover:opacity-80"
            />
            {/* Subtle bottom accent */}
            <rect x={x} y={y + height - 4} width={width} height={4} fill="rgba(0,0,0,0.1)" />
        </g>
    );
};

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
        <div className="space-y-8 mb-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* 1. REVENUE TREND - Smooth & Elegant */}
                <div className="md:col-span-1 lg:col-span-2 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Revenue Performance</h3>
                                <p className="text-xs text-slate-500">Weekly financial overview</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                            <Activity className="h-3 w-3" /> Growth +12%
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickFormatter={(val) => `${val / 1000}k`}
                                />
                                <Tooltip content={<CustomTooltip currency={true} />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. ORDER DISTRIBUTION - Modern Donut */}
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                            <PieIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Order Flux</h3>
                            <p className="text-xs text-slate-500">Breakdown by status</p>
                        </div>
                    </div>

                    <div className="h-[240px] w-full flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
                            <p className="text-2xl font-black text-slate-800 tracking-tighter">
                                {orderStatusData.reduce((a, b) => a + b.value, 0)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-[-2px]">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PRODUCT VELOCITY - Vertical Arrow Bars */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Flame className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Market Leaderboards</h3>
                            <p className="text-xs text-slate-500">Top selling digital assets</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        FULL REPORT <ChevronRight className="h-3 w-3" />
                    </button>
                </div>

                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={salesByProductData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
                            <Bar
                                dataKey="sales"
                                shape={<VerticalArrowBar />}
                                animationDuration={1500}
                                barSize={40}
                            >
                                {salesByProductData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList
                                    dataKey="sales"
                                    position="top"
                                    style={{ fill: '#64748b', fontSize: '12px', fontWeight: 700 }}
                                    offset={10}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
