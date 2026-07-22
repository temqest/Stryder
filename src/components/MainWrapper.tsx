'use client'

import { usePathname } from 'next/navigation'

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/runner')) {
    return <main className="flex-1 flex flex-col">{children}</main>
  }

  return (
    <main className="pt-16 flex-1 flex flex-col">
      {children}
    </main>
  )
}
