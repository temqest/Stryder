'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Maximize2, Minimize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StickyMap({ events }: { events: any[] }) {
  const router = useRouter()
  const mapRef = useRef<MapRef>(null)
  const [isEnlarged, setIsEnlarged] = useState(false)

  // Find the first event with valid routeMapData waypoints to use as center, else fallback to Manila
  const initialCenter = useMemo(() => {
    for (const event of events) {
      if (event.routeMapData?.waypoints?.[0]) {
        return {
          longitude: event.routeMapData.waypoints[0].lng,
          latitude: event.routeMapData.waypoints[0].lat
        }
      }
    }
    return { longitude: 120.9842, latitude: 14.5995 }
  }, [events])

  const [viewState, setViewState] = useState({
    ...initialCenter,
    zoom: 11,
    pitch: 0
  })

  // Force map to resize when container size changes
  useEffect(() => {
    if (mapRef.current) {
      // Small timeout to allow CSS transition/render to finish
      setTimeout(() => {
        mapRef.current?.resize()
      }, 50)
    }
  }, [isEnlarged])

  const containerClasses = isEnlarged
    ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[90vw] max-w-6xl h-[85vh] rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[var(--bg-base)]"
    : "w-full h-[calc(100vh-120px)] sticky top-24 rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"

  return (
    <>
      {isEnlarged && (
        <div 
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsEnlarged(false)}
        />
      )}
      <div className={containerClasses}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          {events.map((event) => {
            // Extract actual coordinates or skip
            const firstWaypoint = event.routeMapData?.waypoints?.[0]
            if (!firstWaypoint) return null

            const lat = firstWaypoint.lat;
            const lng = firstWaypoint.lng;

            return (
              <Marker key={event.id} longitude={lng} latitude={lat} anchor="bottom">
                <div 
                  className="group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/events/${event.id}`);
                  }}
                >
                  <div className="w-8 h-8 bg-[var(--bg-panel-raised)] border-2 border-[var(--accent)] rounded-full flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors shadow-[0_0_15px_var(--accent)]">
                    <MapPin className="w-4 h-4 text-[var(--accent)] group-hover:text-[#0A0A0A] transition-colors" />
                  </div>
                </div>
              </Marker>
            )
          })}
        </Map>

        {/* Enlarge / Minimize Button */}
        <button 
          onClick={() => setIsEnlarged(!isEnlarged)}
          className="absolute top-4 right-4 z-10 bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] p-3 rounded-full shadow-lg transition-all"
          title={isEnlarged ? "Minimize Map" : "Enlarge Map"}
        >
          {isEnlarged ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>
    </>
  )
}

