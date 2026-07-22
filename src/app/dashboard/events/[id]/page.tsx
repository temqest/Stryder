import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, QrCode, Download, Search } from 'lucide-react'
import { format } from 'date-fns'
import { EventDetailsForm } from '@/components/EventDetailsForm'
import { ScanQRModalButton } from '@/components/ScanQRModalButton'
import { DeleteEventModal } from '@/components/DeleteEventModal'

export const dynamic = 'force-dynamic'

export default async function EventManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          registrations: {
            include: {
              user: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  if (!event) return notFound()

  // Flatten registrations for the table
  const allRegistrations = event.categories.flatMap((cat: any) => 
    cat.registrations.map((reg: any) => ({
      ...reg,
      categoryDistance: cat.distance,
      pricePaid: cat.price
    }))
  ).sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())

  const totalRegs = allRegistrations.length
  const totalRev = allRegistrations.reduce((sum: number, r: any) => sum + r.pricePaid, 0)

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Navigation */}
        <Link href="/dashboard" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold uppercase tracking-wider text-xs mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">
              {event.name}
            </h1>
            <div className="text-[var(--text-secondary)] font-bold tracking-wider uppercase text-sm">
              Event Management
            </div>
          </div>
          
          <div className="flex gap-4">
            <DeleteEventModal event={event as any} />
            <button className="px-6 py-3 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold uppercase tracking-wider text-xs hover:border-[var(--text-primary)] transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <ScanQRModalButton className="px-6 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs hover:bg-[var(--accent-dim)] transition-colors flex items-center shadow-[0_0_15px_var(--border-accent)]" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <div className="text-3xl font-black mb-1">{totalRegs}</div>
            <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.1em]">Total Runners</div>
          </div>
          <div className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
            <div className="text-3xl font-black text-[var(--accent)] mb-1">₱{totalRev.toLocaleString()}</div>
            <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.1em]">Gross Revenue</div>
          </div>
          {event.categories.map((cat: any) => (
            <div key={cat.id} className="bg-[var(--bg-panel)] rounded-2xl p-6 border border-[var(--border-subtle)]">
              <div className="text-3xl font-black mb-1">{cat.registrations.length} <span className="text-lg text-[var(--text-secondary)]">/ {cat.capacity}</span></div>
              <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.1em]">{cat.distance} Capacity</div>
            </div>
          ))}
        </div>



        <EventDetailsForm event={event as any} />

      </div>
    </div>
  )
}
