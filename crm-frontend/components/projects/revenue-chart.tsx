"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function formatCurrency(value:number){
  return "₹ " + value.toLocaleString()
}

export default function RevenueChart({data}:any){

  return(

    <div className="bg-white border rounded-lg p-4">

      <h2 className="font-semibold mb-4">
        Revenue by Project
      </h2>

      <div className="h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <XAxis dataKey="name" />

            <YAxis
              tickFormatter={(value)=>`₹${(value/100000).toFixed(1)}L`}
            />

            <Tooltip
              formatter={(value)=>formatCurrency(Number(value))}
            />

            <Bar
              dataKey="revenue"
              fill="#2563eb"
              radius={[6,6,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}