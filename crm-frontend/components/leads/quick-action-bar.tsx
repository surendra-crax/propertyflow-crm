"use client"

import { Phone, MessageSquare, Calendar } from "lucide-react"

interface QuickActionBarProps {
  phone: string
  fullName: string
  agentName?: string
  projectName?: string
  leadId: string
}

export function QuickActionBar({ phone, fullName, agentName, projectName, leadId }: QuickActionBarProps) {
  const waText = encodeURIComponent(
    `Hello ${fullName}, this is ${agentName || "your agent"} from PropertyFlow regarding your interest in ${projectName || "our properties"}. Let me know when you are available to talk.`
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex gap-3 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
      <a
        href={`tel:${phone}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95"
      >
        <Phone className="w-4 h-4" />
        Call
      </a>
      <a
        href={`https://wa.me/${phone?.replace(/\D/g, "")}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        WhatsApp
      </a>
      <a
        href={`/site-visits?leadId=${leadId}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95"
      >
        <Calendar className="w-4 h-4" />
        Visit
      </a>
    </div>
  )
}
