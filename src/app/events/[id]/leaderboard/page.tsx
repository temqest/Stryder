import { Trophy, Clock, Target, Calendar, MapPin, Download, ChevronLeft, Medal } from 'lucide-react'
import prisma from '@/lib/prisma'
import { format, differenceInSeconds } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { categories: true }
  })

  if (!event) notFound()

  // Fetch results and rank them
  const results = await prisma.raceResult.findMany({
    where: { 
      registration: { category: { eventId: event.id } }
    },
    include: {
      registration: {
        include: {
          user: true,
          category: true
        }
      }
    },
    orderBy: { timestamp: 'asc' } // Earliest finish time first
  })

  // Format and calculate time diff
  const rankedResults = results.map((r, index) => {
    // Assuming event date is start time (in a real app, you'd have an actual start time)
    // For now, we will just format the finish time
    return {
      rank: index + 1,
      name: r.registration.user.name || 'Anonymous Runner',
      bib: r.registration.bibNumber,
      category: r.registration.category.distance,
      time: format(new Date(r.timestamp), 'HH:mm:ss'),
      id: r.id
    }
  })

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <Link href="/runner/history" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
           <ChevronLeft className="w-4 h-4 mr-2" /> Back to History
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Official Results
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              {event.name}
            </h1>
            <div className="flex items-center text-[var(--text-secondary)] mt-4 space-x-4">
               <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(event.date), 'MMMM do, yyyy')}</span>
               <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location || 'TBA'}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] relative overflow-hidden">
          
          <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
             <h2 className="text-xl font-black uppercase tracking-tight">Leaderboard</h2>
             <div className="flex items-center text-[var(--accent)] text-sm font-bold uppercase tracking-wider">
                <Medal className="w-4 h-4 mr-2" /> Top Finishers
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[var(--bg-panel-raised)] text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      <th className="p-4 pl-8 font-bold border-b border-[var(--border-subtle)]">Rank</th>
                      <th className="p-4 font-bold border-b border-[var(--border-subtle)]">Runner</th>
                      <th className="p-4 font-bold border-b border-[var(--border-subtle)]">Bib</th>
                      <th className="p-4 font-bold border-b border-[var(--border-subtle)]">Category</th>
                      <th className="p-4 pr-8 font-bold border-b border-[var(--border-subtle)] text-right">Finish Time</th>
                   </tr>
                </thead>
                <tbody>
                   {rankedResults.map((result) => (
                      <tr key={result.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-raised)] transition-colors">
                         <td className="p-4 pl-8">
                            {result.rank === 1 && <span className="text-yellow-400 font-black text-xl flex items-center"><Trophy className="w-5 h-5 mr-2" /> 1</span>}
                            {result.rank === 2 && <span className="text-gray-400 font-black text-xl">2</span>}
                            {result.rank === 3 && <span className="text-amber-600 font-black text-xl">3</span>}
                            {result.rank > 3 && <span className="text-[var(--text-secondary)] font-bold">{result.rank}</span>}
                         </td>
                         <td className="p-4 font-bold">{result.name}</td>
                         <td className="p-4 text-[var(--text-secondary)] font-mono">{result.bib || 'N/A'}</td>
                         <td className="p-4">
                            <span className="px-2 py-1 bg-[var(--bg-base)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--border-subtle)]">
                              {result.category}
                            </span>
                         </td>
                         <td className="p-4 pr-8 text-right font-black font-mono text-lg">{result.time}</td>
                      </tr>
                   ))}
                   {rankedResults.length === 0 && (
                      <tr>
                         <td colSpan={5} className="p-10 text-center text-[var(--text-secondary)]">
                            No results posted yet for this event.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

        </div>

      </div>
    </div>
  )
}
