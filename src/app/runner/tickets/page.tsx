import { TicketCard } from '@/components/TicketCard'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MyTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const runner = await prisma.stryderUser.findUnique({ 
    where: { email: user.email || '' } 
  })
  
  if (!runner) redirect('/signup')

  const registrations = await prisma.registration.findMany({
    where: { 
      userId: runner.id,
      status: 'CONFIRMED',
      category: { event: { date: { gte: new Date() } } }
    },
    include: { category: { include: { event: true } } },
    orderBy: { category: { event: { date: 'asc' } } }
  })

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Registrations
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              My Tickets
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {registrations.map((reg, index) => (
             <TicketCard 
               key={reg.id} 
               registration={reg} 
               runnerName={runner.name} 
               isActive={index === 0} 
             />
          ))}

          {registrations.length === 0 && (
             <div className="col-span-1 md:col-span-2 p-10 border border-dashed border-[var(--border-subtle)] rounded-3xl text-center text-[var(--text-secondary)]">
                You have no upcoming tickets.
             </div>
          )}

        </div>

      </div>
    </div>
  )
}
