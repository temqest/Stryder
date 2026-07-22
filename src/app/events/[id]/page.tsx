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
    include: { 
      categories: {
        include: { registrations: true }
      } 
    }
  })

  if (!event) return notFound()

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Hero Banner */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-[var(--bg-panel)] border-b border-[var(--border-subtle)]">
        {event.bannerImage && (
          <img src={event.bannerImage} alt={event.name} className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
        )}
        
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
                {event.location || 'Location TBD'}
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
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg whitespace-pre-wrap">
              {event.description || 'Event details coming soon.'}
            </p>
          </section>

          {/* Interactive Route Map & Profile */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Route Detail</h2>
            <div className="mb-12">
              <EventRouteMap waypoints={(event.routeMapData as any)?.waypoints} />
            </div>
          </section>

          {/* Event Gallery */}
          {event.galleryImages && event.galleryImages.length > 0 ? (
            <section className="pt-8 border-t border-[var(--border-subtle)] mt-12">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Event Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.galleryImages.map((img: string, idx: number) => (
                  <div key={idx} className={`rounded-2xl border border-[var(--border-subtle)] overflow-hidden relative group ${idx === 1 || idx === 2 ? 'aspect-[4/3] md:aspect-square md:col-span-2' : 'aspect-square'}`}>
                    <img src={img} alt={`Gallery Image ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                    <div className="absolute inset-0 bg-[#0A0A0A] opacity-20 group-hover:opacity-10 transition-opacity" />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="pt-8 border-t border-[var(--border-subtle)] mt-12">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Event Gallery (Coming Soon)</h2>
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
          )}

          {/* Event Info & Schedule */}
          <section className="pt-8 border-t border-[var(--border-subtle)] mt-12">
             <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">Event Info & Schedule</h2>
             <div className="bg-[var(--bg-panel-raised)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
               <p className="text-[var(--text-secondary)] font-bold uppercase tracking-wider text-sm">Race schedule and guidelines will be announced soon.</p>
             </div>
          </section>

          {/* Organizer Info */}
          <section className="pt-8 border-t border-[var(--border-subtle)] mt-12 pb-12 lg:pb-0">
             <div className="bg-[var(--bg-panel-raised)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
               <p className="text-[var(--text-secondary)] font-bold uppercase tracking-wider text-sm">Organizer details will be added soon.</p>
             </div>
          </section>
        </div>

        {/* Categories Sidebar */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">Select a Distance</h3>
          
          {event.categories.map((category: any) => {
            const spotsTaken = category.registrations?.filter((r: any) => r.status !== 'CANCELLED' && r.status !== 'REFUNDED').length || 0;
            const spotsRemaining = Math.max(0, category.capacity - spotsTaken);
            return (
            <div key={category.id} className="group p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="text-5xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{category.distance}</span>
                <span className="text-2xl font-bold">₱{category.price.toLocaleString()}</span>
              </div>
              
              <div className="text-xs uppercase tracking-[0.1em] font-bold text-[var(--text-secondary)] mb-8 relative z-10">
                Spots Remaining: {spotsRemaining}
              </div>
              
              {spotsRemaining > 0 ? (
                <Link 
                  href={`/events/${event.id}/register?category=${category.id}`}
                  className="w-full py-4 rounded-full font-black uppercase tracking-wider text-center transition-transform flex items-center justify-center relative z-10 bg-[var(--accent)] text-[#0A0A0A] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(212,255,0,0.15)]"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all absolute right-6" />
                </Link>
              ) : (
                <div className="w-full py-4 rounded-full font-black uppercase tracking-wider text-center flex items-center justify-center relative z-10 bg-[var(--bg-panel-raised)] text-[var(--text-secondary)] cursor-not-allowed opacity-50">
                  Sold Out
                </div>
              )}
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}
