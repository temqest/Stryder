import { Ticket, QrCode, Upload, Save, Settings2, Download } from 'lucide-react'

export default async function BibDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="text-[var(--text-primary)] p-6 pt-24 md:p-10 md:pt-24 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-2 block">
            Event Assets
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
            Bib Designer
          </h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button className="flex items-center px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg text-sm font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
          <button className="flex items-center px-6 py-2 bg-[var(--accent)] text-[#0A0A0A] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-all">
            <Save className="w-4 h-4 mr-2" /> Save Design
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
             
             <div className="space-y-5">
               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Background Image</label>
                 <button className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-subtle)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--bg-panel-raised)] transition-all group">
                   <Upload className="w-6 h-6 text-[var(--text-secondary)] mb-2 group-hover:text-[var(--accent)] transition-colors" />
                   <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Upload Template (JPG/PNG)</span>
                 </button>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">QR Code Size</label>
                 <input type="range" className="w-full accent-[var(--accent)]" min="50" max="200" defaultValue="120" />
                 <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                   <span>Small</span>
                   <span>Large</span>
                 </div>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Runner Name Toggle</label>
                 <div className="flex items-center">
                   <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent)] mr-2" />
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
                 <div className="w-[400px] h-[300px] bg-white rounded-lg shadow-2xl relative border-2 border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    
                    {/* Placeholder Design */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-0 left-0 w-full h-12 bg-red-600 flex items-center justify-center">
                       <span className="text-white font-black uppercase tracking-widest text-lg">Stryder Midnight Run</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                       <div className="w-24 h-24 bg-white p-1 shadow-sm border border-gray-200 flex items-center justify-center">
                         <QrCode className="w-20 h-20 text-black" />
                       </div>
                    </div>
                    
                    <div className="absolute bottom-6 right-6 text-right">
                       <div className="text-black font-black text-6xl tracking-tighter leading-none mb-1">
                         1042
                       </div>
                       <div className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                         JOHN DOE
                       </div>
                    </div>

                    <div className="absolute top-16 left-6">
                       <div className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                         10K Category
                       </div>
                    </div>

                    {/* Pin holes */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-[var(--bg-base)] rounded-full shadow-inner border border-gray-300"></div>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-[var(--bg-base)] rounded-full shadow-inner border border-gray-300"></div>
                    <div className="absolute bottom-4 left-32 w-3 h-3 bg-[var(--bg-base)] rounded-full shadow-inner border border-gray-300"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-[var(--bg-base)] rounded-full shadow-inner border border-gray-300"></div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
