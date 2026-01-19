'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { generateReport } from './report-actions'

export function DownloadReportButton() {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        try {
            setLoading(true)
            const csvData = await generateReport()

            if (!csvData) {
                alert('No data to download for this month.')
                return
            }

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `digiprime_report_${new Date().toISOString().slice(0, 10)}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Failed to download report', error)
            alert('Failed to generate report. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Report
        </button>
    )
}
