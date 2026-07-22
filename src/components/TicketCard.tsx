'use client'

import { Ticket, Calendar, MapPin, X } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useState } from 'react'
import { format } from 'date-fns'

interface TicketCardProps {
  registration: any;
  runnerName: string;
  isActive: boolean;
}

export function TicketCard({ registration, runnerName, isActive }: TicketCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className={`bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-${isActive ? 'accent' : 'subtle'})] relative overflow-hidden flex flex-col ${!isActive ? 'opacity-75 hover:opacity-100 transition-opacity' : ''}`}>
         <div className="p-8 pb-6 border-b border-dashed border-[var(--border-subtle)] relative">
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[var(--bg-base)] rounded-full border-r border-t border-[var(--border-subtle)]"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[var(--bg-base)] rounded-full border-l border-t border-[var(--border-subtle)]"></div>
            
            <div className="flex justify-between items-start mb-6">
               <span className={`px-3 py-1 ${isActive ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' : 'bg-[var(--bg-panel-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'} text-xs font-bold uppercase tracking-wider rounded-full`}>
                 {isActive ? 'Active' : 'Upcoming'}
               </span>
               <Ticket className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{registration.category.event.name}</h2>
            <div className="flex flex-col space-y-2 text-[var(--text-secondary)] text-sm mb-6">
               <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(registration.category.event.date), 'MMM do, yyyy • h:mm a')}</span>
               <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {registration.category.event.location || 'TBA'}</span>
            </div>
         </div>
         <div className="p-8 pt-6 flex items-center justify-between bg-[var(--bg-panel-raised)]">
            <div>
               <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1">Category / Bib</div>
               <div className="font-black text-xl text-[var(--text-primary)]">{registration.category.distance} • <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}>{registration.bibNumber || 'TBD'}</span></div>
               <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-4 mb-1">Runner</div>
               <div className="font-bold text-sm text-[var(--text-primary)]">{runnerName}</div>
            </div>
            
            {isActive ? (
               <div 
                 className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(205,255,0,0.2)]"
                 onClick={() => setIsModalOpen(true)}
               >
                 <QRCode value={registration.id} size={80} />
               </div>
            ) : (
               <div className="w-24 h-24 bg-[var(--bg-base)] rounded-lg p-2 flex items-center justify-center border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] text-center">QR Ready Near Event</span>
               </div>
            )}
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 max-w-sm w-full relative flex flex-col items-center border border-[var(--border-subtle)]">
            <button 
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-center mt-2">{registration.category.event.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-8 text-center">{registration.category.distance} • {registration.bibNumber}</p>
            
            <div className="bg-white p-4 rounded-xl inline-block shadow-[0_0_50px_rgba(205,255,0,0.2)]">
              <QRCode value={registration.id} size={256} />
            </div>
            
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] mt-8 text-center leading-relaxed">
              Scan this at the event entrance or baggage drop.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
