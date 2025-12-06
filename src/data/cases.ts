/**
 * 案例数据定义
 * 包含所有案例的详细信息和介绍内容
 */

export interface CaseDetail {
  id: string
  category: 'engineering' | 'supply' | 'sale'
  title: string
  tags: string[]
  description: string
  image: string
  // 详情页内容
  overview: string
  challenge: string
  solution: string[]
  results: string[]
  highlights: string[]
  client?: string
  duration?: string
  location?: string
}

// 案例ID列表
export const caseIds = [
  'large-cruise-engineering',
  'regular-maintenance',
  'equipment-supply',
  'engineering-equipment-supply',
  'cargo-ship-transaction',
  'technology-upgrade'
] as const

// 案例类别映射
const caseCategoryMap: Record<string, 'engineering' | 'supply' | 'sale'> = {
  'large-cruise-engineering': 'engineering',
  'regular-maintenance': 'engineering',
  'equipment-supply': 'supply',
  'engineering-equipment-supply': 'supply',
  'cargo-ship-transaction': 'sale',
  'technology-upgrade': 'engineering'
}

// 案例图片映射
export const caseImageMap: Record<string, string> = {
  'large-cruise-engineering': '/case1.png',
  'regular-maintenance': '/case2.png',
  'equipment-supply': '/case3.png',
  'engineering-equipment-supply': '/case4.png',
  'cargo-ship-transaction': '/case5.png',
  'technology-upgrade': '/case6.png'
}

/**
 * 根据翻译函数获取案例数据
 * @param t 翻译函数
 */
export function getCasesData(t: (key: string) => string): CaseDetail[] {
  return caseIds.map(id => {
    const baseKey = `cases.items.${id}`
    return {
      id,
      category: caseCategoryMap[id],
      title: t(`${baseKey}.title`),
      tags: (t(`${baseKey}.tags`, { returnObjects: true }) as string[]) || [],
      description: t(`${baseKey}.description`),
      image: caseImageMap[id],
      overview: t(`${baseKey}.overview`),
      challenge: t(`${baseKey}.challenge`),
      solution: (t(`${baseKey}.solution`, { returnObjects: true }) as string[]) || [],
      results: (t(`${baseKey}.results`, { returnObjects: true }) as string[]) || [],
      highlights: (t(`${baseKey}.highlights`, { returnObjects: true }) as string[]) || [],
      client: t(`${baseKey}.client`),
      duration: t(`${baseKey}.duration`),
      location: t(`${baseKey}.location`)
    }
  })
}

// 原始数据已移除，现在使用 getCasesData 函数根据翻译获取数据
// 如需查看原始数据，请参考翻译文件中的 cases.items

/**
 * 根据ID获取案例详情
 * @param id 案例ID
 * @param t 翻译函数
 */
export function getCaseById(id: string, t: (key: string) => string): CaseDetail | undefined {
  const cases = getCasesData(t)
  return cases.find(caseItem => caseItem.id === id)
}

/**
 * 根据类别获取案例列表
 * @param category 案例类别
 * @param t 翻译函数
 */
export function getCasesByCategory(category: string, t: (key: string) => string): CaseDetail[] {
  const cases = getCasesData(t)
  if (category === 'all') {
    return cases
  }
  return cases.filter(caseItem => caseItem.category === category)
}

