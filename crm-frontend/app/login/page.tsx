"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "../../lib/api"
import { Building2, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react"

const DEMO = [
  { role: "Admin",   email: "admin@propertyflow.com",  color: "from-blue-500   to-blue-600",   ring: "focus:ring-blue-500/30",   badge: "bg-blue-500/10 text-blue-300 border-blue-500/30"   },
  { role: "Manager", email: "priya@propertyflow.com",  color: "from-violet-500 to-violet-600", ring: "focus:ring-violet-500/30", badge: "bg-violet-500/10 text-violet-300 border-violet-500/30" },
  { role: "Agent",   email: "amit@propertyflow.com",   color: "from-emerald-500 to-emerald-600", ring: "focus:ring-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  { role: "Broker",  email: "sunil@brokers.com",       color: "from-amber-500  to-amber-600",  ring: "focus:ring-amber-500/30",  badge: "bg-amber-500/10 text-amber-300 border-amber-500/30"  },
]

const FEATURES = [
  "AI-powered lead scoring & intelligence",
  "Interactive 3D floor plans & site maps",
  "GPS-enabled site visit tracking",
  "Real-time pipeline analytics",
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res  = await api.post("/auth/login", { email, password })
      const token = res.data.access_token
      const user  = res.data.user
      localStorage.clear()
      localStorage.setItem("token",  token)
      localStorage.setItem("user",   JSON.stringify(user))
      localStorage.setItem("userId", user.id)
      localStorage.setItem("role",   user.role)
      router.push("/dashboard")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(email: string) {
    setEmail(email)
    setPassword("password123")
    setError("")
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f1e]">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight">PropertyFlow</p>
              <p className="text-blue-400/70 text-[10px] uppercase tracking-[0.2em] font-medium">Enterprise CRM</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            The future of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              real estate sales
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
            Unify your entire sales pipeline — from lead capture to deal closure — with enterprise-grade intelligence.
          </p>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          {/* Metric strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Users",   value: "2,400+" },
              { label: "Leads Managed",  value: "180K+"  },
              { label: "Revenue Closed", value: "₹940Cr+" },
            ].map(m => (
              <div key={m.label} className="bg-white/5 rounded-xl p-4 border border-white/8">
                <p className="text-xl font-bold text-white tabular-nums">{m.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">PropertyFlow</p>
              <p className="text-blue-400/70 text-[9px] uppercase tracking-widest">Enterprise CRM</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Demo Access</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO.map(d => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => fillDemo(d.email)}
                  className={`bg-white/5 border border-white/8 hover:border-white/15 hover:bg-white/8 rounded-xl p-3 text-left transition-all group ${
                    email === d.email ? "border-blue-500/40 bg-blue-500/8" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${d.badge}`}>
                      {d.role}
                    </span>
                    {email === d.email && (
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{d.email}</p>
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] text-slate-700 mt-3">
              All demo accounts use <span className="font-mono text-slate-500">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
