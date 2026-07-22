import { Activity, QrCode, Timer, Plus, Trophy } from 'lucide-react'

import { ScanQRModalButton } from '@/components/ScanQRModalButton'

export default async function RaceMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto space-y-12">
      
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
          <ScanQRModalButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Started</span>
              <Timer className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div className="text-4xl font-black mb-1">02:45:10</div>
            <div className="text-xs text-[var(--text-secondary)]">Race Time Elapsed</div>
         </div>
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Scanned</span>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-black mb-1">142</div>
            <div className="text-xs text-[var(--text-secondary)]">Finishers Recorded</div>
         </div>
         <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Remaining</span>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-4xl font-black mb-1">858</div>
            <div className="text-xs text-[var(--text-secondary)]">Runners On Course</div>
         </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold uppercase tracking-tight">Recent Finishers</h3>
               <button className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider flex items-center">
                 <Plus className="w-3 h-3 mr-1" /> Manual Entry
               </button>
            </div>
            
            <div className="space-y-4">
              {/* Dummy data */}
              {[
                { bib: '1042', time: '00:45:12', cat: '10K', rank: 1, name: 'John Doe' },
                { bib: '1011', time: '00:46:05', cat: '10K', rank: 2, name: 'Alex Smith' },
                { bib: '2055', time: '01:02:10', cat: '21K', rank: 1, name: 'Sarah Connor' },
              ].map((f) => (
                <div key={f.bib} className="flex items-center justify-between p-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl">
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
                         {f.name} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">{f.cat}</span>
                       </div>
                       <div className="text-sm text-[var(--text-secondary)] font-mono mt-1">Bib: {f.bib}</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black font-mono">{f.time}</div>
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
              <div>
                <h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 border-b border-[var(--border-subtle)] pb-2">10K Category</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[var(--text-primary)]">1. John Doe</span><span className="font-mono text-[var(--accent)]">45:12</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[var(--text-primary)]">2. Alex Smith</span><span className="font-mono text-[var(--text-secondary)]">46:05</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 border-b border-[var(--border-subtle)] pb-2">21K Category</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[var(--text-primary)]">1. Sarah Connor</span><span className="font-mono text-[var(--accent)]">1:02:10</span></div>
                  <div className="flex justify-between text-sm text-[var(--text-secondary)] italic">Awaiting Finishers...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
