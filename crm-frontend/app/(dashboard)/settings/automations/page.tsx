"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Zap, Plus, Settings2, CheckCircle2, XCircle, ArrowRight, Play, Trash2 } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { toastError, toastSuccess } from "../../../../lib/toast"

export default function AutomationsPage() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadRules() }, [])

  async function loadRules() {
    setLoading(true)
    try {
      const res = await api.get("/automations")
      setRules(res.data)
    } catch {
      toastError("Failed to load automations")
    }
    setLoading(false)
  }

  async function toggleRule(id: string, currentStatus: boolean) {
    try {
      await api.put(`/automations/${id}/toggle`, { isActive: !currentStatus })
      toastSuccess(`Automation ${!currentStatus ? 'activated' : 'paused'} successfully`)
      loadRules()
    } catch {
      toastError("Failed to update automation status")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Workflow Automations"
        subtitle="Automate lead assignments, follow-ups, and pipeline movements based on triggers"
        badge={<Zap className="w-5 h-5 text-amber-500" />}
        action={
          <Button className="gap-2 bg-slate-800 hover:bg-slate-700 text-white">
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Active Rules</h3>
              <p className="text-xs text-slate-500 mt-0.5">Rules execute automatically when conditions are met.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
             <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {rules.filter(r => r.isActive).length} Active</span>
             <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" /> {rules.filter(r => !r.isActive).length} Paused</span>
          </div>
        </div>

        {loading ? (
             <div className="p-8 space-y-4">
                 {[1, 2, 3].map(i => (
                     <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse" />
                 ))}
             </div>
        ) : rules.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-lg">No Automations Yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">Build automated workflows to put your CRM on autopilot. Save hours of manual work every week.</p>
                <Button variant="outline" className="gap-2">
                    <Play className="w-4 h-4 text-indigo-500" /> Use a Template
                </Button>
            </div>
        ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {rules.map(rule => (
                    <div key={rule.id} className={`p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${!rule.isActive ? 'opacity-75' : ''}`}>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg truncate">{rule.name}</h4>
                                    {rule.isActive ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            <XCircle className="w-3 h-3" /> Paused
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2 text-sm mt-3">
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md font-mono text-xs border border-slate-200 dark:border-slate-700">
                                        <span className="font-semibold text-slate-400">IF</span> {rule.condition}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-md font-mono text-xs border border-indigo-100 dark:border-indigo-800/50">
                                        <span className="font-semibold text-indigo-400">THEN</span> {rule.action}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => toggleRule(rule.id, rule.isActive)}
                                    className={`w-24 ${rule.isActive ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 border-slate-200' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 bg-emerald-50/50'}`}
                                >
                                    {rule.isActive ? "Pause" : "Activate"}
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
