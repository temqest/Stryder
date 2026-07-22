import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QRCode from 'react-qr-code'

export const dynamic = 'force-dynamic'

export default async function PrintBibsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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

  // Parse design
  let design: any = {
    backgroundColor: '#DC2626',
    showName: true,
    qrPosition: 'bottom-left',
    qrSize: 120,
    textColor: '#FFFFFF'
  }
  
  if (event.bibDesignData) {
    if (typeof event.bibDesignData === 'string') {
      try { design = JSON.parse(event.bibDesignData) } catch (e) {}
    } else {
      design = event.bibDesignData
    }
  }

  // Position classes
  let qrPosClass = 'bottom-8 left-8'
  if (design.qrPosition === 'bottom-right') qrPosClass = 'bottom-8 right-8'
  if (design.qrPosition === 'top-left') qrPosClass = 'top-32 left-8'
  if (design.qrPosition === 'top-right') qrPosClass = 'top-32 right-8'
  if (design.qrPosition === 'center') qrPosClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'

  return (
    <div className="bg-white text-black min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 0; }
          body { background: white; }
          .bib-page { page-break-after: always; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          .no-print { display: none; }
        }
      `}} />
      
      <div className="no-print p-4 bg-gray-100 border-b border-gray-300 text-center font-sans">
        <h1 className="font-bold mb-2">Print Bibs ({allRegistrations.length})</h1>
        <p className="text-sm text-gray-600 mb-4">Press Ctrl+P or Cmd+P to print or save as PDF. Ensure "Background graphics" is enabled in your print dialog.</p>
        <button onClick={() => { /* This won't work in Server Component directly, just a prompt */ }} className="px-4 py-2 bg-blue-600 text-white font-bold rounded shadow" type="button" autoFocus>
          Use Browser Print Function
        </button>
      </div>

      {allRegistrations.map((reg, index) => (
        <div key={reg.id} className="bib-page p-8 font-sans">
          {/* Scaled up version of the preview */}
          <div className="w-[1000px] h-[700px] bg-white rounded-3xl shadow-2xl relative border-4 border-gray-200 overflow-hidden print:shadow-none print:border-none">
            
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div 
              className="absolute top-0 left-0 w-full h-32 flex items-center justify-center"
              style={{ backgroundColor: design.backgroundColor }}
            >
               <span className="font-black uppercase tracking-widest text-4xl" style={{ color: design.textColor }}>
                 {event.name}
               </span>
            </div>
            
            <div className={`absolute ${qrPosClass}`}>
               <div className="bg-white p-2 shadow-sm border border-gray-200 flex items-center justify-center">
                 <QRCode value={reg.id} size={design.qrSize * 1.5} level="H" />
               </div>
            </div>
            
            <div className="absolute bottom-12 right-12 text-right">
               <div className="text-black font-black tracking-tighter leading-none mb-2" style={{ fontSize: '150px' }}>
                 {/* Generate a sequential bib number if bibNumber is missing */}
                 {reg.bibNumber || (1000 + index).toString()}
               </div>
               <div className="text-gray-500 font-bold uppercase tracking-widest text-3xl">
                 {reg.categoryDistance}
               </div>
            </div>

            {design.showName && (
              <div className="absolute top-1/2 left-0 w-full text-center -translate-y-1/2 z-10 px-12">
                <div className="text-black font-black uppercase text-6xl bg-white/70 backdrop-blur-sm inline-block px-8 py-2 rounded-xl">
                  {reg.user.name}
                </div>
              </div>
            )}
            
            {/* Pin holes */}
            <div className="absolute top-8 left-8 w-6 h-6 bg-white rounded-full shadow-inner border border-gray-300"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full shadow-inner border border-gray-300"></div>
            <div className="absolute bottom-8 left-8 w-6 h-6 bg-white rounded-full shadow-inner border border-gray-300"></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-white rounded-full shadow-inner border border-gray-300"></div>

          </div>
        </div>
      ))}

      {allRegistrations.length === 0 && (
        <div className="p-20 text-center text-gray-500 font-sans">
          No participants registered yet.
        </div>
      )}
    </div>
  )
}
