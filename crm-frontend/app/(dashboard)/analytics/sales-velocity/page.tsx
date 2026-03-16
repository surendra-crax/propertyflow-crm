"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Gauge, Clock, Trophy, BarChart3 } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { toastError } from "../../../../lib/toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function SalesVelocityPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await api.get("/analytics/sales-velocity")
      setData(res.data)
    } catch {
      toastError("Failed to load Sales Velocity Data")
    }
    setLoading(false)
  }

  const formatStage = (s: any) => (typeof s === 'string' ? s.replace(/_/g, " ") : s)

  const colors = ["#cbd5e1", "#bae6fd", "#7dd3fc", "#38bdf8", "#0284c7", "#0369a1"]

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Sales Velocity Analytics"
        subtitle="Measure how fast leads move through your sales pipeline"
        badge={<Gauge className="w-5 h-5 text-indigo-500" />}
        action={
          <Button variant="outline" onClick={loadData} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-40 animate-pulse" />
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-40 animate-pulse" />
        </div>
      ) : data ? (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time to Close KPI */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                    <Trophy className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500/20" />
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5" /> Average Time to Close
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black">{data.avgLeadToBookingDays}</span>
                            <span className="text-xl font-medium text-indigo-200">Days</span>
                        </div>
                        <p className="mt-4 text-indigo-100/80 text-sm font-medium">
                            Based on {data.totalWonLeads} total deals closed. The faster this is, the higher your sales velocity.
                        </p>
                    </div>
                </div>

                {/* Explanation Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col justify-center shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-slate-400" />
                        What is Sales Velocity?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                        Sales Velocity measures how quickly you are making money. It calculates the average time it takes for a new lead to convert into a booked sale. 
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        By identifying which stage leads spend the most time in (see chart below), you can pinpoint pipeline bottlenecks and train your sales team to move deals forward faster.
                    </p>
                </div>
            </div>

            {/* Velocity Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Average Time Spent per Stage</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Average days active leads have been sitting in each pipeline stage</p>
                    </div>
                </div>
                
                <div className="p-6 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.avgDaysPerStage}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
                            <XAxis type="number" tickFormatter={(v) => `${v}d`} stroke="#94a3b8" fontSize={12} />
                            <YAxis 
                                dataKey="stage" 
                                type="category" 
                                tickFormatter={formatStage} 
                                stroke="#64748b" 
                                fontSize={11}
                                fontWeight="bold"
                            />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                formatter={(value: any) => [`${value} Days`, 'Average Time']}
                                labelFormatter={formatStage}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar 
                                dataKey="avgDays" 
                                radius={[0, 6, 6, 0]} 
                                barSize={32}
                            >
                                {data.avgDaysPerStage.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
      ) : (
          <div className="text-center py-10 text-slate-400">Failed to load sales velocity data.</div>
      )}
    </div>
  )
}
