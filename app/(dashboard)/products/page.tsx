import { getProducts } from './actions'
import { ProductDialog } from './product-dialog'
import { ProductCard } from './product-card'
import { Package } from 'lucide-react'

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
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    )
}
