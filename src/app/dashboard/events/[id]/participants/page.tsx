import prisma from '@/lib/prisma'
import { Users, Search, Download, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params
  
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      categories: {
        include: {
          registrations: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  if (!event) {
    return <div className="p-10 text-[var(--text-secondary)]">Event not found</div>
  }

  // Flatten participants
  const participants = event.categories.flatMap(cat => 
    cat.registrations.map(reg => ({
      ...reg,
      categoryName: cat.distance,
      distance: cat.distance
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            {event.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Participants
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button className="flex items-center px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 w-full md:w-96">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
            <input 
              type="text" 
              placeholder="Search by name, bib, or email..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm font-medium hover:border-[var(--border-accent)] transition-all text-[var(--text-secondary)]">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="pb-3 px-4 font-bold">Runner</th>
                <th className="pb-3 px-4 font-bold">Category</th>
                <th className="pb-3 px-4 font-bold">Bib No.</th>
                <th className="pb-3 px-4 font-bold">Status</th>
                <th className="pb-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {participants.map((p, i) => (
                <tr key={p.id} className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center mr-3 border border-[var(--border-subtle)]">
                        <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <div className="font-bold">{p.user?.name || 'Anonymous User'}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">{p.user?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--accent)]">{p.categoryName}</td>
                  <td className="py-4 px-4 font-mono text-[var(--text-secondary)]">
                     {String(1000 + i)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-md">Confirmed</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-[var(--text-secondary)] hover:text-[var(--accent)] text-xs font-bold uppercase tracking-wider">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[var(--text-secondary)] border-none">
                    No participants registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
