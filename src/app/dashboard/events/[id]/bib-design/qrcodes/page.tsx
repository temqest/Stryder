import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QRCode from 'react-qr-code'

export const dynamic = 'force-dynamic'

export default async function PrintQRCodesPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const regsQuery = resolvedSearchParams.regs as string
  
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

  // Flatten registrations
  let allRegistrations = event.categories.flatMap((cat: any) => 
    cat.registrations.map((reg: any) => ({
      ...reg,
      categoryDistance: cat.distance,
    }))
  )

  if (regsQuery) {
    const selectedIds = regsQuery.split(',')
    allRegistrations = allRegistrations.filter(r => selectedIds.includes(r.id))
  }

  return (
    <div className="bg-white text-black min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: portrait; margin: 10mm; }
          body { background: white; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
        }
      `}} />
      
      <div className="no-print p-4 bg-gray-100 border-b border-gray-300 text-center font-sans">
        <h1 className="font-bold mb-2">Print QR Codes ({allRegistrations.length})</h1>
        <p className="text-sm text-gray-600 mb-4">Print this page on sticker paper. Each page fits 12 QR codes.</p>
      </div>

      <div className="p-8 font-sans max-w-[800px] mx-auto">
        <div className="grid grid-cols-3 gap-6 gap-y-12">
          {allRegistrations.map((reg, index) => (
            <div key={reg.id} className={`flex flex-col items-center justify-center text-center ${(index + 1) % 12 === 0 ? 'page-break' : ''}`}>
              <div className="bg-white p-2 border border-gray-300 mb-2">
                <QRCode value={reg.id} size={150} level="H" />
              </div>
              <div className="font-bold text-sm uppercase tracking-tight w-full truncate px-2">{reg.user.name}</div>
              <div className="text-xs text-gray-500 font-bold uppercase">{reg.categoryDistance}</div>
            </div>
          ))}
        </div>
      </div>

      {allRegistrations.length === 0 && (
        <div className="p-20 text-center text-gray-500 font-sans">
          No participants registered yet.
        </div>
      )}
    </div>
  )
}
