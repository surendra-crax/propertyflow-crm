"use client"

import { useState } from "react"
import { api } from "../../lib/api"

export default function EditLeadModal({lead,onClose,onUpdated}:any){

  const [form,setForm] = useState({
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email || "",
    status: lead.status
  })

  async function updateLead(){

    await api.patch(`/leads/${lead.id}`,form)

    onUpdated()
    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-full max-w-md">

        <h2 className="text-lg font-semibold mb-4">
          Edit Lead
        </h2>

        <div className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            value={form.fullName}
            onChange={(e)=>setForm({...form,fullName:e.target.value})}
          />

          <input
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={(e)=>setForm({...form,phone:e.target.value})}
          />

          <input
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={(e)=>setForm({...form,status:e.target.value})}
          >

            <option>NEW</option>
            <option>CONTACTED</option>
            <option>FOLLOW_UP</option>
            <option>SITE_VISIT_DONE</option>
            <option>NEGOTIATION</option>
            <option>CLOSED_WON</option>
            <option>CLOSED_LOST</option>

          </select>

        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={updateLead}
            className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded flex-1"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )

}