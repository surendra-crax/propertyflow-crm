"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { Users } from "lucide-react"

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/analytics/agent-leaderboard").then(res => {
      setAgents(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-44 bg-white rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Agents</h1>
        <p className="text-sm text-slate-400">{agents.length} agents</p>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No agents</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <div key={agent.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-indigo-500"
                  }`}>
                  #{i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{agent.name}</p>
                  <p className="text-xs text-slate-400">Agent</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{agent.leads}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Leads</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{agent.deals}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Deals</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{agent.visits}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Visits</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">₹{(agent.revenue / 100000).toFixed(0)}L</p>
                  <p className="text-[10px] text-emerald-500 uppercase">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}