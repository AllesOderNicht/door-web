'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useI18n } from '@/hooks/useI18n'
import styles from './CaseDetail.module.css'
import type { CaseDetail as CaseDetailData } from '@/data/cases'

interface CaseDetailProps {
  caseData: CaseDetailData
}

/**
 * 案例详情组件
 * 展示案例的详细信息和介绍
 */
export const CaseDetail = ({ caseData }: CaseDetailProps) => {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <section className={styles.caseDetail}>
      <div className={styles.container}>
        {/* 返回按钮 */}
        <button className={styles.backButton} onClick={() => router.back()}>
          ← {t('cases.backToList')}
        </button>

        {/* 案例头部信息 */}
        <div className={styles.header}>
          <div className={styles.headerImage}>
            <Image
              src={caseData.image}
              alt={caseData.title}
              width={1200}
              height={500}
              className={styles.image}
            />
          </div>
          <div className={styles.headerContent}>
            <div className={styles.tags}>
              {caseData.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <h1>{caseData.title}</h1>
            <p className={styles.description}>{caseData.description}</p>
            {caseData.client && (
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t('cases.detail.client')}：</span>
                  <span className={styles.metaValue}>{caseData.client}</span>
                </div>
                {caseData.duration && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>{t('cases.detail.duration')}：</span>
                    <span className={styles.metaValue}>{caseData.duration}</span>
                  </div>
                )}
                {caseData.location && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>{t('cases.detail.location')}：</span>
                    <span className={styles.metaValue}>{caseData.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 案例详细内容 */}
        <div className={styles.content}>
          {/* 项目概述 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('cases.detail.overview')}</h2>
            <p className={styles.sectionText}>{caseData.overview}</p>
          </div>

          {/* 面临的挑战 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('cases.detail.challenge')}</h2>
            <p className={styles.sectionText}>{caseData.challenge}</p>
          </div>

          {/* 解决方案 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('cases.detail.solution')}</h2>
            <ul className={styles.solutionList}>
              {caseData.solution.map((item, index) => (
                <li key={index} className={styles.solutionItem}>
                  <span className={styles.solutionNumber}>{index + 1}</span>
                  <span className={styles.solutionText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 项目成果 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('cases.detail.results')}</h2>
            <ul className={styles.resultsList}>
              {caseData.results.map((result, index) => (
                <li key={index} className={styles.resultItem}>
                  <span className={styles.resultIcon}>✓</span>
                  <span className={styles.resultText}>{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 项目亮点 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('cases.detail.highlights')}</h2>
            <div className={styles.highlightsGrid}>
              {caseData.highlights.map((highlight, index) => (
                <div key={index} className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>★</div>
                  <p className={styles.highlightText}>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className={styles.actions}>
          <button className={styles.contactButton} onClick={() => {
            window.location.href = '/#contact'
          }}>
            {t('contact.title')}
          </button>
          <button className={styles.backToListButton} onClick={() => router.push('/#cases')}>
            {t('cases.viewMore')}
          </button>
        </div>
      </div>
    </section>
  )
}

