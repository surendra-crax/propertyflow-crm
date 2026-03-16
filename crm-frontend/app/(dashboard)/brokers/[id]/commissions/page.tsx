"use client"

import { useEffect, useState, use } from "react"
import { api } from "../../../../../lib/api"
import { Wallet, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../components/ui/dialog"
import { Input } from "../../../../../components/ui/input"

export default function brokerCommissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [payments, setPayments] = useState<any[]>([])
  const [broker, setBroker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newPayment, setNewPayment] = useState({ amount: "", dealId: "", notes: "" })
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    try {
      const [pRes, bRes, dRes] = await Promise.all([
        api.get(`/broker-commissions/broker/${id}`),
        api.get(`/brokers/${id}`),
        api.get("/deals") // Simplified: load all deals to select from
      ])
      setPayments(pRes.data)
      setBroker(bRes.data)
      setDeals(dRes.data.filter((d: any) => d.brokerId === id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post(`/broker-commissions`, {
        ...newPayment,
        brokerId: id,
        amount: parseFloat(newPayment.amount)
      })
      setShowAdd(false)
      setNewPayment({ amount: "", dealId: "", notes: "" })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-8">Loading commissions...</div>

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/brokers" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Broker Commissions</h1>
          <p className="text-sm text-slate-500">{broker?.name} - {broker?.company}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Commission Paid</p>
          <p className="text-2xl font-bold mt-1 text-indigo-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deals Count</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{deals.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">Date</TableHead>
              <TableHead>Deal Reference</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Amount Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map(p => (
              <TableRow key={p.id}>
                <TableCell className="px-5 text-sm">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-sm font-medium">{p.deal?.project?.name || "N/A"}</TableCell>
                <TableCell className="text-sm text-slate-500 italic">{p.notes || "-"}</TableCell>
                <TableCell className="text-right font-bold text-slate-900">₹{p.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                  No commission payments recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Commission Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Deal</label>
              <select 
                required
                className="w-full border rounded-md h-9 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={newPayment.dealId}
                onChange={e => setNewPayment({...newPayment, dealId: e.target.value})}
              >
                <option value="">Select a deal</option>
                {deals.map(d => (
                  <option key={d.id} value={d.id}>{d.project?.name} - {d.lead?.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Amount Paid (₹)</label>
              <Input 
                required 
                type="number" 
                value={newPayment.amount} 
                onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                placeholder="e.g. 50000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Input 
                value={newPayment.notes} 
                onChange={e => setNewPayment({...newPayment, notes: e.target.value})}
                placeholder="e.g. TDS deducted"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
