import { DashboardTopBar } from '@/components/DashboardTopBar'
import { OrganizerSidebar } from '@/components/OrganizerSidebar'
import { CreateEventModal } from '@/components/CreateEventModal'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const organizer = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })
  
  if (!organizer || organizer.role !== 'ORGANIZER') {
    redirect('/login')
  }

  const events = await prisma.event.findMany({
    where: { organizerId: organizer.id },
    select: { id: true, name: true },
    orderBy: { date: 'asc' }
  })

  // Since this is a single organizer portal, role is OWNER for now
  const role = 'OWNER'

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
