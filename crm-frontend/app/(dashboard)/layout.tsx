"use client"

import { useState } from "react"
import Sidebar from "../../components/layout/sidebar"
import Navbar from "../../components/layout/navbar"
import { AuthProvider } from "../../components/auth/auth-provider"

import DemoBanner from "../../components/layout/demo-banner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto overflow-hidden">
          <DemoBanner />
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 z-0">
            {children}
          </main>
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthProvider>
  )
}