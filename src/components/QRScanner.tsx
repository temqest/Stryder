'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { checkInParticipant, recordRaceFinish } from '@/app/dashboard/actions'
import { CheckCircle2, Loader2, XCircle, ScanLine } from 'lucide-react'

export default function QRScanner({ mode = 'check-in' }: { mode?: 'check-in' | 'finish-line' }) {
  const [isActive, setIsActive] = useState(false)
  const [scanResult, setScanResult] = useState<{ success: boolean, name?: string, error?: string, category?: string, event?: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isActive) return
    
    // We only want to initialize the scanner once
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    let isRequesting = false

    scanner.render(
      async (decodedText) => {
        // Prevent multiple simultaneous requests while one is processing
        if (isRequesting) return
        
        isRequesting = true
        setIsProcessing(true)
        setScanResult(null)

        try {
          // Pause the scanner to prevent multiple rapid scans of the same code
          scanner.pause(true)
          
          const result = mode === 'check-in' 
            ? await checkInParticipant(decodedText)
            : await recordRaceFinish(decodedText);
            
          setScanResult(result)
          
          // Clear result and resume scanning after 3 seconds
          setTimeout(() => {
            setScanResult(null)
            isRequesting = false
            scanner.resume()
          }, 3000)
        } catch (error) {
          setScanResult({ success: false, error: 'Network error or invalid code' })
          setTimeout(() => {
            setScanResult(null)
            isRequesting = false
            scanner.resume()
          }, 3000)
        } finally {
          setIsProcessing(false)
        }
      },
      (error) => {
        // ignore continuous scan failures (happens every frame when no QR is in view)
      }
    )

    return () => {
      scanner.clear().catch(console.error)
    }
  }, [isActive])

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 relative">
      <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Race Check-In</h2>
            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">Scan participant tickets</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <ScanLine className="w-5 h-5" />
          </div>
        </div>
        
        <div className="p-2 bg-black relative min-h-[300px] flex flex-col items-center justify-center">
          {!isActive ? (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--bg-panel)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <ScanLine className="w-8 h-8" />
              </div>
              <p className="text-[var(--text-secondary)] mb-6 max-w-xs text-sm">Ready to check-in participants. Click below to activate your camera.</p>
              <button 
                onClick={() => setIsActive(true)}
                className="px-6 py-3 bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs rounded-full hover:bg-[var(--accent-dim)] transition-colors shadow-[0_0_15px_var(--border-accent)]"
              >
                Start Camera
              </button>
            </div>
          ) : (
            <>
              {isProcessing && (
                <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin mb-4" />
                  <p className="text-white font-bold uppercase tracking-wider text-sm">Processing...</p>
                </div>
              )}
              
              <div id="reader" className="w-full text-white" />
              
              <button 
                onClick={() => setIsActive(false)}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 hover:bg-black/70 transition-colors"
              >
                Close Camera
              </button>
            </>
          )}
        </div>
      </div>

      {scanResult && (
        <div className={`p-6 rounded-2xl border ${scanResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} flex items-start space-x-4 animate-in slide-in-from-bottom-4 duration-300`}>
          {scanResult.success ? (
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className={`text-lg font-black uppercase tracking-tight ${scanResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {scanResult.success ? 'Check-In Successful' : 'Check-In Failed'}
            </h3>
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {scanResult.error || scanResult.name}
            </p>
            {scanResult.success && (
              <div className="inline-block px-2 py-1 bg-[var(--bg-base)] rounded-lg text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-primary)]">
                {scanResult.event} • {scanResult.category}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
