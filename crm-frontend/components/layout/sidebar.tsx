"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../auth/auth-provider"
import {
  LayoutDashboard,
  Users,
  Target,
  Columns3,
  MapPin,
  Handshake,
  FolderKanban,
  BarChart3,
  Settings,
  CalendarCheck,
  Building2,
  UserCog,
  X,
} from "lucide-react"

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER"] },
  { name: "Leads", path: "/leads", icon: Target, roles: ["ADMIN", "MANAGER", "AGENT"] },
  { name: "Pipeline", path: "/pipeline", icon: Columns3, roles: ["ADMIN", "MANAGER", "AGENT"] },
  { name: "Follow-ups", path: "/followups", icon: CalendarCheck, roles: ["ADMIN", "MANAGER", "AGENT"] },
  { name: "Site Visits", path: "/site-visits", icon: MapPin, roles: ["ADMIN", "MANAGER", "AGENT"] },
  { name: "Deals", path: "/deals", icon: Handshake, roles: ["ADMIN", "MANAGER", "AGENT", "BROKER"] },
  { name: "Projects", path: "/projects", icon: FolderKanban, roles: ["ADMIN", "MANAGER", "BROKER"] },
  { name: "Brokers", path: "/brokers", icon: Building2, roles: ["ADMIN"] },
  { name: "Agents", path: "/agents", icon: Users, roles: ["ADMIN"] },
  { name: "Analytics", path: "/projects/analytics", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
  { name: "Settings", path: "/settings", icon: Settings, roles: ["ADMIN"] },
]

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {

  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const filteredMenu = menu.filter(item => item.roles.includes(user.role))

  return (

    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white h-screen flex flex-col shrink-0
      transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>

      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">PropertyFlow</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">CRM</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredMenu.map(item => {

          const isActive = pathname === item.path ||
            (item.path !== "/dashboard" && pathname.startsWith(item.path + "/"))

          const Icon = item.icon

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? "bg-indigo-600/20 text-indigo-300 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section & Branding */}
      <div className="mt-auto px-4 py-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400">{user.role}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
            Powered by <a href="https://webxai.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">WebXAI</a>
          </p>
        </div>
      </div>

    </aside>
  )
}