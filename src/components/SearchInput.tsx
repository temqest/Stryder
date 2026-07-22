'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        if (query) {
          params.set('q', query)
        } else {
          params.delete('q')
        }
        router.push(`?${params.toString()}`)
      })
    }, 300) // Debounce

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  return (
    <div className="relative flex-1 lg:w-80">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-[var(--accent)] animate-pulse' : 'text-[var(--text-secondary)]'}`} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, location, or distance..."
        className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
      />
    </div>
  )
}
