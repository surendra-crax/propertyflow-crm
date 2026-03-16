"use client"

import { useState, useEffect } from "react"
import { api } from "../../../lib/api"
import { PageHeader } from "../../../components/shared/page-header"
import { Megaphone, Plus, Trash2, Edit, Save, X, TrendingUp, IndianRupee, Users, MousePointerClick, CalendarDays } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { toastSuccess, toastError } from "../../../lib/toast"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "", source: "FACEBOOK_ADS", adSpend: 0,
    leadsGenerated: 0, visitsGenerated: 0, bookings: 0
  })

  // Pre-defined sources matching LeadSource enum mostly, plus some marketing channels
  const sources = ["FACEBOOK_ADS", "GOOGLE_ADS", "INSTAGRAM", "LINKEDIN", "HOUSING_COM", "MAGICBRICKS", "NINETY_NINE_ACRES", "OFFLINE_PRINT", "BILLBOARD", "OTHER"]

  useEffect(() => { loadCampaigns() }, [])

  async function loadCampaigns() {
    setLoading(true)
    try {
      const res = await api.get("/campaigns/roi")
      setCampaigns(res.data)
    } catch {
      toastError("Failed to load campaigns")
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await api.patch(`/campaigns/${editingId}`, {
            ...formData,
            adSpend: Number(formData.adSpend),
            leadsGenerated: Number(formData.leadsGenerated),
            visitsGenerated: Number(formData.visitsGenerated),
            bookings: Number(formData.bookings)
        })
        toastSuccess("Campaign updated")
        setEditingId(null)
      } else {
        await api.post("/campaigns", {
            ...formData,
            adSpend: Number(formData.adSpend),
            leadsGenerated: Number(formData.leadsGenerated),
            visitsGenerated: Number(formData.visitsGenerated),
            bookings: Number(formData.bookings)
        })
        toastSuccess("Campaign created")
        setShowAddForm(false)
      }
      loadCampaigns()
      setFormData({ name: "", source: "FACEBOOK_ADS", adSpend: 0, leadsGenerated: 0, visitsGenerated: 0, bookings: 0 })
    } catch {
      toastError(editingId ? "Failed to update campaign" : "Failed to create campaign")
    }
  }

  function handleEdit(c: any) {
    setFormData({
      name: c.name, source: c.source, adSpend: c.adSpend,
      leadsGenerated: c.leadsGenerated, visitsGenerated: c.visitsGenerated, bookings: c.bookings
    })
    setEditingId(c.id)
    setShowAddForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) return
    try {
      await api.delete(`/campaigns/${id}`)
      toastSuccess("Campaign deleted")
      loadCampaigns()
    } catch {
      toastError("Failed to delete campaign")
    }
  }

  const formatCurrency = (val: number | null) => {
      if (val === null || val === undefined) return "-"
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Campaigns & ROI"
        subtitle="Track marketing spend and calculate true Cost Per Acquisition"
        badge={<Megaphone className="w-5 h-5 text-slate-400" />}
        action={
          <Button onClick={() => {
              setEditingId(null)
              setFormData({ name: "", source: "FACEBOOK_ADS", adSpend: 0, leadsGenerated: 0, visitsGenerated: 0, bookings: 0 })
              setShowAddForm(!showAddForm)
          }} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showAddForm ? "Cancel" : "Add Campaign"}
          </Button>
        }
      />

      {/* Aggregate Stats */}
      {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                  { label: "Total Spend", value: formatCurrency(campaigns.reduce((sum, c) => sum + c.adSpend, 0)), icon: IndianRupee, color: "text-rose-500" },
                  { label: "Total Leads", value: campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0), icon: Users, color: "text-blue-500" },
                  { label: "Avg Cost Per Lead", value: formatCurrency(campaigns.reduce((sum, c) => sum + c.adSpend, 0) / Math.max(1, campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0))), icon: MousePointerClick, color: "text-purple-500" },
                  { label: "Total Bookings", value: campaigns.reduce((sum, c) => sum + c.bookings, 0), icon: TrendingUp, color: "text-emerald-500" },
              ].map(stat => (
                  <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${stat.color.replace('text', 'bg').replace('500', '50 dark:bg-opacity-20')} flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
              {editingId ? "Edit Campaign" : "Add New Campaign"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Campaign Name</label>
                <input required type="text" className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Diwali Mega Sale" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Source / Channel</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none"
                  value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                  {sources.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Total Ad Spend (₹)</label>
                <input required type="number" min="0" step="0.01" className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.adSpend} onChange={e => setFormData({ ...formData, adSpend: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Leads Generated</label>
                <input required type="number" min="0" className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.leadsGenerated} onChange={e => setFormData({ ...formData, leadsGenerated: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Site Visits Generated</label>
                <input required type="number" min="0" className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.visitsGenerated} onChange={e => setFormData({ ...formData, visitsGenerated: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Deals Closed (Bookings)</label>
                <input required type="number" min="0" className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30"
                  value={formData.bookings} onChange={e => setFormData({ ...formData, bookings: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Campaign</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Spend</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Output</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right bg-blue-50/50 dark:bg-blue-900/10">Cost / Lead</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right bg-purple-50/50 dark:bg-purple-900/10">Cost / Visit</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right bg-emerald-50/50 dark:bg-emerald-900/10">Cost / Booking</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Conv. Rate</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">No campaigns recorded yet.</td></tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 inline-block rounded uppercase mt-1">{c.source.replace(/_/g, " ")}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(c.adSpend)}
                    </td>
                    <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs">
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium" title="Leads">{c.leadsGenerated} L</span>
                            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-medium" title="Visits">{c.visitsGenerated} V</span>
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-medium" title="Bookings">{c.bookings} B</span>
                        </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/5">
                      {formatCurrency(c.cpl)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-purple-600 dark:text-purple-400 bg-purple-50/30 dark:bg-purple-900/5">
                      {formatCurrency(c.cpsv)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5">
                      {formatCurrency(c.cpb)}
                    </td>
                    <td className="px-5 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 font-bold ${c.conversionRate > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            {c.conversionRate}%
                        </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
