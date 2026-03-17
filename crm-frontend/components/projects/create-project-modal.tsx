"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { X, Building2, MapPin, Users, Hash, IndianRupee } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function CreateProjectModal({ onClose, onCreated }: any) {
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<any[]>([])

  const [form, setForm] = useState({
    name: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    totalUnits: "",
    availableUnits: "",
    status: "ONGOING",
    managerId: ""
  })

  useEffect(() => {
    api.get("/analytics/agent-leaderboard").then(res => {
      setAgents(res.data)
      if (res.data.length > 0) {
        setForm(prev => ({ ...prev, managerId: res.data[0].id }))
      }
    })
  }, [])

  function updateField(field: string, value: string) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function createProject() {
    if (
      !form.name ||
      !form.location ||
      !form.minPrice ||
      !form.maxPrice ||
      !form.totalUnits ||
      !form.availableUnits ||
      !form.managerId
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: form.name,
        location: form.location,
        minPrice: Number(form.minPrice),
        maxPrice: Number(form.maxPrice),
        totalUnits: Number(form.totalUnits),
        availableUnits: Number(form.availableUnits),
        status: form.status,
        managerId: form.managerId
      }

      await api.post("/projects", payload)
      onCreated()
      onClose()
    } catch (err: any) {
      console.error("Create project error:", err)
      alert(err?.response?.data?.message || "Project creation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <Building2 className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Create New Project</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Project Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="e.g. Skyline Heights"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="e.g. Downtown Sector 5"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Min Price (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Min Price"
                value={form.minPrice}
                onChange={(e) => updateField("minPrice", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Max Price (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Max Price"
                value={form.maxPrice}
                onChange={(e) => updateField("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Total Units</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="100"
                value={form.totalUnits}
                onChange={(e) => updateField("totalUnits", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Available Units</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="100"
                value={form.availableUnits}
                onChange={(e) => updateField("availableUnits", e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Manager</label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none"
                value={form.managerId}
                onChange={(e) => updateField("managerId", e.target.value)}
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            onClick={createProject}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-base"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-8 py-6 text-base"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}