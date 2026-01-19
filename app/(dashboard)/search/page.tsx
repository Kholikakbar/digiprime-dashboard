export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q: string }
}) {
    // Await searchParams in Next.js 15+ (if applicable) or access directly. 
    // In Next 14 it's not a promise but good practice to treat as potential signal.
    const query = searchParams.q

    if (!query) {
        return (
            <div className="p-8 text-center bg-card rounded-2xl border border-border/50">
                <h2 className="text-xl font-semibold mb-2">Search DigiPrime</h2>
                <p className="text-muted-foreground">Enter a keyword to search for orders or products.</p>
            </div>
        )
    }

    const supabase = createClient()

    // Search Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5)

    // Search Orders (by ID or Buyer)
    // Note: PostgREST ilike on multiple columns requires 'or' syntax
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .or(`shopee_order_no.ilike.%${query}%,buyer_username.ilike.%${query}%`)
        .limit(5)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Results */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-muted/20">
                        <h3 className="font-semibold">Products ({products?.length || 0})</h3>
                    </div>
                    <div className="p-0">
                        {(!products || products.length === 0) ? (
                            <div className="p-4 text-sm text-muted-foreground">No products found.</div>
                        ) : (
                            <div className="divide-y divide-border/40">
                                {products.map((product) => (
                                    <div key={product.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-sm">{product.name}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{product.type.toLowerCase()}</div>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Results */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-muted/20">
                        <h3 className="font-semibold">Orders ({orders?.length || 0})</h3>
                    </div>
                    <div className="p-0">
                        {(!orders || orders.length === 0) ? (
                            <div className="p-4 text-sm text-muted-foreground">No orders found.</div>
                        ) : (
                            <div className="divide-y divide-border/40">
                                {orders.map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-sm">#{order.shopee_order_no}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>{order.status}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{order.buyer_username}</span>
                                            <span>{new Date(order.order_date).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
