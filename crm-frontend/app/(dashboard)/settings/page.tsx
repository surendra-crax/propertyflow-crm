"use client"

import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { Settings as SettingsIcon, UserPlus, X } from "lucide-react"

export default function SettingsPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "AGENT" })

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const res = await api.get("/users")
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    async function handleCreate(e: any) {
        e.preventDefault()
        setCreating(true)
        try {
            await api.post("/users", form)
            setShowCreate(false)
            setForm({ name: "", email: "", password: "", phone: "", role: "AGENT" })
            loadUsers()
        } catch (err) {
            console.error(err)
        }
        setCreating(false)
    }

    const roleColors: Record<string, string> = {
        ADMIN: "bg-red-50 text-red-700",
        MANAGER: "bg-blue-50 text-blue-700",
        AGENT: "bg-emerald-50 text-emerald-700",
        BROKER: "bg-purple-50 text-purple-700",
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Settings</h1>
                    <p className="text-sm text-slate-400">Manage users, agents, and brokers</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-5 py-3">Name</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-5 py-3">Email</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-5 py-3">Role</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-sm text-slate-500">{user.email}</td>
                                <td className="px-5 py-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                        }`}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleCreate} className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">Add New User</h2>
                            <button type="button" onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
                                <input required className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                                <input required type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
                                <input required type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
                                <input className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Role</label>
                                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="AGENT">Agent</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="BROKER">Broker</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" disabled={creating} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                                {creating ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
