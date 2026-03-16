"use client"

import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export function BrandingTab() {
  const [config, setConfig] = useState({
    companyName: "",
    logoUrl: "",
    brandColor: "#6366f1",
    emailSignature: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    try {
      const res = await api.get("/tenant-config")
      if (res.data) setConfig(res.data)
    } catch (err) {
      console.error("Failed to load branding config", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/tenant-config", config)
      alert("Settings saved successfully!")
    } catch (err) {
      console.error("Failed to save branding config", err)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Branding</CardTitle>
        <CardDescription>Customize your CRM instance with your company's identity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input 
              value={config.companyName} 
              onChange={e => setConfig({...config, companyName: e.target.value})} 
              placeholder="e.g. Acme Real Estate"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <Input 
              value={config.logoUrl} 
              onChange={e => setConfig({...config, logoUrl: e.target.value})} 
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Color</label>
            <div className="flex gap-4 items-center">
              <input 
                type="color" 
                value={config.brandColor} 
                onChange={e => setConfig({...config, brandColor: e.target.value})}
                className="w-12 h-12 rounded border cursor-pointer"
              />
              <Input 
                value={config.brandColor} 
                onChange={e => setConfig({...config, brandColor: e.target.value})}
                className="w-32"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Signature (Plain Text)</label>
            <textarea 
              value={config.emailSignature} 
              onChange={e => setConfig({...config, emailSignature: e.target.value})}
              className="w-full min-h-[100px] border rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              placeholder="Best regards, \nThe Team"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Branding Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
