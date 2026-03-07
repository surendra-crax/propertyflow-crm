"use client"

import { useState } from "react"
import { api } from "../../lib/api"

export default function CreateProjectModal({ onClose, onCreated }: any) {

  const [loading,setLoading] = useState(false)

  const [form,setForm] = useState({
    name:"",
    location:"",
    minPrice:"",
    maxPrice:"",
    totalUnits:"",
    availableUnits:"",
    status:"ONGOING"
  })

  function updateField(field:string,value:string){
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function createProject(){

    if(
      !form.name ||
      !form.location ||
      !form.minPrice ||
      !form.maxPrice ||
      !form.totalUnits ||
      !form.availableUnits
    ){
      alert("Please fill all fields")
      return
    }

    try{

      setLoading(true)

      const payload = {
        name: form.name,
        location: form.location,
        minPrice: Number(form.minPrice),
        maxPrice: Number(form.maxPrice),
        totalUnits: Number(form.totalUnits),
        availableUnits: Number(form.availableUnits),
        status: form.status
      }

      await api.post("/projects",payload)

      onCreated()
      onClose()

    }catch(err:any){

      console.error("Create project error:",err)

      if(err?.response?.data?.message){
        alert(err.response.data.message)
      }else{
        alert("Project creation failed")
      }

    }finally{
      setLoading(false)
    }

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white p-6 rounded-lg w-full max-w-lg">

        <h2 className="text-lg font-semibold mb-4">
          Create Project
        </h2>

        <div className="grid gap-3">

          <input
            placeholder="Project Name"
            className="border p-2 rounded w-full"
            value={form.name}
            onChange={(e)=>updateField("name",e.target.value)}
          />

          <input
            placeholder="Location"
            className="border p-2 rounded w-full"
            value={form.location}
            onChange={(e)=>updateField("location",e.target.value)}
          />

          <input
            type="number"
            placeholder="Minimum Price"
            className="border p-2 rounded w-full"
            value={form.minPrice}
            onChange={(e)=>updateField("minPrice",e.target.value)}
          />

          <input
            type="number"
            placeholder="Maximum Price"
            className="border p-2 rounded w-full"
            value={form.maxPrice}
            onChange={(e)=>updateField("maxPrice",e.target.value)}
          />

          <input
            type="number"
            placeholder="Total Units"
            className="border p-2 rounded w-full"
            value={form.totalUnits}
            onChange={(e)=>updateField("totalUnits",e.target.value)}
          />

          <input
            type="number"
            placeholder="Available Units"
            className="border p-2 rounded w-full"
            value={form.availableUnits}
            onChange={(e)=>updateField("availableUnits",e.target.value)}
          />

        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">

          <button
            onClick={createProject}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            {loading ? "Creating..." : "Create"}
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