"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { MapPin, Calendar, User } from "lucide-react"

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30",
  CANCELLED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/30",
}

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/site-visits").then(res => {
      setVisits(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Site Visits</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">{visits.length} visits</p>
      </div>

      {visits.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No site visits</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visits.map(visit => (
            <div key={visit.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{visit.lead?.fullName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{visit.lead?.phone}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusColors[visit.status]}`}>
                  {visit.status}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-300">{new Date(visit.visitDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-300">{visit.agent?.name}</span>
                </div>
                {visit.notes && (
                  <p className="text-slate-500 dark:text-slate-400 mt-2 italic">{visit.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}