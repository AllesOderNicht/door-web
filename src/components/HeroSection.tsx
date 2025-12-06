'use client'

import { useI18n } from '@/hooks/useI18n'
import styles from './HeroSection.module.css'

/**
 * 主视觉区域（Hero Section）组件
 * 展示公司主要业务和核心价值主张
 */
export const HeroSection = () => {
  const { t } = useI18n()

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>
        <h1 suppressHydrationWarning>{t('hero.title')}</h1>
        <p suppressHydrationWarning>{t('hero.description')}</p>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToContact(); }} className={styles.btn} suppressHydrationWarning>{t('hero.cta')}</a>
      </div>
    </section>
  )
}

