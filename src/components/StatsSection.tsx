'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/hooks/useI18n'
import styles from './StatsSection.module.css'

/**
 * 统计数据组件
 * 展示公司的关键数据
 */
export const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  })
  const { t } = useI18n()

  const [counts, setCounts] = useState({
    vessels: 0,
    satisfaction: 0,
    support: 0,
    cruiseLines: 0
  })

  const stats = useMemo(() => [
    {
      value: 50,
      suffix: '+',
      label: t('stats.vessels'),
      key: 'vessels'
    },
    {
      value: 98,
      suffix: '%',
      label: t('stats.satisfaction'),
      key: 'satisfaction'
    },
    {
      value: 24,
      suffix: '/7',
      label: t('stats.support'),
      key: 'support'
    },
    {
      value: 5,
      suffix: '',
      label: t('stats.cruiseLines'),
      key: 'cruiseLines'
    }
  ], [t])

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2秒动画
      const steps = 60 // 60步
      const stepDuration = duration / steps

      stats.forEach((stat) => {
        const targetValue = stat.value
        const increment = targetValue / steps
        let currentValue = 0

        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= targetValue) {
            currentValue = targetValue
            clearInterval(timer)
          }

          setCounts(prev => ({
            ...prev,
            [stat.key]: Math.floor(currentValue)
          }))
        }, stepDuration)
      })
    }
  }, [inView, stats])

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
    <section className={styles.stats}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={styles.statItem}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="h-full flex flex-col items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className={styles.statValue}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {counts[stat.key as keyof typeof counts]}{stat.suffix}
                  </motion.div>
                  <div className={styles.statLabel}>
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
