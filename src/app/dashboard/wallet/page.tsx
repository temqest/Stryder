import React from 'react'
import { DollarSign, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Download, Filter, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function WalletPage() {
  // Dummy data for visual presentation
  const stats = {
    availableBalance: 45250.00,
    totalEarnings: 125500.00,
    pendingClearance: 12500.00
  }

  const transactions = [
    { id: 'TRX-99381', date: '2026-07-21T14:30:00', type: 'Payout', amount: -25000, status: 'Completed', description: 'Bank Transfer to ending 1234' },
    { id: 'TRX-99382', date: '2026-07-20T09:15:00', type: 'Earnings', amount: 3500, status: 'Cleared', description: 'Stryder Midnight Run 10K - 10 Registrations' },
    { id: 'TRX-99383', date: '2026-07-19T16:45:00', type: 'Earnings', amount: 8500, status: 'Pending', description: 'City Marathon - 5 Registrations' },
    { id: 'TRX-99384', date: '2026-07-15T10:00:00', type: 'Payout', amount: -15000, status: 'Completed', description: 'Bank Transfer to ending 1234' },
    { id: 'TRX-99385', date: '2026-07-12T11:20:00', type: 'Earnings', amount: 42000, status: 'Cleared', description: 'Trail Blaze 2026 - Early Bird Tickets' },
  ]

  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
          <div>
            <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
              Financial Center
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Wallet
            </h1>
          </div>
          <button className="px-6 py-3 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider text-sm hover:bg-[var(--accent-dim)] transition-colors shrink-0 flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-2" /> Request Cashout
          </button>
        </div>

        {/* Balance Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--accent)] relative overflow-hidden group transition-all flex flex-col justify-between h-48 shadow-[0_0_30px_-10px_var(--accent)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="flex justify-between items-start z-10">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Available for Cashout</div>
               <DollarSign className="w-6 h-6 text-[var(--accent)] opacity-80" />
            </div>
            <div className="z-10">
              <div className="text-4xl md:text-5xl font-black mb-1">₱{stats.availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                 Funds ready to be withdrawn
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--text-secondary)] transition-all flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Pending Clearance</div>
               <Clock className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-1">₱{stats.pendingClearance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                 Processing (1-3 business days)
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--text-secondary)] transition-all flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
               <div className="uppercase text-[11px] tracking-[0.1em] text-[var(--text-secondary)] font-bold">Total Earnings (All Time)</div>
               <ArrowUpRight className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-1">₱{stats.totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                 Lifetime gross earnings
              </div>
            </div>
          </div>

        </div>

        {/* Transactions List */}
        <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-subtle)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">Recent Transactions</h2>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full text-sm focus:outline-none focus:border-[var(--accent)] transition-colors w-full sm:w-48 placeholder:text-[var(--text-secondary)]"
                />
              </div>
              <button className="p-2 border border-[var(--border-subtle)] rounded-full hover:bg-[var(--bg-panel-raised)] transition-colors text-[var(--text-secondary)]" title="Filter">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 border border-[var(--border-subtle)] rounded-full hover:bg-[var(--bg-panel-raised)] transition-colors text-[var(--text-secondary)]" title="Download Report">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="p-4 pl-6 md:pl-8 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 pr-6 md:pr-8 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx, idx) => (
                  <tr 
                    key={trx.id} 
                    className={`
                      border-t border-[var(--border-subtle)] hover:bg-[var(--bg-panel-raised)] transition-colors
                      ${idx === transactions.length - 1 ? 'border-b-0' : ''}
                    `}
                  >
                    <td className="p-4 pl-6 md:pl-8 text-sm font-medium">
                      <span className="text-[var(--text-secondary)]">{trx.id}</span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                      {new Date(trx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm max-w-[200px] truncate md:max-w-none md:whitespace-normal">
                      <div className="font-bold flex items-center">
                        {trx.type === 'Earnings' ? (
                          <ArrowDownLeft className="w-3 h-3 text-green-500 mr-2 shrink-0" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-red-500 mr-2 shrink-0" />
                        )}
                        {trx.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`
                        inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${trx.status === 'Completed' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : ''}
                        ${trx.status === 'Cleared' ? 'bg-green-500/10 text-green-500' : ''}
                        ${trx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      `}>
                        {trx.status === 'Completed' || trx.status === 'Cleared' ? (
                           <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                           <Clock className="w-3 h-3 mr-1" />
                        )}
                        {trx.status}
                      </div>
                    </td>
                    <td className="p-4 pr-6 md:pr-8 text-right font-black">
                      <span className={trx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                        {trx.amount > 0 ? '+' : ''}₱{Math.abs(trx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
