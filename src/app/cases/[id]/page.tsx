import { notFound } from 'next/navigation'
import { CaseDetailPageClient } from './CaseDetailPageClient'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * 案例详情页面
 * 动态路由：/cases/[id]
 */
export default function CaseDetailPage({ params }: PageProps) {
  return (
    <main>
      <Header />
      <CaseDetailPageClient caseId={params.id} />
      <Footer />
    </main>
  )
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  const caseIds = [
    'large-cruise-engineering',
    'regular-maintenance',
    'equipment-supply',
    'engineering-equipment-supply',
    'cargo-ship-transaction',
    'technology-upgrade'
  ]
  return caseIds.map((id) => ({
    id,
  }))
}

