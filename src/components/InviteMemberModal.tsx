'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { inviteTeamMember } from '@/app/dashboard/team/actions'

export default function InviteMemberModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('SCANNER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await inviteTeamMember(email, role)
      setIsOpen(false)
      setEmail('')
      setRole('SCANNER')
    } catch (err: any) {
      setError(err.message || "Failed to invite member")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center px-6 py-3 bg-[var(--accent)] text-[#0A0A0A] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all"
      >
        <Plus className="w-5 h-5 mr-2" /> Invite Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-white rounded-full transition-colors hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-black uppercase tracking-wider mb-6">Invite Team Member</h2>
            
            <form onSubmit={handleInvite} className="space-y-4">
              {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-md text-sm">{error}</div>}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Role
                </label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  <option value="MANAGER">Manager (Full Access)</option>
                  <option value="SCANNER">Scanner (QR Scanning Only)</option>
                </select>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {role === 'MANAGER' ? 'Managers can edit events, view finances, and manage the team.' : 'Scanners can only access the race day scanner page.'}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white transition-colors mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-full bg-[var(--accent)] text-[#0A0A0A] text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
