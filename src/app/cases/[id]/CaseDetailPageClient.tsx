'use client'

import { useI18n } from '@/hooks/useI18n'
import { getCaseById } from '@/data/cases'
import { CaseDetail } from '@/components/CaseDetail'
import { notFound } from 'next/navigation'

interface CaseDetailPageClientProps {
  caseId: string
}

/**
 * 案例详情页面客户端组件
 * 处理翻译和案例数据获取
 */
export function CaseDetailPageClient({ caseId }: CaseDetailPageClientProps) {
  const { t } = useI18n()
  const caseDetail = getCaseById(caseId, t)

  if (!caseDetail) {
    notFound()
  }

  return <CaseDetail caseData={caseDetail} />
}

