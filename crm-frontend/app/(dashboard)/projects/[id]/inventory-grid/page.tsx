"use client"

import { useEffect, useState, use } from "react"
import { api } from "../../../../../lib/api"
import { ArrowLeft, Grip, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"

export default function InventoryGridPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [units, setUnits] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    try {
      const [uRes, pRes] = await Promise.all([
        api.get(`/units/project/${id}`),
        api.get(`/projects/${id}`)
      ])
      setUnits(uRes.data)
      setProject(pRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Group units by floor
  const unitsByFloor = units.reduce((acc: any, unit: any) => {
    if (!acc[unit.floor]) acc[unit.floor] = []
    acc[unit.floor].push(unit)
    return acc
  }, {})

  // Sort floors descending (top floor at top)
  const sortedFloors = Object.keys(unitsByFloor).sort((a, b) => Number(b) - Number(a))

  // Sort units within floor by unitNumber
  sortedFloors.forEach(floor => {
    unitsByFloor[floor].sort((a: any, b: any) => a.unitNumber.localeCompare(b.unitNumber))
  })

  // Color mapping per requirements
  const statusConfig: any = {
    AVAILABLE: { color: "bg-emerald-500", label: "Available" },
    SOLD: { color: "bg-red-500", label: "Sold" },
    RESERVED: { color: "bg-amber-500", label: "Reserved" },
    MGMT_QUOTA: { color: "bg-blue-500", label: "Mgmt Quota" }
  }

  if (loading) return <div className="p-8 text-slate-500">Loading inventory grid...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${id}/units`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{project?.name} - Visual Inventory</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tower / Floor Status Grid</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 text-xs font-semibold shadow-sm">
          {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
            <div key={key} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className={`w-3 h-3 rounded-full ${config.color}`} />
              {config.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Grid Container */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-x-auto">
          {sortedFloors.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No units found for this project.</div>
          ) : (
            <div className="inline-flex flex-col gap-3 min-w-full">
              {sortedFloors.map(floor => (
                <div key={floor} className="flex items-center gap-4">
                  <div className="w-16 shrink-0 text-right font-bold text-slate-700 dark:text-slate-300">
                    Floor {floor}
                  </div>
                  <div className="flex items-center gap-2">
                    {unitsByFloor[floor].map((unit: any) => (
                      <button
                        key={unit.id}
                        onClick={() => setSelectedUnit(unit)}
                        className={`
                          w-12 h-12 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-105
                          ${statusConfig[unit.status]?.color || 'bg-slate-400'}
                          ${selectedUnit?.id === unit.id ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-white dark:ring-offset-slate-900' : ''}
                        `}
                        title={`Unit ${unit.unitNumber} - ${unit.status}`}
                      >
                        {unit.unitNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedUnit ? (
          <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg sticky top-6">
            <div className={`h-2 w-full ${statusConfig[selectedUnit.status]?.color || 'bg-slate-400'}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Grip className="w-4 h-4 text-slate-400" />
                  Unit {selectedUnit.unitNumber}
                </h3>
                <button onClick={() => setSelectedUnit(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${statusConfig[selectedUnit.status]?.color || 'bg-slate-400'}`}>
                    {statusConfig[selectedUnit.status]?.label || selectedUnit.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Type</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedUnit.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Floor</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedUnit.floor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Area (sqft)</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedUnit.area || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Price</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      ₹{selectedUnit.price ? (selectedUnit.price / 100000).toFixed(2) + 'L' : '-'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <Link href={`/projects/${id}/units`} className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold hover:underline">
                    Edit Unit Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-80 shrink-0 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-500">
            <Grip className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium">Select a unit from the grid<br/>to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
