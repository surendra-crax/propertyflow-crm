"use client"

import { useState } from "react"
import Sidebar from "../../components/layout/sidebar"
import Navbar from "../../components/layout/navbar"
import { AuthProvider } from "../../components/auth/auth-provider"
import { Toaster } from "sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "../../lib/query-client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{ duration: 4000 }}
          expand={false}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
