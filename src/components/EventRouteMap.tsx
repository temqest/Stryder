'use client'

import { useState, useMemo, useRef } from 'react'
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Flag, Focus } from 'lucide-react'

// Dummy GeoJSON route for Manila (Roxas Boulevard loop)
const dummyRouteGeoJSON: any = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [120.9754, 14.5826], // Quirino Grandstand
      [120.9774, 14.5776],
      [120.9804, 14.5726],
      [120.9834, 14.5676],
      [120.9864, 14.5626], // CCP Complex
      [120.9834, 14.5676],
      [120.9804, 14.5726],
      [120.9774, 14.5776],
      [120.9754, 14.5826],
    ]
  }
}

const DUMMY_INITIAL_VIEW_STATE = {
  longitude: 120.9804,
  latitude: 14.5726,
  zoom: 13,
  pitch: 45
}

interface Waypoint {
  id?: number
  lng: number
  lat: number
  label?: string
}

export default function EventRouteMap({ waypoints }: { waypoints?: Waypoint[] }) {
  const hasCustomRoute = waypoints && waypoints.length > 0
  
  const initialViewState = useMemo(() => {
    if (hasCustomRoute) {
      return {
        longitude: waypoints[0].lng,
        latitude: waypoints[0].lat,
        zoom: 13.5,
        pitch: 45
      }
    }
    return DUMMY_INITIAL_VIEW_STATE
  }, [waypoints, hasCustomRoute])

  const routeGeoJSON = useMemo(() => {
    if (hasCustomRoute && waypoints.length > 1) {
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: waypoints.map(w => [w.lng, w.lat])
        }
      }
    }
    return dummyRouteGeoJSON
  }, [waypoints, hasCustomRoute])

  const [viewState, setViewState] = useState(initialViewState)
  const mapRef = useRef<MapRef>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const handleRecenter = () => {
    mapRef.current?.flyTo({
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      pitch: initialViewState.pitch,
      duration: 1200,
      essential: true
    })
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleFlyTo = (longitude: number, latitude: number, zoom: number = 14) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom,
      pitch: initialViewState.pitch,
      duration: 1200,
      essential: true
    })
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const displayWaypoints = useMemo(() => {
    if (!hasCustomRoute) return []
    if (waypoints.length <= 5) return waypoints
    
    const len = waypoints.length
    return [
      waypoints[0],
      waypoints[Math.floor(len * 0.25)],
      waypoints[Math.floor(len * 0.5)],
      waypoints[Math.floor(len * 0.75)],
      waypoints[len - 1]
    ]
  }, [waypoints, hasCustomRoute])

  const renderWaypoints = () => {
    if (hasCustomRoute) {
      return displayWaypoints.map((wp, index) => (
        <Marker key={index} longitude={wp.lng} latitude={wp.lat} anchor="bottom">
          {index === 0 || index === displayWaypoints.length - 1 ? (
             <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-[0_0_15px_var(--accent)] text-[#0A0A0A]">
               <Flag className="w-4 h-4" />
             </div>
          ) : (
            <div className="w-6 h-6 bg-[var(--bg-panel-raised)] border-2 border-[var(--text-secondary)] rounded-full flex items-center justify-center">
              <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
            </div>
          )}
        </Marker>
      ))
    }
    
    // Dummy markers
    return (
      <>
        {/* Start Line Marker */}
        <Marker longitude={120.9754} latitude={14.5826} anchor="bottom">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-[0_0_15px_var(--accent)] text-[#0A0A0A]">
            <Flag className="w-4 h-4" />
          </div>
        </Marker>
        {/* Turnaround / Checkpoint */}
        <Marker longitude={120.9864} latitude={14.5626} anchor="bottom">
          <div className="w-6 h-6 bg-[var(--bg-panel-raised)] border-2 border-[var(--text-secondary)] rounded-full flex items-center justify-center">
            <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
          </div>
        </Marker>
      </>
    )
  }

  const renderWaypointList = () => {
    if (hasCustomRoute) {
      return displayWaypoints.map((wp, index) => {
        const isStart = index === 0;
        const isFinish = index === displayWaypoints.length - 1;
        const label = isStart ? 'Start Line' : isFinish ? 'Finish Line' : wp.label || `Checkpoint ${index}`;
        
        return (
          <div 
            key={index}
            className="relative pl-8 cursor-pointer group"
            onClick={() => handleFlyTo(wp.lng, wp.lat)}
          >
            <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 group-hover:scale-125 transition-transform ${isStart || isFinish ? 'bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]' : 'bg-[var(--bg-panel-raised)] border-2 border-[var(--text-secondary)] group-hover:border-[var(--accent)] transition-colors'}`} />
            <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">{label}</h4>
            <p className="text-[var(--text-secondary)] text-sm">{wp.lng.toFixed(4)}, {wp.lat.toFixed(4)}</p>
          </div>
        )
      })
    }

    // Dummy list
    return (
      <>
        <div 
          className="relative pl-8 cursor-pointer group"
          onClick={() => handleFlyTo(120.9754, 14.5826)}
        >
          <div className="absolute w-4 h-4 rounded-full bg-[var(--accent)] -left-[9px] top-1 shadow-[0_0_10px_var(--accent)] group-hover:scale-125 transition-transform" />
          <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">Start Line</h4>
          <p className="text-[var(--text-secondary)] text-sm">Quirino Grandstand, Rizal Park</p>
        </div>
        <div 
          className="relative pl-8 cursor-pointer group"
          onClick={() => handleFlyTo(120.9864, 14.5626, 14.5)}
        >
          <div className="absolute w-4 h-4 rounded-full bg-[var(--bg-panel-raised)] border-2 border-[var(--text-secondary)] -left-[9px] top-1 group-hover:border-[var(--accent)] transition-colors" />
          <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">Checkpoint Alpha</h4>
          <p className="text-[var(--text-secondary)] text-sm">Roxas Boulevard (5km mark)</p>
        </div>
        <div 
          className="relative pl-8 cursor-pointer group"
          onClick={() => handleFlyTo(120.9754, 14.5826)}
        >
          <div className="absolute w-4 h-4 rounded-full bg-[var(--bg-panel-raised)] border-2 border-[var(--text-secondary)] -left-[9px] top-1 group-hover:border-[var(--accent)] transition-colors" />
          <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">Finish Line</h4>
          <p className="text-[var(--text-secondary)] text-sm">Quirino Grandstand, Rizal Park</p>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-8">
      <div 
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-layer"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#E5FF00', // STRYDER accent color
                'line-width': 4,
                'line-opacity': 0.8
              }}
            />
          </Source>

          {renderWaypoints()}
        </Map>

        {/* Recenter Button */}
        <button 
          onClick={handleRecenter}
          className="absolute top-4 right-4 z-10 bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] p-3 rounded-full shadow-lg transition-all"
          title="Recenter Map"
        >
          <Focus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative border-l-2 border-dashed border-[var(--border-subtle)] ml-4 space-y-8 pb-4">
        {renderWaypointList()}
      </div>
    </div>
  )
}
