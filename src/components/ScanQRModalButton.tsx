'use client'

import { useState } from 'react'
import { QrCode, X } from 'lucide-react'
import QRScanner from '@/components/QRScanner'

export function ScanQRModalButton({ 
  className = "flex items-center px-6 py-3 bg-[var(--accent)] text-[#0A0A0A] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all shadow-[0_0_15px_var(--border-accent)]",
  mode = 'check-in'
}: { 
  className?: string,
  mode?: 'check-in' | 'finish-line'
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        <QrCode className="w-5 h-5 mr-2" /> {mode === 'finish-line' ? 'Finish Line' : 'Scan QR'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <QRScanner mode={mode} />
          </div>
        </div>
      )}
    </>
  )
}
