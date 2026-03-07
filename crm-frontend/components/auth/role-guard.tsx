"use client"

import { useEffect, useState } from "react"

export default function RoleGuard({allowed,children}:any){

  const [role,setRole] = useState("")

  useEffect(()=>{
    const r = localStorage.getItem("role") || ""
    setRole(r)
  },[])

  if(!allowed.includes(role)){
    return (
      <div className="p-6 text-red-500">
        Access denied
      </div>
    )
  }

  return children
}