"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

export default function ConvertDealModal({lead,onClose,onCreated}:any){

  const [saleValue,setSaleValue] = useState("")
  const [brokerId,setBrokerId] = useState("")
  const [brokers,setBrokers] = useState<any[]>([])

  async function loadBrokers(){

    const res = await api.get("/brokers")

    setBrokers(res.data)

  }

  useEffect(()=>{
    loadBrokers()
  },[])

  async function createDeal(){

    await api.post("/deals",{
      leadId: lead.id,
      projectId: lead.projectId,
      saleValue: Number(saleValue),
      brokerId
    })

    onCreated()
    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-lg p-6 w-full max-w-md">

        <h2 className="text-lg font-semibold mb-4">
          Convert Lead to Deal
        </h2>

        <div className="space-y-4">

          <div>

            <label className="text-sm">
              Client
            </label>

            <p className="font-medium">
              {lead.fullName}
            </p>

          </div>

          <div>

            <label className="text-sm">
              Sale Value
            </label>

            <input
              type="number"
              value={saleValue}
              onChange={(e)=>setSaleValue(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />

          </div>

          <div>

            <label className="text-sm">
              Broker
            </label>

            <select
              value={brokerId}
              onChange={(e)=>setBrokerId(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >

              <option value="">No Broker</option>

              {brokers.map((b:any)=>(
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}

            </select>

          </div>

        </div>

        <div className="flex gap-2 mt-6">

          <button
            onClick={createDeal}
            className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            Convert
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