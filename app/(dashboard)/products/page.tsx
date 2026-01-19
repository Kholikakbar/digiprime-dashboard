import { getProducts, deleteProduct } from './actions'
import { ProductDialog } from './product-dialog'
import { Package, Trash2, Tag, Box } from 'lucide-react'

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Products</h2>
                    <p className="text-muted-foreground mt-1">Manage your digital product catalog.</p>
                </div>
                <ProductDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-muted/20">
                        <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
                            <Package className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm text-muted-foreground mt-1">Start by adding your first digital product.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <form action={deleteProduct.bind(null, product.id)}>
                                    <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${product.type === 'ACCOUNT' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                        {product.type === 'ACCOUNT' ? <Box className="h-6 w-6" /> : <Tag className="h-6 w-6" />}
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.is_active ? 'bg-green-500/10 text-green-700 ring-green-600/20' : 'bg-gray-500/10 text-gray-700 ring-gray-600/20'}`}>
                                            {product.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                    {product.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Price</span>
                                        <span className="font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-muted-foreground block">Stock</span>
                                        <span className={`font-bold ${product.stock_count === 0 ? 'text-destructive' : ''}`}>
                                            {product.stock_count} units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
