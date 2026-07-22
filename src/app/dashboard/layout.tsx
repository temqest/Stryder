import { DashboardTopBar } from '@/components/DashboardTopBar'
import { OrganizerSidebar } from '@/components/OrganizerSidebar'
import { CreateEventModal } from '@/components/CreateEventModal'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const events = await prisma.event.findMany({
    select: { id: true, name: true },
    orderBy: { date: 'asc' }
  })

  const session = { user: { id: 'admin-123', email: 'admin@stryder.com' } } // Mock session
  const isOwner = true // (session.user.id === 'admin-123')
  const teamMember = await prisma.teamMember.findFirst({ where: { email: session.user.email, status: 'ACTIVE' } })
  const role = isOwner ? 'OWNER' : teamMember?.role || 'NONE'

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-base)] overflow-hidden">
      <DashboardTopBar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <OrganizerSidebar events={events} role={role} />
        <main className="flex-1 w-full min-w-0 overflow-y-auto">
          {children}
          <Suspense fallback={null}>
            <CreateEventModal />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
