import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

/**
 * 自定义 i18n hook
 * 提供类型安全的翻译功能
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation()

  /**
   * 切换语言
   * @param lng 语言代码
   */
  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng)
  }, [i18n])

  /**
   * 获取当前语言
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language
  }, [i18n])

  /**
   * 检查是否为中文
   */
  const isChinese = useCallback(() => {
    return i18n.language.startsWith('zh')
  }, [i18n.language])

  /**
   * 检查是否为英文
   */
  const isEnglish = useCallback(() => {
    return i18n.language.startsWith('en')
  }, [i18n.language])

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isChinese,
    isEnglish,
    currentLanguage: i18n.language
  }
}
