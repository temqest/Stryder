'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Ticket,
  Clock,
  Compass,
  Wallet,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { differenceInDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface RunnerSidebarProps {
  nextRegistration?: any;
}

export function RunnerSidebar({ nextRegistration }: RunnerSidebarProps) {
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

  const mainLinks = [
    { name: 'Dashboard', href: '/runner', icon: LayoutDashboard },
    { name: 'My Tickets', href: '/runner/tickets', icon: Ticket },
    { name: 'Past Races', href: '/runner/history', icon: Clock },
    { name: 'Discover', href: '/runner/discover', icon: Compass },
  ]

  const daysToGo = nextRegistration ? differenceInDays(new Date(nextRegistration.category.event.date), new Date()) : null

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
          
          <div className="mb-8 px-2 mt-4 md:mt-0">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
              Runner Menu
            </h2>
            <div className="space-y-1">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'bg-[var(--accent)] text-[#0A0A0A] shadow-[0_0_15px_rgba(205,255,0,0.1)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-[#0A0A0A]' : ''}`} />
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex-1" />
          
          {/* Quick Stats or Info Card */}
          {nextRegistration && (
            <Link href="/runner/tickets" onClick={() => setIsOpen(false)}>
              <div className="mb-6 px-4 py-4 rounded-2xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors cursor-pointer group">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2 group-hover:text-[var(--accent)] transition-colors">Next Race</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">{nextRegistration.category.event.name}</p>
                <p className="text-xs text-[var(--accent)] mt-1 font-bold">
                  {daysToGo !== null && daysToGo > 0 ? `In ${daysToGo} Days` : 'Today!'}
                </p>
              </div>
            </Link>
          )}

          <div className="pt-4 border-t border-[var(--border-subtle)] px-2 pb-4">
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
