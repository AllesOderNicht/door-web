import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/providers/I18nProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '贻洋船舶服务 - 专业船舶工程服务与供应',
  description: '贻洋船舶服务为全球航运业提供专业、高效、可靠的船舶技术服务，包括船舶工程服务、设备供应和普通货船买卖等。',
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
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}

