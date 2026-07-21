import { Users, Mail, Shield, Trash2, Plus } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Access Control
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Team & Staff
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button className="flex items-center px-6 py-3 bg-[var(--accent)] text-[#0A0A0A] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all">
            <Plus className="w-5 h-5 mr-2" /> Invite Member
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-panel-raised)]">
           <h3 className="text-lg font-bold uppercase tracking-tight flex items-center">
             <Shield className="w-5 h-5 mr-3 text-[var(--accent)]" /> Active Members
           </h3>
           <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
             Manage who has access to your organizer dashboard. Assign specific roles like 'Scanner' to volunteers for race day QR scanning, or 'Manager' for full event editing access.
           </p>
        </div>
        
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
              
              <tr className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                      <Users className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">You (Admin)</div>
                      <div className="text-xs text-[var(--text-secondary)]">admin@stryder.com</div>
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

              <tr className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                      <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Jane Volunteer</div>
                      <div className="text-xs text-[var(--text-secondary)]">jane@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <select defaultValue="scanner" className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold uppercase tracking-wider px-3 py-1.5 focus:outline-none focus:border-[var(--accent)] text-[var(--text-secondary)]">
                     <option value="manager">Manager</option>
                     <option value="scanner">Scanner</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-[11px] font-bold text-green-500 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Active
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                     <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-[var(--bg-panel-raised)] transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4 border border-yellow-500/20">
                      <Mail className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-secondary)] italic">Pending Invite</div>
                      <div className="text-xs text-[var(--text-secondary)]">mark@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <select defaultValue="manager" className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold uppercase tracking-wider px-3 py-1.5 focus:outline-none focus:border-[var(--accent)] text-[var(--text-secondary)]">
                     <option value="manager">Manager</option>
                     <option value="scanner">Scanner</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-[11px] font-bold text-yellow-500 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div> Pending
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] mr-4">Resend</button>
                  <button className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                     <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}
