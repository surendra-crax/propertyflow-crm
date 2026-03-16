"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { UserPlus, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"

export function UsersTab() {
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
        ADMIN: "bg-red-50 text-red-700 hover:bg-red-50",
        MANAGER: "bg-blue-50 text-blue-700 hover:bg-blue-50",
        AGENT: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
        BROKER: "bg-purple-50 text-purple-700 hover:bg-purple-50",
    }

    if (loading) return <div>Loading users...</div>

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setShowCreate(true)} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add User
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-5">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="px-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${roleColors[user.role]}`}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? "default" : "secondary"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {showCreate && (
                <Dialog open={showCreate} onOpenChange={setShowCreate}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
                                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                                <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
                                <Input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Role</label>
                                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="AGENT">Agent</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="BROKER">Broker</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                                <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create User"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
