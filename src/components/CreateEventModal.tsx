'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Plus, Trash2, MapPin, Image as ImageIcon, Loader2, ArrowRight, ArrowLeft, Search, Maximize, Minimize } from 'lucide-react'
import { createEvent } from '@/app/dashboard/actions'
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

export function CreateEventModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCreateOpen = searchParams?.get('create') === 'true'

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([{ id: 1, distance: '', price: '', capacity: '' }])
  const [nextCatId, setNextCatId] = useState(2)
  const [waypoints, setWaypoints] = useState<{id: number, label: string, lng: number, lat: number}[]>([])
  const [nextWpId, setNextWpId] = useState(1)
  const [viewState, setViewState] = useState({
    longitude: 120.9804,
    latitude: 14.5726,
    zoom: 13,
    pitch: 0
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const formRef = useRef<HTMLFormElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isMapExpanded, setIsMapExpanded] = useState(false)

  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?country=ph&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
      const data = await res.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setViewState({ ...viewState, longitude: lng, latitude: lat, zoom: 12 })
      }
    } catch (err) {
      console.error('Error fetching location:', err)
    }
  }

  if (!isCreateOpen) return null

  const closeModal = () => {
    // Remove the ?create=true from URL
    const newParams = new URLSearchParams(searchParams?.toString() || '')
    newParams.delete('create')
    router.replace(`?${newParams.toString()}`, { scroll: false })
  }

  const handleAddCategory = () => {
    setCategories([...categories, { id: nextCatId, distance: '', price: '', capacity: '' }])
    setNextCatId(nextCatId + 1)
  }

  const handleRemoveCategory = (id: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  const handleAddWaypoint = () => {
    // If manually adding, default to center of map
    setWaypoints([...waypoints, { id: nextWpId, label: `Waypoint ${waypoints.length + 1}`, lng: viewState.longitude, lat: viewState.latitude }])
    setNextWpId(nextWpId + 1)
  }

  const handleMapClick = (evt: any) => {
    const { lng, lat } = evt.lngLat
    setWaypoints([...waypoints, { id: nextWpId, label: `Waypoint ${waypoints.length + 1}`, lng, lat }])
    setNextWpId(nextWpId + 1)
  }

  const handleUndo = () => {
    if (waypoints.length > 0) {
      setWaypoints(waypoints.slice(0, -1))
    }
  }

  const handleRemoveWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(w => w.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Inject dynamic categories into formData
      categories.forEach((cat, index) => {
        formData.append(`category_${index}_distance`, cat.distance)
        formData.append(`category_${index}_price`, cat.price)
        formData.append(`category_${index}_capacity`, cat.capacity)
      })

      // Inject dynamic waypoints into formData
      waypoints.forEach((wp, index) => {
        formData.append(`wp_${index}_label`, wp.label)
        formData.append(`wp_${index}_lng`, wp.lng.toString())
        formData.append(`wp_${index}_lat`, wp.lat.toString())
      })

      const result = await createEvent(formData)
      if (result.success) {
        closeModal()
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please check required fields.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="uppercase text-[10px] tracking-[0.2em] text-[var(--accent)] font-bold mb-1 block">
              Step {currentStep} of {totalSteps}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Create New Event</h2>
          </div>
          <button onClick={closeModal} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          <form id="create-event-form" ref={formRef} onSubmit={handleSubmit} className="space-y-10">
            
            {/* Step 1: Basic Info & Media */}
            <div className={currentStep === 1 ? "space-y-10" : "hidden"}>
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center">
                  Basic Info
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Event Name</label>
                    <input name="name" type="text" placeholder="e.g. Stryder Midnight Run" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Event Date</label>
                    <input name="date" type="datetime-local" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)] [color-scheme:dark]" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" rows={4} placeholder="Describe the race..." className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> Location
                  </label>
                  <input name="location" type="text" placeholder="e.g. Rizal Park, Manila" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]" />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center">
                  Media Assets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" /> Banner Image
                    </label>
                    <input name="bannerImage" type="file" accept="image/*" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" />
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">Upload a hero image for the event page.</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" /> Gallery Images
                    </label>
                    <input name="galleryImages" type="file" accept="image/*" multiple className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" />
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">Select multiple images.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Step 2: Pricing & Categories */}
            <div className={currentStep === 2 ? "space-y-10" : "hidden"}>
              <section className="space-y-4">
                <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-2 mb-4">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                     Distances & Pricing
                   </h3>
                   <button type="button" onClick={handleAddCategory} className="flex items-center text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] hover:text-white transition-colors">
                     <Plus className="w-3 h-3 mr-1" /> Add Category
                   </button>
                </div>

                {categories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center space-x-4 bg-[var(--bg-base)] p-4 rounded-xl border border-[var(--border-subtle)]">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Distance (e.g. 5K)</label>
                      <input 
                        type="text" 
                        value={cat.distance}
                        onChange={(e) => {
                          const newCats = [...categories]
                          newCats[index].distance = e.target.value
                          setCategories(newCats)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Price (₱)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={cat.price}
                        onChange={(e) => {
                          const newCats = [...categories]
                          newCats[index].price = e.target.value
                          setCategories(newCats)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Capacity</label>
                      <input 
                        type="number" 
                        min="1"
                        value={cat.capacity}
                        onChange={(e) => {
                          const newCats = [...categories]
                          newCats[index].capacity = e.target.value
                          setCategories(newCats)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    {categories.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCategory(cat.id)}
                        className="mt-5 p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </section>
            </div>

            {/* Step 3: Route Map */}
            <div className={currentStep === 3 ? "space-y-10" : "hidden"}>
              <section className={isMapExpanded ? "fixed inset-4 z-[100] bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 flex flex-col" : "space-y-4"}>
                <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-2 mb-4">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                     Route Map Waypoints
                   </h3>
                   <div className="flex space-x-4">
                     <button type="button" onClick={handleUndo} disabled={waypoints.length === 0} className="flex items-center text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white transition-colors disabled:opacity-50">
                       Undo Last
                     </button>
                     <button type="button" onClick={handleAddWaypoint} className="flex items-center text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] hover:text-white transition-colors">
                       <Plus className="w-3 h-3 mr-1" /> Add Manual Waypoint
                     </button>
                   </div>
                </div>

                {/* Map Controls */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
                    <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
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
                      className="w-full bg-transparent text-sm focus:outline-none text-[var(--text-primary)]" 
                    />
                    <button type="button" onClick={() => handleSearchLocation()} className="text-[10px] font-bold uppercase text-[var(--accent)] ml-2 shrink-0">Search</button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="flex items-center px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors shrink-0"
                  >
                    {isMapExpanded ? <><Minimize className="w-3 h-3 mr-2" /> Shrink Map</> : <><Maximize className="w-3 h-3 mr-2" /> Enlarge Map</>}
                  </button>
                </div>

                <div className={isMapExpanded ? "flex-1 w-full rounded-xl overflow-hidden border border-[var(--border-subtle)] relative shadow-inner" : "w-full h-[300px] rounded-xl overflow-hidden border border-[var(--border-subtle)] relative mb-6 shadow-inner transition-all duration-300"}>
                  {currentStep === 3 && (
                    <Map
                      key={isMapExpanded ? 'expanded' : 'collapsed'}
                      {...viewState}
                      onMove={(evt) => setViewState(evt.viewState)}
                      onClick={handleMapClick}
                      mapStyle="mapbox://styles/mapbox/dark-v11"
                      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                      cursor="crosshair"
                    >
                      {waypoints.length > 1 && (
                        <Source id="route" type="geojson" data={{
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'LineString',
                            coordinates: waypoints.map(wp => [Number(wp.lng), Number(wp.lat)])
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
                      
                      {waypoints.map((wp, i) => (
                        <Marker key={wp.id} longitude={Number(wp.lng)} latitude={Number(wp.lat)} anchor="bottom">
                          <div className="w-6 h-6 bg-[var(--accent)] text-[#0A0A0A] rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_var(--accent)]">
                            {i + 1}
                          </div>
                        </Marker>
                      ))}
                    </Map>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 pointer-events-none">
                    Click on the map to drop a waypoint
                  </div>
                </div>

                <div className={isMapExpanded ? "hidden" : "space-y-4"}>
                  {waypoints.map((wp, index) => (
                  <div key={wp.id} className="flex items-center space-x-4 bg-[var(--bg-base)] p-4 rounded-xl border border-[var(--border-subtle)]">
                    <div className="w-6 h-6 shrink-0 bg-[var(--bg-panel-raised)] text-[var(--text-secondary)] rounded-full flex items-center justify-center text-[10px] font-black border border-[var(--border-subtle)]">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Label</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Start Line"
                        value={wp.label}
                        onChange={(e) => {
                          const newWps = [...waypoints]
                          newWps[index].label = e.target.value
                          setWaypoints(newWps)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="120.9842"
                        value={wp.lng}
                        onChange={(e) => {
                          const newWps = [...waypoints]
                          newWps[index].lng = parseFloat(e.target.value)
                          setWaypoints(newWps)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="14.5995"
                        value={wp.lat}
                        onChange={(e) => {
                          const newWps = [...waypoints]
                          newWps[index].lat = parseFloat(e.target.value)
                          setWaypoints(newWps)
                        }}
                        className="w-full bg-transparent border-b border-[var(--border-subtle)] py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveWaypoint(wp.id)}
                      className="mt-5 p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                </div>
              </section>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-panel-raised)] flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={() => setCurrentStep(prev => prev - 1)} 
                className="flex items-center px-6 py-3 rounded-full border border-[var(--border-subtle)] text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <button 
              type="button" 
              onClick={closeModal} 
              className="px-6 py-3 rounded-full border border-[var(--border-subtle)] text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button 
              type="button" 
              onClick={() => setCurrentStep(prev => prev + 1)} 
              className={`flex items-center px-8 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors ${currentStep < totalSteps ? '' : 'hidden'}`}
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            <button 
              type="submit" 
              form="create-event-form"
              disabled={loading}
              className={`flex items-center px-8 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === totalSteps ? '' : 'hidden'}`}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
