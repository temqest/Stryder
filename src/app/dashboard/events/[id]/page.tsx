import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, QrCode, Download, Search } from 'lucide-react'
import { format } from 'date-fns'

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
            <button className="px-6 py-3 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold uppercase tracking-wider text-xs hover:border-[var(--text-primary)] transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <button className="px-6 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs hover:bg-[var(--accent-dim)] transition-colors flex items-center shadow-[0_0_15px_var(--border-accent)]">
              <QrCode className="w-4 h-4 mr-2" /> Scan QR
            </button>
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

        {/* Registrants Table */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden">
          
          {/* Table Header / Toolbar */}
          <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-panel-raised)]">
            <h3 className="font-black uppercase tracking-tight text-xl">Participant List</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search runners..." className="pl-10 pr-4 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-colors w-64" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] bg-[var(--bg-base)]">
                  <th className="p-6">Runner Name</th>
                  <th className="p-6">Distance</th>
                  <th className="p-6">Registration ID</th>
                  <th className="p-6">Shirt Size</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {allRegistrations.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-[var(--bg-panel-raised)] transition-colors">
                    <td className="p-6 font-bold">{reg.user.name} <br/><span className="text-[var(--text-secondary)] text-xs font-normal">{reg.user.email}</span></td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full text-xs font-bold uppercase tracking-wider">{reg.categoryDistance}</span>
                    </td>
                    <td className="p-6 font-mono text-[var(--text-secondary)] text-xs">{reg.id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-6 font-bold">{reg.user.shirtSize || 'N/A'}</td>
                    <td className="p-6">
                      <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-wider flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)] mr-2 shadow-[0_0_5px_var(--accent)]"></div>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-6 text-right text-[var(--text-secondary)]">{format(new Date(reg.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
                {allRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[var(--text-secondary)]">
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  )
}
