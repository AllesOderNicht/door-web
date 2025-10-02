'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { TranslationOutlined } from '@ant-design/icons'
import { useI18n } from '@/hooks/useI18n'
import { SUPPORTED_LANGUAGES, getLanguageName, getNextLanguage } from '@/utils/i18n'
import styles from './LanguageSwitcher.module.css'

/**
 * 语言切换组件
 * 支持下拉菜单和点击切换两种模式
 */
interface LanguageSwitcherProps {
  /** 是否显示为下拉菜单，默认为 false（点击切换模式） */
  showDropdown?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 是否使用浅色主题（用于浅色背景） */
  light?: boolean
}

export const LanguageSwitcher = ({ 
  showDropdown = false, 
  className = '',
  light = false
}: LanguageSwitcherProps) => {
  const { currentLanguage, changeLanguage } = useI18n()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage)
  const nextLang = getNextLanguage(currentLanguage)

  /**
   * 处理语言切换
   */
  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    setIsDropdownOpen(false)
  }

  /**
   * 处理点击切换（非下拉模式）
   */
  const handleToggleLanguage = () => {
    if (!showDropdown) {
      changeLanguage(nextLang)
    } else {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  if (showDropdown) {
    return (
      <div className={`${styles.languageSwitcher} ${styles.dropdown} ${light ? styles.light : ''} ${className}`}>
        <motion.button
          className={styles.trigger}
          onClick={handleToggleLanguage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.flag}>{currentLang?.flag}</span>
          <span className={styles.languageName}>{currentLang?.name}</span>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <motion.button
                  key={language.code}
                  className={`${styles.dropdownItem} ${
                    language.code === currentLanguage ? styles.active : ''
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                  whileHover={{ backgroundColor: 'var(--primary-color-light)' }}
                >
                  <span className={styles.flag}>{language.flag}</span>
                  <span className={styles.languageName}>{language.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div
    style={{
      marginLeft: '16px',
    }}
      onClick={handleToggleLanguage}
      title={`切换到 ${getLanguageName(nextLang)}`}
    >
      <TranslationOutlined className={styles.globeIcon} />
    </div>
  )
}
