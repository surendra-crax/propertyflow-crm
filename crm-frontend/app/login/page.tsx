"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "../../lib/api"
import { Building2, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: any) {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", { email, password })

      const token = res.data.access_token
      const user = res.data.user

      localStorage.clear()
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userId", user.id)
      localStorage.setItem("role", user.role)

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PropertyFlow CRM</h1>
          <p className="text-sm text-slate-400 mt-1">Modern CRM for Real Estate Teams</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-0.5">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm text-red-300 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Demo credentials */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-[11px] text-slate-500 text-center mb-2 uppercase tracking-wider">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setEmail("admin@propertyflow.com"); setPassword("password123") }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors text-left"
              >
                <span className="font-medium text-indigo-400">Admin</span>
                <br />
                <span className="text-slate-500">admin@propertyflow.com</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("priya@propertyflow.com"); setPassword("password123") }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors text-left"
              >
                <span className="font-medium text-indigo-400">Manager</span>
                <br />
                <span className="text-slate-500">priya@propertyflow.com</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("amit@propertyflow.com"); setPassword("password123") }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors text-left"
              >
                <span className="font-medium text-indigo-400">Agent</span>
                <br />
                <span className="text-slate-500">amit@propertyflow.com</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("sunil@brokers.com"); setPassword("password123") }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors text-left"
              >
                <span className="font-medium text-indigo-400">Broker</span>
                <br />
                <span className="text-slate-500">sunil@brokers.com</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}