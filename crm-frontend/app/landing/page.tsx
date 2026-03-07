"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Target, Columns3, BarChart3, Users, ArrowRight, Check, MessageSquare, Loader2 } from "lucide-react"
import LandingNavbar from "../../components/layout/landing-navbar"
import { api } from "../../lib/api"

export default function LandingPage() {
    const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", teamSize: "", message: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState("")

    const validateForm = () => {
        const { name, email, phone } = formData

        // Block clearly fake names
        const fakeKeywords = ['test', 'asdf', 'qwer', 'fake', 'admin', 'demo', 'sample', 'abcd', 'xyz', 'foo', 'bar', '123']
        if (name.trim().length < 3) return 'Please enter your full name (at least 3 characters).'
        if (fakeKeywords.some(k => name.toLowerCase().includes(k))) return 'Please enter a real name.'

        // Email: must look real — block disposable/test domains
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (!emailRegex.test(email)) return 'Please enter a valid email address.'
        const blockedDomains = ['mailinator', 'trashmail', 'guerrillamail', 'yopmail', 'tempmail', 'sharklasers', 'example.com', 'test.com', 'fake.com']
        if (blockedDomains.some(d => email.toLowerCase().includes(d))) return 'Please use a real business email address.'

        // Phone: must have at least 10 digits
        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length < 10) return 'Please enter a valid phone number (min 10 digits).'
        if (/^(0+|1234567890|9876543210)$/.test(digitsOnly)) return 'Please enter a real phone number.'

        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateForm()
        if (validationError) {
            setSubmitError(validationError)
            return
        }
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

            {/* Hero */}
            <section id="home" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-6xl mx-auto px-6 py-24 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium mb-6 border border-white/10">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Trusted by 500+ Real Estate Teams
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                            PropertyFlow <span className="text-indigo-400">CRM</span> —<br />
                            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                                Close More Property Deals With Smart Real Estate CRM
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                            Manage leads, track pipeline, close deals, and grow your real estate business — all from one powerful platform.
                        </p>
                        <div className="flex items-center gap-4">
                            <button onClick={scrollToContact} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                                Book Consultation
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link href="/demo-login" className="bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-all border border-white/10">
                                View Live Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 bg-white dark:bg-slate-950 transition-colors">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Everything you need to sell properties</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Powerful tools designed specifically for real estate teams to manage their entire sales workflow.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: "Lead Management", desc: "Capture, track, and nurture leads from any source. Automatic assignment ensures no lead goes unattended." },
                            { icon: Columns3, title: "Pipeline Tracking", desc: "Visual Kanban board to move leads through stages. Drag-and-drop simplicity with real-time updates." },
                            { icon: BarChart3, title: "Revenue Analytics", desc: "Track revenue by project, agent, and source. Monthly trends and pipeline forecasting at a glance." },
                            { icon: Users, title: "Agent Performance", desc: "Monitor agent productivity with leaderboards. Track deals, conversions, and revenue per agent." },
                            { icon: MessageSquare, title: "WhatsApp Follow-ups", desc: "Send one-click WhatsApp messages to clients using pre-built templates directly from your pipeline." },
                            { icon: Building2, title: "Direct Call System", desc: "Initiate calls to leads and agents directly from the CRM with one click, logging engagement instantly." },
                            { icon: Building2, title: "Project Management", desc: "Manage multiple projects with inventory tracking, pricing, and occupancy analytics." },
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all dark:bg-slate-800">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                                    <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">How PropertyFlow Works</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">A simple 5-step workflow to accelerate your real estate sales.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
                        {[
                            { step: "1", title: "Capture", desc: "Leads flowing in from website and ads." },
                            { step: "2", title: "Assign", desc: "Auto-routed to the best agents." },
                            { step: "3", title: "Engage", desc: "Follow up via WhatsApp and calls." },
                            { step: "4", title: "Visit", desc: "Schedule and manage site visits." },
                            { step: "5", title: "Close", desc: "Sign deals and track revenue." }
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col items-center relative">
                                {i < 4 && <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-slate-200 dark:bg-slate-700" />}
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xl rounded-full flex items-center justify-center mb-4 border-2 border-indigo-100 dark:border-indigo-900/50 z-10 shadow-sm relative">
                                    {s.step}
                                </div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{s.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-dark.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="max-w-6xl mx-auto px-6 text-center mb-16 relative">
                    <h2 className="text-3xl font-bold text-white mb-4">See PropertyFlow In Action</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">A powerful, intuitive interface designed for maximum productivity.</p>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="rounded-2xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-800 ring-1 ring-white/10">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="aspect-[16/9] w-full bg-slate-900 relative overflow-hidden group">
                            <img
                                src="/dashboard-preview.png"
                                alt="PropertyFlow CRM Dashboard"
                                className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">CRM Deployment Plans</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Custom-deployed and managed real estate CRM for your team — by WebXAI.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter CRM */}
                        <div className="rounded-2xl p-8 flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Starter CRM</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best for small real estate teams.</p>
                            <div className="my-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                                <div className="text-3xl font-extrabold text-slate-800 dark:text-white">₹15,000<span className="text-base font-medium text-slate-400 dark:text-slate-500"> / month</span></div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">or ₹1,50,000 / year</div>
                            </div>
                            <ul className="space-y-2.5 mb-8 flex-1">
                                {["Lead management system", "Pipeline tracking", "Site visit scheduling", "WhatsApp follow-up integration", "Basic analytics dashboard", "Company branding inside CRM", "Domain setup", "Hosting setup", "Basic maintenance and support"].map((f, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 dark:text-slate-300 leading-snug">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={scrollToContact} className="w-full text-center px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-600">
                                Book Consultation
                            </button>
                        </div>

                        {/* Business CRM — highlighted */}
                        <div className="rounded-2xl p-8 flex flex-col relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/30 scale-[1.03] z-10">
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">Most Popular</div>
                            <h3 className="text-xl font-bold text-white">Business CRM</h3>
                            <p className="text-sm text-indigo-200 mt-1">Best for growing real estate agencies.</p>
                            <div className="my-6 border-t border-white/20 pt-6">
                                <div className="text-3xl font-extrabold text-white">₹30,000<span className="text-base font-medium text-indigo-200"> / month</span></div>
                                <div className="text-sm text-indigo-200 mt-1">or ₹3,00,000 / year</div>
                            </div>
                            <ul className="space-y-2.5 mb-8 flex-1">
                                {["Project management module", "Agent performance tracking", "Deal management system", "Revenue analytics dashboards", "Automation setup", "Custom reporting", "Priority technical support", "Custom CRM branding"].map((f, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-indigo-200 shrink-0 mt-0.5" />
                                        <span className="text-indigo-100 leading-snug">{f}</span>
                                    </li>
                                ))}
                                <li className="text-xs text-indigo-300 italic pt-1">+ Everything in Starter</li>
                            </ul>
                            <button onClick={scrollToContact} className="w-full text-center px-6 py-3.5 rounded-xl text-sm font-semibold bg-white text-indigo-600 hover:bg-indigo-50 transition-all">
                                Book Consultation
                            </button>
                        </div>

                        {/* Enterprise CRM */}
                        <div className="rounded-2xl p-8 flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Enterprise CRM</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best for large developers and real estate companies.</p>
                            <div className="my-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                                <div className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Custom Pricing</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deployment under ₹3,00,000</div>
                            </div>
                            <ul className="space-y-2.5 mb-8 flex-1">
                                {["White-label CRM system", "Full company branding", "Landing page setup for the client", "Custom automation workflows", "Dedicated hosting deployment", "Team training and onboarding", "Advanced customization options"].map((f, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 dark:text-slate-300 leading-snug">{f}</span>
                                    </li>
                                ))}
                                <li className="text-xs text-slate-400 italic pt-1">+ Everything in Business</li>
                            </ul>
                            <button onClick={scrollToContact} className="w-full text-center px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-600">
                                Let&apos;s Discuss
                            </button>
                        </div>
                    </div>

                    {/* Pricing Note */}
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-12 max-w-2xl mx-auto leading-relaxed">
                        PropertyFlow CRM is deployed and customized specifically for your real estate company by WebXAI.<br />
                        Contact us to schedule a consultation and see how the platform can be tailored for your business.
                    </p>
                </div>
            </section>

            {/* What Clients Get & About WebXAI */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">What Clients Get</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Every white-label enterprise package comes fully loaded with:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            {[
                                "CRM dashboard", "Lead management", "Pipeline tracking",
                                "Analytics", "WhatsApp follow-ups", "Agent performance tracking",
                                "Project management", "Custom domain setup", "White-label branding"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Built by WebXAI</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            WebXAI builds automation systems and AI-powered platforms for modern businesses. PropertyFlow CRM is our flagship real estate product, designed to help teams capture more leads and close deals faster.
                        </p>
                        <a href="https://webxai.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            Visit WebXAI <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
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
                                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium">
                                        {submitError}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                                        <input
                                            required type="text"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                                        <input
                                            type="text"
                                            value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="Real Estate Corp"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</label>
                                        <input
                                            required type="email"
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="you@yourcompany.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                                        <input
                                            required type="tel"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Size</label>
                                        <select
                                            value={formData.teamSize} onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        >
                                            <option value="">Select team size</option>
                                            <option value="1-5">1-5 agents</option>
                                            <option value="6-20">6-20 agents</option>
                                            <option value="21-50">21-50 agents</option>
                                            <option value="50+">50+ agents</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message / Requirements</label>
                                        <textarea
                                            rows={4}
                                            value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="Tell us about your current sales process and what you're looking for..."
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Demo"}
                                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">By submitting this form, you agree to our Terms of Service and Privacy Policy.</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-8 transition-colors">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                            <Building2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">PropertyFlow CRM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Powered by <a href="https://webxai.com" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">WebXAI</a>
                    </div>
                    <p className="text-xs text-slate-400">© 2026 PropertyFlow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
