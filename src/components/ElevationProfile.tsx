'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { distance: '0km', elevation: 10 },
  { distance: '2km', elevation: 15 },
  { distance: '4km', elevation: 12 },
  { distance: '6km', elevation: 35 },
  { distance: '8km', elevation: 40 },
  { distance: '10km', elevation: 15 },
  { distance: '12km', elevation: 10 },
]

export default function ElevationProfile() {
  return (
    <div className="w-full h-[250px] bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl p-6 mt-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Elevation Profile</h3>
        <span className="text-xs font-bold text-[var(--accent)] px-2 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-md shadow-[0_0_10px_var(--accent)]/10">+30m Gain</span>
      </div>

      <div className="w-full h-[150px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E5FF00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E5FF00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="distance" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-panel-raised)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="elevation" stroke="#E5FF00" strokeWidth={2} fillOpacity={1} fill="url(#colorElevation)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
