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
import { TrendingUp, Package, ShoppingCart, PieChart as PieIcon, Activity, Flame } from 'lucide-react'

const INFOGRAPHIC_COLORS = [
    '#FF6B6B', // Red/Pink
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#1A535C', // Dark Teal
    '#FF9F1C', // Orange
    '#7067CF', // Purple
    '#2CB67D', // Green
]

const CustomTooltip = ({ active, payload, label, currency = false }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-100 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">{label}</p>
                <div className="flex items-center gap-3">
                    <div
                        className="h-4 w-4 rounded-full shadow-inner"
                        style={{ backgroundColor: payload[0].color || payload[0].fill }}
                    />
                    <p className="text-base font-black text-slate-800 italic">
                        {currency
                            ? `Rp ${Number(payload[0].value).toLocaleString('id-ID')}`
                            : `${payload[0].value} Qty`}
                    </p>
                </div>
            </div>
        )
    }
    return null
}

// Custom shape for horizontal bars with pointy ends (like the reference image top-left)
const PointyBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const arrowWidth = 15;

    return (
        <path
            d={`M${x},${y} L${x + width - arrowWidth},${y} L${x + width},${y + height / 2} L${x + width - arrowWidth},${y + height} L${x},${y + height} Z`}
            fill={fill}
            className="drop-shadow-sm transition-all duration-300 hover:opacity-80"
        />
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">

            {/* 1. MOUNTAIN REVENUE CHART (Style inspired by bottom-right of reference) */}
            <div className="col-span-full lg:col-span-2 rounded-[2rem] border-4 border-slate-50 bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <div className="flex items-center justify-between mb-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white rotate-3">
                            <Activity className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800 tracking-tight">Revenue Peaks</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">7-Day Financial Trajectory</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        LIVE ANALYTICS
                    </div>
                </div>

                <div className="h-[350px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a1b2', fontWeight: 800 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a1b2', fontWeight: 800 }}
                                tickFormatter={(value) => `${(value / 1000)}k`}
                            />
                            <Tooltip content={<CustomTooltip currency={true} />} />
                            <Area
                                type="stepAfter"
                                dataKey="revenue"
                                stroke="#6366f1"
                                strokeWidth={5}
                                fillOpacity={1}
                                fill="url(#mountainGradient)"
                                animationDuration={2500}
                                animationEasing="ease-in-out"
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="none"
                                fill="#a855f7"
                                fillOpacity={0.1}
                                animationDuration={3000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. INFOGRAPHIC PIE (Style inspired by pie charts in reference) */}
            <div className="rounded-[2rem] border-4 border-slate-50 bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col group">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-14 w-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 text-white -rotate-3">
                        <PieIcon className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">Order Flux</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Distribution</p>
                    </div>
                </div>

                <div className="h-[300px] w-full flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="45%"
                                innerRadius={75}
                                outerRadius={105}
                                paddingAngle={10}
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={4}
                                animationBegin={200}
                                animationDuration={1800}
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="diamond"
                                wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-3xl font-black text-slate-800 tracking-tighter">
                            {orderStatusData.reduce((a, b) => a + b.value, 0)}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-[-4px]">TOTAL</p>
                    </div>
                </div>
            </div>

            {/* 3. ARROW BARS (Style inspired by top-left bar charts in reference) */}
            <div className="col-span-full rounded-[2rem] border-4 border-slate-50 bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] mt-4 group">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 text-white rotate-2">
                            <Flame className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800 tracking-tight">Top Velocity Products</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Leaders by Quantity</p>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full px-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={salesByProductData}
                            margin={{ top: 0, right: 60, left: 40, bottom: 20 }}
                            barGap={20}
                        >
                            <CartesianGrid strokeDasharray="10 10" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={140}
                                tick={{ fontSize: 13, fill: '#1e293b', fontWeight: 900, italic: true }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                            />
                            <Bar
                                dataKey="sales"
                                shape={<PointyBar />}
                                barSize={40}
                                animationDuration={2000}
                            >
                                {salesByProductData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length]} />
                                ))}
                                <LabelList
                                    dataKey="sales"
                                    position="right"
                                    style={{ fill: '#475569', fontSize: '14px', fontWeight: 900, fontFamily: 'monospace' }}
                                    offset={15}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
