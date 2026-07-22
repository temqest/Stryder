'use client'

import { useState } from 'react'
import { Trash2, X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'
import { deleteEvent, finishEventDeletion } from '@/app/dashboard/actions'
import { useRouter } from 'next/navigation'
import { isPast } from 'date-fns'

export function DeleteEventModal({ event }: { event: { id: string, name: string, date: Date } }) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const router = useRouter()
  
  const isEventPast = isPast(new Date(event.date))

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmName !== event.name) {
      setError("Event name does not match.")
      return
    }

    setIsLoading(true)
    setError(null)
    
    const result = await deleteEvent(event.id)
    if (result.success) {
      setIsSuccess(true)
      setIsLoading(false)
    } else {
      setError(result.error || 'Failed to delete event')
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-full bg-red-500/10 text-red-500 font-bold uppercase tracking-wider text-xs hover:bg-red-500 hover:text-white transition-colors flex items-center shadow-[0_0_15px_rgba(239,68,68,0.1)]"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete Event
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-panel)] w-full max-w-lg border border-red-500/30 rounded-3xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-red-500 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Delete Event
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mt-1">Danger Zone</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Event Deleted</h3>
                  <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
                    {event.name} and all its associated data have been permanently removed.
                  </p>
                  <button
                    onClick={() => finishEventDeletion()}
                    className="w-full flex items-center justify-center py-4 bg-[var(--bg-base)] text-[var(--text-primary)] rounded-xl font-bold uppercase tracking-wider hover:bg-[var(--bg-panel-raised)] transition-colors border border-[var(--border-subtle)]"
                  >
                    Return to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-400 font-bold mb-2 uppercase tracking-wider">Warning!</p>
                    <p className="text-sm text-red-300 leading-relaxed">
                      You are about to permanently delete <span className="font-bold text-white">{event.name}</span>.
                    </p>
                    {!isEventPast && (
                      <p className="text-sm text-red-300 leading-relaxed mt-2 font-bold">
                        Since this event has not yet started/finished, any participants who have already paid for their registration will be automatically refunded, and their tickets will be revoked.
                      </p>
                    )}
                    <p className="text-sm text-red-300 leading-relaxed mt-2">
                      This action cannot be undone. All data, including route maps, registrations, and race results will be permanently destroyed.
                    </p>
                  </div>

                  <form onSubmit={handleDelete} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                        To verify, type <span className="text-[var(--text-primary)] font-black normal-case select-all">{event.name}</span> below:
                      </label>
                      <input
                        type="text"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder="Event Name"
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm font-bold uppercase tracking-wider">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-4 bg-[var(--bg-base)] text-[var(--text-secondary)] rounded-xl font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || confirmName !== event.name}
                        className="flex-1 flex items-center justify-center py-4 bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Permanently'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
