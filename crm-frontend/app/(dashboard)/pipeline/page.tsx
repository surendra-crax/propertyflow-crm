"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import Link from "next/link"
import { Flame, Thermometer, Snowflake } from "lucide-react"

const statuses = [
  { key: "NEW", label: "New", color: "bg-blue-500" },
  { key: "CONTACTED", label: "Contacted", color: "bg-cyan-500" },
  { key: "FOLLOW_UP", label: "Follow Up", color: "bg-amber-500" },
  { key: "SITE_VISIT_DONE", label: "Site Visit", color: "bg-purple-500" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-orange-500" },
  { key: "CLOSED_WON", label: "Won ✓", color: "bg-emerald-500" },
  { key: "CLOSED_LOST", label: "Lost", color: "bg-red-500" },
]

const tempIcons: Record<string, any> = {
  HOT: <Flame className="w-3 h-3 text-red-500" />,
  WARM: <Thermometer className="w-3 h-3 text-orange-400" />,
  COLD: <Snowflake className="w-3 h-3 text-blue-400" />,
}

const tempColors: Record<string, string> = {
  HOT: "text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-800",
  WARM: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-800",
  COLD: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-800",
}

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<any>({})
  const [loading, setLoading] = useState(true)

  async function loadPipeline() {
    try {
      const res = await api.get("/leads/pipeline")
      setPipeline(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { loadPipeline() }, [])

  async function handleDrag(result: any) {
    if (!result.destination) return
    const leadId = result.draggableId
    const newStatus = result.destination.droppableId
    const oldStatus = result.source.droppableId
    if (newStatus === oldStatus) return

    const lead = pipeline[oldStatus]?.find((l: any) => l.id === leadId)
    if (lead) {
      setPipeline((prev: any) => ({
        ...prev,
        [oldStatus]: prev[oldStatus].filter((l: any) => l.id !== leadId),
        [newStatus]: [{ ...lead, status: newStatus }, ...(prev[newStatus] || [])],
      }))
    }

    try {
      await api.patch(`/leads/${leadId}/status`, { status: newStatus })
    } catch (err) {
      console.error(err)
      loadPipeline()
    }
  }

  const totalLeads = Object.values(pipeline).flat().length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white rounded animate-pulse" />
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="w-64 h-96 bg-white rounded-xl border shrink-0 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col min-w-0 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sales Pipeline</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">{totalLeads} leads across {statuses.length} stages · Drag to move</p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDrag}>
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-w-0 snap-x scroll-smooth">
          {statuses.map((stage) => {
            const leads = pipeline[stage.key] || []
            const stageValue = leads.reduce((s: number, l: any) => s + ((l.budgetMin || 0) + (l.budgetMax || 0)) / 2, 0)

            return (
              <Droppable droppableId={stage.key} key={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-72 shrink-0 rounded-xl transition-all snap-center flex flex-col border ${snapshot.isDraggingOver
                        ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-900/10"
                        : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40"
                      }`}
                  >
                    {/* Column Header */}
                    <div className="px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.color} shrink-0`} />
                        <h3 className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex-1">{stage.label}</h3>
                        <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-semibold border border-slate-200 dark:border-slate-700 shadow-sm">
                          {leads.length}
                        </span>
                      </div>
                      {stageValue > 0 && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                          ≈ ₹{(stageValue / 100000).toFixed(0)}L pipeline
                        </p>
                      )}
                    </div>

                    {/* Cards */}
                    <div className="px-2 pb-3 space-y-2 min-h-[400px] flex-1">
                      {leads.map((lead: any, index: number) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-slate-900 rounded-lg border transition-all ${snapshot.isDragging
                                  ? "shadow-xl border-indigo-300 dark:border-indigo-500 rotate-1 z-50 scale-[1.03]"
                                  : "border-slate-200 dark:border-slate-700/70 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
                                }`}
                            >
                              <Link href={`/leads/${lead.id}`} className="block p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{lead.fullName}</p>
                                  {lead.temperature && (
                                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ml-2 ${tempColors[lead.temperature] || tempColors.COLD}`}>
                                      {tempIcons[lead.temperature]}
                                      {lead.temperature}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">{lead.phone}</p>
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-400 dark:text-slate-500 truncate max-w-[90px]">
                                    {lead.project?.name || "—"}
                                  </span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                                    ₹{(((lead.budgetMin || 0) + (lead.budgetMax || 0)) / 200000).toFixed(0)}L
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/60">
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                                    {lead.assignedAgent?.name?.split(" ")[0] || "—"}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {lead.score ?? 0}pts
                                  </span>
                                </div>
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {leads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-20 text-[11px] text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg mt-2">
                          Drop leads here
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