'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward, faShieldAlt, faCertificate, faAnchor } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './CertificationsSection.module.css'

/**
 * 资质证书组件
 * 展示公司的认证和资质
 */
export const CertificationsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const certifications = [
    {
      icon: faAward,
      title: t('certifications.iso9001.title'),
      description: t('certifications.iso9001.description')
    },
    {
      icon: faShieldAlt,
      title: t('certifications.iso14001.title'),
      description: t('certifications.iso14001.description')
    },
    {
      icon: faCertificate,
      title: t('certifications.classnk.title'),
      description: t('certifications.classnk.description')
    },
    {
      icon: faAnchor,
      title: t('certifications.abs.title'),
      description: t('certifications.abs.description')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="certifications" className={styles.certifications}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            {t('certifications.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className={styles.certGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`${styles.certCard} tech-border`}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* 图标 */}
                <div className={styles.certIcon}>
                  <FontAwesomeIcon icon={cert.icon} />
                </div>

                {/* 标题和描述 */}
                <h3 className={styles.cardTitle}>
                  {cert.title}
                </h3>
                <p className={styles.cardDescription}>
                  {cert.description}
                </p>

                {/* 悬停效果 */}
                <div className={styles.hoverOverlay} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
