'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useI18n } from '@/hooks/useI18n'
import styles from './CasesSection.module.css'

/**
 * 案例展示组件
 * 展示公司的重要项目案例
 */
export const CasesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const [hoveredCase, setHoveredCase] = useState<number | null>(null)

  const cases = [
    {
      id: 1,
      title: t('cases.adaMagic.title'),
      description: t('cases.adaMagic.description'),
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      link: '#'
    },
    {
      id: 2,
      title: t('cases.adaMediterranean.title'),
      description: t('cases.adaMediterranean.description'),
      image: 'https://images.unsplash.com/photo-1501959181532-7d2a3c064642?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      link: '#'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  return (
    <section id="cases" className={styles.cases}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            {t('cases.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('cases.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className={styles.casesGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              variants={itemVariants}
              className="group"
              onMouseEnter={() => setHoveredCase(caseItem.id)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              <motion.div
                className={`${styles.caseCard} tech-border`}
                whileHover={{ y: -10 }}
              >
                {/* 图片区域 */}
                <div className={styles.caseImage} style={{ backgroundImage: `url(${caseItem.image})` }}>
                  {/* 悬停遮罩 */}
                  <motion.div
                    className={styles.caseOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredCase === caseItem.id ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      className="btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('cases.viewDetails')}
                    </motion.button>
                  </motion.div>
                </div>

                {/* 内容区域 */}
                <div className={styles.caseContent}>
                  <h3 className={styles.caseTitle}>
                    {caseItem.title}
                  </h3>
                  <p className={styles.caseDescription}>
                    {caseItem.description}
                  </p>
                  <motion.button
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('cases.learnMore')}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
