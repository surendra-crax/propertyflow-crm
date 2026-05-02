"use client"

import dynamic from "next/dynamic"

// Leaflet must be dynamically imported (no SSR) — it requires window
const PropertyMapInner = dynamic(() => import("./PropertyMapInner"), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center h-[600px]">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  </div>
) })

export default function MapPage() {
  return <PropertyMapInner />
}
