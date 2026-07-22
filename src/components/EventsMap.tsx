'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Focus, Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

const DEFAULT_CENTER = {
  longitude: 120.9804,
  latitude: 14.5726,
  zoom: 11,
  pitch: 45
}

interface EventsMapProps {
  events: any[]
}

export default function EventsMap({ events }: EventsMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState(DEFAULT_CENTER)
  const [popupInfo, setPopupInfo] = useState<any | null>(null)

  // Map events to coordinates using strictly real data from routeMapData
  const mapData = useMemo(() => {
    return events
      .filter(event => event.routeMapData?.waypoints?.length > 0)
      .map(event => ({
        ...event,
        lng: event.routeMapData.waypoints[0].lng,
        lat: event.routeMapData.waypoints[0].lat
      }))
  }, [events])

  useEffect(() => {
    if (mapData.length > 0) {
      mapRef.current?.flyTo({
        center: [mapData[0].lng, mapData[0].lat],
        zoom: 12,
        duration: 1000
      })
    } else {
      mapRef.current?.flyTo({
        center: [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude],
        zoom: DEFAULT_CENTER.zoom,
        duration: 1000
      })
    }
  }, [mapData])

  const handleRecenter = () => {
    mapRef.current?.flyTo({
      center: [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude],
      zoom: DEFAULT_CENTER.zoom,
      pitch: DEFAULT_CENTER.pitch,
      duration: 1200,
      essential: true
    })
  }

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[var(--bg-panel)] group">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {mapData.map((event, index) => (
          <Marker
            key={event.id}
            longitude={event.lng}
            latitude={event.lat}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation()
              setPopupInfo(event)
              mapRef.current?.flyTo({
                center: [event.lng, event.lat],
                zoom: 14,
                duration: 1000
              })
            }}
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 bg-[var(--accent)]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-[0_0_15px_var(--accent)] text-[#0A0A0A] relative z-10 transition-transform hover:scale-110">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="stryder-popup z-50"
            maxWidth="300px"
          >
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl p-1 text-[var(--text-primary)]">
               <div className="h-32 relative overflow-hidden rounded-xl mb-3">
                  {popupInfo.bannerImage ? (
                     <img src={popupInfo.bannerImage} alt={popupInfo.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-gradient-to-tr from-[var(--bg-panel-raised)] to-[var(--bg-base)]" />
                  )}
               </div>
               <div className="px-3 pb-3">
                 <h4 className="font-black uppercase tracking-tight text-lg mb-1">{popupInfo.name}</h4>
                 <div className="text-[var(--text-secondary)] text-xs space-y-1 mb-4 font-bold uppercase tracking-wider">
                    <div className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" /> {format(new Date(popupInfo.date), 'MMM do')}</div>
                    <div className="flex items-center"><MapPin className="w-3 h-3 mr-1.5" /> {popupInfo.location}</div>
                 </div>
                 <Link href={`/events/${popupInfo.id}`} className="w-full py-2 bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-[10px] rounded-full flex items-center justify-center hover:bg-[var(--accent-dim)] transition-colors">
                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                 </Link>
               </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Recenter Button */}
      <button 
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-10 bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] p-3 rounded-full shadow-lg transition-all"
        title="Recenter Map"
      >
        <Focus className="w-5 h-5" />
      </button>

      {/* Custom Popup Style via Global CSS injection for Mapbox */}
      <style dangerouslySetInnerHTML={{__html: `
        .stryder-popup .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .stryder-popup .mapboxgl-popup-tip {
          border-bottom-color: var(--border-subtle) !important;
        }
      `}} />
    </div>
  )
}
