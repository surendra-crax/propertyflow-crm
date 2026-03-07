"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

export default function AgentLeaderboard(){

  const [agents,setAgents] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function load(){

      try{

        const res = await api.get("/analytics/agent-performance")

        setAgents(res.data)

      }catch(err){
        console.error(err)
      }

      setLoading(false)

    }

    load()

  },[])

  if(loading){
    return <div className="p-6">Loading agent performance...</div>
  }

  return(

    <div className="bg-white border rounded-lg p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-4">
        Agent Performance
      </h2>

      {agents.length === 0 && (
        <p className="text-gray-500 text-sm">
          No performance data
        </p>
      )}

      <div className="space-y-3">

        {agents.map((agent,index)=>(
          
          <div
            key={agent.id}
            className="flex items-center justify-between border p-3 rounded"
          >

            <div>

              <p className="font-medium">
                {index + 1}. {agent.name}
              </p>

              <p className="text-xs text-gray-500">
                {agent.email}
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm">
                Deals: {agent.deals}
              </p>

              <p className="text-sm text-green-600">
                ₹ {agent.revenue?.toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}