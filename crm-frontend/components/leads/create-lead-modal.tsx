"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import CreateLeadModal from "../../../components/leads/create-lead-modal"
import { Target, Phone, Calendar, Search, Filter, MessageSquare, FileText } from "lucide-react"
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

  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)

  async function loadLeads() {
    setLoading(true)
    try {
      const res = await api.get("/leads", {
        params: { page, limit: 24, status: statusFilter, search }
      })

      // ✅ SAFE FIX
      setLeads(res?.data?.data || [])
      setMeta(res?.data?.meta || null)

    } catch (err) {
      console.error(err)
      setLeads([]) // fallback
    }
    setLoading(false)
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      loadLeads()
    }, 300)
    return () => clearTimeout(delay)
  }, [page, statusFilter, search])

  async function handleExport() {
    try {
      const res = await api.get('/exports/leads', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'leads.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Export failed", err)
    }
  }

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
          <p className="text-sm text-slate-400 dark:text-slate-500">{meta?.total || 0} total leads</p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 bg-white dark:bg-slate-900 border px-4 py-2.5 rounded-lg text-sm">
            <FileText className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowCreate(true)} className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm">
            + Create Lead
          </button>
        </div>
      </div>

      {/* Leads */}
      {(leads?.length || 0) === 0 ? (
        <div className="text-center py-10">
          <Target className="mx-auto mb-2" />
          No leads found
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(leads || []).map((lead) => (
            <div key={lead?.id}>

              <p>{lead?.fullName || "-"}</p>
              <p>{lead?.phone || "-"}</p>

              <span>
                {(lead?.status || "").replace(/_/g, " ")}
              </span>

              <p>
                ₹{((lead?.budgetMin || 0) / 100000).toFixed(0)}L - ₹{((lead?.budgetMax || 0) / 100000).toFixed(0)}L
              </p>

            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta?.totalPages > 1 && (
        <div className="flex justify-between">
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>
            Previous
          </button>
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}>
            Next
          </button>
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
