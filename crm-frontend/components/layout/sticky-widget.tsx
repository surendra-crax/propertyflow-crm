"use client"

import { useState } from "react"
import { MessageCircle, Mail, Calendar, X, HelpCircle } from "lucide-react"

export default function StickyWidget() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="absolute bottom-16 right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform origin-bottom-right transition-all animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                        <h3 className="font-semibold text-sm">Contact WebXAI</h3>
                        <p className="text-xs text-indigo-100 mt-1">We're here to help you grow.</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                        <a
                            href="https://wa.me/917093242788?text=I'm%20interested%20in%20PropertyFlow%20CRM"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            WhatsApp Us
                        </a>
                        <a
                            href="mailto:webxdev.ai@gmail.com"
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail className="w-4 h-4" />
                            </div>
                            Email Sales
                        </a>
                        <a
                            href="/landing#contact-form"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            Book Meeting
                        </a>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:scale-105 transition-all outline-none"
            >
                {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
            </button>
        </div>
    )
}
