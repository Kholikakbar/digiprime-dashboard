'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SyncPage() {
    const [jsonInput, setJsonInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleSync = async () => {
        setLoading(true)
        setResult(null)

        try {
            // Parse JSON input
            const data = JSON.parse(jsonInput)

            // Send to API
            const res = await fetch('/api/shopee/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await res.json()
            setResult(result)

        } catch (error: any) {
            setResult({ error: error.message || 'Invalid JSON format' })
        } finally {
            setLoading(false)
        }
    }

    const exampleJSON = `{
  "orders": [
    {
      "order_sn": "230125ABC123",
      "buyer_name": "Budi Santoso",
      "item_name": "PIPIT AI CREDIT",
      "order_status": "COMPLETED",
      "total_amount": 50000,
      "quantity": 1
    }
  ]
}`

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Shopee Order Sync</h1>
                            <p className="text-sm text-slate-500">Paste JSON data pesanan Shopee untuk sinkronisasi otomatis</p>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        JSON Data Pesanan
                    </label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={exampleJSON}
                        className="w-full h-64 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none bg-slate-50"
                    />

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={() => setJsonInput(exampleJSON)}
                            className="text-sm text-slate-500 hover:text-slate-700 underline"
                        >
                            Load Example
                        </button>

                        <button
                            onClick={handleSync}
                            disabled={loading || !jsonInput.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Sync Orders
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className={`rounded-2xl shadow-sm border p-6 ${result.error
                            ? 'bg-red-50 border-red-200'
                            : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {result.error ? (
                                <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                            ) : (
                                <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h3 className={`font-bold mb-2 ${result.error ? 'text-red-900' : 'text-green-900'}`}>
                                    {result.error ? 'Sync Failed' : 'Sync Success!'}
                                </h3>

                                {result.error ? (
                                    <p className="text-sm text-red-700">{result.error}</p>
                                ) : (
                                    <div className="space-y-2 text-sm text-green-800">
                                        <p><strong>Synced:</strong> {result.stats?.synced || 0} orders</p>
                                        <p><strong>Skipped:</strong> {result.stats?.skipped || 0} orders</p>
                                        <p><strong>Failed:</strong> {result.stats?.failed || 0} orders</p>
                                        {result.stats?.errors?.length > 0 && (
                                            <div className="mt-3 p-3 bg-red-100 rounded-lg">
                                                <p className="font-semibold text-red-900 mb-1">Errors:</p>
                                                <ul className="list-disc list-inside text-red-800 text-xs space-y-1">
                                                    {result.stats.errors.map((err: string, i: number) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-900 mb-3">📖 Cara Pakai:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                        <li>Buka Shopee Seller Centre → Pesanan Saya</li>
                        <li>Copy data pesanan (bisa manual atau pakai script)</li>
                        <li>Format data menjadi JSON seperti contoh di atas</li>
                        <li>Paste di kotak input, lalu klik "Sync Orders"</li>
                        <li>Data akan otomatis masuk ke dashboard!</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
