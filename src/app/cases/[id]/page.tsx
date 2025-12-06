/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CaseDetailPageClient } from './CaseDetailPageClient'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { caseIds, caseImageMap } from '@/data/cases'
import zhCN from '@/i18n/locales/zh-CN.json'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// 提取案例数据的类型
type CaseItem = {
  title: string
  description: string
  [key: string]: unknown
}

// 动态生成 Metadata
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params
  
  // 检查 id 是否有效
  if (!caseIds.includes(id as any)) {
    return {
      title: '案例未找到',
    }
  }

  // 从 JSON 获取数据
  // 注意：这里简单处理，实际生产中可能需要更严谨的类型检查
  const casesData = (zhCN as any).cases.items
  const caseData = casesData[id] as CaseItem
  const image = caseImageMap[id] || '/Heroimage.jpg'

  if (!caseData) {
    return {
      title: '案例详情',
    }
  }

  return {
    title: caseData.title,
    description: caseData.description,
    openGraph: {
      title: caseData.title,
      description: caseData.description,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: caseData.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: caseData.title,
      description: caseData.description,
      images: [image],
    },
  }
}

/**
 * 案例详情页面
 * 动态路由：/cases/[id]
 */
export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params
  
  const casesData = (zhCN as any).cases.items
  const caseData = casesData[id] as CaseItem
  const image = caseImageMap[id] || '/Heroimage.jpg'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yymarines.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: caseData?.title,
    description: caseData?.description,
    image: `${siteUrl}${image}`,
    provider: {
      '@type': 'Organization',
      name: 'yymarines 贻洋船舶服务',
      url: siteUrl
    },
    areaServed: 'Global',
    url: `${siteUrl}/cases/${id}`
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <CaseDetailPageClient caseId={id} />
      <Footer />
    </main>
  )
}

// 生成静态参数
export async function generateStaticParams() {
  return caseIds.map((id) => ({
    id,
  }))
}
