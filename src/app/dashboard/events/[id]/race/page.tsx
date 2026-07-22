import { Activity, QrCode, Timer, Plus, Trophy } from 'lucide-react'
import { ScanQRModalButton } from '@/components/ScanQRModalButton'
import { ManualEntryModalButton } from '@/components/ManualEntryModalButton'
import prisma from '@/lib/prisma'
import { differenceInSeconds } from 'date-fns'
import { LiveRefresh } from './LiveRefresh'

// Helper to format seconds to HH:MM:SS
function formatDuration(totalSeconds: number) {
  if (totalSeconds < 0) return '00:00:00'
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default async function RaceMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch event and categories
  const event = await prisma.event.findUnique({
    where: { id },
    include: { categories: true }
  })

  if (!event) return <div>Event not found</div>

  // Fetch all registrations and results for this event
  const registrations = await prisma.registration.findMany({
    where: { category: { eventId: id } },
    include: { user: true, category: true, raceResults: true }
  })

  const checkedInRegistrations = registrations.filter(r => r.checkedInAt !== null)
  
  // Extract all race results mapped with user data
  let allResults = []
  for (const reg of checkedInRegistrations) {
    if (reg.raceResults.length > 0) {
      // Assuming one race result per registration for now
      const result = reg.raceResults[0]
      const durationSeconds = differenceInSeconds(result.timestamp, event.date)
      allResults.push({
        id: result.id,
        bib: reg.bibNumber || 'N/A',
        name: reg.user.name,
        category: reg.category.distance,
        categoryId: reg.category.id,
        finishTime: result.timestamp,
        durationSeconds,
        durationFormatted: formatDuration(durationSeconds)
      })
    }
  }

  // Calculate Leaderboards (Top 3 per category)
  const leaderboards = event.categories.map(category => {
    const categoryResults = allResults
      .filter(r => r.categoryId === category.id)
      .sort((a, b) => a.durationSeconds - b.durationSeconds) // fastest first

    // Assign ranks
    categoryResults.forEach((r, idx) => {
      (r as any).rank = idx + 1
    })

    return {
      category,
      results: categoryResults.slice(0, 3) // Top 3
    }
  })

  // Recent Finishers (Overall, sorted by finish time desc)
  const recentFinishers = [...allResults]
    .sort((a, b) => b.finishTime.getTime() - a.finishTime.getTime())
    .slice(0, 10)

  // Top level stats
  const eventStartedSeconds = differenceInSeconds(new Date(), event.date)
  const startedFormatted = formatDuration(eventStartedSeconds)
  const totalScanned = allResults.length
  const remainingRunners = checkedInRegistrations.length - totalScanned

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto space-y-12">
      <LiveRefresh intervalMs={5000} />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Live Race Monitor
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Race Tracking
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <ScanQRModalButton mode="finish-line" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Started</span>
              <Timer className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div className="text-4xl font-black mb-1">{eventStartedSeconds > 0 ? startedFormatted : '00:00:00'}</div>
            <div className="text-xs text-[var(--text-secondary)]">Race Time Elapsed</div>
         </div>
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Scanned</span>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-black mb-1">{totalScanned}</div>
            <div className="text-xs text-[var(--text-secondary)]">Finishers Recorded</div>
         </div>
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Remaining</span>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-4xl font-black mb-1">{remainingRunners}</div>
            <div className="text-xs text-[var(--text-secondary)]">Runners On Course</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold uppercase tracking-tight">Recent Finishers</h3>
               <ManualEntryModalButton eventId={id} />
            </div>
            
            <div className="space-y-4">
              {recentFinishers.length === 0 && (
                <div className="text-center p-8 text-[var(--text-secondary)] border border-dashed border-[var(--border-subtle)] rounded-xl">
                  No finishers yet. Waiting for scanners...
                </div>
              )}
              {recentFinishers.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl">
                  <div className="flex items-center">
                     {f.rank === 1 ? (
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mr-4 border border-yellow-500/20">
                          <Trophy className="w-5 h-5" />
                        </div>
                     ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-panel)] text-[var(--text-secondary)] flex items-center justify-center mr-4 border border-[var(--border-subtle)] font-bold">
                          #{f.rank}
                        </div>
                     )}
                     <div>
                       <div className="font-bold flex items-center">
                         {f.name} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">{f.category}</span>
                       </div>
                       <div className="text-sm text-[var(--text-secondary)] font-mono mt-1">Bib: {f.bib}</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black font-mono">{f.durationFormatted}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Finish Time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center text-[var(--accent)]">
              <Trophy className="w-4 h-4 mr-2" /> Top Leaders
            </h3>
            
            <div className="space-y-6">
              {leaderboards.map((lb) => (
                <div key={lb.category.id}>
                  <h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 border-b border-[var(--border-subtle)] pb-2">
                    {lb.category.distance} Category
                  </h4>
                  <div className="space-y-2">
                    {lb.results.length === 0 && (
                      <div className="text-sm text-[var(--text-secondary)] italic">Awaiting Finishers...</div>
                    )}
                    {lb.results.map((r: any) => (
                      <div key={r.id} className="flex justify-between text-sm">
                        <span className="text-[var(--text-primary)]">{r.rank}. {r.name}</span>
                        <span className="font-mono text-[var(--accent)]">{r.durationFormatted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
