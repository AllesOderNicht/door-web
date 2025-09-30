'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward, faGlobe, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './AboutSection.module.css'

/**
 * 关于我们组件
 * 介绍公司背景和特色
 */
export const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const features = [
    {
      icon: faAward,
      title: t('about.features.quality.title'),
      description: t('about.features.quality.description')
    },
    {
      icon: faGlobe,
      title: t('about.features.asia.title'),
      description: t('about.features.asia.description')
    },
    {
      icon: faUserTie,
      title: t('about.features.team.title'),
      description: t('about.features.team.description')
    }
  ]

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
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
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
              {t('about.title')}
            </h2>
            
            <div className={styles.description}>
              <p>
                {t('about.content.paragraph1')}
              </p>
              <p>
                {t('about.content.paragraph2')}
              </p>
              <p>
                {t('about.content.paragraph3')}
              </p>
            </div>

            {/* 特色功能 */}
            <div className={styles.features}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={styles.featureItem}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <motion.div
                    className={styles.featureIcon}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FontAwesomeIcon icon={feature.icon} />
                  </motion.div>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>
                      {feature.title}
                    </h4>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => scrollToSection('#contact')}
              className={styles.button}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('about.cta')}
            </motion.button>
          </motion.div>

          {/* 图片内容 */}
          <motion.div
            className={styles.imageContent}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className={styles.imageContainer}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.image} />
              
              {/* 装饰性边框 */}
              <div className={styles.decorativeBorder} />
              
              {/* 悬停效果 */}
              <div className={styles.hoverOverlay} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}