"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { X } from "lucide-react"

const SOURCES = ["WEBSITE", "FACEBOOK_ADS", "GOOGLE_ADS", "BROKER", "REFERRAL", "WALK_IN"]
const PROPERTY_TYPES = ["FLAT", "VILLA", "PLOT", "COMMERCIAL"]

export default function CreateLeadModal({ onClose, onCreated }: any) {
  const [projects, setProjects] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    budgetMin: "",
    budgetMax: "",
    propertyType: "FLAT",
    source: "WEBSITE",
    notes: "",
    projectId: "",
    assignedAgentId: "",
    nextFollowup: "",
  })

  useEffect(() => {
    loadDropdowns()
  }, [])

  async function loadDropdowns() {
    try {
      const [projRes, agentRes] = await Promise.all([
        api.get("/projects"),
        api.get("/users/agents"),
      ])
      setProjects(projRes.data)
      setAgents(agentRes.data)

      if (projRes.data.length > 0) {
        setForm(f => ({ ...f, projectId: projRes.data[0].id }))
      }
      if (agentRes.data.length > 0) {
        setForm(f => ({ ...f, assignedAgentId: agentRes.data[0].id }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/leads", {
        ...form,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        nextFollowup: form.nextFollowup || undefined,
        notes: form.notes || undefined,
      })
      onCreated()
      onClose()
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Create New Lead</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name *</label>
              <input
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Phone *</label>
              <input
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Budget Min (₹) *</label>
              <input
                required
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                value={form.budgetMin}
                onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Budget Max (₹) *</label>
              <input
                required
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                value={form.budgetMax}
                onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
              />
            </div>
          </div>

          {/* Property Type & Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Property Type</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Lead Source</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project & Agent */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Project *</label>
              <select
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Assigned Agent *</label>
              <select
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.assignedAgentId}
                onChange={(e) => setForm({ ...form, assignedAgentId: e.target.value })}
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Next Follow-up</label>
            <input
              type="datetime-local"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
              value={form.nextFollowup}
              onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Notes</label>
            <textarea
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </form>
    </div>
  )
}