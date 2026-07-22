import QRScanner from '@/components/QRScanner'

export const dynamic = 'force-dynamic'

export default function ScannerPage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-4 block">
            Tools
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
            Scanner
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl text-lg leading-relaxed">
            Scan participant QR codes to instantly verify and check them into the race.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <QRScanner />
      </div>
    </div>
  )
}
