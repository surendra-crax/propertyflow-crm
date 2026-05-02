"use client"

import { useEffect, useState, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import CreateLeadModal from "@/components/leads/create-lead-modal"
import {
  Target, Phone, Calendar, Search, MessageSquare, FileText,
  ChevronLeft, ChevronRight, Filter, Plus, Flame, Thermometer,
  Snowflake, ArrowUpDown, SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  NEW:            { label: "New",            cls: "badge-new" },
  CONTACTED:      { label: "Contacted",      cls: "badge-contacted" },
  FOLLOW_UP:      { label: "Follow Up",      cls: "badge-followup" },
  SITE_VISIT_DONE:{ label: "Site Visit",     cls: "badge-visit" },
  NEGOTIATION:    { label: "Negotiation",    cls: "badge-negotiation" },
  CLOSED_WON:     { label: "Won",            cls: "badge-won" },
  CLOSED_LOST:    { label: "Lost",           cls: "badge-lost" },
}

const TEMP_CFG = {
  HOT:  { icon: Flame,       color: "text-red-500",   bg: "bg-red-500/10",   label: "HOT"  },
  WARM: { icon: Thermometer, color: "text-amber-500", bg: "bg-amber-500/10", label: "WARM" },
  COLD: { icon: Snowflake,   color: "text-blue-500",  bg: "bg-blue-500/10",  label: "COLD" },
}

function LeadCardSkeleton() {
  return (
    <div className="enterprise-card p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="shimmer h-4 w-32 rounded" />
          <div className="shimmer h-3 w-24 rounded" />
        </div>
        <div className="shimmer h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
      </div>
      <div className="shimmer h-9 w-full rounded-lg" />
    </div>
  )
}

export default function LeadsPage() {
  const queryClient   = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [search,     setSearch]     = useState("")
  const [status,     setStatus]     = useState("ALL")
  const [page,       setPage]       = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["leads", page, status, debouncedSearch],
    queryFn:  () => api.get("/leads", { params: { page, limit: 24, status, search: debouncedSearch } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const leads = data?.data || []
  const meta  = data?.meta

  async function handleExport() {
    try {
      const res  = await api.get("/exports/leads", { responseType: "blob" })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href  = url
      link.setAttribute("download", "leads.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { /* silent */ }
  }

  const onCreated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["leads"] })
  }, [queryClient])

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta?.total ?? 0} total leads
            {isFetching && !isLoading && (
              <span className="ml-2 text-primary text-xs">Refreshing…</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-muted/60 hover:bg-muted border border-border text-foreground px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <FileText className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_CFG).map(([v, c]) => (
              <option key={v} value={v}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <LeadCardSkeleton key={i} />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="enterprise-card p-16 text-center">
          <Target className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-foreground font-medium">No leads found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" /> Create your first lead
          </button>
        </div>
      ) : (
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
          {leads.map((lead: any) => {
            const sc   = STATUS_CFG[lead.status] || STATUS_CFG.NEW
            const tc   = TEMP_CFG[lead.temperature as keyof typeof TEMP_CFG] || TEMP_CFG.COLD
            const TempIcon = tc.icon
            const overdue = lead.nextFollowup && new Date(lead.nextFollowup) < new Date()

            return (
              <div
                key={lead.id}
                className="enterprise-card flex flex-col overflow-hidden group hover:border-primary/30"
              >
                <Link href={`/leads/${lead.id}`} className="p-4 flex-1">
                  {/* Name + Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {lead.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project</span>
                      <span className="text-foreground font-medium truncate max-w-[120px] text-right">{lead.project?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent</span>
                      <span className="text-foreground truncate max-w-[120px] text-right">{lead.assignedAgent?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="text-foreground tabular-nums">
                        ₹{((lead.budgetMin || 0) / 100000).toFixed(0)}L–₹{((lead.budgetMax || 0) / 100000).toFixed(0)}L
                      </span>
                    </div>
                  </div>

                  {/* Temperature + Score */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${tc.bg}`}>
                      <TempIcon className={`w-3 h-3 ${tc.color}`} />
                      <span className={`text-[9px] font-bold ${tc.color}`}>{tc.label}</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, lead.score)}%`,
                          backgroundColor: lead.score >= 60 ? "#ef4444" : lead.score >= 30 ? "#f59e0b" : "#3b82f6",
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{lead.score}pt</span>
                  </div>

                  {/* Follow-up */}
                  {lead.nextFollowup && (
                    <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${overdue ? "text-red-500" : "text-amber-500"}`}>
                      <Calendar className="w-3 h-3" />
                      {overdue ? "Overdue: " : "Follow-up: "}
                      {new Date(lead.nextFollowup).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </Link>

                {/* Action bar */}
                <div className="flex items-center border-t border-border bg-muted/30 p-2 gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${lead.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${lead.fullName}, this is regarding your interest in ${lead.project?.name || "our properties"}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between enterprise-card px-5 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{((meta.page - 1) * meta.limit) + 1}</span>
            {" "}–{" "}
            <span className="font-semibold text-foreground">{Math.min(meta.page * meta.limit, meta.total)}</span>
            {" "}of{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={meta.page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-sm font-medium text-foreground px-2">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={meta.page === meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showCreate && <CreateLeadModal onClose={() => setShowCreate(false)} onCreated={onCreated} />}
    </div>
  )
}
