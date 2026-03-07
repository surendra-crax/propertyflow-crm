"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const statuses = [
  { key: "NEW", label: "New", color: "bg-blue-500" },
  { key: "CONTACTED", label: "Contacted", color: "bg-cyan-500" },
  { key: "FOLLOW_UP", label: "Follow Up", color: "bg-amber-500" },
  { key: "SITE_VISIT_DONE", label: "Site Visit", color: "bg-purple-500" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-orange-500" },
  { key: "CLOSED_WON", label: "Won", color: "bg-emerald-500" },
  { key: "CLOSED_LOST", label: "Lost", color: "bg-red-500" },
]

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

    // Optimistic update
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
    <div className="space-y-5 h-full flex flex-col min-w-0 w-full">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sales Pipeline</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">Drag leads to update their status</p>
      </div>

      <DragDropContext onDragEnd={handleDrag}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-w-0 pb-8 snap-x">
          {statuses.map((stage) => {
            const leads = pipeline[stage.key] || []

            return (
              <Droppable droppableId={stage.key} key={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-72 md:w-64 shrink-0 rounded-xl transition-colors snap-center ${snapshot.isDraggingOver ? "bg-indigo-50 dark:bg-indigo-900/20" : "bg-slate-100/80 dark:bg-slate-900/60"
                      } border border-transparent dark:border-slate-800/60`}
                  >
                    {/* Column Header */}
                    <div className="px-3 py-3 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{stage.label}</h3>
                      <span className="ml-auto text-[10px] bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-medium shadow-sm border border-transparent dark:border-slate-700">
                        {leads.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="px-2 pb-3 space-y-2 min-h-[500px]">
                      {leads.map((lead: any, index: number) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-slate-900 p-3 rounded-lg border transition-all ${snapshot.isDragging
                                ? "shadow-lg border-indigo-300 dark:border-indigo-500 rotate-2 z-50 scale-105"
                                : "border-slate-200 dark:border-slate-700 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-600"
                                }`}
                            >
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{lead.fullName}</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{lead.phone}</p>
                              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{lead.project?.name}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{lead.assignedAgent?.name?.split(' ')[0]}</span>
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    ₹{((lead.budgetMin + lead.budgetMax) / 200000).toFixed(0)}L
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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