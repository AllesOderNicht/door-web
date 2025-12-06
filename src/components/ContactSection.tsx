'use client'

import { useState, FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faClock,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import styles from './ContactSection.module.css'

/**
 * 联系我们区域组件
 * 展示公司联系方式并提供询价表单
 */
export const ContactSection = () => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitMessage({ type: 'success', text: data.message || t('contact.form.success') })
        // 清空表单
        setFormData({
          name: '',
          company: '',
          phone: '',
          email: '',
          service: '',
          message: ''
        })
        // 3秒后清除成功消息
        setTimeout(() => {
          setSubmitMessage(null)
        }, 5000)
      } else {
        setSubmitMessage({ type: 'error', text: data.message || t('contact.form.error') })
      }
    } catch (error) {
      console.error('提交询价失败:', error)
      setSubmitMessage({ type: 'error', text: t('contact.form.networkError') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactItems = [
    {
      icon: faMapMarkerAlt,
      title: t('contact.info.address.title'),
      content: t('contact.info.address.content')
    },
    {
      icon: faPhoneAlt,
      title: t('contact.info.phone.title'),
      content: t('contact.info.phone.content')
    },
    {
      icon: faEnvelope,
      title: t('contact.info.email.title'),
      content: t('contact.info.email.content')
    },
    {
      icon: faClock,
      title: t('contact.info.hours.title'),
      content: t('contact.info.hours.content')
    }
  ]

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h3>{t('contact.companyName')}</h3>
            
            <div className={styles.contactDetails}>
              {contactItems.map((item, index) => (
                <div key={index} className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <div className={styles.contactText}>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <p>{t('contact.description')}</p>
          </div>
          
          <div className={styles.contactFormContainer}>
            <div className={styles.contactForm}>
              <h3>{t('contact.form.title')}</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.formControl}
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="company">{t('contact.form.company')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className={styles.formControl}
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">{t('contact.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.formControl}
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formControl}
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="service">{t('contact.form.service')}</label>
                  <select
                    id="service"
                    name="service"
                    className={styles.formControl}
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">{t('contact.form.servicePlaceholder')}</option>
                    <option value="engineering">{t('contact.form.serviceOptions.engineering')}</option>
                    <option value="supply">{t('contact.form.serviceOptions.supply')}</option>
                    <option value="maintenance">{t('contact.form.serviceOptions.maintenance')}</option>
                    <option value="consulting">{t('contact.form.serviceOptions.consulting')}</option>
                    <option value="inspection">{t('contact.form.serviceOptions.inspection')}</option>
                    <option value="crew">{t('contact.form.serviceOptions.crew')}</option>
                    <option value="sale">{t('contact.form.serviceOptions.sale')}</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">{t('contact.form.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.formControl}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                {submitMessage && (
                  <div
                    className={`${styles.submitMessage} ${
                      submitMessage.type === 'success' ? styles.success : styles.error
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
                
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}