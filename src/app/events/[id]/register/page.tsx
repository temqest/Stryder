'use client'

import { useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    // Simulate API call to checkout endpoint
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        eventId: id,
        categoryId,
        name: formData.get('name'),
        email: formData.get('email'),
        emergencyContact: formData.get('emergencyContact'),
        shirtSize: formData.get('shirtSize'),
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      const data = await res.json()
      router.push(`/tickets/${data.registrationId}`)
    } else {
      setIsSubmitting(false)
      alert("Failed to register. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center py-24 px-6 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="mb-12">
          <span className="uppercase text-[11px] tracking-[0.2em] text-[var(--accent)] font-bold mb-4 block">
            Step 1 of 2
          </span>
          <h1 className="text-5xl font-black uppercase tracking-tight mb-4 leading-none">Participant Info</h1>
          <p className="text-[var(--text-secondary)] text-lg">Secure your spot. Fill in your details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-panel)] p-10 rounded-3xl border border-[var(--border-subtle)]">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
                <input required name="name" type="text" className="w-full px-5 py-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[#333]" placeholder="JONATHAN DOE" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email Address</label>
                <input required name="email" type="email" className="w-full px-5 py-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[#333]" placeholder="RUNNER@EXAMPLE.COM" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Emergency Contact</label>
              <input required name="emergencyContact" type="text" className="w-full px-5 py-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[#333]" placeholder="JANE DOE - 0917-XXX-XXXX" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Shirt Size</label>
              <select required name="shirtSize" className="w-full px-5 py-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all appearance-none">
                <option value="">SELECT SIZE</option>
                <option value="S">SMALL (S)</option>
                <option value="M">MEDIUM (M)</option>
                <option value="L">LARGE (L)</option>
                <option value="XL">EXTRA LARGE (XL)</option>
              </select>
            </div>
            
          </div>
          
          <div className="mt-10 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-2 text-[var(--accent)]" /> 
              Secure Checkout
            </div>
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full md:w-auto px-10 py-4 rounded-full bg-[var(--accent)] text-[#0A0A0A] font-bold uppercase tracking-wider hover:bg-[var(--accent-dim)] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'PROCESSING...' : 'CONFIRM & PAY'}
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-3" />}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
