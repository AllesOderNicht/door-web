'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faBars } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

/**
 * 导航栏组件
 * 包含滚动效果和移动端菜单
 */
export const Header = () => {
  const { t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 处理页面内滚动
  const handleNavigation = (href: string) => {
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  // Logo 点击处理
  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#cases', label: t('nav.cases') },
    { href: '#contact', label: t('nav.contact') },
  ]

  return (
    <header 
      id="header"
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        {/* Logo区域 */}
        {isHomePage ? (
          <div className={styles.logo} onClick={handleLogoClick}>
            <FontAwesomeIcon icon={faShip} className={styles.logoIcon} />
            贻洋<span className={styles.accent}>船舶服务</span>
          </div>
        ) : (
          <Link href="/" className={styles.logo}>
            <FontAwesomeIcon icon={faShip} className={styles.logoIcon} />
            贻洋<span className={styles.accent}>船舶服务</span>
          </Link>
        )}

        {/* 导航和语言切换器容器 */}
        <div className={styles.navWrapper}>
          {/* 主导航菜单 */}
          <nav 
            id="nav"
            className={`${styles.nav} ${isMobileMenuOpen ? styles.active : ''}`}
          >
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  {isHomePage ? (
                    <a 
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavigation(item.href)
                      }}
                      suppressHydrationWarning
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      href={`/${item.href}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      suppressHydrationWarning
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* 桌面端语言切换器 */}
          <div className={styles.desktopLanguageSwitcher}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* 移动端右侧按钮组（语言切换器 + 菜单按钮） */}
        <div className={styles.mobileRightButtons}>
          {/* 移动端语言切换器 */}
          <div className={styles.mobileLanguageSwitcher}>
            <LanguageSwitcher />
          </div>
          {/* 移动端菜单按钮 */}
          <div 
            className={styles.mobileMenu}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
    </header>
  )
}

