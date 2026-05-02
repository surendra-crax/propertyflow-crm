"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import {
  TrendingUp, TrendingDown, Users, Handshake, Target, BarChart3,
  CalendarCheck, AlertTriangle, ArrowRight, Flame, Thermometer,
  Snowflake, Clock, Activity, ChevronRight,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

/* ── palette ── */
const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

/* ── helpers ── */
function formatCrore(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`
  return `₹${v.toLocaleString()}`
}

function StatBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-emerald-500" : "text-red-500"}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(value)}{suffix}
    </span>
  )
}

/* ── skeleton ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-72" />
        <Skeleton className="h-72" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2].map(i => <Skeleton key={i} className="h-64" />)}
      </div>
    </div>
  )
}

/* ── custom tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-muted-foreground mb-1 text-xs font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-semibold text-foreground">
          {p.name}: {typeof p.value === "number" && p.value > 10000 ? formatCrore(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER"
  const [lbMonth, setLbMonth] = useState("ALL")

  const { data: metrics,   isLoading: mLoad } = useQuery({ queryKey: ["dashboard"],      queryFn: () => api.get("/analytics/dashboard").then(r => r.data) })
  const { data: revenue,   isLoading: rLoad } = useQuery({ queryKey: ["monthly-revenue"],queryFn: () => api.get("/analytics/monthly-revenue").then(r => r.data), enabled: isAdmin })
  const { data: sources,   isLoading: sLoad } = useQuery({ queryKey: ["lead-sources"],   queryFn: () => api.get("/analytics/lead-sources").then(r => r.data),    enabled: isAdmin })
  const { data: forecast,  isLoading: fLoad } = useQuery({ queryKey: ["pipeline-forecast"],queryFn: ()=> api.get("/analytics/pipeline-forecast").then(r=>r.data),enabled: isAdmin })
  const { data: leaderboard } = useQuery({ queryKey: ["agent-leaderboard", lbMonth], queryFn: () => api.get(`/analytics/agent-leaderboard?month=${lbMonth}`).then(r => r.data), enabled: isAdmin })
  const { data: todayFU  = [] } = useQuery({ queryKey: ["followups-today"],   queryFn: () => api.get("/leads/followups/today").then(r => r.data) })
  const { data: overdueFU = [] } = useQuery({ queryKey: ["followups-overdue"],queryFn: () => api.get("/leads/followups/overdue").then(r => r.data) })

  const loading = mLoad && rLoad && sLoad

  if (loading) return <DashboardSkeleton />

  const metricCards = [
    {
      label:   "Total Leads",
      value:   metrics?.totalLeads || 0,
      icon:    Target,
      trend:   12,
      bg:      "bg-blue-500/10",
      iconBg:  "bg-blue-500",
      text:    "text-blue-600 dark:text-blue-400",
    },
    {
      label:   "Deals Closed",
      value:   metrics?.totalDeals || 0,
      icon:    Handshake,
      trend:   8,
      bg:      "bg-emerald-500/10",
      iconBg:  "bg-emerald-500",
      text:    "text-emerald-600 dark:text-emerald-400",
    },
    {
      label:   "Total Revenue",
      value:   formatCrore(metrics?.revenue || 0),
      icon:    TrendingUp,
      trend:   15,
      bg:      "bg-violet-500/10",
      iconBg:  "bg-violet-500",
      text:    "text-violet-600 dark:text-violet-400",
    },
    {
      label:   "Conversion Rate",
      value:   `${metrics?.conversionRate || 0}%`,
      icon:    BarChart3,
      trend:   -2,
      bg:      "bg-amber-500/10",
      iconBg:  "bg-amber-500",
      text:    "text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <div className="space-y-6 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-semibold">Live</span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="enterprise-card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <StatBadge value={card.trend} />
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Follow-up alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today */}
        <div className="enterprise-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Today&apos;s Follow-ups</span>
            </div>
            <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-semibold">
              {todayFU.length}
            </span>
          </div>
          <div className="p-3 max-h-60 overflow-y-auto">
            {todayFU.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                All clear — no follow-ups today
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayFU.map((f: any) => (
                  <Link
                    key={f.id}
                    href={`/leads/${f.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {f.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{f.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{f.phone} · {f.project?.name || "No project"}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overdue */}
        <div className="enterprise-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Overdue Follow-ups</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${overdueFU.length > 0 ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground"}`}>
              {overdueFU.length}
            </span>
          </div>
          <div className="p-3 max-h-60 overflow-y-auto">
            {overdueFU.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No overdue follow-ups
              </div>
            ) : (
              <div className="space-y-1.5">
                {overdueFU.map((f: any) => (
                  <Link
                    key={f.id}
                    href={`/leads/${f.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {f.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{f.fullName}</p>
                      <p className="text-xs text-red-500/80 font-medium">
                        Due: {f.nextFollowup ? new Date(f.nextFollowup).toLocaleDateString("en-IN") : "No date"}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{f.assignedAgent?.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts row — admin/manager only */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue chart */}
            <div className="enterprise-card lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Monthly closed deal value</p>
                </div>
                {metrics?.revenue && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatCrore(metrics.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                )}
              </div>
              {rLoad ? <Skeleton className="h-52" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenue || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" strokeOpacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 240)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 240)" }} tickFormatter={v => formatCrore(v)} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Lead Sources */}
            <div className="enterprise-card p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">Lead Sources</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Distribution by channel</p>
              </div>
              {sLoad ? <Skeleton className="h-52" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={sources || []}
                      dataKey="count"
                      nameKey="source"
                      cx="50%" cy="50%"
                      outerRadius={80} innerRadius={48}
                      paddingAngle={2}
                    >
                      {(sources || []).map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      iconType="circle" iconSize={7}
                      formatter={(v: string) => <span className="text-[11px] text-muted-foreground">{v.replace(/_/g, " ")}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pipeline Forecast */}
            <div className="enterprise-card p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">Pipeline Forecast</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Expected revenue by stage</p>
              </div>
              {fLoad ? <Skeleton className="h-52" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={forecast || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "oklch(0.52 0.02 240)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.52 0.02 240)" }} tickFormatter={v => formatCrore(v)} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Pipeline Value" fill="#8b5cf6" radius={[5, 5, 0, 0]} maxBarSize={42} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Agent Leaderboard */}
            <div className="enterprise-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Agent Leaderboard</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Top performers by revenue</p>
                </div>
                <select
                  value={lbMonth}
                  onChange={e => setLbMonth(e.target.value)}
                  className="text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="ALL">All Time</option>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {(!leaderboard || leaderboard.length === 0) ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No data for this period</div>
                ) : (
                  leaderboard.slice(0, 5).map((agent: any, i: number) => {
                    const medals = ["🥇", "🥈", "🥉"]
                    return (
                      <div key={agent.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-7 h-7 flex items-center justify-center text-base shrink-0">
                          {i < 3 ? medals[i] : <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{agent.leads} leads</span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-[10px] text-muted-foreground">{agent.deals} deals</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-emerald-500 shrink-0 tabular-nums">
                          {formatCrore(agent.revenue)}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>

              <Link
                href="/agents"
                className="mt-4 flex items-center justify-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View all agents <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Agent / Broker view */}
      {user?.role === "AGENT" && (
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Your Activity</h3>
              <p className="text-xs text-muted-foreground">Use the sidebar to navigate to your leads and follow-ups</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/leads" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
              <Target className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">My Leads</span>
            </Link>
            <Link href="/followups" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
              <CalendarCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Follow-ups</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
