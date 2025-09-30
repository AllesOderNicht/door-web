import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TechBackground } from '@/components/TechBackground'
import { I18nProvider } from '@/providers/I18nProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yiyang Marine Service | Premium Cruise Ship Repair & Maintenance',
  description: 'World-class repair, maintenance and refurbishment for the most prestigious vessels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <I18nProvider>
          <TechBackground />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}