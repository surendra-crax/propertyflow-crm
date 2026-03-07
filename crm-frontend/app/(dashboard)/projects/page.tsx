"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { FolderKanban, MapPin } from "lucide-react"

const statusColors: Record<string, string> = {
  PRELAUNCH: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30",
  ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-52 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Projects</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">{projects.length} projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => {
            const occupancy = Math.round(((project.totalUnits - project.availableUnits) / project.totalUnits) * 100)
            return (
              <div key={project.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col group">
                <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 mix-blend-multiply" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm border backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{project.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm mb-5 flex-1">
                    <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400">Price Range</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">₹{(project.minPrice / 100000).toFixed(0)}L - ₹{(project.maxPrice / 100000).toFixed(0)}L</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400">Units</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{project.availableUnits} <span className="text-slate-400 dark:text-slate-600 font-normal">/ {project.totalUnits} available</span></span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 dark:text-slate-400">Manager</span>
                      <span className="text-slate-800 dark:text-slate-200">{project.manager?.name || "-"}</span>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>Occupancy Rate</span>
                      <span className={`font-bold ${occupancy > 80 ? "text-emerald-600 dark:text-emerald-400" : occupancy > 50 ? "text-amber-500 dark:text-amber-400" : "text-indigo-600 dark:text-indigo-400"}`}>{occupancy}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${occupancy > 80 ? "bg-emerald-500" : occupancy > 50 ? "bg-amber-400" : "bg-indigo-500"}`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}