'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

export function PublicNav() {
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/runner')) {
    return null
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-[var(--accent)] group">
          <span className="font-black text-xl tracking-tighter uppercase">Stryder</span>
        </Link>
        <div className="flex items-center space-x-6 sm:space-x-8">
          <Link href="/events" className="text-sm font-bold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
            Events
          </Link>
          <Link href="/dashboard" className="text-sm font-bold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
            Organizer
          </Link>
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-bold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
