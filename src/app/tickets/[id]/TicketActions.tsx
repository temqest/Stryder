'use client'

import { Download, Printer } from 'lucide-react'

export default function TicketActions() {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadQR = () => {
    const svg = document.querySelector('.ticket-qr-code svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Add padding and white background
      canvas.width = img.width + 40
      canvas.height = img.height + 40
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 20, 20)
      }
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'stryder-qr-code.png'
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 no-print">
      <button 
        onClick={handleDownloadQR}
        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-sm font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center shadow-[0_0_15px_rgba(212,255,0,0.15)]"
      >
        <Download className="w-4 h-4 mr-2" />
        Save QR Code
      </button>
      <button 
        onClick={handlePrint}
        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--bg-panel-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center justify-center"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print Ticket
      </button>
    </div>
  )
}
