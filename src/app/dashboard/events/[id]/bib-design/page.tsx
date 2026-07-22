import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BibDesigner from '@/components/BibDesigner'

export default async function BibDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          registrations: {
            include: { user: true }
          }
        }
      }
    }
  })

  if (!event) return notFound()

  // Ensure bibDesignData is a proper object
  let initialDesign = undefined
  if (event.bibDesignData) {
    if (typeof event.bibDesignData === 'string') {
      try { initialDesign = JSON.parse(event.bibDesignData) } catch (e) {}
    } else {
      initialDesign = event.bibDesignData
    }
  }

  // Flatten registrations
  const allRegistrations = event.categories.flatMap((cat: any) => 
    cat.registrations.map((reg: any) => ({
      ...reg,
      categoryDistance: cat.distance,
    }))
  )

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto">
      <BibDesigner 
        eventId={event.id} 
        eventName={event.name} 
        initialDesign={initialDesign}
        registrations={allRegistrations}
      />
    </div>
  )
}
