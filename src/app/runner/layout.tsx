import { RunnerTopBar } from '@/components/RunnerTopBar'
import { RunnerSidebar } from '@/components/RunnerSidebar'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RunnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const runner = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })
  
  if (!runner || runner.role !== 'RUNNER') {
    // Or redirect to signup if they don't exist
    redirect('/signup')
  }
  
  let nextRegistration = null
  if (runner) {
    const upcoming = await prisma.registration.findMany({
      where: { 
        userId: runner.id,
        status: 'CONFIRMED',
        category: { event: { date: { gte: new Date() } } }
      },
      include: { category: { include: { event: true } } },
      orderBy: { category: { event: { date: 'asc' } } },
      take: 1
    })
    nextRegistration = upcoming[0] || null
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-base)] overflow-hidden">
      <RunnerTopBar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <RunnerSidebar nextRegistration={nextRegistration} />
        <main className="flex-1 w-full min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
