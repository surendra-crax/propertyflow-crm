"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { useAuth } from "../../../components/auth/auth-provider"
import { TrendingUp, Users, Handshake, Target, BarChart3, CalendarCheck, AlertTriangle } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from "recharts"

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8", "#6d28d9"]

export default function DashboardPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<any>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [leadSources, setLeadSources] = useState<any[]>([])
  const [pipelineForecast, setPipelineForecast] = useState<any[]>([])
  const [agentLeaderboard, setAgentLeaderboard] = useState<any[]>([])
  const [todayFollowups, setTodayFollowups] = useState<any[]>([])
  const [overdueFollowups, setOverdueFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const [metricsRes, revenueRes, sourcesRes, forecastRes, leaderRes, todayRes, overdueRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/monthly-revenue"),
        api.get("/analytics/lead-sources"),
        api.get("/analytics/pipeline-forecast"),
        api.get("/analytics/agent-leaderboard"),
        api.get("/leads/followups/today"),
        api.get("/leads/followups/overdue"),
      ])
      setMetrics(metricsRes.data)
      setMonthlyRevenue(revenueRes.data)
      setLeadSources(sourcesRes.data)
      setPipelineForecast(forecastRes.data)
      setAgentLeaderboard(leaderRes.data)
      setTodayFollowups(todayRes.data)
      setOverdueFollowups(overdueRes.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const metricCards = [
    { label: "Total Leads", value: metrics?.totalLeads || 0, icon: Target, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { label: "Deals Closed", value: metrics?.totalDeals || 0, icon: Handshake, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
    { label: "Total Revenue", value: `₹${((metrics?.revenue || 0) / 100000).toFixed(1)}L`, icon: TrendingUp, color: "from-purple-500 to-violet-600", bg: "bg-purple-50" },
    { label: "Conversion Rate", value: `${metrics?.conversionRate || 0}%`, icon: BarChart3, color: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Follow-up Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Follow-ups */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Today&apos;s Follow-ups</h3>
            <span className="ml-auto text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
              {todayFollowups.length}
            </span>
          </div>
          {todayFollowups.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No follow-ups today</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayFollowups.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-transparent dark:border-slate-800 text-left">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{f.phone} · {f.project?.name}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{f.assignedAgent?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Follow-ups */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Overdue Follow-ups</h3>
            <span className="ml-auto text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
              {overdueFollowups.length}
            </span>
          </div>
          {overdueFollowups.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No overdue follow-ups</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overdueFollowups.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-500/5 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{f.phone} · {f.project?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                      {f.nextFollowup ? new Date(f.nextFollowup).toLocaleDateString() : "N/A"}
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{f.assignedAgent?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Revenue */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Sources */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Lead Sources</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={leadSources}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                  >
                    {leadSources.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Forecast + Agent Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pipeline Forecast */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Pipeline Forecast</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pipelineForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Pipeline Value"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Agent Leaderboard</h3>
              <div className="space-y-3">
                {agentLeaderboard.map((agent: any, i: number) => (
                  <div key={agent.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-transparent dark:border-slate-800">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-slate-300 dark:bg-slate-600"
                      }`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{agent.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{agent.leads} leads · {agent.deals} deals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">₹{(agent.revenue / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agent-only view */}
      {user?.role === "AGENT" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Assigned Leads</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">Check your leads and follow-ups from the sidebar navigation.</p>
        </div>
      )}
    </div>
  )
}