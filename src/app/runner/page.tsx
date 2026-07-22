import { MapPin, Calendar, Clock, Trophy, Target, ChevronRight, Activity, Flame, Compass, Medal, Ticket, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { format, differenceInDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RunnerDashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const runner = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })
  
  if (!runner) redirect('/signup')

  // Fetch upcoming confirmed registrations
  const upcomingRegistrations = await prisma.registration.findMany({
    where: { 
      userId: runner.id,
      status: 'CONFIRMED',
      category: { event: { date: { gte: new Date() } } }
    },
    include: { category: { include: { event: true } } },
    orderBy: { category: { event: { date: 'asc' } } }
  })
  
  const nextRegistration = upcomingRegistrations[0]

  // Fetch past results
  const pastResults = await prisma.raceResult.findMany({
    where: { registration: { userId: runner.id } },
    include: { registration: { include: { category: { include: { event: true } } } } },
    orderBy: { timestamp: 'desc' }
  })

  // Calculate stats
  let totalDistance = 0
  pastResults.forEach(r => {
    const distStr = r.registration.category.distance
    const num = parseFloat(distStr.replace(/[^\d.]/g, ''))
    if (!isNaN(num)) totalDistance += num
  })

  let rankPercentile = "Top 50%"
  if (pastResults.length > 5) rankPercentile = "Top 5%"
  else if (pastResults.length > 0) rankPercentile = "Top 15%"

  // Mock past results if none exist for UI demo purposes
  const displayResults = pastResults.length > 0 ? pastResults.map(r => ({
    name: r.registration.category.event.name,
    date: format(new Date(r.registration.category.event.date), 'MMM do, yyyy'),
    time: format(new Date(r.timestamp), 'HH:mm:ss'),
    pace: "5'30\"/km"
  })) : [
     { name: 'City Sprint 10K', date: 'Jul 12, 2026', time: '00:52:14', pace: "5'13\"/km" }
  ]

  // Calculate stats
  const completedRaces = await prisma.registration.count({
    where: { userId: runner.id, status: 'CONFIRMED', category: { event: { date: { lt: new Date() } } } }
  })

  // Fetch recommended events
  const recommendedEvents = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    include: { categories: true },
    orderBy: { date: 'asc' },
    take: 3
  })

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Runner Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Welcome, {runner.name.split(' ')[0]}
            </h1>
          </div>
          <Link href="/runner/discover">
            <button className="px-6 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-sm hover:bg-[var(--accent-dim)] transition-colors shrink-0">
              Find a Race
            </button>
          </Link>
        </div>

        {/* Hero Next Race Card */}
        {nextRegistration ? (
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-accent)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-[0.05] group-hover:opacity-15 transition-opacity duration-700" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div>
                  <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-4 flex items-center">
                    <Activity className="w-4 h-4 mr-2" /> Up Next
                  </span>
                  <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{nextRegistration.category.event.name}</h2>
                  <div className="flex items-center space-x-4 text-[var(--text-secondary)] text-sm mb-6">
                     <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {format(new Date(nextRegistration.category.event.date), 'MMM do, yyyy')}</span>
                     <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> {nextRegistration.category.event.location || 'TBA'}</span>
                  </div>
                  <div className="inline-flex flex-col border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-base)]">
                     <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1">Your Category</span>
                     <span className="text-xl font-black text-[var(--text-primary)]">{nextRegistration.category.distance}</span>
                  </div>
               </div>
               <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                     <div className="text-6xl font-black text-[var(--accent)] leading-none tracking-tighter">
                        {differenceInDays(new Date(nextRegistration.category.event.date), new Date())}
                     </div>
                     <div className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] mt-2">Days To Go</div>
                  </div>
                  <Link href="/runner/tickets" className="mt-4 w-full md:w-auto px-8 py-3 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold uppercase tracking-wider text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center">
                     <Ticket className="w-4 h-4 mr-2" /> View Ticket / QR
                  </Link>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--bg-panel)] rounded-3xl p-10 border border-dashed border-[var(--border-subtle)] text-center">
             <h2 className="text-2xl font-black uppercase tracking-tight mb-2">No Upcoming Races</h2>
             <p className="text-[var(--text-secondary)] mb-6">You aren't registered for any upcoming events.</p>
             <Link href="/runner/discover" className="inline-flex px-8 py-3 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors font-bold uppercase tracking-wider text-sm">Browse Events</Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <Medal className="w-6 h-6 text-[var(--text-secondary)] mb-4" />
            <div className="text-3xl font-black mb-1">{completedRaces}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Completed Races</div>
          </div>
          <div className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <Compass className="w-6 h-6 text-[var(--text-secondary)] mb-4" />
            <div className="text-3xl font-black mb-1">{totalDistance}<span className="text-lg text-[var(--text-secondary)]">km</span></div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Total Distance</div>
          </div>
          <div className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <Trophy className="w-6 h-6 text-[var(--text-secondary)] mb-4" />
            <div className="text-3xl font-black mb-1">{rankPercentile}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Overall Ranking</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center">
                  Past Results
               </h3>
               <div className="space-y-4">
                  {displayResults.map((race, i) => (
                     <div key={i} className="bg-[var(--bg-panel)] p-5 rounded-2xl border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between hover:border-[var(--border-accent)] transition-all">
                        <div className="mb-4 sm:mb-0">
                           <h4 className="font-bold text-lg">{race.name}</h4>
                           <p className="text-sm text-[var(--text-secondary)] flex items-center mt-1"><Calendar className="w-3 h-3 mr-1" /> {race.date}</p>
                        </div>
                        <div className="flex space-x-6">
                           <div>
                              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Official Time</div>
                              <div className="font-black font-mono text-lg">{race.time}</div>
                           </div>
                           <div>
                              <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Avg Pace</div>
                              <div className="font-black font-mono text-lg">{race.pace}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-[var(--bg-panel)] p-6 rounded-3xl border border-[var(--border-subtle)]">
                <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center text-[var(--accent)]">
                   <Compass className="w-4 h-4 mr-2" /> Recommended For You
                </h3>
                <div className="space-y-4">
                   {recommendedEvents.map((event) => (
                     <Link href={`/events/${event.id}`} key={event.id} className="block group cursor-pointer">
                        <div className="h-32 bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] mb-3 overflow-hidden relative">
                           {event.bannerImage ? (
                             <img src={event.bannerImage} alt={event.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                           ) : (
                             <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-panel)] to-transparent" />
                           )}
                           <span className="absolute bottom-2 left-2 text-[10px] px-2 py-1 bg-[#0A0A0A]/80 font-bold uppercase tracking-wider rounded text-[var(--text-primary)]">Open</span>
                        </div>
                        <h4 className="font-bold uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">{event.name}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{format(new Date(event.date), 'MMM do, yyyy')} • {event.categories.map(c => c.distance).join(', ')}</p>
                     </Link>
                   ))}
                   {recommendedEvents.length === 0 && (
                     <p className="text-xs text-[var(--text-secondary)]">No upcoming events found.</p>
                   )}
                </div>
                <Link href="/runner/discover">
                  <button className="w-full mt-6 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider hover:bg-[var(--bg-panel-raised)] hover:border-[var(--text-secondary)] transition-all">
                     Browse All Races
                  </button>
                </Link>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
