'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MapPin, 
  Award, 
  Settings, 
  Ticket, 
  Activity,
  Menu,
  X,
  Wallet,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function OrganizerSidebar({ events, role = 'OWNER' }: { events: { id: string; name: string }[], role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/login')
    router.refresh()
  }

  // Extract the event ID if we are deep inside an event route
  const eventIdMatch = pathname?.match(/\/dashboard\/events\/([^/]+)/)
  const eventId = eventIdMatch ? eventIdMatch[1] : null

  const allMainLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Team & Staff', href: '/dashboard/team', icon: Users },
    { name: 'Scanner', href: '/dashboard/scanner', icon: Activity },
  ]
  const mainLinks = role === 'SCANNER' 
    ? allMainLinks.filter(l => l.name === 'Scanner')
    : allMainLinks;

  const eventLinks = eventId ? [
    { name: 'Event Info', href: `/dashboard/events/${eventId}`, icon: Settings },
    { name: 'Participants', href: `/dashboard/events/${eventId}/participants`, icon: Users },
    { name: 'Race Monitor', href: `/dashboard/events/${eventId}/race`, icon: Activity },
    // { name: 'Bib Design', href: `/dashboard/events/${eventId}/bib-design`, icon: Ticket },
  ] : []

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-md text-[var(--text-secondary)]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[var(--bg-panel)] border-r border-[var(--border-subtle)] transform transition-transform duration-300 ease-in-out pt-16
        md:translate-x-0 md:static md:h-full md:pt-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto p-4 flex flex-col custom-scrollbar">
          
          <div className="mb-8 px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
              Main Menu
            </h2>
            <div className="space-y-1">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== '/dashboard' && link.href !== '/dashboard/events' && pathname?.startsWith(link.href))
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-[var(--accent)] text-[#0A0A0A]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <link.icon className="w-4 h-4 mr-3 shrink-0" />
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mb-8 px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
              Your Events
            </h2>
            <div className="space-y-1 border-l border-[var(--border-subtle)] ml-2 pl-2">
              {events.map((event) => {
                 const isEventActive = eventId === event.id
                 return (
                  <div key={event.id} className="mb-1">
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        isEventActive 
                          ? 'bg-[var(--bg-panel-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)]' 
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)] border border-transparent'
                      }`}
                    >
                      <Calendar className="w-3 h-3 mr-3 shrink-0" />
                      <span className="truncate">{event.name}</span>
                    </Link>
                    
                    {/* Render sub-links if this is the active event */}
                    {isEventActive && (
                      <div className="mt-1 ml-4 border-l border-[var(--border-subtle)] pl-2 space-y-1">
                        {eventLinks.map((link) => {
                          const isActive = pathname === link.href
                          return (
                            <Link
                              key={link.name}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                isActive 
                                  ? 'text-[var(--accent)] bg-[var(--accent)]/5' 
                                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              <link.icon className="w-3 h-3 mr-2 shrink-0" />
                              {link.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                 )
              })}
              {events.length === 0 && (
                 <div className="text-xs text-[var(--text-secondary)] px-3 py-2">No events found.</div>
              )}
            </div>
          </div>
          <div className="flex-1" />
          
          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] px-2 pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-3 shrink-0" />
              Log Out
            </button>
          </div>
          
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
