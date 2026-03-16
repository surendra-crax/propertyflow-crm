"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2, Target, Columns3, BarChart3, Users, ArrowRight, Check,
  MessageSquare, Loader2, MapPin, Calendar, TrendingUp, Zap,
  AlertTriangle, Clock, Eye, Globe, Lock, Server, Shield,
  Phone, ChevronRight, Star
} from "lucide-react"
import LandingNavbar from "../../components/layout/landing-navbar"
import { api } from "../../lib/api"

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", teamSize: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const validateForm = () => {
    const { name, email, phone } = formData
    const fakeKeywords = ['test', 'asdf', 'qwer', 'fake', 'admin', 'demo', 'sample', 'abcd', 'xyz', 'foo', 'bar', '123']
    if (name.trim().length < 3) return 'Please enter your full name (at least 3 characters).'
    if (fakeKeywords.some(k => name.toLowerCase().includes(k))) return 'Please enter a real name.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address.'
    const blockedDomains = ['mailinator', 'trashmail', 'guerrillamail', 'yopmail', 'tempmail', 'sharklasers', 'example.com', 'test.com', 'fake.com']
    if (blockedDomains.some(d => email.toLowerCase().includes(d))) return 'Please use a real business email address.'
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length < 10) return 'Please enter a valid phone number (min 10 digits).'
    if (/^(0+|1234567890|9876543210)$/.test(digitsOnly)) return 'Please enter a real phone number.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) { setSubmitError(validationError); return }
    setIsSubmitting(true)
    setSubmitError("")
    try {
      await api.post("/contact-leads", formData)
      setSubmitSuccess(true)
      setFormData({ name: "", company: "", email: "", phone: "", teamSize: "", message: "" })
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <LandingNavbar />

      {/* ─── HERO ─── */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white pt-20">
        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Copy */}
            <div className="max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:ml-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold mb-6 border border-white/15 text-indigo-200">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Real Estate Sales Operating System
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] mb-6 tracking-tight">
                Convert Property
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Enquiries into Bookings
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                PropertyFlow helps real estate teams capture leads, manage agents, track site visits, and close deals faster — all from one powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-4 rounded-xl text-sm font-bold transition-all shadow-xl shadow-indigo-500/30 group"
                >
                  Request Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <Link
                  href="/demo-login"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-4 rounded-xl text-sm font-bold transition-all border border-white/15 backdrop-blur-sm"
                >
                  View Live Demo
                </Link>

              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-slate-400">
                {[
                  { icon: Check, text: "No per-user fees" },
                  { icon: Check, text: "Full data ownership" },
                  { icon: Check, text: "White-label ready" },
                ].map(({ icon: I, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <I className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Dashboard preview card */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-slate-800/50">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-4 flex-1 bg-slate-700/60 rounded-md text-[10px] text-slate-400 text-center py-0.5 font-mono">
                    crm.yourcompany.com
                  </span>
                </div>

                {/* Mini dashboard mockup */}
                <div className="p-4 space-y-3 bg-slate-950/60">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Active Leads", value: "284", color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Site Visits", value: "47", color: "text-purple-400", bg: "bg-purple-500/10" },
                      { label: "Deals Won", value: "₹2.4Cr", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-white/5`}>
                        <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pipeline mini */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pipeline</p>
                    <div className="flex gap-1.5">
                      {[
                        { label: "New", count: 48, w: "w-[48%]", color: "bg-blue-500" },
                        { label: "Follow", count: 31, w: "w-[31%]", color: "bg-amber-500" },
                        { label: "Visit", count: 12, w: "w-[12%]", color: "bg-purple-500" },
                        { label: "Won", count: 9, w: "w-[9%]", color: "bg-emerald-500" },
                      ].map(b => (
                        <div key={b.label} className="flex flex-col gap-1">
                          <div className={`h-1.5 ${b.color} rounded-full ${b.w} min-w-[12px]`} />
                          <span className="text-[9px] text-slate-500">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead rows */}
                  <div className="space-y-1.5">
                    {[
                      { name: "Rajesh Mehta", project: "Green Valley Villas", status: "HOT", color: "text-red-400 bg-red-900/30" },
                      { name: "Priya Sharma", project: "Skyline Heights", status: "WARM", color: "text-amber-400 bg-amber-900/30" },
                      { name: "Arun Kumar", project: "Lakefront Residences", status: "NEW", color: "text-blue-400 bg-blue-900/30" },
                    ].map(l => (
                      <div key={l.name} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2 border border-white/5">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-200">{l.name}</p>
                          <p className="text-[9px] text-slate-500">{l.project}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${l.color}`}>{l.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-emerald-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg">
                ✓ Lead Assigned in 12s
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                🔥 3 Site Visits Today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="bg-slate-900 border-y border-slate-800 py-10 md:py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:flex justify-items-center gap-y-8 gap-x-4 md:gap-12 text-center items-center lg:justify-center">
          {[
            { value: "500+", label: "Real Estate Teams" },
            { value: "₹450Cr+", label: "Revenue Tracked" },
            { value: "1.2L+", label: "Leads Managed" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM SECTION ─── */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">Sound familiar?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              Real Estate Sales is Harder Than It Should Be
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Most teams lose deals not because they lack customers — but because the process breaks down.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: AlertTriangle,
                color: "text-red-500",
                bg: "bg-red-50 dark:bg-red-500/10",
                border: "border-red-100 dark:border-red-500/20",
                title: "Leads Get Lost",
                desc: "Enquiries from ads, portals, and walk-ins fall through the cracks. No system to capture and route them.",
              },
              {
                icon: Clock,
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-500/10",
                border: "border-amber-100 dark:border-amber-500/20",
                title: "Agents Miss Follow-Ups",
                desc: "No reminders, no accountability. Leads go cold while competitors close the deal.",
              },
              {
                icon: Eye,
                color: "text-purple-500",
                bg: "bg-purple-50 dark:bg-purple-500/10",
                border: "border-purple-100 dark:border-purple-500/20",
                title: "Managers Are Blind",
                desc: "Without real-time visibility, management can't track where deals are or why revenue is stalling.",
              },
              {
                icon: Calendar,
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-500/10",
                border: "border-blue-100 dark:border-blue-500/20",
                title: "Site Visits Are Chaos",
                desc: "Scheduling conflicts, no-shows, and lack of pre-visit preparation cost deals every month.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl border ${card.border} ${card.bg} p-6 transition-all hover:shadow-md`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM OVERVIEW ─── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">Platform Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              One Platform. Complete Sales Control.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Every tool your team needs to capture, nurture, and close real estate deals — all in one deployable system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Lead Management", desc: "Capture and route leads from any source automatically. Smart assignment rules ensure no enquiry goes unattended.", color: "from-blue-500 to-indigo-600" },
              { icon: Columns3, title: "Sales Pipeline", desc: "Visual Kanban board with drag-and-drop. See every deal's status at a glance and move leads through stages instantly.", color: "from-indigo-500 to-purple-600" },
              { icon: MapPin, title: "Site Visit Scheduling", desc: "Schedule, track, and follow up on site visits. Agents get reminders; managers get full visibility.", color: "from-purple-500 to-pink-600" },
              { icon: Building2, title: "Project Inventory", desc: "Manage units across multiple projects. Color-coded availability grid with floor-wise status tracking.", color: "from-orange-500 to-red-500" },
              { icon: BarChart3, title: "Revenue Analytics", desc: "Project-wise revenue, agent leaderboards, pipeline forecasting, and campaign ROI — all in real time.", color: "from-emerald-500 to-teal-600" },
              { icon: TrendingUp, title: "Deal & Commission Tracking", desc: "Track closed deals, broker commissions, payment schedules, and revenue milestones across your portfolio.", color: "from-teal-500 to-cyan-600" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 md:mb-5 shadow-lg group-hover:scale-105 transition-transform mx-auto md:mx-0`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 text-center md:text-left">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-center md:text-left">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW SECTION ─── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              From Enquiry to Booking — Automated
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              PropertyFlow guides every lead through a structured sales journey so nothing falls through the cracks.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-0 relative">
            {[
              { step: "1", icon: Zap, title: "Lead Captured", desc: "Enquiries from ads, website forms, and portals are captured automatically.", color: "bg-blue-500" },
              { step: "2", icon: Users, title: "Agent Assigned", desc: "Assignment rules route the lead to the best available agent instantly.", color: "bg-indigo-500" },
              { step: "3", icon: Phone, title: "Follow Up", desc: "Agent calls or sends WhatsApp with one click. System logs the contact.", color: "bg-purple-500" },
              { step: "4", icon: MapPin, title: "Site Visit", desc: "Visit scheduled, confirmed, and tracked. No-shows flagged automatically.", color: "bg-orange-500" },
              { step: "5", icon: TrendingUp, title: "Deal Closed", desc: "Booking recorded, payment plan setup, revenue dashboards updated instantly.", color: "bg-emerald-500" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center flex-col md:flex-row flex-1 min-w-0">
                <div className="flex flex-col items-center text-center px-4 py-6 md:py-0 flex-1 min-w-0">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${s.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg shrink-0`}>
                    <s.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-slate-500 mb-3">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[150px] md:max-w-[130px]">{s.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:flex items-center shrink-0">
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD SHOWCASE ─── */}
      <section className="py-24 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">Platform Preview</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">See PropertyFlow in Action</h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              A clean, modern interface built for speed. Your team will be productive from day one.
            </p>
          </div>

          {/* Main screenshot */}
          <div className="rounded-2xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-800 ring-1 ring-white/10 mb-10">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[11px] text-slate-500 font-mono">Analytics Dashboard — Live Data</span>
            </div>
            <div className="aspect-[16/9] w-full bg-slate-900 relative overflow-hidden group">
              <img
                src="/dashboard-actual.png"
                alt="PropertyFlow CRM Analytics Dashboard"
                className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* 3-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Revenue by project, agent leaderboard, lead source breakdown, and pipeline forecast all in one view." },
              { icon: Columns3, title: "Kanban Pipeline", desc: "Visual deal board — drag leads through stages from New to Won. Real-time count and budget per column." },
              { icon: Target, title: "Lead Profile", desc: "Full lead history, activity timeline, documents, scheduled visits, and one-click contact options." },
            ].map(card => (
              <div key={card.title} className="bg-slate-900 border border-slate-700/60 rounded-xl p-5 hover:border-indigo-700/60 transition-colors">
                <div className="w-9 h-9 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                  <card.icon className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHITE-LABEL ADVANTAGE ─── */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">Deployment Model</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              Not a Shared SaaS — Your Own CRM Instance
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Unlike generic CRMs, PropertyFlow is deployed exclusively for your company. You get complete isolation, full control, and your own branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Server, title: "Dedicated Instance", desc: "Your own server, your own database. No shared infrastructure, no data mixing.", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
              { icon: Globe, title: "Custom Branding", desc: "Your company name, logo, and colors throughout the CRM. Agents see your brand, not ours.", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
              { icon: Lock, title: "Full Data Ownership", desc: "You own every byte of your customer data. Export anytime, migrate anytime.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
              { icon: Shield, title: "Isolated Integrations", desc: "Your WhatsApp, email, and payment gateways. No mixing with other clients' configs.", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20" },
            ].map(b => (
              <div key={b.title} className={`rounded-2xl border p-6 transition-all hover:shadow-md ${b.bg}`}>
                <div className={`w-10 h-10 rounded-xl ${b.bg} border flex items-center justify-center mb-4`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/40 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Built & deployed by WebXAI
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                WebXAI handles the full setup — hosting, branding, onboarding, and ongoing support. Your team gets a production-ready CRM within 30 minutes of going live.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              {["Setup in &lt;30 mins", "Ongoing Support", "Regular Updates"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Transparent One-Time Investment</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Get your own dedicated real estate sales operating system. No monthly fees. full ownership.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-[2rem] p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 -tr-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative">
                  
                  {/* Left Col — Price & CTA */}
                  <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100 dark:border-indigo-500/20">
                      Early Deployment Offer
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">PropertyFlow CRM Deployment</h3>
                    
                    <div className="my-6">
                      <div className="text-lg text-slate-400 dark:text-slate-500 line-through font-medium">₹3,00,000</div>
                      <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-1">₹1,50,000</div>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">50% Limited Launch Offer</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">One-time setup. No monthly subscription.</p>
                      </div>
                    </div>

                    <button 
                      onClick={scrollToContact}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl shadow-indigo-500/25 group mb-4"
                    >
                      Request Deployment
                    </button>
                    
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center md:text-left leading-relaxed">
                      Your company receives a dedicated CRM installation with full data ownership.
                    </p>
                  </div>

                  {/* Right Col — Features */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 gap-y-3.5">
                      {[
                        "Complete lead management system",
                        "Sales pipeline tracking",
                        "Site visit scheduling",
                        "Project & inventory management",
                        "Agent performance dashboard",
                        "Deal and revenue tracking",
                        "Campaign source tracking",
                        "WhatsApp communication integration",
                        "Company branding inside CRM",
                        "Hosting and domain setup",
                        "CRM deployment and configuration",
                        "Team onboarding and training"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-16 max-w-2xl mx-auto leading-relaxed">
            PropertyFlow CRM is exclusively deployed and managed for your real estate company by WebXAI.<br />
            Schedule a consultation to see how we can transform your sales operations.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-6 uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            Get Started Today
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Stop Losing Property Leads
          </h2>
          <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Install a complete Real Estate Sales Operating System for your business. Dedicated deployment, zero setup headache.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-indigo-50 transition-all shadow-xl group"
            >
              Request Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              href="/demo-login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-base transition-all border border-white/20 backdrop-blur-sm"
            >
              View Live Demo
            </Link>

          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact-form" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-12 border border-slate-100 dark:border-slate-800">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Ready to grow your business?</h2>
              <p className="text-slate-500 dark:text-slate-400">Book a consultation or request a demo setup for your real estate team.</p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 p-6 rounded-xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Request Received!</h3>
                <p className="text-emerald-600 dark:text-emerald-400">Thank you for contacting WebXAI. Our team will reach out shortly to schedule a consultation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium">{submitError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                    <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="Real Estate Corp" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="you@yourcompany.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Size</label>
                    <select value={formData.teamSize} onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      <option value="">Select team size</option>
                      <option value="1-5">1-5 agents</option>
                      <option value="6-20">6-20 agents</option>
                      <option value="21-50">21-50 agents</option>
                      <option value="50+">50+ agents</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message / Requirements</label>
                    <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400"
                      placeholder="Tell us about your current sales process and what you're looking for..." />
                  </div>
                </div>
                <button disabled={isSubmitting} type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Demo"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">By submitting this form, you agree to our Terms of Service and Privacy Policy.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">PropertyFlow CRM</span>
            <span className="text-slate-600 dark:text-slate-600 text-xs ml-2">Real Estate Sales OS</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            Powered by <a href="https://webxaitech.com" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-400 hover:text-indigo-300">WebXAI</a>
          </div>
          <p className="text-xs text-slate-500">© 2026 PropertyFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
