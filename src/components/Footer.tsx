'use client'

import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLinkedinIn, 
  faTwitter, 
  faInstagram, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './Footer.module.css'

/**
 * 页脚组件
 * 包含公司信息和链接
 */
export const Footer = () => {
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

  const footerLinks = {
    quick: [
      { href: '#home', label: t('nav.home') },
      { href: '#services', label: t('nav.services') },
      { href: '#cases', label: t('nav.cases') },
      { href: '#projects', label: t('nav.projects') },
      { href: '#certifications', label: t('nav.certifications') },
      { href: '#about', label: t('nav.about') },
      { href: '#contact', label: t('nav.contact') }
    ],
    services: [
      { href: '#', label: t('services.mechanical.title') },
      { href: '#', label: t('services.electrical.title') },
      { href: '#', label: t('services.interior.title') },
      { href: '#', label: t('services.exterior.title') },
      { href: '#', label: t('services.safety.title') }
    ],
    locations: [
      { href: '#', label: t('footer.locations.shanghai') },
      { href: '#', label: t('footer.locations.hongkong') },
      { href: '#', label: t('footer.locations.singapore') },
      { href: '#', label: t('footer.locations.busan') },
      { href: '#', label: t('footer.locations.yokohama') }
    ]
  }

  const socialLinks = [
    { icon: faLinkedinIn, href: '#' },
    { icon: faTwitter, href: '#' },
    { icon: faInstagram, href: '#' },
    { icon: faYoutube, href: '#' }
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div
          className={styles.footerContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 公司信息 */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>
              {t('footer.companyName')}
            </h3>
            <p className={styles.footerDescription}>
              {t('footer.description')}
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 快速链接 */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>
              {t('footer.quickLinks')}
            </h3>
            <ul className={styles.footerLinks}>
              {footerLinks.quick.map((link, index) => (
                <li key={index} className={styles.footerLinkItem}>
                  <div
                    onClick={() => scrollToSection(link.href)}
                    className={styles.footerLink}
                  >
                    {link.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 我们的服务 */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>
              {t('footer.ourServices')}
            </h3>
            <ul className={styles.footerLinks}>
              {footerLinks.services.map((link, index) => (
                <li key={index} className={styles.footerLinkItem}>
                  <a
                    href={link.href}
                    className={styles.footerLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 服务地点 */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>
              {t('footer.serviceLocations')}
            </h3>
            <ul className={styles.footerLinks}>
              {footerLinks.locations.map((link, index) => (
                <li key={index} className={styles.footerLinkItem}>
                  <a
                    href={link.href}
                    className={styles.footerLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* 版权信息 */}
        <motion.div
          className={styles.copyright}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>
            {t('footer.copyright')}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
