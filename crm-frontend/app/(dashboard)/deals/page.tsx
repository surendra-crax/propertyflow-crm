"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import Link from "next/link"
import {
  Handshake, TrendingUp, CreditCard, FileText, Calculator,
  User, Phone, Building2, CalendarDays, BadgeIndianRupee, ExternalLink,
} from "lucide-react"

function formatVal(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`
  return `₹${n.toLocaleString("en-IN")}`
}

function Skeleton() {
  return (
    <div className="space-y-5 pb-6">
      <div className="shimmer h-8 w-52 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="shimmer h-52 rounded-xl" />)}
      </div>
    </div>
  )
}

export default function DealsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn:  () => api.get("/deals").then(r => {
      const d = r.data
      return Array.isArray(d) ? d : (d?.data || [])
    }),
  })

  const deals: any[] = data

  const totalRevenue = deals.reduce((s, d) => s + (d.saleValue || 0), 0)
  const totalComm    = deals.reduce((s, d) => s + (d.commissionAmount || 0), 0)
  const avgDealSize  = deals.length > 0 ? totalRevenue / deals.length : 0

  async function handleExport() {
    try {
      const res  = await api.get("/exports/deals", { responseType: "blob" })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href  = url
      link.setAttribute("download", "deals.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { /* silent */ }
  }

  if (isLoading) return <Skeleton />

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground">Deals</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{deals.length} closed deals</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tools/emi-calculator"
            className="flex items-center gap-1.5 text-sm bg-muted/60 hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-lg font-medium transition-all"
          >
            <Calculator className="w-4 h-4" /> EMI Calc
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm bg-muted/60 hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-lg font-medium transition-all"
          >
            <FileText className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue",   value: formatVal(totalRevenue), icon: TrendingUp,         bg: "bg-emerald-500/10", color: "text-emerald-500" },
          { label: "Total Deals",     value: deals.length,            icon: Handshake,           bg: "bg-blue-500/10",    color: "text-blue-500"    },
          { label: "Avg Deal Size",   value: formatVal(avgDealSize),  icon: BadgeIndianRupee,    bg: "bg-violet-500/10",  color: "text-violet-500"  },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="enterprise-card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* EMI / Payment promo */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex flex-wrap items-center gap-3">
        <Calculator className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">EMI & payment planning tools are live</p>
          <p className="text-xs text-muted-foreground">Help buyers model home-loan EMIs and plan payment schedules before closing.</p>
        </div>
        <Link href="/tools/emi-calculator" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
          Open EMI Calculator <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Deal cards */}
      {deals.length === 0 ? (
        <div className="enterprise-card p-16 text-center">
          <Handshake className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-medium text-foreground">No deals yet</p>
          <p className="text-sm text-muted-foreground mt-1">Close a lead from the pipeline to create a deal</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal: any) => (
            <div key={deal.id} className="enterprise-card p-4 hover:border-primary/30">
              {/* Project + amount */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{deal.project?.name || "Unknown Project"}</p>
                  <p className="text-xs text-muted-foreground">{deal.project?.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-emerald-500 tabular-nums">{formatVal(deal.saleValue)}</p>
                  {deal.unit?.unitNumber && (
                    <p className="text-[10px] text-muted-foreground">Unit {deal.unit.unitNumber}</p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                {[
                  { icon: User,          val: deal.lead?.fullName,                    label: "Client"    },
                  { icon: Phone,         val: deal.lead?.phone,                       label: "Phone"     },
                  { icon: Building2,     val: deal.lead?.assignedAgent?.name || "—",  label: "Agent"     },
                  { icon: Handshake,     val: deal.broker?.name || "Direct",          label: "Broker"    },
                  { icon: CalendarDays,  val: new Date(deal.closedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), label: "Closed" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground w-12 shrink-0">{label}</span>
                    <span className="text-foreground font-medium truncate">{val}</span>
                  </div>
                ))}

                {deal.broker && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                      <BadgeIndianRupee className="w-3 h-3 text-amber-500" />
                    </div>
                    <span className="text-muted-foreground w-12 shrink-0">Comm.</span>
                    <span className="text-amber-500 font-bold tabular-nums">{formatVal(deal.commissionAmount || 0)}</span>
                  </div>
                )}
              </div>

              {/* Payment history link */}
              <div className="mt-4 pt-3 border-t border-border">
                <Link
                  href={`/deals/${deal.id}/payments`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 py-2 rounded-lg transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Payment History
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commission summary */}
      {totalComm > 0 && (
        <div className="enterprise-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Broker Commissions Payable</p>
            <p className="text-lg font-bold text-amber-500 tabular-nums mt-0.5">{formatVal(totalComm)}</p>
          </div>
          <Link href="/brokers" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
            Manage Brokers <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
