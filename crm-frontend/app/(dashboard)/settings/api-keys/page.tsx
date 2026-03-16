"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { toastSuccess, toastError } from "../../../../lib/toast"

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([])
  const [newLabel, setNewLabel] = useState("")
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => { loadKeys() }, [])

  async function loadKeys() {
    try {
      const res = await api.get("/api-keys")
      setKeys(res.data)
    } catch {}
  }

  async function generateKey() {
    if (!newLabel.trim()) return
    setGenerating(true)
    try {
      const res = await api.post("/api-keys", { label: newLabel })
      setNewKey(res.data.key)
      setNewLabel("")
      loadKeys()
      toastSuccess("API Key generated. Copy it now — it won't be shown again!")
    } catch {
      toastError("Failed to generate API key")
    }
    setGenerating(false)
  }

  async function revokeKey(id: string) {
    try {
      await api.delete(`/api-keys/${id}`)
      toastSuccess("API key revoked")
      loadKeys()
    } catch {
      toastError("Failed to revoke key")
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="API Keys"
        subtitle="Generate API keys to integrate external systems with the CRM"
        badge={<Key className="w-5 h-5 text-slate-400" />}
      />

      {/* New key result */}
      {newKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800 mb-1">Copy your key now — it won't be shown again</p>
              <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                <code className="text-xs font-mono text-slate-700 flex-1 truncate">
                  {showKey ? newKey : newKey.replace(/./g, "•")}
                </code>
                <button onClick={() => setShowKey(s => !s)} className="text-amber-600 hover:text-amber-700">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(newKey); toastSuccess("Copied!") }}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate new key */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Generate New Key</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
            placeholder="Label (e.g. Facebook Webhook)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
          />
          <Button
            onClick={generateKey}
            disabled={generating || !newLabel.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Active keys */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active Keys</h3>
        </div>
        {keys.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No API keys yet. Generate one above.</div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {keys.map(key => (
              <div key={key.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{key.label}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${key.isActive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                      {key.isActive ? "Active" : "Revoked"}
                    </span>
                    <span className="text-[11px] text-slate-400">Created {new Date(key.createdAt).toLocaleDateString()}</span>
                    {key.expiresAt && <span className="text-[11px] text-amber-500">Expires {new Date(key.expiresAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                {key.isActive && (
                  <button
                    onClick={() => revokeKey(key.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage example */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Usage</h4>
        <pre className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
{`POST /public/leads
X-API-Key: pfcrm_your_key_here
Content-Type: application/json

{ "fullName": "...", "phone": "..." }`}
        </pre>
      </div>
    </div>
  )
}
