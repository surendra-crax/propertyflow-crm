"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import Link from "next/link"
import {
  Brain, Flame, Thermometer, Snowflake, Target, ArrowRight,
  TrendingUp, AlertCircle, CheckCircle, Clock, Zap, Star,
  BarChart3, Phone, MessageSquare,
} from "lucide-react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"

interface Lead {
  id: string; fullName: string; phone: string; email: string
  status: string; score: number; temperature: string
  source: string; budgetMin: number; budgetMax: number
  nextFollowup: string | null; project?: { name: string }
  assignedAgent?: { name: string }
}

const TEMP_CONFIG = {
  HOT:  { icon: Flame,      color: "text-red-500",    bg: "bg-red-500/10",    badge: "bg-red-500/10 text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/40" },
  WARM: { icon: Thermometer,color: "text-amber-500",  bg: "bg-amber-500/10",  badge: "bg-amber-500/10 text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-900/40" },
  COLD: { icon: Snowflake,  color: "text-blue-500",   bg: "bg-blue-500/10",   badge: "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-900/40" },
}

function scoreBar(score: number) {
  const pct = Math.min(100, score)
  const color = score >= 60 ? "#ef4444" : score >= 30 ? "#f59e0b" : "#3b82f6"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

function getNextAction(lead: Lead): { text: string; urgency: "high" | "medium" | "low" } {
  if (lead.temperature === "HOT" && lead.status === "NEGOTIATION") return { text: "Schedule closing call today", urgency: "high" }
  if (lead.temperature === "HOT" && lead.status === "SITE_VISIT_DONE") return { text: "Send offer letter now", urgency: "high" }
  if (lead.temperature === "HOT") return { text: "Call within the hour", urgency: "high" }
  if (!lead.nextFollowup && lead.status !== "CLOSED_WON" && lead.status !== "CLOSED_LOST") return { text: "Schedule a follow-up date", urgency: "high" }
  if (lead.nextFollowup && new Date(lead.nextFollowup) < new Date()) return { text: "Overdue follow-up — call now", urgency: "high" }
  if (lead.temperature === "WARM" && lead.status === "CONTACTED") return { text: "Send property brochure via WhatsApp", urgency: "medium" }
  if (lead.temperature === "WARM") return { text: "Schedule site visit", urgency: "medium" }
  if (lead.status === "NEW") return { text: "Make first contact", urgency: "medium" }
  return { text: "Nurture with monthly updates", urgency: "low" }
}

function getReasonExplanation(lead: Lead): string[] {
  const reasons: string[] = []
  if (lead.budgetMax >= 5000000) reasons.push("High budget (₹50L+)")
  if (["WEBSITE", "REFERRAL", "BROKER"].includes(lead.source)) reasons.push(`Premium source: ${lead.source}`)
  if (lead.status === "NEGOTIATION") reasons.push("In active negotiation")
  if (lead.status === "SITE_VISIT_DONE") reasons.push("Completed site visit")
  if (lead.status === "FOLLOW_UP") reasons.push("In follow-up stage")
  if (lead.nextFollowup && new Date(lead.nextFollowup) < new Date()) reasons.push("Overdue follow-up")
  if (lead.temperature === "COLD") reasons.push("Low engagement — needs re-engagement")
  return reasons.length ? reasons : ["Mid-range budget", "Standard source"]
}

export default function IntelligencePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/leads?limit=100")
        setLeads(res.data?.data || [])
      } catch { /* silent */ }
      setLoading(false)
    }
    load()
  }, [])

  const scored   = [...leads].sort((a, b) => b.score - a.score)
  const hotLeads  = scored.filter(l => l.temperature === "HOT")
  const warmLeads = scored.filter(l => l.temperature === "WARM")
  const coldLeads = scored.filter(l => l.temperature === "COLD")

  const filtered = scored.filter(l => {
    if (filter !== "ALL" && l.temperature !== filter) return false
    if (search && !l.fullName.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false
    return true
  })

  /* Radar data for score breakdown */
  const radarData = [
    { axis: "HOT Leads",     value: hotLeads.length  },
    { axis: "Score 60+",     value: scored.filter(l => l.score >= 60).length },
    { axis: "Score 30-60",   value: scored.filter(l => l.score >= 30 && l.score < 60).length },
    { axis: "No Follow-up",  value: scored.filter(l => !l.nextFollowup && !["CLOSED_WON","CLOSED_LOST"].includes(l.status)).length },
    { axis: "Overdue",       value: scored.filter(l => l.nextFollowup && new Date(l.nextFollowup) < new Date()).length },
    { axis: "In Pipeline",   value: scored.filter(l => !["CLOSED_WON","CLOSED_LOST"].includes(l.status)).length },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 shimmer rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-violet-500" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Lead Intelligence</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-500 border border-violet-500/20">
              AI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">AI-powered lead scoring, temperature analysis, and next-best-action recommendations</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Hot Leads",    value: hotLeads.length,   icon: Flame,       color: "text-red-500",    bg: "bg-red-500/10"    },
          { label: "Warm Leads",   value: warmLeads.length,  icon: Thermometer, color: "text-amber-500",  bg: "bg-amber-500/10"  },
          { label: "Cold Leads",   value: coldLeads.length,  icon: Snowflake,   color: "text-blue-500",   bg: "bg-blue-500/10"   },
          { label: "Avg. Score",   value: Math.round(leads.reduce((a,l) => a + l.score, 0) / Math.max(leads.length, 1)), icon: Star, color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="enterprise-card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {(["ALL", "HOT", "WARM", "COLD"] as const).map(t => {
              const cfg = t !== "ALL" ? TEMP_CONFIG[t] : null
              const Icon = cfg?.icon
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {t === "ALL" ? `All (${leads.length})` : `${t} (${t === "HOT" ? hotLeads.length : t === "WARM" ? warmLeads.length : coldLeads.length})`}
                </button>
              )
            })}
            <input
              type="text"
              placeholder="Search name / phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ml-auto px-3 py-1.5 text-xs bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="space-y-3">
            {filtered.slice(0, 20).map(lead => {
              const action = getNextAction(lead)
              const reasons = getReasonExplanation(lead)
              const tempCfg = TEMP_CONFIG[lead.temperature as keyof typeof TEMP_CONFIG] || TEMP_CONFIG.COLD
              const TempIcon = tempCfg.icon

              return (
                <div key={lead.id} className="enterprise-card p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl ${tempCfg.bg} flex items-center justify-center shrink-0`}>
                      <TempIcon className={`w-5 h-5 ${tempCfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-foreground truncate">{lead.fullName}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${tempCfg.badge}`}>
                          {lead.temperature}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.phone} · {lead.project?.name || "No project"}</p>
                    </div>

                    <Link
                      href={`/leads/${lead.id}`}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Score</span>
                    </div>
                    {scoreBar(lead.score)}
                  </div>

                  {/* Next action */}
                  <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 mb-3 ${
                    action.urgency === "high"   ? "bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30" :
                    action.urgency === "medium" ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30" :
                    "bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30"
                  }`}>
                    <Zap className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      action.urgency === "high" ? "text-red-500" : action.urgency === "medium" ? "text-amber-500" : "text-blue-500"
                    }`} />
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">Next Best Action</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.text}</p>
                    </div>
                  </div>

                  {/* Reason tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.slice(0, 3).map(r => (
                      <span key={r} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {r}
                      </span>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone?.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(lead.fullName)}, this is regarding your interest in ${encodeURIComponent(lead.project?.name || "our properties")}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="enterprise-card p-12 text-center">
                <Brain className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-foreground font-medium">No leads match the filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights panel */}
        <div className="space-y-4">
          {/* Radar */}
          <div className="enterprise-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline Health</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(0.9 0.005 240)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: "oklch(0.52 0.02 240)" }} />
                <Radar name="Leads" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="enterprise-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Action Alerts</h3>
            <div className="space-y-2">
              {[
                {
                  icon: AlertCircle,
                  color: "text-red-500",
                  bg: "bg-red-500/10",
                  text: `${leads.filter(l => l.nextFollowup && new Date(l.nextFollowup) < new Date()).length} overdue follow-ups`,
                  link: "/followups",
                },
                {
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                  text: `${leads.filter(l => !l.nextFollowup && !["CLOSED_WON","CLOSED_LOST"].includes(l.status)).length} leads without follow-up date`,
                  link: "/leads",
                },
                {
                  icon: Flame,
                  color: "text-red-400",
                  bg: "bg-red-400/10",
                  text: `${hotLeads.length} hot leads need immediate attention`,
                  link: "/leads",
                },
                {
                  icon: TrendingUp,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  text: `${leads.filter(l => l.status === "NEGOTIATION").length} leads in negotiation`,
                  link: "/pipeline",
                },
              ].map((a, i) => {
                const Icon = a.icon
                return (
                  <Link
                    key={i}
                    href={a.link}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${a.color}`} />
                    </div>
                    <p className="text-xs text-foreground font-medium flex-1">{a.text}</p>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 mt-0.5 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Top 5 by score */}
          <div className="enterprise-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Scored Leads</h3>
            <div className="space-y-2">
              {scored.slice(0, 5).map((lead, i) => {
                const cfg = TEMP_CONFIG[lead.temperature as keyof typeof TEMP_CONFIG] || TEMP_CONFIG.COLD
                const Icon = cfg.icon
                return (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">#{i+1}</span>
                    <div className={`w-6 h-6 rounded-md ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-3 h-3 ${cfg.color}`} />
                    </div>
                    <p className="text-xs font-medium text-foreground flex-1 truncate">{lead.fullName}</p>
                    <span className="text-xs font-bold text-foreground tabular-nums">{lead.score}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
