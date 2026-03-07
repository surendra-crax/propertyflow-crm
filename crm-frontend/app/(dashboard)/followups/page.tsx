"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { CalendarCheck, AlertTriangle, Phone, User } from "lucide-react"

export default function FollowupsPage() {
    const [todayFollowups, setTodayFollowups] = useState<any[]>([])
    const [overdueFollowups, setOverdueFollowups] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<"today" | "overdue">("today")

    useEffect(() => {
        Promise.all([
            api.get("/leads/followups/today"),
            api.get("/leads/followups/overdue"),
        ]).then(([todayRes, overdueRes]) => {
            setTodayFollowups(todayRes.data)
            setOverdueFollowups(overdueRes.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl animate-pulse" />)}
            </div>
        )
    }

    const currentList = tab === "today" ? todayFollowups : overdueFollowups

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Follow-ups</h1>
                <p className="text-sm text-slate-400 dark:text-slate-500">Track and manage your follow-up schedule</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setTab("today")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "today"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                >
                    <CalendarCheck className="w-4 h-4" />
                    Today ({todayFollowups.length})
                </button>
                <button
                    onClick={() => setTab("overdue")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "overdue"
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                >
                    <AlertTriangle className="w-4 h-4" />
                    Overdue ({overdueFollowups.length})
                </button>
            </div>

            {/* List */}
            {currentList.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <CalendarCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {tab === "today" ? "No follow-ups scheduled for today" : "No overdue follow-ups"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentList.map((lead: any) => (
                        <div
                            key={lead.id}
                            className={`bg-white dark:bg-slate-900 border rounded-xl p-4 hover:shadow-md transition-shadow ${tab === "overdue" ? "border-red-200 dark:border-red-900/50" : "border-slate-200 dark:border-slate-800"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${tab === "overdue" ? "bg-red-500" : "bg-indigo-500"
                                        }`}>
                                        {lead.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lead.fullName}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {lead.phone}
                                            </span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">{lead.project?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-medium ${tab === "overdue" ? "text-red-500 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                                        {lead.nextFollowup ? new Date(lead.nextFollowup).toLocaleString() : "N/A"}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                                        <User className="w-3 h-3" />
                                        {lead.assignedAgent?.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
