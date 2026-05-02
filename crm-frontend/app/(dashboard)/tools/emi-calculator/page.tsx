"use client"

import { useState, useMemo } from "react"
import { Calculator, TrendingUp, IndianRupee, Percent, Clock, Download, Share2, ChevronDown, ChevronUp } from "lucide-react"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"

/* ── EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1) ── */
function calcEMI(principal: number, annualRate: number, tenureMonths: number) {
  if (!principal || !annualRate || !tenureMonths) return 0
  const r = annualRate / (12 * 100)
  const n = tenureMonths
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`
  return `₹${Math.round(v).toLocaleString("en-IN")}`
}

function RangeInput({
  label, value, min, max, step, onChange, format,
  sublabel,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string; sublabel?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold text-primary">{format(value)}</span>
          {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
        </div>
      </div>
      <div className="relative h-2 bg-muted rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

export default function EMICalculatorPage() {
  const [principal, setPrincipal]   = useState(5000000)   // 50L
  const [rate, setRate]             = useState(8.5)
  const [tenure, setTenure]         = useState(240)        // 20 years
  const [showAmort, setShowAmort]   = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [compareRate, setCompareRate] = useState(9.0)
  const [compareTenure, setCompareTenure] = useState(180)

  const emi       = useMemo(() => calcEMI(principal, rate, tenure),           [principal, rate, tenure])
  const totalPay  = useMemo(() => emi * tenure,                               [emi, tenure])
  const totalInt  = useMemo(() => totalPay - principal,                       [totalPay, principal])
  const intRatio  = useMemo(() => totalInt / totalPay * 100,                  [totalInt, totalPay])

  const emi2      = useMemo(() => compareMode ? calcEMI(principal, compareRate, compareTenure) : 0, [compareMode, principal, compareRate, compareTenure])
  const total2    = useMemo(() => emi2 * compareTenure, [emi2, compareTenure])
  const int2      = useMemo(() => total2 - principal, [total2, principal])

  /* Yearly amortization schedule */
  const amortization = useMemo(() => {
    const r = rate / (12 * 100)
    const rows = []
    let balance = principal
    for (let yr = 1; yr <= Math.ceil(tenure / 12); yr++) {
      let yearPrincipal = 0
      let yearInterest  = 0
      for (let m = 0; m < 12 && balance > 0; m++) {
        const intPart  = balance * r
        const prinPart = emi - intPart
        yearInterest  += intPart
        yearPrincipal += prinPart
        balance       -= prinPart
      }
      rows.push({
        year:      yr,
        principal: Math.max(0, yearPrincipal),
        interest:  Math.max(0, yearInterest),
        balance:   Math.max(0, balance),
      })
    }
    return rows
  }, [principal, rate, tenure, emi])

  /* Chart data */
  const pieData = [
    { name: "Principal",    value: principal },
    { name: "Total Interest", value: totalInt },
  ]

  const balanceData = amortization.map(r => ({
    year:    `Yr ${r.year}`,
    balance: Math.round(r.balance),
    paid:    Math.round(principal - r.balance),
  }))

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">EMI Calculator</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            NEW
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Calculate home loan EMI, total interest, and repayment schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="enterprise-card p-5 space-y-6">
            <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Loan Parameters</h2>

            <RangeInput
              label="Loan Amount"
              value={principal}
              min={500000} max={50000000} step={100000}
              format={formatINR}
              onChange={setPrincipal}
            />

            <RangeInput
              label="Interest Rate"
              value={rate}
              min={5} max={20} step={0.05}
              format={v => `${v.toFixed(2)}%`}
              sublabel="per annum"
              onChange={setRate}
            />

            <RangeInput
              label="Loan Tenure"
              value={tenure}
              min={12} max={360} step={12}
              format={v => `${v / 12} yr`}
              sublabel={`${tenure} months`}
              onChange={setTenure}
            />
          </div>

          {/* Compare toggle */}
          <div className="enterprise-card p-4">
            <button
              onClick={() => setCompareMode(v => !v)}
              className="w-full flex items-center justify-between text-sm font-semibold text-foreground"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Compare Scenarios
              </span>
              {compareMode ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {compareMode && (
              <div className="mt-4 space-y-5 pt-4 border-t border-border">
                <RangeInput
                  label="Compare Rate"
                  value={compareRate}
                  min={5} max={20} step={0.05}
                  format={v => `${v.toFixed(2)}%`}
                  onChange={setCompareRate}
                />
                <RangeInput
                  label="Compare Tenure"
                  value={compareTenure}
                  min={12} max={360} step={12}
                  format={v => `${v / 12} yr`}
                  onChange={setCompareTenure}
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Primary result card */}
          <div className="enterprise-card p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Monthly EMI</p>
                <p className="text-4xl font-bold text-primary mt-1 tabular-nums">{formatINR(emi)}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/10">
              {[
                { label: "Principal",      value: formatINR(principal), icon: IndianRupee, color: "text-blue-500" },
                { label: "Total Interest", value: formatINR(totalInt),  icon: Percent,     color: "text-red-500"  },
                { label: "Total Amount",   value: formatINR(totalPay),  icon: TrendingUp,  color: "text-emerald-500" },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="text-center">
                    <p className={`text-sm font-bold ${s.color} tabular-nums`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comparison card */}
          {compareMode && (
            <div className="enterprise-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Scenario Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Scenario A",   emi: emi,  total: totalPay, interest: totalInt, rate, tenure },
                  { label: "Scenario B",   emi: emi2, total: total2,   interest: int2,     rate: compareRate, tenure: compareTenure },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${i === 0 ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/30" : "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/30"}`}>
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">{s.label}</p>
                    <p className="text-xl font-bold text-foreground tabular-nums">{formatINR(s.emi)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    <div className="space-y-1 mt-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="font-medium text-foreground">{s.rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenure</span>
                        <span className="font-medium text-foreground">{s.tenure / 12} yrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-medium text-red-500 tabular-nums">{formatINR(s.interest)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  💡 Scenario {int2 < totalInt ? "B" : "A"} saves{" "}
                  <strong>{formatINR(Math.abs(totalInt - int2))}</strong> in interest over the loan tenure.
                </p>
              </div>
            </div>
          )}

          {/* Pie chart */}
          <div className="enterprise-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Payment Breakdown</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={36} paddingAngle={2}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip formatter={(v: any) => formatINR(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {[
                  { label: "Principal",     value: principal, pct: 100 - intRatio, color: "#3b82f6" },
                  { label: "Total Interest",value: totalInt,  pct: intRatio,       color: "#ef4444" },
                ].map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{d.label}</span>
                      <span className="text-muted-foreground tabular-nums">{formatINR(d.value)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{d.pct.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance chart */}
      <div className="enterprise-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Loan Balance Over Time</h3>
            <p className="text-xs text-muted-foreground mt-0.5">How your outstanding balance decreases year by year</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={balanceData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatINR(v)} axisLine={false} tickLine={false} width={65} />
            <Tooltip formatter={(v: any) => formatINR(Number(v))} />
            <Area type="monotone" dataKey="balance" name="Outstanding" stroke="#3b82f6" fill="url(#balGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="paid"    name="Principal Paid" stroke="#10b981" fill="url(#paidGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Amortization table */}
      <div className="enterprise-card overflow-hidden">
        <button
          onClick={() => setShowAmort(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors border-b border-border"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Yearly Amortization Schedule
          </span>
          {showAmort ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showAmort && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  {["Year", "EMI × 12", "Principal", "Interest", "Balance"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amortization.map(row => (
                  <tr key={row.year} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.year}</td>
                    <td className="px-4 py-3 text-foreground tabular-nums">{formatINR(emi * 12)}</td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400 tabular-nums">{formatINR(row.principal)}</td>
                    <td className="px-4 py-3 text-red-500 tabular-nums">{formatINR(row.interest)}</td>
                    <td className="px-4 py-3 text-foreground tabular-nums">{formatINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
