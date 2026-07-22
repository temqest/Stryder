import { Search, MapPin, Calendar, Filter, ArrowRight, Tag, List, Map as MapIcon } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import EventsMap from '@/components/EventsMap'
import SearchInput from '@/components/SearchInput'

export const dynamic = 'force-dynamic'

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ view?: string, q?: string }> }) {
  const { view = 'grid', q = '' } = await searchParams
  
  const events = await prisma.event.findMany({
    where: { 
      date: { gte: new Date() },
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      } : {})
    },
    include: { categories: true },
    orderBy: { date: 'asc' }
  })

  // Separate the first event as "Featured" if available, others as upcoming
  const featuredEvent = (events.length > 0 && !q) ? events[0] : null
  const upcomingEvents = (events.length > 0 && !q) ? events.slice(1) : events

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Discover Races
            </h1>
          </div>
          
          <div className="flex w-full lg:w-auto space-x-2">
             <SearchInput />
             <div className="flex bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-full p-1 shrink-0">
               <Link href={`/runner/discover?view=grid${q ? `&q=${q}` : ''}`} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center transition-colors ${view === 'grid' ? 'bg-[var(--accent)] text-[#0A0A0A]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                 <List className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Grid</span>
               </Link>
               <Link href={`/runner/discover?view=map${q ? `&q=${q}` : ''}`} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center transition-colors ${view === 'map' ? 'bg-[var(--accent)] text-[#0A0A0A]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                 <MapIcon className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Map</span>
               </Link>
             </div>
          </div>
        </div>

        {events.length === 0 ? (
           <div className="p-10 border border-dashed border-[var(--border-subtle)] rounded-3xl text-center text-[var(--text-secondary)]">
              No upcoming events found.
           </div>
        ) : view === 'map' ? (
           <EventsMap events={events} />
        ) : (
          <>
            {/* Featured Event Hero */}
            {featuredEvent && (
              <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] relative overflow-hidden group">
                <div className="absolute inset-0 z-0">
                   {featuredEvent.bannerImage ? (
                     <img src={featuredEvent.bannerImage} alt={featuredEvent.name} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-tr from-[#0A0A0A] to-[var(--bg-panel-raised)]" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                </div>
                
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                   <div className="max-w-2xl">
                      <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider rounded-full border border-[var(--accent)]/20 mb-6 inline-block">Featured Event</span>
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">{featuredEvent.name}</h2>
                      <div className="flex flex-wrap gap-4 text-[var(--text-secondary)] text-sm mb-6">
                         <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(featuredEvent.date), 'MMM do, yyyy')}</span>
                         <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {featuredEvent.location || 'TBA'}</span>
                         <span className="flex items-center"><Tag className="w-4 h-4 mr-2" /> {featuredEvent.categories.map(c => c.distance).join(', ')}</span>
                      </div>
                      <p className="text-[var(--text-secondary)] max-w-xl">
                         {featuredEvent.description || 'Join us for this amazing event! Register now to secure your spot and start training.'}
                      </p>
                   </div>
                   <Link href={`/events/${featuredEvent.id}`} className="shrink-0">
                      <button className="w-full md:w-auto px-8 py-4 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-sm hover:bg-[var(--accent-dim)] transition-colors flex items-center justify-center">
                         Register Now <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                   </Link>
                </div>
              </div>
            )}

            {/* Event Grid */}
            <h3 className="text-xl font-black uppercase tracking-tight pt-4 border-t border-[var(--border-subtle)]">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {upcomingEvents.map((event) => (
                  <Link href={`/events/${event.id}`} key={event.id} className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all overflow-hidden flex flex-col group cursor-pointer">
                     <div className="h-48 relative overflow-hidden bg-[var(--bg-base)]">
                        {event.bannerImage ? (
                          <img src={event.bannerImage} alt={event.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[var(--bg-panel-raised)] to-[var(--bg-base)]" />
                        )}
                        <span className="absolute top-4 right-4 bg-[#0A0A0A]/80 backdrop-blur px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded text-[var(--text-primary)] border border-[var(--border-subtle)]">
                           Open
                        </span>
                     </div>
                     <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                           <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-[var(--accent)] transition-colors">{event.name}</h3>
                           <div className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2" /> {format(new Date(event.date), 'MMM do, yyyy')}</span>
                              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2" /> {event.location || 'TBA'}</span>
                           </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
                           {event.categories.map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                {cat.distance}
                              </span>
                           ))}
                        </div>
                     </div>
                  </Link>
               ))}
               {upcomingEvents.length === 0 && (
                 <div className="col-span-full p-6 text-center text-[var(--text-secondary)]">
                    No more upcoming events.
                 </div>
               )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
