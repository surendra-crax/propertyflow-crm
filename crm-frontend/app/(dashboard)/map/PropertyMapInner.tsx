"use client"

import { useEffect, useState, useRef } from "react"
import { api } from "@/lib/api"
import { Map as MapIcon, Navigation2, Layers, Filter, ExternalLink, Building2, Users, Handshake } from "lucide-react"
import Link from "next/link"

// Leaflet CSS must be imported here since this is a client-only component
import "leaflet/dist/leaflet.css"

/* ── Geocode approximate coordinates for Indian cities ── */
const CITY_COORDS: Record<string, [number, number]> = {
  mumbai:     [19.0760, 72.8777],
  pune:       [18.5204, 73.8567],
  bangalore:  [12.9716, 77.5946],
  bengaluru:  [12.9716, 77.5946],
  delhi:      [28.7041, 77.1025],
  hyderabad:  [17.3850, 78.4867],
  chennai:    [13.0827, 80.2707],
  kolkata:    [22.5726, 88.3639],
  ahmedabad:  [23.0225, 72.5714],
  surat:      [21.1702, 72.8311],
  jaipur:     [26.9124, 75.7873],
  lucknow:    [26.8467, 80.9462],
  gurgaon:    [28.4595, 77.0266],
  noida:      [28.5355, 77.3910],
  thane:      [19.2183, 72.9781],
  navi:       [19.0330, 73.0297],
}

function guessCoords(location: string): [number, number] {
  const low = location.toLowerCase()
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (low.includes(city)) return coords
  }
  // Default: India center
  const offset: [number, number] = [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8]
  return [20.5937 + offset[0], 78.9629 + offset[1]]
}

interface Project {
  id: string
  name: string
  location: string
  status: string
  totalUnits: number
  availableUnits: number
  minPrice: number
  maxPrice: number
}

interface SiteVisit {
  id: string
  visitDate: string
  status: string
  lead?: { fullName: string; phone: string }
}

export default function PropertyMapInner() {
  const mapRef     = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const [projects, setProjects]       = useState<Project[]>([])
  const [siteVisits, setSiteVisits]   = useState<SiteVisit[]>([])
  const [mapType, setMapType]         = useState<"projects" | "visits">("projects")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [userLocation, setUserLocation] = useState<[number,number] | null>(null)

  useEffect(() => {
    api.get("/projects").then(r => setProjects(r.data?.data || r.data || [])).catch(() => {})
    api.get("/site-visits").then(r => setSiteVisits(r.data?.data || r.data || [])).catch(() => {})
  }, [])

  /* ── GPS: get user's current location ── */
  function locateMe() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
      setUserLocation(coords)
      if (leafletRef.current) {
        leafletRef.current.setView(coords, 14)
        const L = (window as any).L
        if (L) {
          L.circle(coords, { radius: 100, color: "#3b82f6", fillOpacity: 0.15 })
           .addTo(leafletRef.current)
        }
      }
    })
  }

  /* ── Initialize Leaflet ── */
  useEffect(() => {
    if (typeof window === "undefined") return
    if (leafletRef.current) return

    import("leaflet").then(L => {
      (window as any).L = L.default || L

      const map = L.default.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
      })

      // OpenStreetMap tiles — free, no API key needed
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© <a href='https://openstreetmap.org'>OpenStreetMap</a>",
        maxZoom: 19,
      }).addTo(map)

      leafletRef.current = map

      // Plot projects
      projects.forEach(p => {
        const coords = guessCoords(p.location)
        const statusColors: Record<string, string> = {
          ONGOING:   "#3b82f6",
          PRELAUNCH: "#f59e0b",
          COMPLETED: "#10b981",
        }
        const color = statusColors[p.status] || "#6b7280"

        const icon = L.default.divIcon({
          className: "",
          html: `
            <div style="
              background:${color};
              color:white;
              padding:6px 10px;
              border-radius:8px;
              font-size:11px;
              font-weight:700;
              white-space:nowrap;
              box-shadow:0 4px 12px ${color}50;
              border:2px solid white;
              cursor:pointer;
            ">
              🏢 ${p.name}
              <div style="font-size:9px;font-weight:500;opacity:0.85;margin-top:1px">${p.availableUnits}/${p.totalUnits} available</div>
            </div>
          `,
          iconAnchor: [50, 30],
        })

        L.default.marker(coords, { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:200px;font-family:system-ui;padding:4px">
              <p style="font-weight:700;font-size:14px;margin-bottom:6px">${p.name}</p>
              <p style="font-size:12px;color:#6b7280;margin-bottom:8px">📍 ${p.location}</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px">
                <div><span style="color:#9ca3af">Status</span><br><strong>${p.status}</strong></div>
                <div><span style="color:#9ca3af">Units</span><br><strong>${p.availableUnits}/${p.totalUnits}</strong></div>
                <div><span style="color:#9ca3af">Min Price</span><br><strong>₹${(p.minPrice/100000).toFixed(0)}L</strong></div>
                <div><span style="color:#9ca3af">Max Price</span><br><strong>₹${(p.maxPrice/100000).toFixed(0)}L</strong></div>
              </div>
            </div>
          `, { maxWidth: 260 })
      })

      // If we have visits, plot them too
      siteVisits.forEach(v => {
        // Site visits don't have coordinates in current schema, so we skip
      })
    })
  }, [projects])

  const statusColors = {
    ONGOING:   "bg-blue-500/10 text-blue-600 border-blue-200",
    PRELAUNCH: "bg-amber-500/10 text-amber-600 border-amber-200",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  }

  return (
    <div className="space-y-4 pb-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Property Map</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">NEW</span>
          </div>
          <p className="text-sm text-muted-foreground">Geospatial view of all projects and site visits</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={locateMe}
            className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-3 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-all"
          >
            <Navigation2 className="w-4 h-4" /> My Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: 600 }}>
        {/* Sidebar */}
        <div className="enterprise-card p-4 space-y-3 overflow-y-auto max-h-[600px]">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects ({projects.length})</h3>

          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects found.</p>
          )}

          {projects.map(p => {
            const occupancy = p.totalUnits > 0 ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProject(selectedProject?.id === p.id ? null : p)
                  if (leafletRef.current) {
                    const coords = guessCoords(p.location)
                    leafletRef.current.setView(coords, 13)
                  }
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedProject?.id === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-foreground leading-tight">{p.name}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                    statusColors[p.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">📍 {p.location}</p>

                {/* Occupancy bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Occupancy</span>
                    <span className="font-medium">{occupancy}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${occupancy}%`,
                        backgroundColor: occupancy > 80 ? "#ef4444" : occupancy > 60 ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-center bg-muted/50 rounded p-1.5">
                    <p className="text-xs font-bold text-foreground tabular-nums">{p.availableUnits}</p>
                    <p className="text-[9px] text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center bg-muted/50 rounded p-1.5">
                    <p className="text-xs font-bold text-foreground tabular-nums">
                      ₹{(p.minPrice / 100000).toFixed(0)}L+
                    </p>
                    <p className="text-[9px] text-muted-foreground">Starting</p>
                  </div>
                </div>

                <Link
                  href={`/projects/${p.id}/units`}
                  onClick={e => e.stopPropagation()}
                  className="mt-2 flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View Units <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </button>
            )
          })}
        </div>

        {/* Map */}
        <div className="enterprise-card overflow-hidden lg:col-span-3" style={{ minHeight: 560 }}>
          <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", minHeight: 560, borderRadius: "inherit" }}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Projects",   value: projects.length,                                       icon: Building2 },
          { label: "Total Units",      value: projects.reduce((a, p) => a + p.totalUnits, 0),         icon: Layers    },
          { label: "Available Units",  value: projects.reduce((a, p) => a + p.availableUnits, 0),    icon: Users     },
          { label: "Site Visits",      value: siteVisits.length,                                     icon: Navigation2 },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="enterprise-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
