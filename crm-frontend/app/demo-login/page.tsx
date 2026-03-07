"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { api } from "../../lib/api";

export default function DemoLoginPage() {
    const router = useRouter();

    // Auto-fill logic when user clicks the credentials
    const handleLogin = async (e: React.FormEvent, role: 'admin' | 'agent') => {
        e.preventDefault();
        const email = role === 'admin' ? 'demo@crm.com' : 'agent@crm.com';
        const password = 'demo123';

        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("userId", res.data.user.id);
            localStorage.setItem("role", res.data.user.role);
            router.push("/dashboard");
        } catch {
            alert('Demo login failed. Make sure the backend is seeded and running.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden transition-colors">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
                {/* Left side info */}
                <div className="flex flex-col justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                        PropertyFlow CRM <br /> Live Demo Environment
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                        Explore the platform exactly as your sales team would. We've pre-loaded dummy data including leads, projects, and deals so you can see it in action.
                    </p>
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl">
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Important Notice</h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                            This is a public demo sandbox. Any data you enter or modify may be visible to others and is reset periodically. Do not enter real prospect information.
                        </p>
                    </div>
                </div>

                {/* Right side form cards */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col gap-6">
                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Choose your role</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select a role to see different permission levels.</p>
                    </div>

                    {/* Admin Demo Card */}
                    <div
                        onClick={(e) => handleLogin(e, 'admin')}
                        className="group flex flex-col p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md bg-slate-50 dark:bg-slate-900/50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 rounded-md">Management View</span>
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg">Admin / Manager</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full access to pipeline, analytics, agents, and CSV exports.</p>
                    </div>

                    {/* Agent Demo Card */}
                    <div
                        onClick={(e) => handleLogin(e, 'agent')}
                        className="group flex flex-col p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-all hover:shadow-md bg-slate-50 dark:bg-slate-900/50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-1 rounded-md">Sales View</span>
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg">Sales Agent</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Focused view for daily tasks, assigned leads, and personal pipeline.</p>
                    </div>

                    <button
                        onClick={() => router.push('/landing')}
                        className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mt-2"
                    >
                        Return to Website
                    </button>
                </div>
            </div>
        </div>
    );
}
