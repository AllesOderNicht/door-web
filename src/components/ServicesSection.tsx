'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTools,
  faCogs,
  faClipboardCheck,
  faCertificate,
  faUserTie,
  faHandshake
} from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './ServicesSection.module.css'

/**
 * 服务内容区域组件
 * 展示公司提供的各项服务
 */
export const ServicesSection = () => {
  const { t } = useI18n()

  const services = [
    {
      icon: faTools,
      title: t('services.items.maintenance.title'),
      description: t('services.items.maintenance.description')
    },
    {
      icon: faCogs,
      title: t('services.items.supply.title'),
      description: t('services.items.supply.description')
    },
    {
      icon: faClipboardCheck,
      title: t('services.items.consulting.title'),
      description: t('services.items.consulting.description')
    },
    {
      icon: faCertificate,
      title: t('services.items.inspection.title'),
      description: t('services.items.inspection.description')
    },
    {
      icon: faUserTie,
      title: t('services.items.crew.title'),
      description: t('services.items.crew.description')
    },
    {
      icon: faHandshake,
      title: t('services.items.sale.title'),
      description: t('services.items.sale.description')
    }
  ]

  return (
    <section className={styles.services} id="services">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>{t('services.title')}</h2>
          <p>{t('services.subtitle')}</p>
        </div>
        
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <div className={styles.serviceContent}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

