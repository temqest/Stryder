import prisma from '@/lib/prisma'
import { Shield } from 'lucide-react'
import TeamList from '@/components/TeamList'
import InviteMemberModal from '@/components/InviteMemberModal'

export const dynamic = 'force-dynamic'

// Mocking session since real auth isn't wired up yet in this demo
const getSession = async () => ({ user: { id: 'admin-123' } })

export default async function TeamPage() {
  const session = await getSession()
  
  // Ensure the owner exists in DB (for demo purposes)
  const owner = await prisma.stryderUser.upsert({
    where: { id: session.user.id },
    update: {},
    create: {
      id: session.user.id,
      name: 'Demo Admin',
      email: 'admin@stryder.com',
      role: 'ORGANIZER'
    }
  })

  const teamMembers = await prisma.teamMember.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  // Format the data for the client component
  const membersData = teamMembers.map(m => ({
    id: m.id,
    email: m.email,
    role: m.role,
    status: m.status,
    userId: m.userId
  }))

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Access Control
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Team & Staff
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <InviteMemberModal />
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-panel-raised)]">
           <h3 className="text-lg font-bold uppercase tracking-tight flex items-center">
             <Shield className="w-5 h-5 mr-3 text-[var(--accent)]" /> Active Members
           </h3>
           <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
             Manage who has access to your organizer dashboard. Assign specific roles like 'Scanner' to volunteers for race day QR scanning, or 'Manager' for full event editing access.
           </p>
        </div>
        
        <TeamList initialMembers={membersData} ownerEmail={owner.email} />
      </div>
      
    </div>
  )
}
