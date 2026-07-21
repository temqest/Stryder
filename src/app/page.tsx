import Link from 'next/link'
import { ArrowRight, Flame, MapPin, Trophy } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
      
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[var(--accent)] rounded-full blur-[160px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Bento Grid Top Section: Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Hero Card (60%) */}
          <div className="lg:col-span-8 bg-[var(--bg-panel)] rounded-3xl p-10 lg:p-16 border border-[var(--border-subtle)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-[0.05] group-hover:opacity-10 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-6 block">
                The Ultimate Racing Platform
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] text-[var(--text-primary)] mb-8">
                Run Your <br /> Best Race.
              </h1>
              <p className="text-[var(--text-secondary)] text-lg max-w-md mb-10 leading-relaxed">
                Discover local marathons, track your performance, and secure your spot at the starting line. Built for runners who demand more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/events"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-[#0A0A0A] font-bold transition-all"
                >
                  Find a Race
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-[var(--border-subtle)] hover:border-[var(--text-primary)] text-[var(--text-primary)] font-bold transition-all"
                >
                  Organizer Login
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Hero Card (40%) */}
          <div className="lg:col-span-4 bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-panel-raised)] flex items-center justify-center mb-6 border border-[var(--border-subtle)]">
                <Flame className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">Live Heatmaps</h3>
              <p className="text-[var(--text-secondary)]">Track real-time runner density and course difficulty before you register.</p>
            </div>
            
            {/* Decorative Map Graphic */}
            <div className="mt-8 h-48 w-full bg-[var(--bg-panel-raised)] rounded-2xl border border-[var(--border-subtle)] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <path d="M-10,120 Q50,150 100,80 T250,90 T350,40" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="6 6" className="opacity-80" />
               </svg>
               <div className="absolute top-[80px] left-[100px] w-3 h-3 bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent)]" />
            </div>
          </div>
        </div>

        {/* Bento Grid Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Stat Card 1 */}
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
            <Trophy className="w-8 h-8 text-[var(--text-secondary)] mb-6" />
            <div className="text-5xl font-black text-[var(--text-primary)] mb-2">12.4k</div>
            <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Registered Runners</div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
            <MapPin className="w-8 h-8 text-[var(--text-secondary)] mb-6" />
            <div className="text-5xl font-black text-[var(--text-primary)] mb-2">48</div>
            <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Active Courses</div>
          </div>

          {/* Highlight Card */}
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-accent)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent)] opacity-[0.02]" />
            <span className="uppercase text-[11px] tracking-[0.1em] text-[var(--accent)] font-bold mb-4 block">
              Featured Event
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-4">
              Midnight City Run '26
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[var(--accent)] text-[#0A0A0A] text-xs font-bold rounded-full">21K</span>
              <span className="px-3 py-1 bg-[var(--bg-panel-raised)] text-[var(--text-primary)] text-xs font-bold rounded-full border border-[var(--border-subtle)]">10K</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
