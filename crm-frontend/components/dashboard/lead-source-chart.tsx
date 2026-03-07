"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function LeadSourceChart() {

  const [data, setData] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      try {

        const res = await api.get("/analytics/lead-sources")

        const formatted = res.data.map((item: any) => ({
          name: item.source,
          value: item.count
        }))

        setData(formatted)

      } catch (err) {
        console.error(err)
      }

    }

    load()

  }, [])

  if (!data.length) {
    return (
      <div className="p-6 text-gray-500">
        No lead source data
      </div>
    )
  }

  return (

    <div className="bg-white border rounded-lg p-4 shadow-sm">

      <h2 className="font-semibold mb-4">
        Lead Sources
      </h2>

      <div style={{ width: "100%", height: 300 }}>

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `${value} leads`} />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}