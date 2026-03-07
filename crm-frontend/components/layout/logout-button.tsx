"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton(){

  const router = useRouter()

  function logout(){

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    router.push("/login")

  }

  return(

    <button
      onClick={logout}
      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
      Logout
    </button>

  )

}