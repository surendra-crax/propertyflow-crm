"use client"

import { useState } from "react"
import { api } from "../../lib/api"

export default function ScheduleVisitModal({lead,agents,onClose,onCreated}:any){

  const [agentId,setAgentId] = useState("")
  const [visitDate,setVisitDate] = useState("")
  const [notes,setNotes] = useState("")

  async function handleSubmit(e:any){

    e.preventDefault()

    await api.post("/site-visits",{
      leadId: lead.id,
      agentId,
      visitDate,
      status:"SCHEDULED",
      notes
    })

    onCreated()
    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-lg w-full max-w-md p-6">

        <h2 className="text-lg font-semibold mb-4">
          Schedule Site Visit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>

            <label className="text-sm">Lead</label>

            <p className="font-medium">
              {lead.fullName}
            </p>

          </div>

          <div>

            <label className="text-sm">
              Assign Agent
            </label>

            <select
              required
              value={agentId}
              onChange={(e)=>setAgentId(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >

              <option value="">Select Agent</option>

              {agents.map((a:any)=>(
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="text-sm">
              Visit Date
            </label>

            <input
              type="datetime-local"
              required
              value={visitDate}
              onChange={(e)=>setVisitDate(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />

          </div>

          <div>

            <label className="text-sm">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e)=>setNotes(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />

          </div>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Schedule
            </button>

          </div>

        </form>

      </div>

    </div>

  )

}