import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/providers/I18nProvider'

const inter = Inter({ subsets: ['latin'] })

// 网站基础URL，生产环境应配置环境变量
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yymarines.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '贻洋船舶服务 - 专业船舶工程服务与供应',
    template: '%s | 贻洋船舶服务',
  },
  description: '贻洋船舶服务为全球航运业提供专业、高效、可靠的船舶技术服务，包括船舶工程服务、设备供应和普通货船买卖等。总部位于上海，服务全球。',
  keywords: [
    '船舶服务', '船舶工程', '船舶设备供应', '船舶维修', '货船买卖', 
    'Marine Services', 'Ship Engineering', 'Marine Equipment Supply', 'Ship Maintenance'
  ],
  authors: [{ name: '贻洋船舶服务' }],
  creator: '贻洋船舶服务',
  publisher: '贻洋船舶服务',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '贻洋船舶服务 - 专业船舶工程服务与供应',
    description: '专业提供船舶工程服务、设备供应及普通货船买卖。全球化服务网络，24小时快速响应。',
    url: SITE_URL,
    siteName: '贻洋船舶服务',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/Heroimage.jpg', // 使用首页大图作为默认OG图片
        width: 1200,
        height: 630,
        alt: '贻洋船舶服务',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '贻洋船舶服务',
    description: '专业船舶工程服务与设备供应专家',
    images: ['/Heroimage.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
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
