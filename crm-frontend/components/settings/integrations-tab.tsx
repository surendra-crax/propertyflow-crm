"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { 
  Megaphone, 
  Table as TableIcon, 
  MessageSquare, 
  Mail, 
  HardDrive,
  Settings2
} from "lucide-react"

const INTEGRATION_DEFS = [
  { type: "FACEBOOK_ADS", name: "Facebook Ads", icon: Megaphone, description: "Sync leads from Facebook Lead Forms" },
  { type: "GOOGLE_SHEETS", name: "Google Sheets", icon: TableIcon, description: "Export leads to Google Sheets automatically" },
  { type: "WHATSAPP_META", name: "WhatsApp (Meta)", icon: MessageSquare, description: "Send automated WhatsApp messages" },
  { type: "RESEND_EMAIL", name: "Resend Email", icon: Mail, description: "Send transactional emails and follow-ups" },
  { type: "AWS_S3", name: "AWS S3 Storage", icon: HardDrive, description: "Store lead and project documents securely" },
]

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [configModal, setConfigModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  async function loadIntegrations() {
    try {
      const res = await api.get("/integrations")
      setIntegrations(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function getStatus(type: string) {
    const integration = integrations.find(i => i.type === type)
    return integration?.isEnabled ? "Active" : "Not Configured"
  }

  function openConfig(def: any) {
    const existing = integrations.find(i => i.type === def.type)
    setSelected({
      ...def,
      isEnabled: existing?.isEnabled ?? false,
      credentials: existing?.credentials ?? {},
      configuration: existing?.configuration ?? {}
    })
    setConfigModal(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.post("/integrations/upsert", {
        type: selected.type,
        isEnabled: selected.isEnabled,
        credentials: selected.credentials,
        configuration: selected.configuration
      })
      await loadIntegrations()
      setConfigModal(false)
    } catch (err) {
      console.error(err)
      alert("Failed to save integration")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATION_DEFS.map(def => {
          const Icon = def.icon
          const status = getStatus(def.type)
          return (
            <Card key={def.type} className="hover:border-indigo-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{def.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">{def.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={status === "Active" ? "default" : "secondary"}>
                  {status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" onClick={() => openConfig(def)}>
                  <Settings2 className="w-3.5 h-3.5 mr-2" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={configModal} onOpenChange={setConfigModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
              <span className="text-sm font-medium">Enable Integration</span>
              <input 
                type="checkbox" 
                checked={selected?.isEnabled} 
                onChange={e => setSelected({...selected, isEnabled: e.target.checked})}
                className="w-4 h-4"
              />
            </div>
            
            {selected?.type === "RESEND_EMAIL" && (
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-slate-500">API Key</label>
                <Input 
                  type="password"
                  value={selected.credentials.apiKey || ""} 
                  onChange={e => setSelected({
                    ...selected, 
                    credentials: {...selected.credentials, apiKey: e.target.value}
                  })}
                  placeholder="re_..."
                />
              </div>
            )}

            {selected?.type === "AWS_S3" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Access Key ID</label>
                  <Input value={selected.credentials.accessKeyId || ""} onChange={e => setSelected({...selected, credentials: {...selected.credentials, accessKeyId: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Secret Access Key</label>
                  <Input type="password" value={selected.credentials.secretAccessKey || ""} onChange={e => setSelected({...selected, credentials: {...selected.credentials, secretAccessKey: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Bucket Name</label>
                  <Input value={selected.configuration.bucketName || ""} onChange={e => setSelected({...selected, configuration: {...selected.configuration, bucketName: e.target.value}})} />
                </div>
              </div>
            )}

            {/* Default credentials catcher for simple API keys */}
            {selected?.type !== "RESEND_EMAIL" && selected?.type !== "AWS_S3" && (
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-slate-500">API Credentials (JSON)</label>
                <textarea 
                  value={JSON.stringify(selected?.credentials, null, 2)}
                  onChange={e => {
                    try { setSelected({...selected, credentials: JSON.parse(e.target.value)}) } catch(err) {}
                  }}
                  className="w-full h-32 border rounded-md p-2 text-xs font-mono"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfigModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Configuration"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
