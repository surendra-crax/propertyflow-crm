"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import CreateLeadModal from "../../../components/leads/create-lead-modal"
import { Target, Phone, Calendar, Search, Filter, MessageSquare } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30",
  CONTACTED: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-900/30",
  FOLLOW_UP: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30",
  SITE_VISIT_DONE: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/30",
  NEGOTIATION: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-900/30",
  CLOSED_WON: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30",
  CLOSED_LOST: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/30",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  async function loadLeads() {
    try {
      const res = await api.get("/leads")
      setLeads(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { loadLeads() }, [])

  const filtered = leads.filter(lead => {
    const matchesSearch = lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.project?.name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-white dark:bg-slate-900 rounded-xl animate-pulse border dark:border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Leads</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-sm"
        >
          + Create Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 dark:focus:border-indigo-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/50 appearance-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="SITE_VISIT_DONE">Site Visit Done</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>
      </div>

      {/* Lead Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Target className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No leads found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-indigo-200 dark:hover:border-slate-600 transition-all flex flex-col overflow-hidden group">
              <Link href={`/leads/${lead.id}`} className="p-4 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lead.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">{lead.phone}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusColors[lead.status] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}>
                    {lead.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Project</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{lead.project?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Agent</span>
                    <span className="text-slate-600 dark:text-slate-300">{lead.assignedAgent?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Budget</span>
                    <span className="text-slate-600 dark:text-slate-300">₹{(lead.budgetMin / 100000).toFixed(0)}L - ₹{(lead.budgetMax / 100000).toFixed(0)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Source</span>
                    <span className="text-slate-600 dark:text-slate-300">{lead.source?.replace(/_/g, " ")}</span>
                  </div>
                  {lead.nextFollowup && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium">
                        <Calendar className="w-3 h-3" />
                        Follow-up
                      </span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">{new Date(lead.nextFollowup).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 flex items-center justify-between gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg text-[13px] font-medium transition-colors border border-emerald-100 dark:border-emerald-500/20"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.fullName}, this is ${lead.assignedAgent?.name || 'your agent'} from PropertyFlow regarding your interest in ${lead.project?.name || 'our properties'}. Let me know when you're available to talk.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-500 rounded-lg text-[13px] font-medium transition-colors border border-green-600 dark:border-green-500 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreated={loadLeads}
        />
      )}
    </div>
  )
}