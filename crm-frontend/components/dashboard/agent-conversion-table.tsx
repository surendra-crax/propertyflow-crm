"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

export default function AgentConversionTable(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      const res = await api.get("/analytics/agent-conversion")

      setData(res.data)

    }

    load()

  },[])

  return(

    <div className="bg-white border rounded-lg p-4 shadow-sm">

      <h2 className="font-semibold mb-4">
        Agent Conversion Performance
      </h2>

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b">

            <th className="text-left py-2">Agent</th>
            <th>Leads</th>
            <th>Deals</th>
            <th>Revenue</th>
            <th>Conversion</th>

          </tr>

        </thead>

        <tbody>

          {data.map((agent,index)=>(

            <tr key={index} className="border-b">

              <td className="py-2">{agent.agent}</td>

              <td className="text-center">
                {agent.leads}
              </td>

              <td className="text-center">
                {agent.deals}
              </td>

              <td className="text-center text-green-600">
                ₹ {agent.revenue.toLocaleString()}
              </td>

              <td className="text-center font-semibold">
                {agent.conversionRate}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}