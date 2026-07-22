import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PublicNav } from '@/components/PublicNav'
import { MainWrapper } from '@/components/MainWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stryder - Race Registration',
  description: 'Find and register for running events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <PublicNav />
        <MainWrapper>
          {children}
        </MainWrapper>
      </body>
    </html>
  )
}
