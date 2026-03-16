"use client"

import { useEffect, useState, use } from "react"
import { api } from "../../../../../lib/api"
import { Building2, Plus, ArrowLeft, Grid, Calculator } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table"

export default function projectUnitsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [units, setUnits] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

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

  const statusColors: any = {
    AVAILABLE: "bg-emerald-50 text-emerald-700",
    RESERVED: "bg-amber-50 text-amber-700",
    SOLD: "bg-red-50 text-red-700",
  }

  if (loading) return <div className="p-8">Loading inventory...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{project?.name} Inventory</h1>
          <p className="text-sm text-slate-500">Manage floors, units and availability</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Link href={`/projects/${id}/cost-sheet`}>
            <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              <Calculator className="w-4 h-4" />
              Cost Sheet
            </Button>
          </Link>
          <Link href={`/projects/${id}/inventory-grid`}>
            <Button variant="outline" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
              <Grid className="w-4 h-4" />
              Visual Grid
            </Button>
          </Link>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Unit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardStat label="Total Units" value={units.length} />
        <CardStat label="Available" value={units.filter(u => u.status === "AVAILABLE").length} color="text-emerald-600" />
        <CardStat label="Reserved" value={units.filter(u => u.status === "RESERVED").length} color="text-amber-600" />
        <CardStat label="Sold" value={units.filter(u => u.status === "SOLD").length} color="text-red-600" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">Unit No.</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Area (Sqft)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No units added to this project yet
                </TableCell>
              </TableRow>
            ) : (
              units.map(unit => (
                <TableRow key={unit.id} className="hover:bg-slate-50/50 cursor-pointer">
                  <TableCell className="px-5 font-semibold">{unit.unitNumber}</TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>{unit.area}</TableCell>
                  <TableCell>₹{(unit.price / 100000).toFixed(2)} L</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[unit.status]}>
                      {unit.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function CardStat({ label, value, color = "text-slate-900" }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
