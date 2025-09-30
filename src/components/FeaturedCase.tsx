'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '@/hooks/useI18n'
import styles from './FeaturedCase.module.css'

/**
 * 爱达魔都号特别展示组件
 * 展示公司的重要案例
 */
export const FeaturedCase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  })
  const { t } = useI18n()

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className={styles.featuredCase}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.content}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* 文字内容 */}
          <motion.div
            className={styles.textContent}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={styles.title}>
              {t('featured.title')}
            </h2>
            <p className={styles.description}>
              {t('featured.description1')}
            </p>
            <p className={styles.description}>
              {t('featured.description2')}
            </p>
            <motion.button
              onClick={() => scrollToSection('#cases')}
              className={styles.button}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('featured.cta')}
            </motion.button>
          </motion.div>

          {/* 图片内容 */}
          <motion.div
            className={styles.imageContent}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={styles.imageContainer}>
              <div className={styles.image} />
              
              {/* 悬停遮罩效果 */}
              <div className={styles.hoverOverlay} />
              
              {/* 装饰性边框 */}
              <div className={styles.decorativeBorder} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
