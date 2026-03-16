"use client"

import { useEffect, useState } from "react"
import { api } from "../../../../../lib/api"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Receipt, IndianRupee, Calendar } from "lucide-react"

export default function DealPaymentsPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string

  const [deal, setDeal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)

  // Payment Form States
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER")
  const [paymentStage, setPaymentStage] = useState("BOOKING")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadDeal()
  }, [dealId])

  async function loadDeal() {
    try {
      const res = await api.get(`/deals/${dealId}`)
      setDeal(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(`/deals/${dealId}/payments`, {
        amount: Number(amount),
        date: new Date(date),
        paymentMethod,
        paymentStage,
        notes
      })
      setShowAddPayment(false)
      // Reset form
      setAmount("")
      setNotes("")
      loadDeal() // refresh data
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading deal payment records...</div>
  }

  if (!deal) {
    return <div className="p-8 text-center text-red-500">Deal not found.</div>
  }

  const totalPaid = deal.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0
  const outstanding = deal.saleValue - totalPaid
  const progressPercent = Math.min(100, Math.round((totalPaid / deal.saleValue) * 100))

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Payment Management</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {deal.lead?.fullName} • {deal.project?.name}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Sale Value</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹{deal.saleValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Received</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 mt-1">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Outstanding Balance</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-500 mt-1">₹{outstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-slate-700 dark:text-slate-300">Collection Progress</span>
          <span className="text-emerald-600 dark:text-emerald-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-500" /> Payment History
        </h2>
        <button
          onClick={() => setShowAddPayment(!showAddPayment)}
          className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Payment
        </button>
      </div>

      {/* Add Payment Form */}
      {showAddPayment && (
        <form onSubmit={handleAddPayment} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Record New Payment</h3>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Amount (₹)</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                required
                min="1"
                max={outstanding}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Stage</label>
            <select
              value={paymentStage}
              onChange={(e) => setPaymentStage(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="TOKEN">Token Advance</option>
              <option value="BOOKING">Booking Amount</option>
              <option value="AGREEMENT">Agreement value</option>
              <option value="FINAL_PAYMENT">Final Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes / Transaction ID</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              placeholder="e.g. UTR NO: HDFC00012345"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowAddPayment(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </form>
      )}

      {/* Payments List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto whitespace-nowrap">
          {deal.payments && deal.payments.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Stage</th>
                  <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Method</th>
                  <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Notes</th>
                  <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {deal.payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold tracking-wide uppercase">
                        {payment.paymentStage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{payment.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-500">{payment.notes || "-"}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800 dark:text-emerald-400">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center flex flex-col items-center">
              <Receipt className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No payments recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
