'use client'

import { useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { MapPin, Calendar, AlignLeft, Check, Edit2, Loader2, Save, X, Navigation, Maximize2, Minimize2, Search, Plus, Trash2 } from 'lucide-react'
import { updateEventDetails } from '@/app/dashboard/actions'
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

type Category = {
  id: string
  distance: string
  price: number
  capacity: number
}

type EventData = {
  id: string
  name: string
  date: Date
  location: string | null
  description: string | null
  categories: Category[]
  routeMapData: any
}

export function EventDetailsForm({ event }: { event: EventData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showWaypoints, setShowWaypoints] = useState(false)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  
  const [editableWaypoints, setEditableWaypoints] = useState<{id: number, label: string, lng: number, lat: number}[]>(
    event.routeMapData?.waypoints?.map((wp: any, index: number) => ({
      id: index + 1,
      label: wp.label || `Waypoint ${index + 1}`,
      lng: Number(wp.lng),
      lat: Number(wp.lat)
    })) || []
  )
  const [nextWpId, setNextWpId] = useState(editableWaypoints.length + 1)
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = useRef<MapRef>(null)
  
  const mapBounds = useMemo(() => {
    if (!event.routeMapData?.waypoints || event.routeMapData.waypoints.length <= 1) return undefined
    const lngs = event.routeMapData.waypoints.map((w: any) => Number(w.lng))
    const lats = event.routeMapData.waypoints.map((w: any) => Number(w.lat))
    return [
      Math.min(...lngs),
      Math.min(...lats),
      Math.max(...lngs),
      Math.max(...lats)
    ] as [number, number, number, number]
  }, [event.routeMapData])
  
  const [formData, setFormData] = useState({
    name: event.name,
    date: new Date(event.date).toISOString().slice(0, 16), // datetime-local format
    location: event.location || '',
    description: event.description || '',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('date', formData.date)
      data.append('location', formData.location)
      data.append('description', formData.description)
      data.append('routeMapData', JSON.stringify({ waypoints: editableWaypoints }))

      await updateEventDetails(event.id, data)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update event details', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: event.name,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || '',
      description: event.description || '',
    })
    setEditableWaypoints(
      event.routeMapData?.waypoints?.map((wp: any, index: number) => ({
        id: index + 1,
        label: wp.label || `Waypoint ${index + 1}`,
        lng: Number(wp.lng),
        lat: Number(wp.lat)
      })) || []
    )
    setIsEditing(false)
  }

  const handleMapClick = (evt: any) => {
    if (!isEditing) return
    const { lng, lat } = evt.lngLat
    setEditableWaypoints([...editableWaypoints, { id: nextWpId, label: `Waypoint ${editableWaypoints.length + 1}`, lng, lat }])
    setNextWpId(nextWpId + 1)
  }

  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?country=ph&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
      const data = await res.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 12 })
      }
    } catch (err) {
      console.error('Error fetching location:', err)
    }
  }

  const handleUndo = () => {
    if (editableWaypoints.length > 0) {
      setEditableWaypoints(editableWaypoints.slice(0, -1))
    }
  }

  const handleAddWaypoint = () => {
    const center = mapRef.current?.getCenter()
    const lng = center?.lng || 120.9804
    const lat = center?.lat || 14.5726
    setEditableWaypoints([...editableWaypoints, { id: nextWpId, label: `Waypoint ${editableWaypoints.length + 1}`, lng, lat }])
    setNextWpId(nextWpId + 1)
  }

  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden relative">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-panel-raised)] flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            Event Information
          </h2>
          <p className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider mt-1">
            Core Details & Setup
          </p>
        </div>
        
        <div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center px-6 py-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Details
            </button>
          ) : (
            <div className="flex space-x-3">
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center px-4 py-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-6 py-2.5 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50 shadow-[0_0_15px_var(--border-accent)]"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8 min-w-0">
        
        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              Event Name
            </label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
              />
            ) : (
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {event.name}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> Date & Time
            </label>
            {isEditing ? (
              <input 
                type="datetime-local" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
              />
            ) : (
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {format(new Date(event.date), 'MMMM d, yyyy - h:mm a')}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> Location
            </label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Rizal Park, Manila"
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
              />
            ) : (
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {event.location || <span className="text-[var(--text-secondary)] italic text-sm">No location specified</span>}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-6 border-t border-[var(--border-subtle)]">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
            <AlignLeft className="w-3 h-3 mr-1" /> Description
          </label>
          {isEditing ? (
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)] custom-scrollbar"
            />
          ) : (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {event.description || <span className="italic">No description provided</span>}
            </p>
          )}
        </div>

        {/* Categories Read-Only */}
        <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
            Race Categories
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {event.categories.map(cat => (
              <div key={cat.id} className="bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 rounded-xl">
                <div className="text-lg font-black text-[var(--accent)] mb-1">{cat.distance}</div>
                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                  <span>₱{cat.price}</span>
                  <span>{cat.capacity} Slots</span>
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
             <p className="text-[10px] text-[var(--text-secondary)] italic mt-2">* Categories cannot be edited after creation. Contact support if needed.</p>
          )}
        </div>
        </div>

        {/* Right Column: Route Map */}
        {event.routeMapData?.waypoints && event.routeMapData.waypoints.length > 0 && (
          <div className="w-full lg:w-[45%] xl:w-[40%] space-y-4 pt-8 lg:pt-0 lg:border-l lg:border-t-0 border-t border-[var(--border-subtle)] lg:pl-10 shrink-0">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              <Navigation className="w-3 h-3 mr-1" /> Route Map
            </label>
            <div className={isMapExpanded ? "fixed inset-4 z-50 bg-[var(--bg-base)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl flex flex-col" : "w-full h-[350px] rounded-xl overflow-hidden border border-[var(--border-subtle)] relative shadow-inner transition-all duration-300"}>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                  className="bg-black/60 hover:bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-colors flex items-center"
                >
                  {isMapExpanded ? <><Minimize2 className="w-3 h-3 mr-2" /> Shrink Map</> : <><Maximize2 className="w-3 h-3 mr-2" /> Enlarge</>}
                </button>
              </div>

              {isEditing && (
                <div className="absolute top-4 left-4 w-full max-w-[280px] z-10 space-y-2">
                  <div className="flex items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-2">
                    <Search className="w-3 h-3 text-white/70 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search for a city or place (e.g., Naga)..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSearchLocation()
                        }
                      }}
                      className="bg-transparent border-none text-[11px] text-white focus:outline-none w-full placeholder:text-white/50"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="button" onClick={handleUndo} disabled={editableWaypoints.length === 0} className="bg-black/60 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors disabled:opacity-50 flex items-center">
                      Undo Last
                    </button>
                    <button type="button" onClick={handleAddWaypoint} className="bg-[var(--accent)] text-[#0A0A0A] text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors flex items-center shadow-[0_0_10px_var(--border-accent)]">
                      <Plus className="w-3 h-3 mr-1" /> Add Waypoint
                    </button>
                  </div>
                </div>
              )}

              <Map
                ref={mapRef}
                key={isMapExpanded ? 'expanded' : 'collapsed'}
                initialViewState={{
                  longitude: event.routeMapData?.waypoints?.[0]?.lng || 120.9804,
                  latitude: event.routeMapData?.waypoints?.[0]?.lat || 14.5726,
                  zoom: 13,
                  pitch: 0,
                  bounds: mapBounds,
                  fitBoundsOptions: { padding: isMapExpanded ? 80 : 40 }
                }}
                onClick={handleMapClick}
                cursor={isEditing ? 'crosshair' : 'grab'}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                {event.routeMapData.waypoints.length > 1 && (
                  <Source id="route" type="geojson" data={{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: editableWaypoints.map((wp) => [Number(wp.lng), Number(wp.lat)])
                    }
                  }}>
                    <Layer
                      id="route-layer"
                      type="line"
                      layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                      paint={{ 'line-color': '#E5FF00', 'line-width': 4, 'line-opacity': 0.8 }}
                    />
                  </Source>
                )}
                
                {editableWaypoints.map((wp, i) => (
                  <Marker key={wp.id} longitude={Number(wp.lng)} latitude={Number(wp.lat)} anchor="bottom">
                    <div className="w-6 h-6 bg-[var(--accent)] text-[#0A0A0A] rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_var(--accent)]">
                      {i + 1}
                    </div>
                  </Marker>
                ))}
              </Map>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                {editableWaypoints.length} Waypoints Plotted
              </span>
              <button 
                type="button" 
                onClick={() => setShowWaypoints(!showWaypoints)}
                className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider hover:text-white transition-colors flex items-center"
              >
                {showWaypoints ? 'Hide Waypoints' : 'View Waypoints'}
              </button>
            </div>
            
            {(showWaypoints || isEditing) && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                {editableWaypoints.map((wp, index) => (
                  <div key={wp.id} className="flex items-center space-x-3 bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)]">
                    <div className="w-5 h-5 shrink-0 bg-[var(--bg-panel-raised)] text-[var(--text-secondary)] rounded-full flex items-center justify-center text-[10px] font-black border border-[var(--border-subtle)]">
                      {index + 1}
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={wp.label}
                          onChange={(e) => {
                            const newWps = [...editableWaypoints]
                            newWps[index].label = e.target.value
                            setEditableWaypoints(newWps)
                          }}
                          className="w-full bg-transparent border-b border-[var(--border-subtle)] py-1 text-[11px] font-bold focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                        />
                        <button type="button" onClick={() => setEditableWaypoints(editableWaypoints.filter(w => w.id !== wp.id))} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate" title={wp.label}>
                        {wp.label || `Waypoint ${index + 1}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
