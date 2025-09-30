'use client'

import { motion } from 'framer-motion'
import { ParallaxBanner } from '@/components/ParallaxBanner'
import { useI18n } from '@/hooks/useI18n'
import styles from './HeroSection.module.css'

/**
 * 英雄区域组件
 * 包含视差滚动背景和动画效果
 */
export const HeroSection = () => {
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
    <section id="home" className={styles.hero}>
      {/* 视差背景 */}
      <ParallaxBanner
        imageUrl="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        className={styles.parallaxBackground}
      />
      
      {/* 渐变遮罩 */}
      <div className={styles.gradientOverlay} />
      
      {/* 动态背景效果 */}
      <div className={styles.dynamicBackground} />

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className={styles.title}>
            {t('hero.title')}
            <br />
            <span className={styles.accent}>{t('hero.subtitle')}</span>
          </h1>
        </motion.div>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          className={styles.buttonGroup}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.button
            onClick={() => scrollToSection('#contact')}
            className="btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('hero.cta')}
          </motion.button>
          
          <motion.button
            onClick={() => scrollToSection('#cases')}
            className="btn btn-secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('nav.cases')}
          </motion.button>
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className={styles.scrollIndicatorInner}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className={styles.scrollIndicatorDot}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
