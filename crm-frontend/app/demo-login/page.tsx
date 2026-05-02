"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ArrowRight, Zap, BarChart3, Users, Handshake } from "lucide-react"
import { api } from "../../lib/api"

const ROLES = [
  {
    key:       "admin",
    email:     "admin@propertyflow.com",
    label:     "System Admin",
    badge:     "Full Control",
    desc:      "Manage projects, agents, analytics, and all company data.",
    color:     "blue",
    icon:      BarChart3,
    active:    "border-blue-500 bg-blue-50 dark:bg-blue-950/40",
    inactive:  "border-border hover:border-blue-400",
    badgeCls:  "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400",
    arrowCls:  "group-hover:text-blue-500",
    spinCls:   "border-blue-600 border-t-transparent",
  },
  {
    key:       "manager",
    email:     "priya@propertyflow.com",
    label:     "Sales Manager",
    badge:     "Management",
    desc:      "Track team pipeline, performance analytics, and deals.",
    color:     "violet",
    icon:      Users,
    active:    "border-violet-500 bg-violet-50 dark:bg-violet-950/40",
    inactive:  "border-border hover:border-violet-400",
    badgeCls:  "text-violet-600 bg-violet-100 dark:bg-violet-900/50 dark:text-violet-400",
    arrowCls:  "group-hover:text-violet-500",
    spinCls:   "border-violet-600 border-t-transparent",
  },
  {
    key:       "agent",
    email:     "amit@propertyflow.com",
    label:     "Property Advisor",
    badge:     "Sales Agent",
    desc:      "Manage daily leads, site visits, and follow-ups.",
    color:     "emerald",
    icon:      Zap,
    active:    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    inactive:  "border-border hover:border-emerald-400",
    badgeCls:  "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400",
    arrowCls:  "group-hover:text-emerald-500",
    spinCls:   "border-emerald-600 border-t-transparent",
  },
  {
    key:       "broker",
    email:     "sunil@brokers.com",
    label:     "External Broker",
    badge:     "Partner Access",
    desc:      "Submit leads and track your commissions.",
    color:     "amber",
    icon:      Handshake,
    active:    "border-amber-500 bg-amber-50 dark:bg-amber-950/40",
    inactive:  "border-border hover:border-amber-400",
    badgeCls:  "text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400",
    arrowCls:  "group-hover:text-amber-500",
    spinCls:   "border-amber-600 border-t-transparent",
  },
]

type WakeStage = "idle" | "waking" | "logging" | "done"

export default function DemoLoginPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [stage, setStage]           = useState<WakeStage>("idle")
  const [error, setError]           = useState("")

  async function handleLogin(roleKey: string, email: string) {
    if (activeRole) return
    setActiveRole(roleKey)
    setError("")
    setStage("waking")

    // First ping health — this wakes the Render cold-start server
    try {
      await Promise.race([
        api.get("/health"),
        new Promise<void>(res => setTimeout(res, 8000)), // max 8s warm-up
      ])
    } catch { /* still try login even if health fails */ }

    setStage("logging")

    try {
      const res  = await api.post("/auth/login", { email, password: "password123" })
      const token = res.data.access_token
      const user  = res.data.user
      localStorage.clear()
      localStorage.setItem("token",  token)
      localStorage.setItem("user",   JSON.stringify(user))
      localStorage.setItem("userId", user.id)
      localStorage.setItem("role",   user.role)
      setStage("done")
      router.push("/dashboard")
    } catch {
      setError("Login failed — the server may still be waking up. Please try again in a few seconds.")
      setActiveRole(null)
      setStage("idle")
    }
  }

  const stageLabel: Record<WakeStage, string> = {
    idle:    "",
    waking:  "Waking server…",
    logging: "Signing you in…",
    done:    "Redirecting…",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Left — branding */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">PropertyFlow</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Enterprise CRM</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
            Live Demo<br />Environment
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
            Explore the full platform with real data pre-loaded — leads, projects, deals, analytics and all new enterprise features.
          </p>

          {/* Warm-up notice */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">⚡ Server Warm-up</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
              The demo server may take <strong>10–20 seconds</strong> on first login as it wakes from sleep. We show you the progress — just click your role and wait.
            </p>
          </div>
        </div>

        {/* Right — role cards */}
        <div className="md:col-span-3 bg-card rounded-2xl border border-border shadow-lg p-6 flex flex-col gap-4">
          <div className="mb-1">
            <h2 className="text-lg font-bold text-foreground">Choose your role</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Each role shows different features and permissions.</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/25 rounded-xl px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {ROLES.map(role => {
            const Icon    = role.icon
            const isThis  = activeRole === role.key
            const busy    = !!activeRole

            return (
              <button
                key={role.key}
                disabled={busy}
                onClick={() => handleLogin(role.key, role.email)}
                className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left disabled:cursor-wait ${
                  isThis ? role.active : role.inactive
                } ${busy && !isThis ? "opacity-40" : ""}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isThis ? "bg-white/80 dark:bg-black/20" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${isThis ? `text-${role.color}-600 dark:text-${role.color}-400` : "text-muted-foreground"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${role.badgeCls}`}>
                      {role.badge}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{role.label}</p>
                  {isThis ? (
                    <p className="text-xs text-primary font-medium mt-0.5 animate-pulse">{stageLabel[stage]}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                  )}
                </div>

                {isThis ? (
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin shrink-0 ${role.spinCls}`} />
                ) : (
                  <ArrowRight className={`w-5 h-5 text-muted-foreground transition-all shrink-0 ${role.arrowCls} group-hover:translate-x-0.5`} />
                )}
              </button>
            )
          })}

          <button
            onClick={() => router.push("/landing")}
            className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            ← Return to website
          </button>
        </div>
      </div>
    </div>
  )
}
