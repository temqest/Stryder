import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { format } from 'date-fns'
import { MapPin, Calendar, ArrowLeft, Ticket } from 'lucide-react'

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      user: true,
      category: {
        include: {
          event: true
        }
      }
    }
  })

  if (!registration) return notFound()

  const { event } = registration.category

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/events" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-bold uppercase tracking-wider mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>

        <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden shadow-2xl relative">
          
          {/* Ticket Header */}
          <div className="p-8 text-center border-b border-dashed border-[var(--border-subtle)] relative">
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[var(--bg-base)] rounded-full border-r border-t border-[var(--border-subtle)] rotate-45" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[var(--bg-base)] rounded-full border-l border-t border-[var(--border-subtle)] -rotate-45" />
            
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
              <Ticket className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">{event.name}</h1>
            <div className="inline-block px-3 py-1 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {registration.category.distance} Category
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-8 flex flex-col items-center justify-center bg-white">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <QRCode 
                value={registration.id}
                size={220}
                level="H"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center">
              Scan at Entrance
            </p>
          </div>

          {/* Details Section */}
          <div className="p-8 border-t border-dashed border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Runner Name</p>
                <p className="font-bold text-sm truncate">{registration.user.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Status</p>
                <p className="font-bold text-sm text-[var(--accent)]">CONFIRMED</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center text-sm font-bold text-[var(--text-secondary)]">
                <Calendar className="w-4 h-4 mr-3" />
                {format(new Date(event.date), 'MMMM do, yyyy - h:mm a')}
              </div>
              <div className="flex items-center text-sm font-bold text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4 mr-3" />
                {event.location || "Location TBD"}
              </div>
            </div>
          </div>

        </div>
        
        <p className="text-center text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-8">
          Save this QR code to your phone or print it.
        </p>
      </div>
    </div>
  )
}
