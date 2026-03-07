"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { Building2 } from "lucide-react"

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/brokers").then(res => {
      setBrokers(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Brokers</h1>
        <p className="text-sm text-slate-400">{brokers.length} brokers</p>
      </div>

      {brokers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No brokers</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {brokers.map(broker => {
            const totalRevenue = broker.deals?.reduce((sum: number, d: any) => sum + d.saleValue, 0) || 0
            return (
              <div key={broker.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                    {broker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{broker.name}</p>
                    <p className="text-xs text-slate-400">{broker.company}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone</span>
                    <span className="text-slate-600">{broker.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commission Rate</span>
                    <span className="text-slate-600">{broker.commission}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deals Closed</span>
                    <span className="text-slate-600 font-medium">{broker.deals?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revenue Generated</span>
                    <span className="text-emerald-600 font-medium">₹{(totalRevenue / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}