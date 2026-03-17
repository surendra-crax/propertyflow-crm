"use client"

import { useState, useEffect } from "react"
import { api } from "../../../../lib/api"
import { PageHeader } from "../../../../components/shared/page-header"
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
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
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-indigo-500" />
                Getting Started with API Keys
            </h4>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>1. <strong>Generate a Key:</strong> Enter a recognizable label (e.g., "Main Website Form") and click Generate.</p>
                <p>2. <strong>Copy and Secure:</strong> Copy the generated key immediately. We only show it once for your security.</p>
                <p>3. <strong>Integrate:</strong> Use the key in your requests as an <code>X-API-Key</code> header.</p>
            </div>
        </div>

        <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Suggested Platforms</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { name: "Zapier", desc: "Automation", icon: "⚡" },
                    { name: "Make.com", desc: "Workflows", icon: "🛠️" },
                    { name: "Twilio", desc: "WhatsApp/SMS", icon: "💬" },
                    { name: "Resend", desc: "Transactional Email", icon: "📧" }
                ].map(p => (
                    <div key={p.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-center">
                        <div className="text-xl mb-1">{p.icon}</div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">HTTP Example (Demo)</h4>
            <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
{`// Create a lead from an external source
fetch('https://api.propertyflow.com/public/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here'
  },
  body: JSON.stringify({
    fullName: "Prospect Name",
    phone: "+91 9876543210",
    email: "prospect@example.com",
    source: "WEBSITE",
    notes: "Created via API"
  })
})
.then(response => response.json())
.then(data => console.log("Lead created:", data));`}
            </pre>
        </div>
      </div>
    </div>
  )
}
