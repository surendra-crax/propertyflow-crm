"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Clock, AlertTriangle, AlertCircle, Timer, RotateCcw } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { toastError } from "../../../../lib/toast"

export default function ResponseTimePage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMetrics() }, [])

  async function loadMetrics() {
    setLoading(true)
    try {
      const res = await api.get("/analytics/response-time")
      setMetrics(res.data)
    } catch {
      toastError("Failed to load response time metrics")
    }
    setLoading(false)
  }

  const formatHoursMinutes = (totalMinutes: number) => {
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      if (h > 0) return `${h}h ${m}m`
      return `${m}m`
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Lead Response Time"
        subtitle="Monitor how fast your team responds to new enquiries"
        badge={<Timer className="w-5 h-5 text-slate-400" />}
        action={
          <Button variant="outline" onClick={loadMetrics} disabled={loading} className="gap-2">
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-32 animate-pulse" />
              ))}
          </div>
      ) : metrics ? (
        <div className="space-y-6">
            {/* Top KPI row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Time Stat */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Response Time</p>
                    <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
                        {formatHoursMinutes(metrics.avgResponseTimeMinutes)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Across {metrics.totalLeads} total leads</p>
                </div>

                {/* > 15 Min Watch */}
                <div className={`border rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm transition-colors ${metrics.notContacted15Min > 0 ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${metrics.notContacted15Min > 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${metrics.notContacted15Min > 0 ? 'text-amber-700 dark:text-amber-500' : 'text-slate-500'}`}>
                        Not Contacted &gt; 15m
                    </p>
                    <p className={`text-4xl font-extrabold ${metrics.notContacted15Min > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-white'}`}>
                        {metrics.notContacted15Min}
                    </p>
                    <p className={`text-xs mt-2 ${metrics.notContacted15Min > 0 ? 'text-amber-600/70' : 'text-slate-400'}`}>Leads needing immediate attention</p>
                </div>

                {/* > 1 Hour Alert */}
                <div className={`border rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm transition-colors ${metrics.notContacted1Hour > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${metrics.notContacted1Hour > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${metrics.notContacted1Hour > 0 ? 'text-red-700 dark:text-red-500' : 'text-slate-500'}`}>
                        Not Contacted &gt; 1h
                    </p>
                    <p className={`text-4xl font-extrabold ${metrics.notContacted1Hour > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                        {metrics.notContacted1Hour}
                    </p>
                    <p className={`text-xs mt-2 ${metrics.notContacted1Hour > 0 ? 'text-red-600/70' : 'text-slate-400'}`}>Critical delays spotted</p>
                </div>
            </div>

            {/* Explanation box */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>How this is calculated:</strong> Response time is measured as the duration between the exact time a lead is created in the system and the time the first activity (Call, WhatsApp, Email, or Meeting) is logged for that lead. Fast response times (&lt; 5 mins) can multiply conversion rates by up to 9x.
            </div>
        </div>
      ) : (
          <div className="text-center py-10 text-slate-400">Failed to load metrics.</div>
      )}
    </div>
  )
}
