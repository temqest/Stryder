'use client'

import { useState } from 'react'
import { Plus, X, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { recordRaceFinishByBib } from '@/app/dashboard/actions'

export function ManualEntryModalButton({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [bibNumber, setBibNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean, name?: string, error?: string, category?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bibNumber.trim()) return

    setIsLoading(true)
    setResult(null)

    const res = await recordRaceFinishByBib(eventId, bibNumber.trim())
    setResult(res)
    setIsLoading(false)

    if (res.success) {
      setBibNumber('')
      // Auto-hide success message after 3 seconds
      setTimeout(() => setResult(null), 3000)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider flex items-center hover:text-[var(--accent-dim)] transition-colors"
      >
        <Plus className="w-3 h-3 mr-1" /> Manual Entry
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-panel)] w-full max-w-md border border-[var(--border-subtle)] rounded-3xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Manual Entry</h2>
                <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">Record finish by Bib Number</p>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false)
                  setResult(null)
                  setBibNumber('')
                }}
                className="w-8 h-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    Bib Number
                  </label>
                  <input
                    type="text"
                    value={bibNumber}
                    onChange={(e) => setBibNumber(e.target.value)}
                    placeholder="Enter Bib Number (e.g. 1042)"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-mono text-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    required
                    autoFocus
                  />
                </div>

                {result && (
                  <div className={`p-4 rounded-xl border ${result.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} flex items-start space-x-3`}>
                    {result.success ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold text-sm">
                        {result.success ? 'Recorded Successfully' : 'Entry Failed'}
                      </p>
                      <p className="text-xs mt-1 opacity-90">{result.error || result.name}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !bibNumber.trim()}
                  className="w-full flex items-center justify-center px-6 py-4 bg-[var(--accent)] text-[#0A0A0A] rounded-xl font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Record Finish'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
