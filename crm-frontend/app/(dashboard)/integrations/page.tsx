"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import {
  Plug, CheckCircle2, XCircle, Copy, Check, Key, Webhook,
  Facebook, Globe, MessageSquare, Mail, HardDrive, Zap,
  RefreshCw, ExternalLink, AlertCircle, Building2,
} from "lucide-react"
import { toast } from "sonner"

/* ─── Integration catalogue ─────────────────────────────────── */
const INTEGRATIONS = [
  {
    group: "Lead Portals",
    items: [
      { type: "FACEBOOK",        label: "Facebook Lead Ads",   icon: Facebook,      color: "text-blue-500",    bg: "bg-blue-500/10",    desc: "Auto-import leads from Facebook & Instagram ad campaigns.",  webhookPath: "/integrations/facebook-leads" },
      { type: "GOOGLE",          label: "Google Ads",          icon: Globe,         color: "text-orange-500",  bg: "bg-orange-500/10",  desc: "Capture leads from Google Ads lead form extensions.",         webhookPath: null },
      { type: "MAGICBRICKS",     label: "MagicBricks",         icon: Building2,     color: "text-red-500",     bg: "bg-red-500/10",     desc: "Receive property inquiries from MagicBricks listings.",       webhookPath: "/integrations/magicbricks" },
      { type: "NINETY_NINE_ACRES", label: "99acres",           icon: Building2,     color: "text-amber-500",   bg: "bg-amber-500/10",   desc: "Pull leads directly from 99acres property listings.",         webhookPath: "/integrations/99acres" },
      { type: "HOUSING_COM",     label: "Housing.com",         icon: Building2,     color: "text-violet-500",  bg: "bg-violet-500/10",  desc: "Sync inquiries from Housing.com real-time.",                  webhookPath: "/integrations/housing" },
      { type: "WEBSITE",         label: "Website / Landing",   icon: Globe,         color: "text-sky-500",     bg: "bg-sky-500/10",     desc: "Embed our JS snippet on any website to capture form leads.",  webhookPath: null },
    ],
  },
  {
    group: "Communication",
    items: [
      { type: "META_WHATSAPP",   label: "WhatsApp Business",   icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Send automated follow-up messages via WhatsApp Business API.", webhookPath: null },
      { type: "TWILIO_SMS",      label: "Twilio SMS",          icon: MessageSquare, color: "text-red-500",     bg: "bg-red-500/10",     desc: "Trigger SMS notifications for leads and reminders.",           webhookPath: null },
      { type: "RESEND",          label: "Resend Email",        icon: Mail,          color: "text-blue-400",    bg: "bg-blue-400/10",    desc: "Send branded email sequences to leads and clients.",           webhookPath: null },
      { type: "SENDGRID",        label: "SendGrid",            icon: Mail,          color: "text-sky-500",     bg: "bg-sky-500/10",     desc: "Transactional & marketing email at scale via SendGrid.",       webhookPath: null },
    ],
  },
  {
    group: "Storage & Infrastructure",
    items: [
      { type: "AWS_S3",          label: "AWS S3",              icon: HardDrive,     color: "text-orange-400",  bg: "bg-orange-400/10",  desc: "Store and serve project images, floor plans, and documents.",  webhookPath: null },
      { type: "WEBHOOK",         label: "Generic Webhook",     icon: Webhook,       color: "text-muted-foreground", bg: "bg-muted",      desc: "POST any lead payload from any source in JSON format.",        webhookPath: "/integrations/webhook/generic" },
    ],
  },
]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://propertyflow-api.onrender.com"

/* ─── Copy button ────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="ml-1 p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

/* ─── API Key row ────────────────────────────────────────────── */
function ApiKeysPanel() {
  const qc = useQueryClient()
  const [label, setLabel] = useState("")
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn:  () => api.get("/api-keys").then(r => r.data || []),
  })

  async function createKey() {
    if (!label.trim()) return
    setCreating(true)
    try {
      const res = await api.post("/api-keys", { label })
      setNewKey(res.data.rawKey || res.data.key || "")
      setLabel("")
      qc.invalidateQueries({ queryKey: ["api-keys"] })
      toast.success("API key created")
    } catch {
      toast.error("Failed to create API key")
    }
    setCreating(false)
  }

  async function deleteKey(id: string) {
    try {
      await api.delete(`/api-keys/${id}`)
      qc.invalidateQueries({ queryKey: ["api-keys"] })
      toast.success("Key revoked")
    } catch {
      toast.error("Failed to revoke key")
    }
  }

  return (
    <div className="enterprise-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Key className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-bold text-foreground">API Keys</h3>
        <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-bold ml-auto">MCP / REST</span>
      </div>
      <p className="text-xs text-muted-foreground">Use these keys to authenticate external tools, MCP clients, and custom integrations against the PropertyFlow REST API.</p>

      {/* Create new key */}
      <div className="flex gap-2">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Key label (e.g. n8n-workflow)"
          className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          onKeyDown={e => e.key === "Enter" && createKey()}
        />
        <button
          onClick={createKey}
          disabled={creating || !label.trim()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create"}
        </button>
      </div>

      {/* Newly created key — show once */}
      {newKey && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Key created — copy now, it won't be shown again
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-foreground break-all">
            {newKey}
            <CopyButton text={newKey} />
          </div>
        </div>
      )}

      {/* Existing keys */}
      {isLoading ? (
        <div className="space-y-2">{[1,2].map(i => <div key={i} className="shimmer h-10 rounded-lg" />)}</div>
      ) : keys.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No API keys yet</p>
      ) : (
        <div className="space-y-2">
          {keys.map((k: any) => (
            <div key={k.id} className="flex items-center gap-3 px-3 py-2.5 bg-muted/40 rounded-lg border border-border">
              <Key className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{k.label}</p>
                <p className="text-[10px] text-muted-foreground">{k.isActive ? "Active" : "Inactive"} · Created {new Date(k.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => deleteKey(k.id)} className="text-[10px] text-red-500 hover:text-red-400 font-semibold transition-colors">Revoke</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MCP info panel ─────────────────────────────────────────── */
function McpPanel() {
  const baseUrl = API_BASE
  const endpoints = [
    { label: "List Leads",   method: "GET",   path: "/leads"      },
    { label: "Create Lead",  method: "POST",  path: "/leads"      },
    { label: "Update Lead",  method: "PATCH", path: "/leads/:id/status" },
    { label: "List Projects",method: "GET",   path: "/projects"   },
    { label: "List Deals",   method: "GET",   path: "/deals"      },
    { label: "Analytics",    method: "GET",   path: "/analytics/dashboard" },
  ]

  return (
    <div className="enterprise-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-foreground">MCP / External Integrations</h3>
        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-bold ml-auto">REST API</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Connect any external tool — n8n, Zapier, Make, Claude MCP clients, or custom scripts — via the PropertyFlow REST API. Use an API key from above as a Bearer token.
      </p>

      <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
        <p className="text-muted-foreground mb-1">Base URL</p>
        <div className="flex items-center gap-1 text-foreground">
          <span className="break-all">{baseUrl}</span>
          <CopyButton text={baseUrl} />
        </div>
      </div>

      <div className="space-y-1.5">
        {endpoints.map(ep => (
          <div key={ep.path} className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-lg border border-border font-mono text-xs">
            <span className={`font-bold w-10 shrink-0 ${ep.method === "GET" ? "text-emerald-500" : ep.method === "POST" ? "text-blue-500" : "text-amber-500"}`}>{ep.method}</span>
            <span className="text-foreground flex-1">{ep.path}</span>
            <span className="text-muted-foreground">{ep.label}</span>
            <CopyButton text={`${baseUrl}${ep.path}`} />
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Add <strong>Authorization: Bearer &lt;api-key&gt;</strong> header to every request. Create a key in the API Keys panel above.
        </p>
      </div>
    </div>
  )
}

/* ─── Integration card ───────────────────────────────────────── */
function IntegrationCard({ item, activeMap, onToggle }: {
  item: typeof INTEGRATIONS[0]["items"][0]
  activeMap: Record<string, boolean>
  onToggle: (type: string, current: boolean) => void
}) {
  const Icon    = item.icon
  const isActive = activeMap[item.type] ?? false

  return (
    <div className={`enterprise-card p-4 flex flex-col gap-3 ${isActive ? "border-primary/30" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${item.color}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{item.label}</p>
            {isActive ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <XCircle className="w-3 h-3" /> Inactive
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onToggle(item.type, isActive)}
          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
            isActive
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isActive ? "Disable" : "Enable"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>

      {item.webhookPath && (
        <div className="bg-muted/50 rounded-lg px-2.5 py-2 font-mono text-[11px] text-muted-foreground flex items-center gap-1">
          <Webhook className="w-3 h-3 shrink-0" />
          <span className="truncate flex-1">{API_BASE}{item.webhookPath}</span>
          <CopyButton text={`${API_BASE}${item.webhookPath}`} />
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function IntegrationsPage() {
  const qc = useQueryClient()

  const { data: integrations = [] } = useQuery({
    queryKey: ["integrations"],
    queryFn:  () => api.get("/integrations").then(r => r.data || []),
  })

  const activeMap: Record<string, boolean> = Object.fromEntries(
    (integrations as any[]).map((i: any) => [i.type, i.isActive])
  )

  async function handleToggle(type: string, current: boolean) {
    try {
      await api.put(`/integrations/${type}`, { isActive: !current })
      qc.invalidateQueries({ queryKey: ["integrations"] })
      toast.success(`${type} ${!current ? "enabled" : "disabled"}`)
    } catch {
      toast.error("Failed to update integration")
    }
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Plug className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground">Integrations</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connect lead portals, communication tools, webhooks, and external automation platforms.
        </p>
      </div>

      {/* API Keys + MCP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ApiKeysPanel />
        <McpPanel />
      </div>

      {/* Integration groups */}
      {INTEGRATIONS.map(group => (
        <div key={group.group}>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{group.group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map(item => (
              <IntegrationCard key={item.type} item={item} activeMap={activeMap} onToggle={handleToggle} />
            ))}
          </div>
        </div>
      ))}

      {/* Docs link */}
      <div className="enterprise-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Need help setting up?</p>
          <p className="text-xs text-muted-foreground mt-0.5">View the full API reference and integration guides.</p>
        </div>
        <a
          href="https://github.com/surendra-crax/propertyflow-crm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View Docs <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
