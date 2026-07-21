'use client'

import { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StickyMap({ events }: { events: any[] }) {
  const router = useRouter()
  const [viewState, setViewState] = useState({
    longitude: 120.9842,
    latitude: 14.5995,
    zoom: 11,
    pitch: 0
  })

  return (
    <div className="w-full h-[calc(100vh-120px)] sticky top-24 rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {events.map((event, i) => {
          // Dummy coordinates around Manila for visual spread
          const lat = 14.5995 + (i * 0.02) - 0.04;
          const lng = 120.9842 + (i * 0.015) - 0.02;
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
    </div>
  )
}
