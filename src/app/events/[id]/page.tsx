import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, ArrowLeft, Clock, Shield } from 'lucide-react'
import { format } from 'date-fns'
import EventRouteMap from '@/components/EventRouteMap'


export const dynamic = 'force-dynamic'

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: { categories: true }
  })

  if (!event) return notFound()

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Hero Banner */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-[var(--bg-panel)] border-b border-[var(--border-subtle)]">
        
        {/* Back Button */}
        <div className="absolute top-8 left-0 w-full z-30 flex justify-center">
          <div className="w-full max-w-7xl px-6">
            <Link href="/events" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-bold uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] bg-[var(--accent)] rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-0 w-full z-20 flex justify-center">
          <div className="w-full max-w-7xl px-6 pb-16">
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-4 block">
              Event Details
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6">{event.name}</h1>
            <div className="flex flex-wrap gap-8 text-[var(--text-secondary)] uppercase tracking-wider font-bold text-sm">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-[var(--accent)]" />
                {format(new Date(event.date), 'MMMM do, yyyy')}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-[var(--accent)]" />
                Manila, Philippines (TBD)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-10">
          <section>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] mt-1">About This Race</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
              {event.description}
            </p>
          </section>

          {/* Interactive Route Map & Profile */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Route Detail</h2>
            <div className="mb-12">
              <EventRouteMap />
            </div>
          </section>

          {/* Event Gallery */}
          <section className="pt-8 border-t border-[var(--border-subtle)] mt-12">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="aspect-square rounded-2xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-base)] to-transparent z-10" />
                 <div className="absolute inset-0 bg-[#0A0A0A] opacity-50 group-hover:opacity-30 transition-opacity" />
                 <div className="absolute bottom-4 left-4 z-20 font-bold tracking-wide uppercase text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Pre-Race</div>
              </div>
              <div className="aspect-[4/3] md:aspect-square rounded-2xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] overflow-hidden relative group md:col-span-2">
                 <div className="absolute inset-0 bg-gradient-to-bl from-[var(--bg-base)] to-transparent z-10" />
                 <div className="absolute inset-0 bg-[var(--accent)] opacity-10 group-hover:opacity-20 transition-opacity" />
                 <div className="absolute bottom-4 left-4 z-20 font-bold tracking-wide uppercase text-xs text-[var(--accent)]">Race Highlights</div>
              </div>
              <div className="aspect-[4/3] md:aspect-square rounded-2xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] overflow-hidden relative group md:col-span-2">
                 <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] to-transparent z-10" />
                 <div className="absolute inset-0 bg-[#0A0A0A] opacity-50 group-hover:opacity-30 transition-opacity" />
                 <div className="absolute bottom-4 left-4 z-20 font-bold tracking-wide uppercase text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Finish Line</div>
              </div>
              <div className="aspect-square rounded-2xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-base)] to-transparent z-10" />
                 <div className="absolute inset-0 bg-[#0A0A0A] opacity-50 group-hover:opacity-30 transition-opacity" />
                 <div className="absolute bottom-4 left-4 z-20 font-bold tracking-wide uppercase text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Post-Race Party</div>
              </div>
            </div>
          </section>

          {/* Event Info & Schedule */}
          <section className="pt-8 border-t border-[var(--border-subtle)] mt-12">
             <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Event Info & Schedule</h2>
             <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start">
                   <div className="w-16 h-16 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shrink-0 shadow-[0_0_15px_rgba(212,255,0,0.05)]">
                      <Clock className="w-6 h-6 text-[var(--accent)]" />
                   </div>
                   <div>
                      <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] mb-2">Race Day Schedule</h4>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">Assembly begins hours before the gun start. Please arrive early to check in your baggage and join the pre-race briefing.</p>
                      <ul className="text-[var(--text-secondary)] text-sm space-y-2">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--border-subtle)] mr-3"></span><span className="font-bold text-[var(--text-primary)] w-24">10:00 PM</span> Baggage Counter Opens</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--border-subtle)] mr-3"></span><span className="font-bold text-[var(--text-primary)] w-24">11:30 PM</span> Warm-up & Briefing</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--accent)] mr-3 shadow-[0_0_5px_var(--accent)]"></span><span className="font-bold text-[var(--text-primary)] w-24">11:59 PM</span> 21K & 10K Gun Start</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[var(--accent)] mr-3 shadow-[0_0_5px_var(--accent)]"></span><span className="font-bold text-[var(--text-primary)] w-24">12:15 AM</span> 5K Gun Start</li>
                      </ul>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start">
                   <div className="w-16 h-16 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shrink-0 shadow-[0_0_15px_rgba(212,255,0,0.05)]">
                      <Shield className="w-6 h-6 text-[var(--accent)]" />
                   </div>
                   <div>
                      <h4 className="font-bold uppercase tracking-wide text-sm text-[var(--text-primary)] mb-2">Rules & Guidelines</h4>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Race bibs must be worn clearly on the front of your shirt. Strictly no pacing by non-registered runners or vehicles. Hydration stations are available every 2.5km. Medical units will be stationed at the Start/Finish line and halfway points.
                      </p>
                   </div>
                </div>
             </div>
          </section>

          {/* Organizer Info */}
          <section className="pt-8 border-t border-[var(--border-subtle)] mt-12 pb-12 lg:pb-0">
             <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center mb-6 sm:mb-0">
                   <div className="w-14 h-14 rounded-full bg-[#0A0A0A] border border-[var(--border-accent)] flex items-center justify-center mr-5 shadow-[0_0_10px_rgba(212,255,0,0.1)]">
                      <span className="font-black text-xl text-[var(--accent)] tracking-tighter">ST</span>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Organized By</h4>
                      <div className="font-black uppercase tracking-wide text-lg text-[var(--text-primary)]">Stryder Events</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">hello@stryder.run</div>
                   </div>
                </div>
                <button className="sm:ml-auto w-full sm:w-auto px-8 py-3 rounded-full border border-[var(--border-subtle)] text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                   Contact
                </button>
             </div>
          </section>
        </div>

        {/* Categories Sidebar */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">Select a Distance</h3>
          
          {event.categories.map((category: any) => (
            <div key={category.id} className="group p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="text-5xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{category.distance}</span>
                <span className="text-2xl font-bold">₱{category.price.toLocaleString()}</span>
              </div>
              
              <div className="text-xs uppercase tracking-[0.1em] font-bold text-[var(--text-secondary)] mb-8 relative z-10">
                Spots Remaining: {category.capacity}
              </div>
              
              <Link 
                href={`/events/${event.id}/register?category=${category.id}`}
                className="w-full py-4 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-black uppercase tracking-wider text-center transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(212,255,0,0.15)]"
              >
                Register Now
                <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all absolute right-6" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
