"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { ShieldAlert, AlertCircle, PhoneOff, CalendarOff, Hourglass, ArrowRight } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { toastError } from "../../../../lib/toast"
import Link from "next/link"

export default function LeadLeakagePage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadReport() }, [])

  async function loadReport() {
    setLoading(true)
    try {
      const res = await api.get("/analytics/lead-leakage")
      setReport(res.data)
    } catch {
      toastError("Failed to load Lead Leakage Report")
    }
    setLoading(false)
  }

  const formatStage = (s: string) => s.replace(/_/g, " ")

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Lead Leakage Report"
        subtitle="Identify ignored leads, process bottlenecks, and prevent sales leakage"
        badge={<ShieldAlert className="w-5 h-5 text-red-500" />}
        action={
          <Button variant="outline" onClick={loadReport} disabled={loading} className="gap-2">
            Refresh Report
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-40 animate-pulse" />
            ))}
        </div>
      ) : report ? (
        <div className="space-y-8">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Never Contacted */}
                <div className="bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/40 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-1">
                                <PhoneOff className="w-4 h-4 text-red-500" />
                                Untouched Leads
                            </p>
                            <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{report.notContacted}</h3>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-[200px]">
                                Leads that entered the system but <strong className="text-red-500">never received</strong> any logged call or message.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                        <Link href="/leads?status=NEW" className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 hover:underline">
                            View Untouched Leads <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* 2. No Recent Follow Up */}
                <div className="bg-white dark:bg-slate-900 border-2 border-amber-100 dark:border-amber-900/40 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-1">
                                <CalendarOff className="w-4 h-4 text-amber-500" />
                                Dropped Follow-ups
                            </p>
                            <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{report.noFollowUp}</h3>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-[200px]">
                                Were contacted previously, but <strong className="text-amber-500">no activity</strong> recorded in the last 3 days.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                        <Link href="/leads?status=FOLLOW_UP" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 hover:underline">
                            View Follow-ups <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* 3. Stuck Total (derived) */}
                <div className="bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-blue-900/40 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-1">
                                <Hourglass className="w-4 h-4 text-blue-500" />
                                Stuck Leads (&gt;7d)
                            </p>
                            <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
                                {Object.values<number>(report.stuckByStage).reduce((sum: number, prev: number) => sum + prev, 0)}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-[200px]">
                                Leads trapped in the same pipeline stage for <strong className="text-blue-500">over 7 days</strong> without progression.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                        <Link href="/pipeline" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 hover:underline">
                            Open Pipeline <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
                
            </div>

            {/* Stage Bottlenecks Breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <AlertCircle className="w-5 h-5 text-indigo-500" />
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Pipeline Bottleneck Report</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Leads stuck in the identical stage for more than 7 days</p>
                    </div>
                </div>
                
                <div className="p-6">
                    {Object.keys(report.stuckByStage).length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-1">Pipeline is Flowing Smoothly</h4>
                            <p className="text-sm text-slate-500">No leads have been stuck in the same stage for over 7 days.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(report.stuckByStage).map(([stage, count]: [string, any]) => (
                                <div key={stage} className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-slate-700 dark:text-slate-200 mb-1">{count}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formatStage(stage)}</span>
                                    <span className="text-[10px] text-slate-400 mt-2 font-medium bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">Stale Stage</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
      ) : (
          <div className="text-center py-10 text-slate-400">Failed to load report.</div>
      )}
    </div>
  )
}
