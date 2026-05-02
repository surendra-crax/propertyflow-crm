"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../auth/auth-provider"
import {
  LayoutDashboard, Users, Target, Columns3, MapPin, Handshake,
  FolderKanban, BarChart3, Settings, CalendarCheck, Building2,
  UserCog, X, Upload, FileSearch, KeyRound, Megaphone, Timer,
  ShieldAlert, Gauge, Zap, Map, Calculator, Brain, ChevronDown,
  ChevronRight, TrendingUp, Home, Layers, Cpu,
} from "lucide-react"
import { useState } from "react"

type NavItem = {
  name: string
  path: string
  icon: React.ElementType
  roles: string[]
  badge?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
  defaultOpen?: boolean
}

const groups: NavGroup[] = [
  {
    label: "Overview",
    defaultOpen: true,
    items: [
      { name: "Dashboard",    path: "/dashboard",   icon: LayoutDashboard, roles: ["ADMIN","MANAGER"] },
      { name: "Pipeline",     path: "/pipeline",    icon: Columns3,        roles: ["ADMIN","MANAGER","AGENT"] },
    ],
  },
  {
    label: "Sales",
    defaultOpen: true,
    items: [
      { name: "Leads",        path: "/leads",       icon: Target,          roles: ["ADMIN","MANAGER","AGENT"] },
      { name: "Follow-ups",   path: "/followups",   icon: CalendarCheck,   roles: ["ADMIN","MANAGER","AGENT"] },
      { name: "Site Visits",  path: "/site-visits", icon: MapPin,          roles: ["ADMIN","MANAGER","AGENT"] },
      { name: "Deals",        path: "/deals",       icon: Handshake,       roles: ["ADMIN","MANAGER","AGENT","BROKER"] },
    ],
  },
  {
    label: "Properties",
    defaultOpen: true,
    items: [
      { name: "Projects",      path: "/projects",             icon: FolderKanban, roles: ["ADMIN","MANAGER","BROKER"] },
      { name: "Property Map",  path: "/map",                  icon: Map,          roles: ["ADMIN","MANAGER","BROKER"], badge: "NEW" },
      { name: "Floor Plans",   path: "/floor-plans",          icon: Layers,       roles: ["ADMIN","MANAGER","BROKER"], badge: "NEW" },
      { name: "EMI Calculator",path: "/tools/emi-calculator", icon: Calculator,   roles: ["ADMIN","MANAGER","AGENT","BROKER"], badge: "NEW" },
    ],
  },
  {
    label: "Team",
    defaultOpen: false,
    items: [
      { name: "Brokers",   path: "/brokers",    icon: Building2, roles: ["ADMIN"] },
      { name: "Agents",    path: "/agents",     icon: Users,     roles: ["ADMIN"] },
      { name: "Campaigns", path: "/campaigns",  icon: Megaphone, roles: ["ADMIN","MANAGER"] },
    ],
  },
  {
    label: "Analytics",
    defaultOpen: false,
    items: [
      { name: "Overview",       path: "/projects/analytics",        icon: BarChart3,  roles: ["ADMIN","MANAGER"] },
      { name: "Lead Intelligence", path: "/analytics/intelligence", icon: Brain,      roles: ["ADMIN","MANAGER"], badge: "NEW" },
      { name: "Response Time",  path: "/analytics/response-time",  icon: Timer,      roles: ["ADMIN","MANAGER"] },
      { name: "Lead Leakage",   path: "/analytics/lead-leakage",   icon: ShieldAlert,roles: ["ADMIN","MANAGER"] },
      { name: "Sales Velocity", path: "/analytics/sales-velocity", icon: Gauge,      roles: ["ADMIN","MANAGER"] },
    ],
  },
  {
    label: "Admin",
    defaultOpen: false,
    items: [
      { name: "Bulk Import",  path: "/leads/import",       icon: Upload,     roles: ["ADMIN","MANAGER"] },
      { name: "Automations",  path: "/settings/automations",icon: Zap,       roles: ["ADMIN"] },
      { name: "Audit Log",    path: "/settings/audit-log", icon: FileSearch, roles: ["ADMIN"] },
      { name: "API Keys",     path: "/settings/api-keys",  icon: KeyRound,   roles: ["ADMIN"] },
      { name: "Settings",     path: "/settings",           icon: Settings,   roles: ["ADMIN"] },
    ],
  },
]

function NavGroup({ group, userRole }: { group: NavGroup; userRole: string }) {
  const pathname = usePathname()
  const visibleItems = group.items.filter(i => i.roles.includes(userRole))
  const hasActive = visibleItems.some(i =>
    pathname === i.path || (i.path !== "/dashboard" && pathname.startsWith(i.path + "/"))
  )
  const [open, setOpen] = useState(group.defaultOpen || hasActive)

  if (!visibleItems.length) return null

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 group-hover:text-slate-400 transition-colors">
          {group.label}
        </span>
        {open
          ? <ChevronDown className="w-3 h-3 text-slate-600" />
          : <ChevronRight className="w-3 h-3 text-slate-600" />
        }
      </button>

      {open && (
        <div className="space-y-0.5">
          {visibleItems.map(item => {
            const isActive = pathname === item.path ||
              (item.path !== "/dashboard" && pathname.startsWith(item.path + "/"))
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
                  transition-all duration-150 group relative
                  ${isActive
                    ? "bg-blue-600/15 text-blue-300 shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const { user } = useAuth()

  if (!user) return null

  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"

  const roleColors: Record<string, string> = {
    ADMIN: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    MANAGER: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    AGENT: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    BROKER: "text-violet-400 bg-violet-500/15 border-violet-500/30",
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex flex-col shrink-0
        bg-[oklch(0.12_0.025_252)] border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>

        {/* Brand header */}
        <div className="px-4 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">PropertyFlow</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.18em] font-medium">Enterprise CRM</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1" onClick={() => setIsOpen(false)}>
          {groups.map(g => (
            <NavGroup key={g.label} group={g} userRole={user.role} />
          ))}
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-white/5 px-3 py-3">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-bold text-white shadow shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">{user.name}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${roleColors[user.role] || roleColors.AGENT} uppercase tracking-wider`}>
                {user.role}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-center">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">
              Powered by <a href="https://webxaitech.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">WebXAI</a>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
