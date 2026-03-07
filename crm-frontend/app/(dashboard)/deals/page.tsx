"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { Handshake, TrendingUp } from "lucide-react"

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/deals").then(res => {
      setDeals(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const totalRevenue = deals.reduce((sum, d) => sum + d.saleValue, 0)
  const avgDealSize = deals.length > 0 ? totalRevenue / deals.length : 0

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-xl border border-transparent dark:border-slate-800 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-xl border border-transparent dark:border-slate-800 animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Deals</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">{deals.length} closed deals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Deals</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{deals.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Deal Size</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹{(avgDealSize / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Deal Cards */}
      {deals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Handshake className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No deals yet</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{deal.project?.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{deal.project?.location}</p>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{(deal.saleValue / 100000).toFixed(1)}L</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Client</span>
                  <span className="text-slate-600 dark:text-slate-300">{deal.lead?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Phone</span>
                  <span className="text-slate-600 dark:text-slate-300">{deal.lead?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Agent</span>
                  <span className="text-slate-600 dark:text-slate-300">{deal.lead?.assignedAgent?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Broker</span>
                  <span className="text-slate-600 dark:text-slate-300">{deal.broker?.name || "Direct"}</span>
                </div>
                {deal.broker && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Commission</span>
                    <span className="text-slate-600 dark:text-slate-300">₹{deal.commissionAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Closed</span>
                  <span className="text-slate-600 dark:text-slate-300">{new Date(deal.closedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}