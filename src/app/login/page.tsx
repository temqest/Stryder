'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Activity, ArrowRight, User, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [role, setRole] = useState<'RUNNER' | 'ORGANIZER'>('RUNNER')
  const supabase = useMemo(() => createClient(), [])

  const handleGoogleLogin = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectPath = role === 'RUNNER' ? '/runner' : '/dashboard'
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/auth/callback?next=${redirectPath}`
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

      <Link href="/" className="mb-10 flex items-center space-x-2 text-[var(--text-primary)] group relative z-10">
        <div className="w-10 h-10 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
          <Activity className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <span className="font-black text-2xl tracking-tighter uppercase">Stryder</span>
      </Link>

      <div className="w-full max-w-md bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">Welcome Back</h1>
          <p className="text-[var(--text-secondary)] text-sm">Log in to manage your events and registrations.</p>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setRole('RUNNER')}
              className={`p-4 rounded-2xl border ${role === 'RUNNER' ? 'bg-[var(--bg-panel-raised)] border-[var(--accent)] shadow-[0_0_15px_rgba(212,255,0,0.05)]' : 'bg-[var(--bg-base)] border-[var(--border-subtle)] hover:border-[var(--text-secondary)]'} transition-all flex flex-col items-center justify-center group`}
            >
              <User className={`w-6 h-6 mb-2 ${role === 'RUNNER' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${role === 'RUNNER' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'}`}>Runner</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ORGANIZER')}
              className={`p-4 rounded-2xl border ${role === 'ORGANIZER' ? 'bg-[var(--bg-panel-raised)] border-[var(--accent)] shadow-[0_0_15px_rgba(212,255,0,0.05)]' : 'bg-[var(--bg-base)] border-[var(--border-subtle)] hover:border-[var(--text-secondary)]'} transition-all flex flex-col items-center justify-center group`}
            >
              <Building2 className={`w-6 h-6 mb-2 ${role === 'ORGANIZER' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${role === 'ORGANIZER' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'}`}>Organizer</span>
            </button>
          </div>
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email Address</label>
            <input 
              required 
              type="email" 
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)] placeholder:text-[var(--border-subtle)]" 
              placeholder="runner@example.com" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
              <Link href="#" className="text-xs font-bold text-[var(--accent)] hover:text-[var(--accent-dim)]">Forgot?</Link>
            </div>
            <input 
              required 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)]" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 mt-6 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold tracking-wide uppercase hover:bg-[var(--accent-dim)] transition-colors flex items-center justify-center"
          >
            Log In
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
            <span className="bg-[var(--bg-panel)] px-4 text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 rounded-xl bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-base)] transition-colors flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[var(--accent)] font-bold hover:text-[var(--accent-dim)]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
