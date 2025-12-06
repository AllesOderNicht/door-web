'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'
import styles from './CasesSection.module.css'
import Image from 'next/image'
import { getCasesByCategory } from '@/data/cases'

/**
 * 服务案例展示区域组件
 * 展示公司的成功案例，支持按类别筛选
 */
export const CasesSection = () => {
  const { t } = useI18n()
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: t('cases.categories.all') },
    { id: 'engineering', label: t('cases.categories.engineering') },
    { id: 'supply', label: t('cases.categories.supply') },
    { id: 'sale', label: t('cases.categories.sale') }
  ]

  const filteredCases = getCasesByCategory(activeCategory, t).map(({ id, category, title, tags, description, image }) => ({
    id,
    category,
    title,
    tags,
    description,
    image
  }))

  return (
    <section className={styles.cases} id="cases">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>{t('cases.title')}</h2>
          <p>{t('cases.subtitle')}</p>
        </div>
        
        <div className={styles.casesTabs}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.tabBtn} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className={styles.casesGrid}>
          {filteredCases.map((caseItem, index) => (
            <div key={index} className={styles.caseCard}>
              <div className={styles.caseImage}>
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  width={400}
                  height={220}
                  className={styles.image}
                />
              </div>
              <div className={styles.caseContent}>
                <h3>{caseItem.title}</h3>
                <div className={styles.caseTags}>
                  {caseItem.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.caseTag}>{tag}</span>
                  ))}
                </div>
                <p>{caseItem.description}</p>
                <Link href={`/cases/${caseItem.id}`} className={styles.btn}>{t('cases.viewDetails')}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

