"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import Link from "next/link"
import { Flame, Thermometer, Snowflake, Columns3, RefreshCw } from "lucide-react"

const STAGES = [
  { key: "NEW",             label: "New",         dot: "bg-blue-500",    header: "bg-blue-500/8 border-blue-200/50 dark:border-blue-900/40" },
  { key: "CONTACTED",       label: "Contacted",   dot: "bg-sky-500",     header: "bg-sky-500/8 border-sky-200/50 dark:border-sky-900/40" },
  { key: "FOLLOW_UP",       label: "Follow Up",   dot: "bg-amber-500",   header: "bg-amber-500/8 border-amber-200/50 dark:border-amber-900/40" },
  { key: "SITE_VISIT_DONE", label: "Site Visit",  dot: "bg-violet-500",  header: "bg-violet-500/8 border-violet-200/50 dark:border-violet-900/40" },
  { key: "NEGOTIATION",     label: "Negotiation", dot: "bg-orange-500",  header: "bg-orange-500/8 border-orange-200/50 dark:border-orange-900/40" },
  { key: "CLOSED_WON",      label: "Won ✓",       dot: "bg-emerald-500", header: "bg-emerald-500/8 border-emerald-200/50 dark:border-emerald-900/40" },
  { key: "CLOSED_LOST",     label: "Lost",        dot: "bg-red-500",     header: "bg-red-500/8 border-red-200/50 dark:border-red-900/40" },
]

const TEMP: Record<string, { icon: React.ReactNode; cls: string }> = {
  HOT:  { icon: <Flame       className="w-3 h-3" />, cls: "text-red-500   bg-red-50   dark:bg-red-950/40   border-red-200   dark:border-red-900/40" },
  WARM: { icon: <Thermometer className="w-3 h-3" />, cls: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40" },
  COLD: { icon: <Snowflake   className="w-3 h-3" />, cls: "text-blue-500  bg-blue-50  dark:bg-blue-950/40  border-blue-200  dark:border-blue-900/40" },
}

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({})
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadPipeline(silent = false) {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await api.get("/leads/pipeline")
      setPipeline(res.data)
    } catch { /* silent */ }
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { loadPipeline() }, [])

  async function handleDrag(result: any) {
    if (!result.destination) return
    const { draggableId: leadId, source, destination } = result
    if (source.droppableId === destination.droppableId) return

    const from = source.droppableId
    const to   = destination.droppableId
    const lead = pipeline[from]?.find((l: any) => l.id === leadId)
    if (!lead) return

    // Optimistic update
    setPipeline(prev => ({
      ...prev,
      [from]: prev[from].filter(l => l.id !== leadId),
      [to]:   [{ ...lead, status: to }, ...(prev[to] || [])],
    }))

    try {
      await api.patch(`/leads/${leadId}/status`, { status: to })
    } catch {
      loadPipeline(true) // revert on error
    }
  }

  const totalLeads = Object.values(pipeline).flat().length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="shimmer h-8 w-48 rounded-lg" />
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map(s => (
            <div key={s.key} className="w-64 shrink-0 shimmer rounded-xl h-[480px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-w-0 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Columns3 className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground">Sales Pipeline</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalLeads} leads · Drag cards to move between stages
          </p>
        </div>
        <button
          onClick={() => loadPipeline(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDrag}>
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 snap-x scroll-smooth">
          {STAGES.map(stage => {
            const leads = pipeline[stage.key] || []
            const pipeVal = leads.reduce((s: number, l: any) => s + ((l.budgetMin || 0) + (l.budgetMax || 0)) / 2, 0)

            return (
              <Droppable droppableId={stage.key} key={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-[272px] shrink-0 rounded-xl flex flex-col border transition-colors snap-center ${
                      snapshot.isDraggingOver
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-muted/30 dark:bg-muted/10"
                    }`}
                  >
                    {/* Column header */}
                    <div className={`px-3 pt-3 pb-2 rounded-t-xl border-b ${stage.header}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${stage.dot}`} />
                        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider flex-1">{stage.label}</span>
                        <span className="text-[10px] bg-background text-muted-foreground px-1.5 py-0.5 rounded-full font-semibold border border-border">
                          {leads.length}
                        </span>
                      </div>
                      {pipeVal > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                          ≈ ₹{(pipeVal / 100000).toFixed(0)}L pipeline
                        </p>
                      )}
                    </div>

                    {/* Cards */}
                    <div className="px-2 py-2 space-y-2 flex-1 overflow-y-auto" style={{ minHeight: 360, maxHeight: "calc(100vh - 240px)" }}>
                      {leads.map((lead: any, idx: number) => {
                        const tc = TEMP[lead.temperature] || TEMP.COLD
                        return (
                          <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`bg-card rounded-lg border transition-all ${
                                  snap.isDragging
                                    ? "shadow-2xl border-primary/50 rotate-1 scale-[1.02] z-50"
                                    : "border-border hover:border-primary/30 hover:shadow-sm"
                                }`}
                              >
                                <Link href={`/leads/${lead.id}`} className="block p-3">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm font-semibold text-foreground leading-tight truncate flex-1">
                                      {lead.fullName}
                                    </p>
                                    <span className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase shrink-0 ${tc.cls}`}>
                                      {tc.icon}{lead.temperature}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-muted-foreground mb-2">{lead.phone}</p>

                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-muted-foreground truncate max-w-[90px]">{lead.project?.name || "—"}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                                      ₹{(((lead.budgetMin || 0) + (lead.budgetMax || 0)) / 200000).toFixed(0)}L
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px]">
                                    <span className="text-muted-foreground truncate max-w-[100px]">
                                      {lead.assignedAgent?.name?.split(" ")[0] || "Unassigned"}
                                    </span>
                                    <span className="font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                      {lead.score ?? 0}pt
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                      {leads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-20 text-[11px] text-muted-foreground/40 border-2 border-dashed border-border/50 rounded-lg">
                          Drop here
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
