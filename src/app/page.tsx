import Link from 'next/link'
import { ArrowRight, Flame, MapPin, Trophy, Activity, Flag } from 'lucide-react'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      
      {/* Hero Section: Full bleed with background image */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/racing_hero_bg.png" 
            alt="Runner sprinting at midnight" 
            fill 
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            priority
          />
          {/* Gradients to blend image into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-[var(--bg-base)] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-transparent to-transparent opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          
          <div className="md:w-3/5 text-left pt-20">
            {/* Teko font for huge impact */}
            <h1 className="font-racing text-7xl md:text-[9rem] font-bold uppercase tracking-tight leading-[0.8] text-[var(--text-primary)] mb-6 drop-shadow-2xl">
              OUTPACE <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white">YOUR LIMITS.</span>
            </h1>
            
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
              Discover local marathons, track your performance, and secure your spot at the starting line. Built for runners who demand more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/events"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-[var(--accent)] text-[#0A0A0A] font-black uppercase tracking-widest overflow-hidden skew-x-[-10deg] hover:bg-white transition-colors duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                <span className="skew-x-[10deg] flex items-center">
                  Find a Race
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link 
                href="/login"
                className="group inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-[var(--border-subtle)] text-[var(--text-primary)] font-black uppercase tracking-widest skew-x-[-10deg] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                <span className="skew-x-[10deg]">Organizer Login</span>
              </Link>
            </div>
          </div>
          
          {/* Floating stat card */}
          <div className="hidden md:flex md:w-2/5 justify-end">
             <div className="bg-black/40 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl p-6 w-72 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <Flame className="w-8 h-8 text-[var(--accent)]" />
                  <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Live Stat</span>
                </div>
                <div className="font-racing text-5xl text-white leading-none mb-1">12,492</div>
                <div className="text-sm text-[var(--text-secondary)] uppercase tracking-widest font-bold">Active Runners</div>
                
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-[var(--text-secondary)]">Last 24h</span>
                     <span className="text-green-400 font-bold">+342 Registrations</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Section - Asymmetrical */}
      <section className="py-24 px-6 relative w-full max-w-7xl mx-auto overflow-visible">
         <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />
         
         <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-transparent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl p-10 md:p-14 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                 <MapPin className="w-12 h-12 text-[var(--accent)] mb-8" />
                 <h2 className="font-racing text-5xl uppercase leading-none mb-4">Explore <br/> Every Course</h2>
                 <p className="text-[var(--text-secondary)] text-lg">Detailed route maps, elevation profiles, and real-time runner heatmaps. Know what you're up against before you even tie your shoes.</p>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-8">
               <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl p-8 transform translate-x-0 md:translate-x-8 hover:-translate-x-2 transition-transform duration-500">
                  <div className="flex items-center mb-4">
                     <Trophy className="w-8 h-8 text-white mr-4" />
                     <h3 className="font-racing text-3xl uppercase tracking-wider">Compete & Conquer</h3>
                  </div>
                  <p className="text-[var(--text-secondary)]">Secure your bib, track your official times, and climb the leaderboards.</p>
               </div>

               <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl p-8 transform translate-x-0 md:-translate-x-4 hover:translate-x-2 transition-transform duration-500">
                  <div className="flex items-center mb-4">
                     <Flag className="w-8 h-8 text-white mr-4" />
                     <h3 className="font-racing text-3xl uppercase tracking-wider">Host the Best</h3>
                  </div>
                  <p className="text-[var(--text-secondary)]">Organizers get full control over ticketing, categories, and live race-day monitoring.</p>
               </div>
            </div>
            
         </div>
      </section>

    </div>
  )
}
