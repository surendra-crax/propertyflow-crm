"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { useRouter } from "next/navigation"

export default function FollowupAlerts(){

  const router = useRouter()

  const [today,setToday] = useState<any[]>([])
  const [overdue,setOverdue] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      try{

        const todayRes = await api.get("/leads/followups/today")
        const overdueRes = await api.get("/leads/followups/overdue")

        setToday(todayRes.data)
        setOverdue(overdueRes.data)

      }catch(err){
        console.error(err)
      }

    }

    load()

  },[])

  return(

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Today Followups */}

      <div className="bg-white border rounded-lg p-5 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Today's Follow-ups
        </h2>

        {today.length === 0 && (
          <p className="text-gray-500 text-sm">
            No follow-ups scheduled today
          </p>
        )}

        <div className="space-y-3">

          {today.map((lead)=>(
            <div
              key={lead.id}
              onClick={()=>router.push(`/leads/${lead.id}`)}
              className="border rounded p-3 cursor-pointer hover:bg-gray-50"
            >

              <p className="font-medium text-sm">
                {lead.fullName}
              </p>

              <p className="text-xs text-gray-500">
                {lead.phone}
              </p>

              <p className="text-xs text-gray-400">
                {lead.project?.name}
              </p>

            </div>
          ))}

        </div>

      </div>


      {/* Overdue */}

      <div className="bg-white border rounded-lg p-5 shadow-sm">

        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Overdue Follow-ups
        </h2>

        {overdue.length === 0 && (
          <p className="text-gray-500 text-sm">
            No overdue follow-ups
          </p>
        )}

        <div className="space-y-3">

          {overdue.map((lead)=>(
            <div
              key={lead.id}
              onClick={()=>router.push(`/leads/${lead.id}`)}
              className="border rounded p-3 cursor-pointer hover:bg-red-50"
            >

              <p className="font-medium text-sm">
                {lead.fullName}
              </p>

              <p className="text-xs text-gray-500">
                {lead.phone}
              </p>

              <p className="text-xs text-gray-400">
                {lead.project?.name}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>

  )

}