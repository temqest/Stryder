import type { Metadata } from 'next'
import { Inter, Teko } from 'next/font/google'
import './globals.css'
import { PublicNav } from '@/components/PublicNav'
import { MainWrapper } from '@/components/MainWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const teko = Teko({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-teko' })

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
    <html lang="en" className={`dark ${inter.variable} ${teko.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <PublicNav />
        <MainWrapper>
          {children}
        </MainWrapper>
      </body>
    </html>
  )
}
