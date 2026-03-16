"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { api } from "../../lib/api";

export default function DemoLoginPage() {
    const router = useRouter();

    // Auto-fill logic when user clicks the credentials
    const [loadingRole, setLoadingRole] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent, role: string) => {
        e.preventDefault();
        setLoadingRole(role);
        
        let email = 'admin@propertyflow.com';
        let password = 'password123';

        if (role === 'manager') email = 'priya@propertyflow.com';
        if (role === 'agent') email = 'amit@propertyflow.com';
        if (role === 'broker') email = 'sunil@brokers.com';

        try {
            const res = await api.post("/auth/login", { email, password });
            
            const token = res.data.access_token;
            const user = res.data.user;

            localStorage.clear();
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.id);
            localStorage.setItem("role", user.role);
            
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            alert('Demo login failed. Please ensure the backend server is running and seeded.');
            setLoadingRole(null);
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
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore PropertyFlow with different access levels.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Admin Demo Card */}
                        <button
                            disabled={!!loadingRole}
                            onClick={(e) => handleLogin(e, 'admin')}
                            className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                                loadingRole === 'admin' 
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                        >
                            <div className="flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md">Full Control</span>
                                <h3 className="font-bold text-slate-800 dark:text-white text-base mt-1">System Admin</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage projects, agents, and view all company reports.</p>
                            </div>
                            {loadingRole === 'admin' ? (
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>

                        {/* Manager Demo Card */}
                        <button
                            disabled={!!loadingRole}
                            onClick={(e) => handleLogin(e, 'manager')}
                            className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                                loadingRole === 'manager' 
                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/40' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                        >
                            <div className="flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-md">Management</span>
                                <h3 className="font-bold text-slate-800 dark:text-white text-base mt-1">Sales Manager</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track team pipeline, performance analytics, and deals.</p>
                            </div>
                            {loadingRole === 'manager' ? (
                                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>

                        {/* Agent Demo Card */}
                        <button
                            disabled={!!loadingRole}
                            onClick={(e) => handleLogin(e, 'agent')}
                            className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                                loadingRole === 'agent' 
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/40' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                        >
                            <div className="flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">Sales Agent</span>
                                <h3 className="font-bold text-slate-800 dark:text-white text-base mt-1">Property Advisor</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage daily leads, site visits, and follow-ups.</p>
                            </div>
                            {loadingRole === 'agent' ? (
                                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>

                        {/* Broker Demo Card */}
                        <button
                            disabled={!!loadingRole}
                            onClick={(e) => handleLogin(e, 'broker')}
                            className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                                loadingRole === 'broker' 
                                ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/40' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-amber-500 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                        >
                            <div className="flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">Partner Access</span>
                                <h3 className="font-bold text-slate-800 dark:text-white text-base mt-1">External Broker</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submit leads and track your project-wide commissions.</p>
                            </div>
                            {loadingRole === 'broker' ? (
                                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>
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
