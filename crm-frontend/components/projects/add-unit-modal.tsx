"use client"

import { useState } from "react"
import { api } from "../../lib/api"
import { X, Building2, Hash, Layers, Home, Maximize2, IndianRupee } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function AddUnitModal({ projectId, onClose, onCreated }: any) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    unitNumber: "",
    floor: "",
    type: "2BHK",
    area: "",
    price: "",
    status: "AVAILABLE"
  })

  function updateField(field: string, value: string) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function createUnit() {
    if (
      !form.unitNumber ||
      !form.floor ||
      !form.type ||
      !form.area ||
      !form.price
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      const payload = {
        unitNumber: form.unitNumber,
        floor: form.floor,
        type: form.type,
        area: Number(form.area),
        price: Number(form.price),
        status: form.status,
        projectId: projectId
      }

      await api.post("/units", payload)
      onCreated()
      onClose()
    } catch (err: any) {
      console.error("Create unit error:", err)
      alert(err?.response?.data?.message || "Unit creation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <Layers className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Unit</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Unit Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="e.g. A-101"
                value={form.unitNumber}
                onChange={(e) => updateField("unitNumber", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Floor</label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="e.g. 1st Floor"
                value={form.floor}
                onChange={(e) => updateField("floor", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Unit Type</label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none"
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="STUDIO">Studio</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Area (Sqft)</label>
            <div className="relative">
              <Maximize2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="1200"
                value={form.area}
                onChange={(e) => updateField("area", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Price (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="5000000"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            onClick={createUnit}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-base"
          >
            {loading ? "Adding..." : "Add Unit"}
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
