import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Users, DollarSign, Calendar, ArrowRight, TrendingUp, MoreVertical, Edit2, Copy, Trash2, Search, Filter, Activity, Clock } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  const recentRegistrations = await prisma.registration.findMany({
    where: {
      category: {
        event: {
          organizerId: organizer.id
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { user: true, category: { include: { event: true } } }
  })

  let totalRegistrations = 0
  let totalRevenue = 0
  let activeEvents = 0

  const enrichedEvents = events.map((event: any) => {
    let eventReg = 0
    let eventRev = 0
    event.categories.forEach((cat: any) => {
      const count = cat.registrations.length
      eventReg += count
      eventRev += count * cat.price
    })
    totalRegistrations += eventReg
    totalRevenue += eventRev
    
    // Status logic
    const isEventPast = isPast(new Date(event.date));
    const status = isEventPast ? 'Completed' : 'Published';
    if (!isEventPast) activeEvents++;

    return { ...event, eventReg, eventRev, status }
  })

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Organizer Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Dashboard Overview
            </h1>
          </div>
          <Link href="?create=true">
            <button className="px-6 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-sm hover:bg-[var(--accent-dim)] transition-colors shrink-0">
              + New Event
            </button>
          </Link>
        </div>

        {/* Top Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--border-accent)] transition-all flex flex-col justify-between h-48">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="flex justify-between items-start">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Total Revenue</div>
               <TrendingUp className="w-6 h-6 text-[var(--accent)] opacity-80" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-1">₱{totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center">
                 Overall earnings
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--border-accent)] transition-all flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Total Registrations</div>
               <Users className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-1">{totalRegistrations.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center">
                 Across all events
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--border-accent)] transition-all flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Active Events</div>
               <Calendar className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-1">{activeEvents}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center">
                 Currently running
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2">
            
            {/* Analytics Chart Placeholder */}
            <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] mb-8 flex flex-col justify-center items-center h-64 relative overflow-hidden group hover:border-[var(--border-accent)] transition-all">
                <Activity className="w-12 h-12 text-[var(--border-subtle)] mb-4 group-hover:text-[var(--accent)] transition-colors" />
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-wider text-sm">Revenue Trends (Coming Soon)</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">Your Events</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="pl-9 pr-4 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full text-sm focus:outline-none focus:border-[var(--accent)] transition-colors w-full sm:w-48 placeholder:text-[var(--text-secondary)]"
                  />
                </div>
                <button className="p-2 border border-[var(--border-subtle)] rounded-full hover:bg-[var(--bg-panel-raised)] transition-colors text-[var(--text-secondary)]">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrichedEvents.map((event: any) => (
                <div key={event.id} className="flex flex-col p-6 bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all">
                    
                    <div className="flex justify-between items-start mb-4">
                      {event.status === 'Published' && <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-md">Published</span>}
                      {event.status === 'Completed' && <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md">Completed</span>}
                      {event.status === 'Draft' && <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider rounded-md">Draft</span>}
                      
                      <div className="flex space-x-1">
                        <Link href={`/dashboard/events/${event.id}`}>
                           <button className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                        </Link>
                        <button className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-raised)] rounded transition-colors"><Copy className="w-4 h-4" /></button>
                        <button className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold uppercase tracking-tight mb-3 flex-1">
                      <Link href={`/dashboard/events/${event.id}`} className="hover:text-[var(--accent)] transition-colors">
                        {event.name}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-col space-y-2 text-sm text-[var(--text-secondary)] mb-4">
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(event.date), 'MMM do, yyyy')}</span>
                      <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> {event.eventReg} Runners</span>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                       <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Gross Revenue</span>
                       <span className="text-[var(--accent)] font-bold">₱{event.eventRev.toLocaleString()}</span>
                    </div>
                </div>
              ))}
              {enrichedEvents.length === 0 && (
                <div className="col-span-1 md:col-span-2 p-10 border border-dashed border-[var(--border-subtle)] rounded-2xl text-center text-[var(--text-secondary)]">
                  No events managed yet. Click "New Event" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Right Column */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-[var(--bg-panel)] rounded-3xl p-6 border border-[var(--border-subtle)]">
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-[var(--accent)]" /> Recent Activity
                </h3>
                
                <div className="space-y-6">
                  {recentRegistrations.map((reg: any) => (
                    <div key={reg.id} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center mr-3 shrink-0 border border-[var(--border-subtle)]">
                        <Users className="w-3 h-3 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-primary)]"><span className="font-bold">{reg.user.name}</span> registered for <span className="text-[var(--accent)]">{reg.category.event.name}</span></p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> {format(new Date(reg.createdAt), 'MMM do, h:mm a')}</p>
                      </div>
                    </div>
                  ))}
                  {recentRegistrations.length === 0 && (
                    <div className="text-sm text-[var(--text-secondary)] italic">
                      No recent activity.
                    </div>
                  )}
                </div>
                
                <button className="w-full mt-6 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)] rounded-lg">
                  View All Activity
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
