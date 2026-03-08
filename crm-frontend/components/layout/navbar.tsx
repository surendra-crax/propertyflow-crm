"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../auth/auth-provider"
import { api } from "../../lib/api"
import { useTheme } from "next-themes"
import { Bell, LogOut, Download, Menu, Sun, Moon } from "lucide-react"

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {

  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function loadNotifications() {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ])
      setNotifications(notifRes.data)
      setUnreadCount(countRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function markAllRead() {
    try {
      await api.patch("/notifications/read-all")
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error(err)
    }
  }

  async function exportData(type: string) {
    try {
      const res = await api.get(`/exports/${type}`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${type}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-3 md:px-6 shrink-0 z-40 relative">

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 dark:text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
            Welcome back, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">

        {/* Export buttons for ADMIN/MANAGER */}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <div className="hidden md:flex items-center gap-1 mr-2">
            <button
              onClick={() => exportData("leads")}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Leads
            </button>
            <button
              onClick={() => exportData("deals")}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Deals
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute -right-16 sm:right-0 top-12 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n: any) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? "bg-indigo-50/50" : ""
                        }`}
                    >
                      <p className="text-sm font-medium text-slate-700">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-300 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role badge */}
        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          {user?.role}
        </span>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>

      </div>
    </header>
  )
}