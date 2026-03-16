"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Shield, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ action: "", entityType: "", from: "", to: "" })
  const limit = 30

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (filters.action) params.set("action", filters.action)
      if (filters.entityType) params.set("entityType", filters.entityType)
      if (filters.from) params.set("from", filters.from)
      if (filters.to) params.set("to", filters.to)

      const res = await api.get(`/audit-log?${params}`)
      setLogs(res.data.logs)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [page, filters])

  useEffect(() => { loadLogs() }, [loadLogs])

  const entityColors: Record<string, string> = {
    LEAD: "text-blue-600 bg-blue-50",
    DEAL: "text-green-600 bg-green-50",
    USER: "text-purple-600 bg-purple-50",
    PAYMENT: "text-orange-600 bg-orange-50",
    SETTING: "text-slate-600 bg-slate-100",
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <PageHeader
        title="Audit Log"
        subtitle="Track every significant action taken in the system"
        badge={<Shield className="w-5 h-5 text-slate-400" />}
      />

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Action</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Filter by action..."
              value={filters.action}
              onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
            />
          </div>
        </div>
        <div className="min-w-[130px]">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Entity Type</label>
          <select
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none"
            value={filters.entityType}
            onChange={e => setFilters(f => ({ ...f, entityType: e.target.value }))}
          >
            <option value="">All</option>
            <option value="LEAD">Lead</option>
            <option value="DEAL">Deal</option>
            <option value="USER">User</option>
            <option value="PAYMENT">Payment</option>
            <option value="SETTING">Setting</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">From</label>
          <input type="date" className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">To</label>
          <input type="date" className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
        </div>
        <Button onClick={() => { setPage(1); loadLogs() }} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">Apply</Button>
        <Button onClick={() => { setFilters({ action: "", entityType: "", from: "", to: "" }); setPage(1) }} size="sm" variant="outline">Reset</Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Entity</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5].map(j => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                    No audit logs found for the selected filters.
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-[12px] text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600 dark:text-slate-300">
                    {log.userEmail || log.userId || "system"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.entityType && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${entityColors[log.entityType] || "text-slate-500 bg-slate-100"}`}>
                        {log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {log.ipAddress || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
