'use client'

import { useState } from 'react'
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Flag, Focus } from 'lucide-react'

// Dummy GeoJSON route for Manila (Roxas Boulevard loop)
const routeGeoJSON: any = {
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

const INITIAL_VIEW_STATE = {
  longitude: 120.9804,
  latitude: 14.5726,
  zoom: 13,
  pitch: 45
}

import { useRef } from 'react'

export default function EventRouteMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const mapRef = useRef<MapRef>(null)

  const handleRecenter = () => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      duration: 1200,
      essential: true
    })
  }

  const handleFlyTo = (longitude: number, latitude: number, zoom: number = 13.5) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      duration: 1200,
      essential: true
    })
  }

  return (
    <div className="space-y-8">
      <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
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
      </div>
    </div>
  )
}
