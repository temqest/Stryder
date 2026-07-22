import { Trophy, Clock, Target, Calendar, MapPin, Download } from 'lucide-react'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const runner = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })
  
  if (!runner) redirect('/signup')

  const pastResults = await prisma.raceResult.findMany({
    where: { registration: { userId: runner.id } },
    include: { registration: { include: { category: { include: { event: true } } } } },
    orderBy: { timestamp: 'desc' }
  })

  const history = pastResults.map(r => ({
    eventId: r.registration.category.eventId,
    name: r.registration.category.event.name,
    date: format(new Date(r.registration.category.event.date), 'MMM do, yyyy'),
    location: r.registration.category.event.location || 'TBA',
    distance: r.registration.category.distance,
    bib: r.registration.bibNumber || 'N/A',
    time: format(new Date(r.timestamp), 'HH:mm:ss'),
    pace: "5'30\"/km",
    rank: "N/A"
  }))

  const pbTime = history.length > 0 ? history[0].time : '00:00:00'
  const pbPace = history.length > 0 ? history[0].pace : "0'00\"/km"

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Performance
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Past Races
            </h1>
          </div>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-[0.03]" />
          
          <h2 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10">Personal Records</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-[var(--bg-base)] p-6 rounded-2xl border border-[var(--border-subtle)]">
               <div className="flex items-center text-[var(--accent)] mb-4">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span className="text-xs uppercase tracking-wider font-bold">Best 10K Time</span>
               </div>
               <div className="text-4xl font-black font-mono tracking-tighter">{pbTime}</div>
            </div>
            <div className="bg-[var(--bg-base)] p-6 rounded-2xl border border-[var(--border-subtle)]">
               <div className="flex items-center text-[var(--text-secondary)] mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-xs uppercase tracking-wider font-bold">Best Pace</span>
               </div>
               <div className="text-4xl font-black font-mono tracking-tighter">{pbPace}</div>
            </div>
            <div className="bg-[var(--bg-base)] p-6 rounded-2xl border border-[var(--border-subtle)]">
               <div className="flex items-center text-[var(--text-secondary)] mb-4">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="text-xs uppercase tracking-wider font-bold">Total Races</span>
               </div>
               <div className="text-4xl font-black font-mono tracking-tighter">{history.length}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {history.map((race, index) => (
            <div key={index} className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden flex flex-col md:flex-row group hover:border-[var(--border-accent)] transition-colors">
               <div className="p-8 border-b md:border-b-0 md:border-r border-dashed border-[var(--border-subtle)] md:w-2/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-[var(--accent)] transition-colors">{race.name}</h3>
                    <div className="flex flex-col space-y-2 text-[var(--text-secondary)] text-sm mb-6">
                       <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {race.date}</span>
                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {race.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                     <div className="px-3 py-1 bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-bold uppercase tracking-wider rounded">
                       {race.distance}
                     </div>
                     <div className="px-3 py-1 bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-bold uppercase tracking-wider rounded">
                       Bib: {race.bib}
                     </div>
                  </div>
               </div>

               <div className="p-8 md:w-3/5 bg-[var(--bg-panel-raised)] grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
                  <div>
                     <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1">Finish Time</div>
                     <div className="font-black font-mono text-2xl">{race.time}</div>
                  </div>
                  <div>
                     <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1">Avg Pace</div>
                     <div className="font-black font-mono text-2xl">{race.pace}</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                     <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1">Overall Rank</div>
                     <div className="font-black font-mono text-2xl">{race.rank}</div>
                  </div>
                  <div className="col-span-2 md:col-span-3 mt-4 pt-4 border-t border-[var(--border-subtle)] flex gap-6">
                     <button className="flex items-center text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Download className="w-4 h-4 mr-2" /> E-Certificate
                     </button>
                     <Link href={`/events/${race.eventId}/leaderboard`} className="flex items-center text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                        <Trophy className="w-4 h-4 mr-2" /> View Leaderboard
                     </Link>
                  </div>
               </div>
            </div>
          ))}

          {history.length === 0 && (
             <div className="p-10 border border-dashed border-[var(--border-subtle)] rounded-3xl text-center text-[var(--text-secondary)]">
                You have no past race results.
             </div>
          )}
        </div>

      </div>
    </div>
  )
}
