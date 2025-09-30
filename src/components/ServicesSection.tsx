'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTools, 
  faBolt, 
  faCouch, 
  faPaintRoller, 
  faLifeRing, 
  faConciergeBell 
} from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './ServicesSection.module.css'

/**
 * 服务区域组件
 * 展示公司提供的各种服务
 */
export const ServicesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const services = [
    {
      icon: faTools,
      title: t('services.mechanical.title'),
      description: t('services.mechanical.description')
    },
    {
      icon: faBolt,
      title: t('services.electrical.title'),
      description: t('services.electrical.description')
    },
    {
      icon: faCouch,
      title: t('services.interior.title'),
      description: t('services.interior.description')
    },
    {
      icon: faPaintRoller,
      title: t('services.exterior.title'),
      description: t('services.exterior.description')
    },
    {
      icon: faLifeRing,
      title: t('services.safety.title'),
      description: t('services.safety.description')
    },
    {
      icon: faConciergeBell,
      title: t('services.luxury.title'),
      description: t('services.luxury.description')
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
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            {t('services.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('services.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className={styles.servicesGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`${styles.serviceCard} tech-border`}
                whileHover={{ scale: 1.02 }}
              >
                {/* 图标 */}
                <div className={styles.serviceIcon}>
                  <FontAwesomeIcon icon={service.icon} />
                </div>

                {/* 标题和描述 */}
                <h3 className={styles.cardTitle}>
                  {service.title}
                </h3>
                <p className={styles.cardDescription}>
                  {service.description}
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
