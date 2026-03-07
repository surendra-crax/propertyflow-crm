"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "../../../../lib/api"
import { ArrowLeft, Phone, Mail, Calendar, User, Clock, Tag, MessageSquare } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-cyan-100 text-cyan-700",
  FOLLOW_UP: "bg-amber-100 text-amber-700",
  SITE_VISIT_DONE: "bg-purple-100 text-purple-700",
  NEGOTIATION: "bg-orange-100 text-orange-700",
  CLOSED_WON: "bg-emerald-100 text-emerald-700",
  CLOSED_LOST: "bg-red-100 text-red-700",
}

const activityIcons: Record<string, string> = {
  LEAD_CREATED: "🆕",
  STATUS_CHANGE: "🔄",
  NOTE_ADDED: "📝",
  DEAL_CREATED: "🤝",
  SITE_VISIT: "📍",
}

export default function LeadDetailPage() {
  const params = useParams()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    loadLead()
  }, [params.id])

  async function loadLead() {
    try {
      const res = await api.get(`/leads/${params.id}`)
      setLead(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function addActivity() {
    if (!newNote.trim()) return
    setAddingNote(true)
    try {
      const userId = localStorage.getItem("userId")
      await api.post("/activities", {
        leadId: params.id,
        userId,
        type: "NOTE_ADDED",
        description: newNote,
      })
      setNewNote("")
      loadLead()
    } catch (err) {
      console.error(err)
    }
    setAddingNote(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white rounded animate-pulse" />
        <div className="h-64 bg-white rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!lead) {
    return <div className="text-center py-16 text-slate-500">Lead not found</div>
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{lead.fullName}</h1>
          <p className="text-sm text-slate-400">{lead.project?.name} · {lead.source?.replace(/_/g, " ")}</p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
          {lead.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact & Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{lead.assignedAgent?.name}</span>
              </div>
              {lead.nextFollowup && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{new Date(lead.nextFollowup).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 pt-5 border-t border-slate-100">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors border border-emerald-100"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.fullName}, this is ${lead.assignedAgent?.name || 'your agent'} from PropertyFlow regarding your interest in ${lead.project?.name || 'our properties'}. Let me know when you're available to talk.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white hover:bg-green-600 rounded-lg text-sm font-medium transition-colors border border-green-600 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Property Type</span>
                <span className="text-slate-600">{lead.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget</span>
                <span className="text-slate-600">₹{(lead.budgetMin / 100000).toFixed(1)}L - ₹{(lead.budgetMax / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source</span>
                <span className="text-slate-600">{lead.source?.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-600">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {lead.notes && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-600">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Deal Info */}
          {lead.deal && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
              <h3 className="text-sm font-semibold text-emerald-700 mb-3">Deal Closed</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-600/70">Sale Value</span>
                  <span className="text-emerald-700 font-semibold">₹{lead.deal.saleValue?.toLocaleString()}</span>
                </div>
                {lead.deal.broker && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600/70">Broker</span>
                    <span className="text-emerald-700">{lead.deal.broker.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-emerald-600/70">Closed</span>
                  <span className="text-emerald-700">{new Date(lead.deal.closedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Timeline</h3>

            {/* Add Note */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Add a note or activity..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addActivity()}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
              />
              <button
                onClick={addActivity}
                disabled={addingNote || !newNote.trim()}
                className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Timeline */}
            {lead.activities?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No activities yet</p>
            ) : (
              <div className="space-y-4">
                {lead.activities?.map((activity: any) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                      {activityIcons[activity.type] || "📋"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400">{activity.user?.name}</span>
                        <span className="text-[11px] text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}