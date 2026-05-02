"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import Link from "next/link"
import {
  FolderKanban, MapPin, Building2, Plus, Layers, Map,
  TrendingUp, Users, BarChart3, ExternalLink, CheckCircle2,
} from "lucide-react"
import CreateProjectModal from "@/components/projects/create-project-modal"

const STATUS_CFG: Record<string, { cls: string; label: string }> = {
  PRELAUNCH: { cls: "badge-followup", label: "Pre-launch" },
  ONGOING:   { cls: "badge-new",      label: "Ongoing"    },
  COMPLETED: { cls: "badge-won",      label: "Completed"  },
}

function Skeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="enterprise-card overflow-hidden">
          <div className="shimmer h-44 w-full" />
          <div className="p-4 space-y-3">
            <div className="shimmer h-4 w-2/3 rounded" />
            <div className="shimmer h-3 w-1/2 rounded" />
            <div className="shimmer h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)

  const { data: raw, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn:  () => api.get("/projects").then(r => r.data),
  })

  const projects: any[] = Array.isArray(raw) ? raw : (raw?.data || [])

  const totals = {
    total:     projects.length,
    units:     projects.reduce((a, p) => a + (p.totalUnits || 0), 0),
    available: projects.reduce((a, p) => a + (p.availableUnits || 0), 0),
    ongoing:   projects.filter(p => p.status === "ONGOING").length,
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{totals.total} projects · {totals.available} units available</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/map" className="flex items-center gap-1.5 text-sm bg-muted/60 hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-lg font-medium transition-all">
            <Map className="w-4 h-4" /> Map View
          </Link>
          <Link href="/floor-plans" className="flex items-center gap-1.5 text-sm bg-muted/60 hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-lg font-medium transition-all">
            <Layers className="w-4 h-4" /> Floor Plans
          </Link>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Projects",  value: totals.total,     icon: Building2,    bg: "bg-blue-500/10",    color: "text-blue-500"    },
          { label: "Ongoing",         value: totals.ongoing,   icon: TrendingUp,   bg: "bg-emerald-500/10", color: "text-emerald-500" },
          { label: "Total Units",     value: totals.units,     icon: Users,        bg: "bg-violet-500/10",  color: "text-violet-500"  },
          { label: "Available Units", value: totals.available, icon: CheckCircle2, bg: "bg-amber-500/10",   color: "text-amber-500"   },
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

      {/* Feature promo */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex flex-wrap items-center gap-3">
        <Layers className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Floor Plans & Property Map are live</p>
          <p className="text-xs text-muted-foreground">Visualise unit availability and see all projects on GPS map.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/floor-plans" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1">Floor Plans <ExternalLink className="w-3 h-3" /></Link>
          <Link href="/map" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1">Map View <ExternalLink className="w-3 h-3" /></Link>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? <Skeleton /> : projects.length === 0 ? (
        <div className="enterprise-card p-16 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-medium text-foreground">No projects yet</p>
          <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> Create first project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => {
            const occ = project.totalUnits > 0
              ? Math.round(((project.totalUnits - project.availableUnits) / project.totalUnits) * 100)
              : 0
            const sc = STATUS_CFG[project.status] || STATUS_CFG.ONGOING

            return (
              <div key={project.id} className="enterprise-card overflow-hidden group hover:border-primary/30">
                <div className="h-44 bg-muted relative overflow-hidden">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-bold text-base leading-tight">{project.name}</p>
                      <p className="text-white/75 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 shrink-0" />{project.location}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.cls}`}>{sc.label}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-semibold text-foreground tabular-nums">{occ}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${occ}%`, backgroundColor: occ > 80 ? "#ef4444" : occ > 60 ? "#f59e0b" : "#10b981" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{project.totalUnits - project.availableUnits} sold</span>
                      <span>{project.availableUnits} available</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-4 p-2.5 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Price Range</span>
                    <span className="font-semibold text-foreground tabular-nums">₹{(project.minPrice/100000).toFixed(0)}L – ₹{(project.maxPrice/100000).toFixed(0)}L</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { href: `/projects/${project.id}/units`,  icon: Users,      label: "Units",      cls: "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted" },
                      { href: "/floor-plans",                   icon: Layers,     label: "Floor Plan", cls: "text-primary bg-primary/5 hover:bg-primary/10" },
                      { href: `/projects/${project.id}/inventory-grid`, icon: BarChart3, label: "Inventory", cls: "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted" },
                    ].map(a => {
                      const Icon = a.icon
                      return (
                        <Link key={a.href} href={a.href} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${a.cls}`}>
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] font-medium">{a.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <CreateProjectModal
          onClose={() => setShowAdd(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ["projects"] })}
        />
      )}
    </div>
  )
}
