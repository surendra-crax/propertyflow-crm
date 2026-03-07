"use client"

import { useState } from "react"
import { api } from "../../lib/api"

export default function AddActivityModal({leadId,onClose,onCreated}:any){

  const [form,setForm] = useState({
    type:"",
    description:""
  })

  async function createActivity(){

    const userId = localStorage.getItem("userId")

    await api.post("/activities",{
      leadId,
      userId,
      type:form.type,
      description:form.description
    })

    onCreated()
    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white p-6 rounded-lg w-full max-w-md">

        <h2 className="text-lg font-semibold mb-4">
          Add Activity
        </h2>

        <div className="grid gap-3">

          <input
            placeholder="Type (Call / Note / Meeting)"
            className="border p-2 rounded"
            onChange={(e)=>setForm({...form,type:e.target.value})}
          />

          <textarea
            placeholder="Description"
            className="border p-2 rounded"
            onChange={(e)=>setForm({...form,description:e.target.value})}
          />

        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={createActivity}
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