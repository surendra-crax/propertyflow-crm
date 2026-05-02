"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { X, User, Phone, Mail, Building2, Users, IndianRupee, Target } from "lucide-react"
import { toast } from "sonner"

interface CreateLeadModalProps {
  onClose: () => void
  onCreated: () => void
}

const SOURCES = [
  { value: "DIRECT",     label: "Direct Walk-in" },
  { value: "WEBSITE",    label: "Website" },
  { value: "REFERRAL",   label: "Referral" },
  { value: "FACEBOOK",   label: "Facebook Ads" },
  { value: "INSTAGRAM",  label: "Instagram" },
  { value: "GOOGLE",     label: "Google Ads" },
  { value: "99ACRES",    label: "99acres" },
  { value: "MAGICBRICKS",label: "MagicBricks" },
  { value: "HOUSING",    label: "Housing.com" },
  { value: "BROKER",     label: "Broker" },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all"

export default function CreateLeadModal({ onClose, onCreated }: CreateLeadModalProps) {
  const [loading, setLoading]   = useState(false)
  const [agents, setAgents]     = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm]         = useState({
    fullName:        "",
    phone:           "",
    email:           "",
    projectId:       "",
    source:          "DIRECT",
    budgetMin:       "",
    budgetMax:       "",
    notes:           "",
    assignedAgentId: "",
  })

  useEffect(() => {
    Promise.all([api.get("/agents"), api.get("/projects")])
      .then(([ar, pr]) => {
        setAgents(ar.data?.data || ar.data || [])
        setProjects(pr.data?.data || pr.data || [])
      })
      .catch(() => {})
  }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/leads", {
        ...form,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : 0,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : 0,
      })
      toast.success("Lead created successfully")
      onCreated()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create lead")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card w-full max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Create New Lead</h2>
              <p className="text-xs text-muted-foreground">Add a prospect to your pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-5 space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    required
                    type="text"
                    placeholder="Rajesh Kumar"
                    className={`${inputCls} pl-9`}
                    value={form.fullName}
                    onChange={set("fullName")}
                  />
                </div>
              </Field>

              <Field label="Phone Number *">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={`${inputCls} pl-9`}
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
              </Field>

              <Field label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    placeholder="rajesh@example.com"
                    className={`${inputCls} pl-9`}
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
              </Field>

              <Field label="Lead Source *">
                <select required className={inputCls} value={form.source} onChange={set("source")}>
                  {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>

              <Field label="Project Interest">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <select className={`${inputCls} pl-9`} value={form.projectId} onChange={set("projectId")}>
                    <option value="">Any / Not specified</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="Assign Agent">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <select className={`${inputCls} pl-9`} value={form.assignedAgentId} onChange={set("assignedAgentId")}>
                    <option value="">Auto-assign</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="Min Budget (₹)">
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="number"
                    placeholder="2000000"
                    className={`${inputCls} pl-9`}
                    value={form.budgetMin}
                    onChange={set("budgetMin")}
                  />
                </div>
              </Field>

              <Field label="Max Budget (₹)">
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="number"
                    placeholder="5000000"
                    className={`${inputCls} pl-9`}
                    value={form.budgetMax}
                    onChange={set("budgetMax")}
                  />
                </div>
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                rows={2}
                placeholder="Any additional context about this lead…"
                className={inputCls}
                value={form.notes}
                onChange={set("notes")}
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 pb-5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
