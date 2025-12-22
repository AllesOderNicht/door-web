'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShip, 
  faChevronRight,
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './Footer.module.css'

/**
 * 页脚区域组件
 * 展示公司信息、快速链接和联系信息
 */
export const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerAbout}>
            <div className={styles.footerLogo}>
              <FontAwesomeIcon icon={faShip} />
              {t('footer.companyName')}
            </div>
            <p>{t('footer.description')}</p>
          </div>
          
          <div className={styles.footerLinks}>
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><Link href="/#home"><FontAwesomeIcon icon={faChevronRight} /> {t('nav.home')}</Link></li>
              <li><Link href="/#about"><FontAwesomeIcon icon={faChevronRight} /> {t('nav.about')}</Link></li>
              <li><Link href="/#services"><FontAwesomeIcon icon={faChevronRight} /> {t('nav.services')}</Link></li>
              <li><Link href="/#cases"><FontAwesomeIcon icon={faChevronRight} /> {t('nav.cases')}</Link></li>
              <li><Link href="/#contact"><FontAwesomeIcon icon={faChevronRight} /> {t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerLinks}>
            <h4>{t('footer.contactInfo')}</h4>
            <ul>
              <li><Link href="/#contact"><FontAwesomeIcon icon={faMapMarkerAlt} /> {t('contact.info.address.content')}</Link></li>
              <li><a href="tel:+86 18633879967"><FontAwesomeIcon icon={faPhoneAlt} /> {t('contact.info.phone.content')}</a></li>
              <li><a href="mailto:yyservice@yymarines.com"><FontAwesomeIcon icon={faEnvelope} /> {t('contact.info.email.content')}</a></li>
              <li><Link href="/#contact"><FontAwesomeIcon icon={faClock} /> {t('contact.info.hours.content')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

