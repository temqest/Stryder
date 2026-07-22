'use client'

import { useState } from 'react'
import { QrCode, Upload, Save, Settings2, Download, CheckCircle2, Loader2, Loader } from 'lucide-react'
import { saveBibDesign } from '@/app/dashboard/actions'
import QRCode from 'react-qr-code'

interface BibDesignerProps {
  eventId: string
  eventName: string
  initialDesign?: any
  registrations?: any[]
}

export default function BibDesigner({ eventId, eventName, initialDesign, registrations = [] }: BibDesignerProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [design, setDesign] = useState({
    backgroundColor: initialDesign?.backgroundColor || '#DC2626', // Default Red
    backgroundImageUrl: initialDesign?.backgroundImageUrl || '',
    showName: initialDesign?.showName ?? true,
    qrPosition: initialDesign?.qrPosition || 'bottom-left',
    qrSize: initialDesign?.qrSize || 120,
    textColor: initialDesign?.textColor || '#FFFFFF',
    bibNumberPosition: initialDesign?.bibNumberPosition || 'bottom-right',
    bibNumberSize: initialDesign?.bibNumberSize || 72,
  })

  // Filter state
  const [selectedRegs, setSelectedRegs] = useState<string[]>([])
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  async function handleSave() {
    setIsSaving(true)
    setSaveSuccess(false)
    const result = await saveBibDesign(eventId, design)
    setIsSaving(false)
    if (result.success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      alert(result.error)
    }
  }

  function handlePrintBibs() {
    const qs = selectedRegs.length > 0 ? `?regs=${selectedRegs.join(',')}` : ''
    window.open(`/dashboard/events/${eventId}/bib-design/print${qs}`, '_blank')
  }

  function handlePrintQRCodes() {
    const qs = selectedRegs.length > 0 ? `?regs=${selectedRegs.join(',')}` : ''
    window.open(`/dashboard/events/${eventId}/bib-design/qrcodes${qs}`, '_blank')
  }

  const filteredRegs = registrations.filter(r => r.user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Calculate QR position classes
  let qrPosClass = 'bottom-4 left-4'
  if (design.qrPosition === 'bottom-right') qrPosClass = 'bottom-4 right-4'
  if (design.qrPosition === 'top-left') qrPosClass = 'top-16 left-4'
  if (design.qrPosition === 'top-right') qrPosClass = 'top-16 right-4'
  if (design.qrPosition === 'center') qrPosClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'

  // Calculate Bib Number position classes
  let bibNumPosClass = 'bottom-6 right-6 text-right'
  if (design.bibNumberPosition === 'center') bibNumPosClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'
  if (design.bibNumberPosition === 'top-right') bibNumPosClass = 'top-16 right-6 text-right'
  if (design.bibNumberPosition === 'top-left') bibNumPosClass = 'top-16 left-6 text-left'
  if (design.bibNumberPosition === 'bottom-left') bibNumPosClass = 'bottom-6 left-6 text-left'

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Event Assets
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Bib Designer
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button onClick={() => setIsSelectModalOpen(true)} className="flex items-center px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all">
            Participants ({selectedRegs.length > 0 ? selectedRegs.length : 'All'})
          </button>
          <button onClick={handlePrintQRCodes} className="flex items-center px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all">
            <QrCode className="w-4 h-4 mr-2" /> Print QR Codes
          </button>
          <button onClick={handlePrintBibs} className="flex items-center px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all">
            <Download className="w-4 h-4 mr-2" /> Print Bibs
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-[var(--accent)] text-[#0A0A0A] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saveSuccess ? 'Saved!' : 'Save Design'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] p-6">
             <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center border-b border-[var(--border-subtle)] pb-4">
               <Settings2 className="w-4 h-4 mr-2 text-[var(--text-secondary)]" /> Layout Settings
             </h3>
             
             <div className="space-y-6">
               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Background Image URL (Optional)</label>
                 <input 
                   type="text" 
                   value={design.backgroundImageUrl}
                   onChange={e => setDesign({ ...design, backgroundImageUrl: e.target.value })}
                   placeholder="https://example.com/bg.jpg"
                   className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] mb-2"
                 />
                 <p className="text-[10px] text-[var(--text-secondary)]">Provide an image URL to use as a full-size background graphic.</p>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Theme Color</label>
                 <div className="flex gap-2">
                   {['#DC2626', '#2563EB', '#16A34A', '#D97706', '#000000'].map(color => (
                     <button
                       key={color}
                       onClick={() => setDesign({ ...design, backgroundColor: color })}
                       className={`w-8 h-8 rounded-full border-2 ${design.backgroundColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'} transition-all`}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                   <input 
                     type="color" 
                     value={design.backgroundColor} 
                     onChange={e => setDesign({ ...design, backgroundColor: e.target.value })}
                     className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0 p-0"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Text Color</label>
                 <div className="flex gap-2">
                   {['#FFFFFF', '#000000', '#FDE047'].map(color => (
                     <button
                       key={color}
                       onClick={() => setDesign({ ...design, textColor: color })}
                       className={`w-8 h-8 rounded-full border-2 ${design.textColor === color ? 'border-[var(--accent)] scale-110' : 'border-gray-500 hover:scale-110'} transition-all`}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">QR Code Position</label>
                 <select 
                   value={design.qrPosition}
                   onChange={e => setDesign({ ...design, qrPosition: e.target.value })}
                   className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
                 >
                   <option value="bottom-left">Bottom Left</option>
                   <option value="bottom-right">Bottom Right</option>
                   <option value="top-left">Top Left</option>
                   <option value="top-right">Top Right</option>
                   <option value="center">Center</option>
                 </select>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">QR Code Size</label>
                 <input 
                   type="range" 
                   value={design.qrSize}
                   onChange={e => setDesign({ ...design, qrSize: parseInt(e.target.value) })}
                   className="w-full accent-[var(--accent)]" 
                   min="60" 
                   max="200" 
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Bib Number Position</label>
                 <select 
                   value={design.bibNumberPosition}
                   onChange={e => setDesign({ ...design, bibNumberPosition: e.target.value })}
                   className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] mb-4"
                 >
                   <option value="bottom-right">Bottom Right</option>
                   <option value="bottom-left">Bottom Left</option>
                   <option value="top-right">Top Right</option>
                   <option value="top-left">Top Left</option>
                   <option value="center">Center</option>
                 </select>

                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Bib Number Size</label>
                 <input 
                   type="range" 
                   value={design.bibNumberSize}
                   onChange={e => setDesign({ ...design, bibNumberSize: parseInt(e.target.value) })}
                   className="w-full accent-[var(--accent)]" 
                   min="30" 
                   max="120" 
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Runner Name Toggle</label>
                 <div className="flex items-center">
                   <input 
                     type="checkbox" 
                     checked={design.showName} 
                     onChange={e => setDesign({ ...design, showName: e.target.checked })}
                     className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent)] mr-2" 
                   />
                   <span className="text-sm">Print Participant Name</span>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="text-blue-500 font-bold text-sm uppercase tracking-wider flex items-center mb-2">
              <QrCode className="w-4 h-4 mr-2" /> QR Code Integration
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The embedded QR code on the bib allows you to instantly scan runners at the finish line using the Race Monitor page or mobile scanner app. It uniquely identifies the runner and their category.
            </p>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="lg:col-span-2">
           <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-subtle)] p-6 min-h-[600px] flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center border-b border-[var(--border-subtle)] pb-4">
               Live Preview
              </h3>
              
              <div className="flex-1 bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-center p-8 overflow-hidden relative">
                 {/* Virtual Bib Canvas */}
                 <div className="w-[450px] h-[320px] bg-white rounded-lg shadow-2xl relative border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
                    
                    {design.backgroundImageUrl && (
                      <div 
                        className="absolute inset-0 z-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${design.backgroundImageUrl})` }}
                      />
                    )}
                    
                    <div 
                      className="absolute top-0 left-0 w-full h-14 flex items-center justify-center transition-colors duration-300 z-10"
                      style={{ backgroundColor: design.backgroundColor }}
                    >
                       <span className="font-black uppercase tracking-widest text-lg" style={{ color: design.textColor }}>
                         {eventName}
                       </span>
                    </div>
                    
                    <div className={`absolute transition-all duration-300 z-10 ${qrPosClass}`}>
                       <div className="bg-white p-1 shadow-sm border border-gray-200 flex items-center justify-center">
                         <QRCode value="sample-id-123" size={design.qrSize} level="H" />
                       </div>
                    </div>
                    
                    <div className={`absolute z-10 transition-all duration-300 ${bibNumPosClass}`}>
                       <div className="text-black font-black tracking-tighter leading-none mb-1" style={{ fontSize: `${design.bibNumberSize}px` }}>
                         1042
                       </div>
                       <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                         10K RUN
                       </div>
                    </div>

                    {design.showName && (
                      <div className="absolute top-1/2 left-0 w-full text-center -translate-y-1/2 z-10 pointer-events-none px-4">
                        <div className="text-black font-black uppercase text-2xl bg-white/70 backdrop-blur-sm inline-block px-4 py-1 rounded">
                          JONATHAN DOE
                        </div>
                      </div>
                    )}

                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Select Participants Modal */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Select Participants</h2>
                <p className="text-xs text-[var(--text-secondary)]">Choose specific runners for printing.</p>
              </div>
              <button onClick={() => setIsSelectModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-4 border-b border-[var(--border-subtle)]">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="flex items-center mb-4 px-2">
                <input 
                  type="checkbox"
                  checked={selectedRegs.length === registrations.length && registrations.length > 0}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedRegs(registrations.map(r => r.id))
                    } else {
                      setSelectedRegs([])
                    }
                  }}
                  className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent)] mr-3"
                />
                <span className="text-sm font-bold">Select All</span>
              </div>
              <div className="space-y-2">
                {filteredRegs.map(reg => (
                  <label key={reg.id} className="flex items-center p-3 hover:bg-[var(--bg-panel-raised)] rounded-xl cursor-pointer transition-colors border border-transparent hover:border-[var(--border-subtle)]">
                    <input 
                      type="checkbox"
                      checked={selectedRegs.includes(reg.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRegs([...selectedRegs, reg.id])
                        } else {
                          setSelectedRegs(selectedRegs.filter(id => id !== reg.id))
                        }
                      }}
                      className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent)] mr-4"
                    />
                    <div>
                      <div className="font-bold text-sm uppercase">{reg.user.name}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{reg.categoryDistance}</div>
                    </div>
                  </label>
                ))}
                {filteredRegs.length === 0 && (
                  <div className="text-center py-8 text-[var(--text-secondary)] text-sm">No runners found.</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--border-subtle)] flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRegs([])}
                className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                Clear Selection
              </button>
              <button 
                onClick={() => setIsSelectModalOpen(false)}
                className="px-6 py-2 bg-[var(--accent)] text-[#0A0A0A] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all"
              >
                Done ({selectedRegs.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
