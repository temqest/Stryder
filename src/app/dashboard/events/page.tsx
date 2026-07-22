import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, Users, ArrowRight, Search, Filter, Activity, Plus } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AllEventsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    redirect('/login')
  }

  const organizer = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })

  if (!organizer || organizer.role !== 'ORGANIZER') {
    redirect('/login')
  }

  const events = await prisma.event.findMany({
    where: { organizerId: organizer.id },
    include: {
      categories: {
        include: {
          registrations: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })

  const enrichedEvents = events.map((event: any) => {
    let eventReg = 0
    let eventRev = 0
    event.categories.forEach((cat: any) => {
      const count = cat.registrations.length
      eventReg += count
      eventRev += count * cat.price
    })
    
    const isEventPast = isPast(new Date(event.date))
    const status = isEventPast ? 'Completed' : 'Published'

    return { ...event, eventReg, eventRev, status }
  })

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Master List
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            All Events
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Link href="?create=true">
            <button className="flex items-center px-6 py-3 bg-[var(--accent)] text-[#0A0A0A] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all">
              <Plus className="w-5 h-5 mr-2" /> Create Event
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 w-full md:w-96">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
            <input 
              type="text" 
              placeholder="Search events..." 
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
                <th className="pb-3 px-4 font-bold">Event Name</th>
                <th className="pb-3 px-4 font-bold">Date</th>
                <th className="pb-3 px-4 font-bold">Status</th>
                <th className="pb-3 px-4 font-bold">Registrations</th>
                <th className="pb-3 px-4 font-bold">Revenue</th>
                <th className="pb-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {enrichedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
                  <td className="py-4 px-4 font-bold text-[var(--text-primary)]">
                    <Link href={`/dashboard/events/${event.id}`} className="hover:text-[var(--accent)] transition-colors">
                      {event.name}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-secondary)]">
                     <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(event.date), 'MMM do, yyyy')}</span>
                  </td>
                  <td className="py-4 px-4">
                     {event.status === 'Published' && <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-md">Published</span>}
                     {event.status === 'Completed' && <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md">Completed</span>}
                     {event.status === 'Draft' && <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider rounded-md">Draft</span>}
                  </td>
                  <td className="py-4 px-4">
                     <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-[var(--text-secondary)]" /> {event.eventReg}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--accent)]">
                     ₱{event.eventRev.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link href={`/dashboard/events/${event.id}`}>
                      <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider bg-[var(--bg-base)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all">
                        Manage
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {enrichedEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--text-secondary)] border-none">
                    No events found.
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
