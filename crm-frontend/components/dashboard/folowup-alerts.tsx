"use client"

import { useEffect,useState } from "react"
import { api } from "../../lib/api"

export default function FollowupAlerts(){

  const [leads,setLeads] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      const res = await api.get("/analytics/today-followups")

      setLeads(res.data)

    }

    load()

  },[])

  if(leads.length === 0){

    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">
          Today's Follow Ups
        </h2>
        <p className="text-sm text-gray-500">
          No follow-ups scheduled today
        </p>
      </div>
    )

  }

  return(

    <div className="bg-white border rounded-lg p-4 shadow-sm">

      <h2 className="font-semibold mb-4">
        Today's Follow Ups
      </h2>

      <div className="space-y-3">

        {leads.map((lead)=>(

          <div
            key={lead.id}
            className="border rounded p-3 flex justify-between"
          >

            <div>

              <p className="font-medium">
                {lead.name}
              </p>

              <p className="text-sm text-gray-500">
                {lead.project}
              </p>

            </div>

            <div className="text-right text-sm">

              <p>
                {lead.agent}
              </p>

              <p className="text-red-600">
                {new Date(lead.time).toLocaleTimeString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}