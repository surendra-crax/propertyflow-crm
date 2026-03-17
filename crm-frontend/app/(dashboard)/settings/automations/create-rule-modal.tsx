"use client"

import { useState } from "react"
import { api } from "../../../../lib/api"
import { X, Zap, ArrowRight, Save } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function CreateRuleModal({ onClose, onCreated }: any) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    condition: "LEAD_CREATED",
    action: "ASSIGN_AGENT",
    isActive: true
  })

  async function createRule() {
    if (!form.name) {
      alert("Please enter a rule name")
      return
    }

    try {
      setLoading(true)
      await api.post("/automations", form)
      onCreated()
      onClose()
    } catch (err: any) {
      console.error("Create rule error:", err)
      alert(err?.response?.data?.message || "Rule creation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-amber-500">
            <Zap className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Create Automation Rule</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Rule Name</label>
            <input
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="e.g. Auto-assign Website Leads"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Trigger (IF)</label>
              <select
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded text-sm outline-none"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="LEAD_CREATED">Lead is Created</option>
                <option value="STATUS_CHANGED">Status Changes</option>
                <option value="VISIT_SCHEDULED">Visit Scheduled</option>
                <option value="INACTIVE_3_DAYS">Lead Inactive 3 Days</option>
              </select>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Action (THEN)</label>
              <select
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded text-sm outline-none"
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
              >
                <option value="ASSIGN_AGENT">Assign Agent</option>
                <option value="SEND_WHATSAPP">Send WhatsApp</option>
                <option value="SEND_EMAIL">Send Email</option>
                <option value="NOTIFY_ADMIN">Notify Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            onClick={createRule}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-base"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Create Automation"}
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
