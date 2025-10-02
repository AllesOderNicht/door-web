'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faHardHat, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './ComplexProjectsSection.module.css'

/**
 * 高难度工程项目组件
 * 展示公司的技术能力和复杂项目经验
 */
export const ComplexProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const projects = [
    {
      icon: faCogs,
      title: t('projects.emergency.title'),
      difficulty: t('projects.emergency.difficulty'),
      description: t('projects.emergency.description')
    },
    {
      icon: faHardHat,
      title: t('projects.hull.title'),
      difficulty: t('projects.hull.difficulty'),
      description: t('projects.hull.description')
    },
    {
      icon: faMicrochip,
      title: t('projects.control.title'),
      difficulty: t('projects.control.difficulty'),
      description: t('projects.control.description')
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
    <section id="projects" className={styles.complexProjects}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            {t('projects.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`${styles.projectCard} tech-border`}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* 图标 */}
                <div className={styles.projectIcon}>
                  <FontAwesomeIcon icon={project.icon} />
                </div>

                {/* 难度标签 */}
                <motion.span
                  className={`${styles.difficulty} ${
                    project.difficulty === t('projects.emergency.difficulty') ? styles.high :
                    project.difficulty === t('projects.hull.difficulty') ? styles.extreme :
                    styles.advanced
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {project.difficulty}
                </motion.span>

                {/* 标题和描述 */}
                <h3 className={styles.cardTitle}>
                  {project.title}
                </h3>
                <p className={styles.cardDescription}>
                  {project.description}
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
