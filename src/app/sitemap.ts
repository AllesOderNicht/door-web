import { MetadataRoute } from 'next'
import { caseIds } from '@/data/cases'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yymarines.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const casesRoutes = caseIds.map((id) => ({
    url: `${SITE_URL}/cases/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...casesRoutes,
  ]
}
