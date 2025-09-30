'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faBars } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

/**
 * 导航栏组件
 * 包含滚动效果和移动端菜单
 */
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useI18n()

  const navItems = [
    { href: '#home', label: t('nav.home') },
    { href: '#services', label: t('nav.services') },
    { href: '#cases', label: t('nav.cases') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#certifications', label: t('nav.certifications') },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : styles.normal}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <nav className={styles.nav}>
          {/* Logo */}
          <motion.div 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('#home')}
          >
            <FontAwesomeIcon 
              icon={faShip} 
              className={styles.logoIcon}
            />
            <div className={styles.logoText}>
              Yiyang<span className={styles.accent}>Marine</span>Service
            </div>
          </motion.div>

          {/* 桌面端导航 */}
          <ul className={styles.navLinks}>
            {navItems.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => scrollToSection(item.href)}
                  className={styles.navLink}
                >
                  {item.label}
                </div>
              </motion.li>
            ))}
          </ul>

          {/* 语言切换器 - 桌面端 */}
          <div className={styles.languageSwitcherContainer}>
            <LanguageSwitcher light={true} />
          </div>

          {/* 移动端右侧区域 */}
          <div className={styles.mobileRightSection}>
            {/* 移动端语言切换器 */}
            <div className={styles.mobileLanguageSwitcher}>
              <LanguageSwitcher light={true} />
            </div>
            
            {/* 移动端菜单按钮 */}
            <div
              className={styles.mobileMenu}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
          </div>
        </nav>

        {/* 移动端菜单 */}
        <motion.div
          className={`${styles.mobileMenuContent} ${isMobileMenuOpen ? styles.open : styles.closed}`}
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className={styles.mobileMenuList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <div
                  onClick={() => scrollToSection(item.href)}
                  className={styles.mobileMenuLink}
                >
                  {item.label}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.header>
  )
}
