'use client'

import Link from 'next/link'
import { Activity, Search, Bell, Settings, User } from 'lucide-react'

export function DashboardTopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[var(--bg-panel)] border-b border-[var(--border-subtle)] flex items-center justify-between px-6">
      <div className="flex items-center space-x-2 text-[var(--text-primary)] group">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <Activity className="w-4 h-4 text-[#0A0A0A]" />
        </div>
        <span className="font-black text-xl tracking-tighter uppercase">Stryder</span>
        <span className="text-sm font-bold tracking-wider text-[var(--text-secondary)] uppercase ml-2 hidden sm:block">Dashboard</span>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <button className="hidden sm:flex items-center px-4 py-2 rounded-full border border-[var(--border-subtle)] text-xs font-bold uppercase tracking-wider hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
          Feedback
        </button>
        <div className="hidden md:flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full px-4 py-1.5 focus-within:border-[var(--accent)] transition-colors">
          <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm focus:outline-none text-[var(--text-primary)] w-48" />
        </div>
        <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-panel)]"></span>
        </button>
        <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors hidden sm:block">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center pl-2 sm:pl-4 border-l border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
            <User className="w-4 h-4" />
          </div>
          <div className="ml-3 hidden sm:block">
            <p className="text-xs font-bold text-[var(--text-primary)]">Admin</p>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">demo@admin.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
