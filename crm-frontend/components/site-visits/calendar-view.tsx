"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"

export function SiteVisitCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [currentDate])

  async function fetchVisits() {
    setLoading(true)
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    try {
      const res = await api.get(`/site-visits/calendar?start=${start.toISOString()}&end=${end.toISOString()}`)
      setVisits(res.data)
    } catch (err) {
      console.error("Failed to fetch calendar visits", err)
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  function isSameDay(d1: number, d2: Date) {
    return d2.getDate() === d1 && d2.getMonth() === currentDate.getMonth() && d2.getFullYear() === currentDate.getFullYear()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[100px]">
        {days.map((day, i) => {
          const dayVisits = day ? visits.filter(v => isSameDay(day, new Date(v.visitDate))) : []
          return (
            <div key={i} className={`border-r border-b border-slate-50 p-1.5 transition-colors ${day ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/20'}`}>
              {day && (
                <>
                  <span className={`text-xs font-medium ${new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() ? 'bg-indigo-600 text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px]">
                    {dayVisits.map(v => (
                      <div key={v.id} className="text-[10px] p-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 truncate font-medium">
                        {v.lead?.fullName}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
