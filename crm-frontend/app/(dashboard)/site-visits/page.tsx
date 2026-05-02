"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { MapPin, Calendar, User, LayoutList, CalendarDays, Navigation2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { SiteVisitCalendar } from "@/components/site-visits/calendar-view"
import Link from "next/link"

const STATUS_CFG: Record<string, { cls: string; icon: React.ElementType; label: string }> = {
  SCHEDULED: { cls: "badge-new",      icon: Clock,         label: "Scheduled" },
  COMPLETED: { cls: "badge-won",      icon: CheckCircle2,  label: "Completed" },
  CANCELLED: { cls: "badge-lost",     icon: XCircle,       label: "Cancelled" },
}

export default function SiteVisitsPage() {
  const [view, setView] = useState<"LIST" | "CALENDAR">("LIST")

  const { data = [], isLoading } = useQuery({
    queryKey: ["site-visits"],
    queryFn:  () => api.get("/site-visits").then(r => {
      const d = r.data
      return Array.isArray(d) ? d : (d?.data || [])
    }),
  })

  const visits: any[] = data
  const counts = {
    scheduled: visits.filter(v => v.status === "SCHEDULED").length,
    completed: visits.filter(v => v.status === "COMPLETED").length,
    cancelled: visits.filter(v => v.status === "CANCELLED").length,
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground">Site Visits</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{visits.length} visits · {counts.scheduled} upcoming</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/map" className="flex items-center gap-1.5 text-sm bg-muted/60 hover:bg-muted border border-border text-foreground px-3 py-2 rounded-lg font-medium transition-all">
            <Navigation2 className="w-4 h-4" /> Map View
          </Link>
          <div className="flex bg-muted/60 p-1 rounded-lg border border-border gap-1">
            {[{ val: "LIST" as const, icon: LayoutList }, { val: "CALENDAR" as const, icon: CalendarDays }].map(({ val, icon: Icon }) => (
              <button
                key={val}
                onClick={() => setView(val)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === val ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {val === "LIST" ? "List" : "Calendar"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Scheduled", value: counts.scheduled, icon: Clock,        bg: "bg-blue-500/10",    color: "text-blue-500"    },
          { label: "Completed", value: counts.completed, icon: CheckCircle2, bg: "bg-emerald-500/10", color: "text-emerald-500" },
          { label: "Cancelled", value: counts.cancelled, icon: XCircle,      bg: "bg-red-500/10",     color: "text-red-500"     },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="enterprise-card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {view === "CALENDAR" ? (
        <div className="enterprise-card p-4"><SiteVisitCalendar /></div>
      ) : isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="shimmer h-40 rounded-xl" />)}
        </div>
      ) : visits.length === 0 ? (
        <div className="enterprise-card p-16 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-medium text-foreground">No site visits yet</p>
          <p className="text-sm text-muted-foreground mt-1">Schedule a visit from a lead's detail page</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visits.map((visit: any) => {
            const sc = STATUS_CFG[visit.status] || STATUS_CFG.SCHEDULED
            const StatusIcon = sc.icon
            const visitDate  = new Date(visit.visitDate)
            const isPast     = visitDate < new Date()

            return (
              <div key={visit.id} className={`enterprise-card p-4 hover:border-primary/30 ${visit.status === "COMPLETED" ? "opacity-80" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{visit.lead?.fullName || "Unknown Lead"}</p>
                    <p className="text-xs text-muted-foreground">{visit.lead?.phone}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.cls}`}>
                    <StatusIcon className="w-3 h-3" /> {sc.label}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3 text-primary" />
                    </div>
                    <span className={`font-medium ${isPast && visit.status === "SCHEDULED" ? "text-red-500" : "text-foreground"}`}>
                      {visitDate.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                      {" · "}
                      {visitDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      {isPast && visit.status === "SCHEDULED" && " (Overdue)"}
                    </span>
                  </div>

                  {visit.agent?.name && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">{visit.agent.name}</span>
                    </div>
                  )}

                  {visit.notes && (
                    <p className="text-xs text-muted-foreground italic bg-muted/50 rounded-lg px-3 py-2 mt-2">
                      {visit.notes}
                    </p>
                  )}
                </div>

                {visit.lead?.id && (
                  <Link href={`/leads/${visit.lead.id}`} className="mt-3 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
                    View Lead →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
