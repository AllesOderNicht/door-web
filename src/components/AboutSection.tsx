'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBullseye, 
  faShip, 
  faClock, 
  faAward 
} from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './AboutSection.module.css'
import Image from 'next/image'

// 注意：Next.js Image 组件需要配置图片域名，已在 next.config.ts 中配置

/**
 * 关于我们区域组件
 * 介绍公司使命、优势和服务特色
 */
export const AboutSection = () => {
  const { t } = useI18n()

  const features = [
    {
      icon: faBullseye,
      title: t('about.features.team.title'),
      description: t('about.features.team.description')
    },
    {
      icon: faShip,
      title: t('about.features.services.title'),
      description: t('about.features.services.description')
    },
    {
      icon: faClock,
      title: t('about.features.response.title'),
      description: t('about.features.response.description')
    },
    {
      icon: faAward,
      title: t('about.features.quality.title'),
      description: t('about.features.quality.description')
    }
  ]

  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>{t('about.title')}</h2>
          <p>{t('about.subtitle')}</p>
        </div>
        
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h3>{t('about.mission')}</h3>
            <p>{t('about.content.paragraph1')}</p>
            <p>{t('about.content.paragraph2')}</p>
            <p>{t('about.content.paragraph3')}</p>
            
            <div className={styles.aboutFeatures}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <div className={styles.featureText}>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.aboutImage}>
            <Image
              src="/AboutUs.jpg"
              alt={t('about.title')}
              width={600}
              height={400}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

