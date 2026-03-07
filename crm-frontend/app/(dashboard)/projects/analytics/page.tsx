"use client"

import { useEffect, useState } from "react"
import { api } from "../../../../lib/api"
import { BarChart3 } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

export default function ProjectAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/projects/analytics").then(res => {
      setAnalytics(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />)}
      </div>
    )
  }

  const revenueData = analytics.map(p => ({ name: p.name.split(" ")[0], revenue: p.revenue }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Project Analytics</h1>
        <p className="text-sm text-slate-400">Revenue and performance by project</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue by Project</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {analytics.map((project: any) => (
          <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">{project.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{project.location}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Leads</span>
                <span className="text-slate-600 font-medium">{project.leadsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deals</span>
                <span className="text-slate-600 font-medium">{project.dealsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revenue</span>
                <span className="text-emerald-600 font-medium">₹{(project.revenue / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Units Sold</span>
                <span className="text-slate-600">{project.soldUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inventory</span>
                <span className="text-slate-600">{project.inventoryPercent}% available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}