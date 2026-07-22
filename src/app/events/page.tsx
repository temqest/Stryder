import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { Calendar, MapPin, ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import StickyMap from '@/components/StickyMap'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      categories: true
    },
    orderBy: {
      date: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--accent)] rounded-full blur-[120px] opacity-10" />
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-4 block">
            Upcoming Schedule
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase leading-tight text-[var(--text-primary)] relative z-10 mb-8">
            Find Your <br /> Next Race.
          </h1>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 relative z-10 bg-[var(--bg-panel)] p-4 rounded-2xl border border-[var(--border-subtle)] shadow-xl shadow-black/20">
            <div className="flex-1 flex items-center">
              <input type="text" placeholder="Search events, cities, or keywords..." className="w-full bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-4 py-2" />
            </div>
            <div className="w-px bg-[var(--border-subtle)] hidden md:block" />
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="relative shrink-0">
                <select className="appearance-none bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full pl-5 pr-10 py-2 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] hover:border-[var(--text-secondary)] transition-colors cursor-pointer w-full">
                  <option>Any Distance</option>
                  <option>5K</option>
                  <option>10K</option>
                  <option>Half Marathon</option>
                  <option>Full Marathon</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" />
              </div>
              <div className="relative shrink-0">
                <select className="appearance-none bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full pl-5 pr-10 py-2 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] hover:border-[var(--text-secondary)] transition-colors cursor-pointer w-full">
                  <option>Any Location</option>
                  <option>Manila</option>
                  <option>Cebu</option>
                  <option>Davao</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" />
              </div>
              <div className="relative shrink-0">
                <select className="appearance-none bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full pl-5 pr-10 py-2 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] hover:border-[var(--text-secondary)] transition-colors cursor-pointer w-full">
                  <option>Any Date</option>
                  <option>This Month</option>
                  <option>Next Month</option>
                  <option>This Year</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Events Layout: Split View */}
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Left Column: Event List */}
          <div className="w-full lg:w-[50%] flex flex-col gap-8">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 border border-[var(--border-subtle)] rounded-3xl bg-[var(--bg-panel)] relative overflow-hidden">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No events found</h3>
                <p className="text-[var(--text-secondary)] mb-8">There are currently no races scheduled on the platform.</p>
                <form action={async () => {
                  'use server';
                  // Quick seed function for demo purposes
                  await prisma.event.create({
                    data: {
                      name: 'Midnight City Run \'26',
                      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
                      description: 'Experience the thrill of a midnight city run. Fast course, cool temps, neon vibes.',
                      categories: {
                        create: [
                          { distance: '5K', price: 25, capacity: 500 },
                          { distance: '10K', price: 40, capacity: 300 },
                          { distance: '21K', price: 65, capacity: 150 },
                        ]
                      }
                    }
                  })
                }}>
                  <button className="px-8 py-4 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors">
                    Generate Demo Event
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {events.map((event: any) => (
                  <Link href={`/events/${event.id}`} key={event.id} className="group relative block">
                    <div className="relative h-full flex flex-col p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] overflow-hidden group-hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-all duration-300">
                      
                      {/* Decorative Glow */}
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />

                      {/* Category Badges (Top Corner) */}
                      <div className="absolute top-6 right-6 flex flex-wrap gap-2 z-20 justify-end">
                        {event.categories.slice(0, 2).map((cat: any) => (
                           <span key={cat.id} className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-[var(--accent)] text-[#0A0A0A] shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]">
                             {cat.distance}
                           </span>
                        ))}
                        {event.categories.length > 2 && (
                           <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-[var(--bg-panel-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                             +{event.categories.length - 2}
                           </span>
                        )}
                      </div>

                      <div className="mb-6 relative z-10 mt-4">
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-tight mb-4 group-hover:text-[var(--accent)] transition-colors pr-12">{event.name}</h2>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-[var(--text-secondary)] font-bold tracking-wide uppercase text-xs">
                            <Calendar className="w-4 h-4 mr-3 text-[var(--accent)]" />
                            {format(new Date(event.date), 'MMMM do, yyyy')}
                          </div>
                          <div className="flex items-center text-[var(--text-secondary)] font-bold tracking-wide uppercase text-xs">
                            <MapPin className="w-4 h-4 mr-3 text-[var(--accent)]" />
                            {event.location || 'Location TBD'}
                          </div>
                        </div>

                        <p className="text-[var(--text-secondary)] line-clamp-2">{event.description}</p>
                      </div>

                      <div className="mt-auto relative z-10 pt-6 border-t border-[var(--border-subtle)]">
                        {/* Explicit Action Button */}
                        <div className="flex items-center text-[var(--text-primary)] group-hover:text-[var(--accent)] font-bold uppercase tracking-wider text-sm transition-colors">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Map (Hidden on mobile) */}
          <div className="hidden lg:block w-full lg:w-[50%] relative">
            <StickyMap events={events} />
          </div>

        </div>
      </div>
    </div>
  )
}
