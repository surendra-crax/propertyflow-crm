"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function RevenueChart(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      try{

        const res = await api.get("/analytics/monthly-revenue")

        setData(res.data)

      }catch(err){
        console.error(err)
      }

    }

    load()

  },[])

  if(!data.length){
    return (
      <div className="p-6 text-gray-500">
        No revenue data
      </div>
    )
  }

  return(

    <div className="bg-white border rounded-lg p-4 shadow-sm">

      <h2 className="font-semibold mb-4">
        Monthly Revenue
      </h2>

      <div style={{ width:"100%", height:300 }}>

        <ResponsiveContainer>

          <BarChart data={data}>

  <XAxis dataKey="month" />

  <YAxis
    tickFormatter={(value)=>`₹${(value/100000).toFixed(0)}L`}
  />

  <Tooltip
    formatter={(value)=>`₹ ${Number(value).toLocaleString()}`}
  />

  <Bar
    dataKey="revenue"
    fill="#2563eb"
  />

</BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}