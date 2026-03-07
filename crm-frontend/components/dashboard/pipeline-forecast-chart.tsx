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

export default function PipelineForecastChart(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    async function load(){

      const res = await api.get("/analytics/pipeline-forecast")

      setData(res.data)

    }

    load()

  },[])

  return(

    <div className="bg-white border rounded-lg p-4 shadow-sm">

      <h2 className="font-semibold mb-4">
        Pipeline Revenue Forecast
      </h2>

      <div style={{width:"100%",height:300}}>

        <ResponsiveContainer>

          <BarChart data={data}>

            <XAxis dataKey="stage" />

            <YAxis
              tickFormatter={(v)=>`₹${(v/100000).toFixed(0)}L`}
            />

            <Tooltip
              formatter={(v)=>`₹ ${Number(v).toLocaleString()}`}
            />

            <Bar
              dataKey="value"
              fill="#16a34a"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}