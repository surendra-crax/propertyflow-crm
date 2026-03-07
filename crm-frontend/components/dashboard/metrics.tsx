"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

export default function Metrics() {

  const [stats,setStats] = useState<any>(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function loadMetrics(){

      try{

        const res = await api.get("/analytics/dashboard")

        setStats(res.data)

      }catch(err){

        console.error(err)

      }finally{

        setLoading(false)

      }

    }

    loadMetrics()

  },[])

  if(loading){
    return <div className="p-6">Loading metrics...</div>
  }

  if(!stats){
    return <div className="p-6">No analytics data</div>
  }

  return(

    <div
      className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      "
    >

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-500">Total Leads</p>
        <p className="text-2xl font-semibold mt-2">
          {stats.totalLeads}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-500">Deals Closed</p>
        <p className="text-2xl font-semibold mt-2">
          {stats.totalDeals}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-500">Revenue</p>
        <p className="text-2xl font-semibold mt-2 text-green-600">
          ₹ {stats.revenue.toLocaleString()}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-500">Conversion Rate</p>
        <p className="text-2xl font-semibold mt-2">
          {stats.conversionRate}%
        </p>
      </div>

    </div>

  )

}