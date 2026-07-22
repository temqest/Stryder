'use client'

import { useState } from 'react'
import { Users, Mail, Trash2 } from 'lucide-react'
import { updateMemberRole, removeTeamMember } from '@/app/dashboard/team/actions'

type Member = {
  id: string
  email: string
  role: string
  status: string
  userId: string | null
}

export default function TeamList({ 
  initialMembers, 
  ownerEmail 
}: { 
  initialMembers: Member[], 
  ownerEmail: string 
}) {
  const [members, setMembers] = useState(initialMembers)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleRoleChange = async (id: string, newRole: string) => {
    setIsUpdating(id)
    try {
      await updateMemberRole(id, newRole)
      setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m))
    } catch (err) {
      console.error(err)
      alert("Failed to update role")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return
    setIsUpdating(id)
    try {
      await removeTeamMember(id)
      setMembers(members.filter(m => m.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to remove member")
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
          <tr>
            <th className="py-4 px-6 font-bold">User</th>
            <th className="py-4 px-6 font-bold">Role</th>
            <th className="py-4 px-6 font-bold">Status</th>
            <th className="py-4 px-6 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          
          {/* Owner row */}
          <tr className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
            <td className="py-4 px-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">You (Admin)</div>
                  <div className="text-xs text-[var(--text-secondary)]">{ownerEmail}</div>
                </div>
              </div>
            </td>
            <td className="py-4 px-6">
              <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[var(--accent)]/20">
                Owner
              </span>
            </td>
            <td className="py-4 px-6">
              <span className="flex items-center text-[11px] font-bold text-green-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Active
              </span>
            </td>
            <td className="py-4 px-6 text-right">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold">N/A</span>
            </td>
          </tr>

          {/* Invited/Active members */}
          {members.map(member => (
            <tr key={member.id} className={`hover:bg-[var(--bg-panel-raised)] transition-colors group ${isUpdating === member.id ? 'opacity-50' : ''}`}>
              <td className="py-4 px-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border ${member.status === 'PENDING' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-[var(--bg-base)] border-[var(--border-subtle)]'}`}>
                    {member.status === 'PENDING' ? (
                      <Mail className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">
                      {member.status === 'PENDING' ? <span className="text-[var(--text-secondary)] italic">Pending Invite</span> : member.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <select 
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  disabled={isUpdating === member.id}
                  className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold uppercase tracking-wider px-3 py-1.5 focus:outline-none focus:border-[var(--accent)] text-[var(--text-secondary)] disabled:opacity-50"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="SCANNER">Scanner</option>
                </select>
              </td>
              <td className="py-4 px-6">
                {member.status === 'ACTIVE' ? (
                  <span className="flex items-center text-[11px] font-bold text-green-500 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Active
                  </span>
                ) : (
                  <span className="flex items-center text-[11px] font-bold text-yellow-500 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div> Pending
                  </span>
                )}
              </td>
              <td className="py-4 px-6 text-right">
                {member.status === 'PENDING' && (
                  <button className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] mr-4">Resend</button>
                )}
                <button 
                  onClick={() => handleRemove(member.id)}
                  disabled={isUpdating === member.id}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  )
}
