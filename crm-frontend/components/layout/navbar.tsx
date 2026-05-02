"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../auth/auth-provider"
import { api } from "../../lib/api"
import { useTheme } from "next-themes"
import { Bell, LogOut, Menu, Sun, Moon, Search, X, Download, CheckCheck } from "lucide-react"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return "just now"
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth()
  const [notifications, setNotifications]   = useState<any[]>([])
  const [unreadCount, setUnreadCount]       = useState(0)
  const [showNotif, setShowNotif]           = useState(false)
  const [showSearch, setShowSearch]         = useState(false)
  const { theme, setTheme }                 = useTheme()
  const [mounted, setMounted]               = useState(false)
  const [searchVal, setSearchVal]           = useState("")
  const notifRef  = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => { loadNotifications() }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  async function loadNotifications() {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ])
      setNotifications(notifRes.data)
      setUnreadCount(countRes.data)
    } catch { /* silent */ }
  }

  async function markAllRead() {
    try {
      await api.patch("/notifications/read-all")
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch { /* silent */ }
  }

  async function exportData(type: string) {
    try {
      const res  = await api.get(`/exports/${type}`, { responseType: "blob" })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href  = url
      link.setAttribute("download", `${type}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { /* silent */ }
  }

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-3 md:px-5 shrink-0 z-30 relative gap-3">

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global search */}
      <div className="flex-1 max-w-sm">
        {showSearch ? (
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search leads, projects, deals…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button onClick={() => { setShowSearch(false); setSearchVal("") }}>
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted rounded-lg px-3 py-2 transition-all w-full max-w-[240px]"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="hidden sm:block">Search…</span>
            <kbd className="hidden sm:flex ml-auto items-center gap-0.5 text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Export — admin/manager */}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <div className="hidden md:flex items-center border-r border-border pr-2 mr-1 gap-0.5">
            <button
              onClick={() => exportData("leads")}
              title="Export Leads CSV"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-accent transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" /> Leads
            </button>
            <button
              onClick={() => exportData("deals")}
              title="Export Deals CSV"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-accent transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" /> Deals
            </button>
          </div>
        )}

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 12).map((n: any) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-accent/50 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                    >
                      {!n.isRead && (
                        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mb-1" />
                      )}
                      <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-bold text-white shadow">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-foreground leading-tight">{user?.name?.split(" ")[0]}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
