"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Layers, ZoomIn, ZoomOut, RotateCcw, Info, CheckCircle2, Clock, XCircle, Shield } from "lucide-react"

/* ── types ── */
interface Unit {
  id: string
  unitNumber: string
  floor: number
  type: string
  area: number
  price: number
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "MGMT_QUOTA"
}

interface Project { id: string; name: string; totalUnits: number; availableUnits: number }

/* ── status config ── */
const STATUS = {
  AVAILABLE:  { label: "Available",  color: "#10b981", bg: "#d1fae5", dark: "#064e3b", icon: CheckCircle2 },
  RESERVED:   { label: "Reserved",   color: "#f59e0b", bg: "#fef3c7", dark: "#451a03", icon: Clock        },
  SOLD:       { label: "Sold",       color: "#ef4444", bg: "#fee2e2", dark: "#450a0a", icon: XCircle      },
  MGMT_QUOTA: { label: "Mgmt Quota", color: "#8b5cf6", bg: "#ede9fe", dark: "#2e1065", icon: Shield       },
}

/* ── Generate a floor plan layout from units on a given floor ── */
function FloorGrid({
  units,
  selectedUnit,
  onSelect,
}: {
  units: Unit[]
  selectedUnit: Unit | null
  onSelect: (u: Unit) => void
}) {
  if (!units.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No units on this floor
      </div>
    )
  }

  const cols = Math.ceil(Math.sqrt(units.length * 1.5))

  return (
    <div className="relative w-full select-none">
      {/* Building outline */}
      <div className="relative border-2 border-border rounded-xl p-6 bg-muted/20">
        {/* Corridor */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-8 bg-muted/40 rounded-full border border-border/50 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Corridor</span>
        </div>

        {/* North side units */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {units.slice(0, Math.ceil(units.length / 2)).map(unit => (
            <UnitCell key={unit.id} unit={unit} selected={selectedUnit?.id === unit.id} onSelect={onSelect} />
          ))}
        </div>

        {/* South side units */}
        <div className="flex flex-wrap gap-2 mt-10 justify-center">
          {units.slice(Math.ceil(units.length / 2)).map(unit => (
            <UnitCell key={unit.id} unit={unit} selected={selectedUnit?.id === unit.id} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  )
}

function UnitCell({ unit, selected, onSelect }: { unit: Unit; selected: boolean; onSelect: (u: Unit) => void }) {
  const cfg = STATUS[unit.status] || STATUS.AVAILABLE
  return (
    <button
      onClick={() => onSelect(unit)}
      className="relative flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-150 hover:scale-105 focus:outline-none"
      style={{
        width: 72,
        height: 72,
        backgroundColor: cfg.bg,
        borderColor: selected ? cfg.color : `${cfg.color}55`,
        boxShadow: selected ? `0 0 0 3px ${cfg.color}40` : undefined,
      }}
    >
      <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{unit.unitNumber}</span>
      <span className="text-[9px] font-medium text-slate-500 mt-0.5">{unit.type}</span>
      <span className="text-[9px] text-slate-400">{unit.area} sqft</span>
      {/* Status dot */}
      <span
        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
    </button>
  )
}

export default function FloorPlansPage() {
  const [projects, setProjects]         = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [units, setUnits]               = useState<Unit[]>([])
  const [floor, setFloor]               = useState(1)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [loading, setLoading]           = useState(false)
  const [zoom, setZoom]                 = useState(1)

  useEffect(() => {
    api.get("/projects").then(r => {
      setProjects(r.data?.data || r.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    setLoading(true)
    setSelectedUnit(null)
    api.get(`/units?projectId=${selectedProject.id}`)
      .then(r => {
        const data = r.data?.data || r.data || []
        setUnits(data)
        const floors = [...new Set(data.map((u: Unit) => u.floor))].sort() as number[]
        setFloor(floors[0] || 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedProject])

  const floors = [...new Set(units.map(u => u.floor))].sort((a, b) => a - b)
  const floorUnits = units.filter(u => u.floor === floor)

  const stats = {
    available:  units.filter(u => u.status === "AVAILABLE").length,
    reserved:   units.filter(u => u.status === "RESERVED").length,
    sold:       units.filter(u => u.status === "SOLD").length,
    mgmt:       units.filter(u => u.status === "MGMT_QUOTA").length,
  }

  return (
    <div className="space-y-5 pb-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-500" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Interactive Floor Plans</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-500 border border-violet-500/20">
              NEW
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Visual inventory management with real-time unit availability</p>
        </div>
      </div>

      {/* Project selector */}
      <div className="enterprise-card p-4">
        <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
          Select Project
        </label>
        <div className="flex flex-wrap gap-2">
          {projects.length === 0 && (
            <span className="text-sm text-muted-foreground">No projects found. Create a project first.</span>
          )}
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProject(p); setFloor(1) }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedProject?.id === p.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/50 text-foreground border-border hover:bg-muted"
              }`}
            >
              {p.name}
              <span className="ml-1.5 text-[10px] opacity-60">{p.totalUnits}u</span>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <>
          {/* Legend + Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.entries(STATUS) as [keyof typeof STATUS, typeof STATUS[keyof typeof STATUS]][]).map(([key, cfg]) => {
              const count = stats[key.toLowerCase() as keyof typeof stats] ?? units.filter(u => u.status === key).length
              const Icon = cfg.icon
              return (
                <div key={key} className="enterprise-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground tabular-nums">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Floor selector */}
            <div className="enterprise-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Floors</h3>
              <div className="space-y-1">
                {floors.length === 0 && <p className="text-sm text-muted-foreground">No floor data</p>}
                {[...floors].reverse().map(f => {
                  const fUnits = units.filter(u => u.floor === f)
                  const avail  = fUnits.filter(u => u.status === "AVAILABLE").length
                  return (
                    <button
                      key={f}
                      onClick={() => { setFloor(f); setSelectedUnit(null) }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        floor === f
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-foreground font-medium"
                      }`}
                    >
                      <span>Floor {f}</span>
                      <span className={`text-xs ${floor === f ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {avail}/{fUnits.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Floor plan canvas */}
            <div className="enterprise-card lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedProject.name} — Floor {floor}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  ><ZoomIn className="w-4 h-4" /></button>
                  <button
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  ><ZoomOut className="w-4 h-4" /></button>
                  <button
                    onClick={() => setZoom(1)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  ><RotateCcw className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="overflow-auto" style={{ minHeight: 280 }}>
                <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
                  {loading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : (
                    <FloorGrid units={floorUnits} selectedUnit={selectedUnit} onSelect={setSelectedUnit} />
                  )}
                </div>
              </div>
            </div>

            {/* Unit detail panel */}
            <div className="enterprise-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {selectedUnit ? "Unit Details" : "Select a Unit"}
              </h3>
              {!selectedUnit ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Info className="w-8 h-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Click any unit on the floor plan to see its details</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{selectedUnit.unitNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: STATUS[selectedUnit.status]?.bg,
                          color: STATUS[selectedUnit.status]?.color,
                        }}
                      >
                        {STATUS[selectedUnit.status]?.label}
                      </span>
                    </div>
                  </div>

                  {[
                    { label: "Type",     value: selectedUnit.type },
                    { label: "Floor",    value: `Floor ${selectedUnit.floor}` },
                    { label: "Area",     value: `${selectedUnit.area} sq ft` },
                    { label: "Price",    value: selectedUnit.price ? `₹${(selectedUnit.price / 100000).toFixed(1)}L` : "On Request" },
                    { label: "Status",   value: STATUS[selectedUnit.status]?.label || selectedUnit.status },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
                      <span className="text-sm font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}

                  {selectedUnit.status === "AVAILABLE" && (
                    <button className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
                      Reserve This Unit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!selectedProject && projects.length > 0 && (
        <div className="enterprise-card p-12 text-center">
          <Layers className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-foreground font-medium">Select a project to view its floor plan</p>
          <p className="text-sm text-muted-foreground mt-1">Interactive unit status visualization</p>
        </div>
      )}
    </div>
  )
}
