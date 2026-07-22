import Link from 'next/link'
import { Activity, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)] overflow-hidden relative">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-[var(--accent)] rounded-full blur-[200px] opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,255,0,0.1)]">
          <Activity className="w-10 h-10 text-[var(--accent)]" />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter text-[var(--text-primary)] mb-4">
          404
        </h1>
        <p className="uppercase text-sm md:text-base tracking-[0.2em] text-[var(--accent)] font-bold mb-8">
          Off The Beaten Path
        </p>
        
        <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-12">
          It looks like you've wandered off course. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-[#0A0A0A] font-bold uppercase tracking-wider text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Link>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-[var(--border-subtle)] hover:border-[var(--text-primary)] text-[var(--text-primary)] font-bold uppercase tracking-wider text-sm transition-all"
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
      
      {/* Decorative track lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none">
         <svg className="w-full h-full" preserveAspectRatio="none">
           <path d="M-10,120 Q50,150 100,80 T250,90 T350,40 T500,80 T750,40 T900,100 T1200,60" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="10 10" />
         </svg>
      </div>

    </div>
  )
}
