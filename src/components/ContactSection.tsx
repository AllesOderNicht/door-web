'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useI18n } from '@/hooks/useI18n'
import styles from './ContactSection.module.css'

/**
 * 联系我们组件
 * 包含联系信息和表单
 */
export const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })
  const { t } = useI18n()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vessel: '',
    service: '',
    message: ''
  })

  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: t('contact.info.headquarters.title'),
      details: t('contact.info.headquarters.details', { returnObjects: true }) as string[]
    },
    {
      icon: faPhone,
      title: t('contact.info.phone.title'),
      details: t('contact.info.phone.details', { returnObjects: true }) as string[]
    },
    {
      icon: faEnvelope,
      title: t('contact.info.email.title'),
      details: t('contact.info.email.details', { returnObjects: true }) as string[]
    },
    {
      icon: faClock,
      title: t('contact.info.hours.title'),
      details: t('contact.info.hours.details', { returnObjects: true }) as string[]
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(t('contact.form.success'))
    setFormData({
      name: '',
      email: '',
      vessel: '',
      service: '',
      message: ''
    })
  }

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            {t('contact.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className={styles.content}>
          {/* 联系信息 */}
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className={styles.contactItem}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <motion.div
                  className={styles.contactIcon}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FontAwesomeIcon icon={info.icon} />
                </motion.div>
                <div className={styles.contactDetails}>
                  <h3 className={styles.contactTitle}>
                    {info.title}
                  </h3>
                  {Array.isArray(info.details) ? info.details.map((detail, idx) => (
                    <p key={idx} className={styles.contactText}>
                      {detail}
                    </p>
                  )) : (
                    <p className={styles.contactText}>
                      {info.details}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 联系表单 */}
          <motion.div
            className={styles.contactForm}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="vessel" className={styles.formLabel}>
                  {t('contact.form.vessel')}
                </label>
                <select
                  id="vessel"
                  name="vessel"
                  value={formData.vessel}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                >
                  <option value="">{t('contact.form.vesselPlaceholder')}</option>
                  <option value="luxury-yacht">{t('contact.form.vesselOptions.luxuryYacht')}</option>
                  <option value="cruise-ship">{t('contact.form.vesselOptions.cruiseShip')}</option>
                  <option value="megayacht">{t('contact.form.vesselOptions.megayacht')}</option>
                  <option value="other">{t('contact.form.vesselOptions.other')}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="service" className={styles.formLabel}>
                  {t('contact.form.service')}
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                >
                  <option value="">{t('contact.form.servicePlaceholder')}</option>
                  <option value="maintenance">{t('contact.form.serviceOptions.maintenance')}</option>
                  <option value="repair">{t('contact.form.serviceOptions.repair')}</option>
                  <option value="refurbishment">{t('contact.form.serviceOptions.refurbishment')}</option>
                  <option value="upgrade">{t('contact.form.serviceOptions.upgrade')}</option>
                  <option value="other">{t('contact.form.serviceOptions.other')}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className={styles.formControl}
                />
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('contact.form.submit')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
