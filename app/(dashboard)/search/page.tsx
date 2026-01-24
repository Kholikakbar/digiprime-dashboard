export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, ShoppingCart, Search as SearchIcon, ArrowRight } from 'lucide-react'

export default async function SearchPage(props: {
    searchParams: Promise<{ q?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams.q

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-3xl border border-slate-200 p-12 shadow-sm">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                    <SearchIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Search DigiPrime</h2>
                <p className="text-slate-500 max-w-sm">Enter a keyword in the search bar above to look for orders, products, or stock entries.</p>
            </div>
        )
    }

    const supabase = await createClient()

    // Search Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10)

    // Search Orders (by ID or Buyer)
    const { data: orders } = await supabase
        .from('orders')
        .select('*, products(name)')
        .or(`shopee_order_no.ilike.%${query}%,buyer_username.ilike.%${query}%`)
        .order('order_date', { ascending: false })
        .limit(10)

    const hasResults = (products && products.length > 0) || (orders && orders.length > 0)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Search Results</h1>
                <p className="text-slate-500 mt-1">Showing matches for "<span className="font-bold text-primary">{query}</span>"</p>
            </div>

            {!hasResults ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center bg-white rounded-3xl border border-slate-200 p-12">
                    <p className="text-slate-900 font-bold text-lg">No results found</p>
                    <p className="text-slate-500 text-sm mt-1">Try different keywords or check for typos.</p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Results */}
                    {products && products.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-black text-slate-900 px-2 uppercase tracking-widest text-xs">
                                <Package className="h-4 w-4 text-primary" />
                                Products ({products.length})
                            </h3>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products`} // We don't have individual product pages yet, so go to list
                                        className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                                                <Package className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</div>
                                                <div className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{product.type} • Stock: {product.stock_count}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-slate-900">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">Price per unit</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Results */}
                    {orders && orders.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-black text-slate-900 px-2 uppercase tracking-widest text-xs">
                                <ShoppingCart className="h-4 w-4 text-orange-500" />
                                Orders ({orders.length})
                            </h3>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/orders`}
                                        className="block p-5 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-black text-slate-900 group-hover:text-primary transition-colors">#{order.shopee_order_no}</span>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">{order.buyer_username}</p>
                                            </div>
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-slate-50 text-slate-700 border-slate-200'
                                                }`}>{order.status}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-xs text-slate-500">
                                                {order.products?.name} • {new Date(order.order_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="font-black text-primary flex items-center gap-1">
                                                Rp {Number(order.total_price).toLocaleString('id-ID')}
                                                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

