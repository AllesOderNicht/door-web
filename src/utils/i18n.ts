import i18n from '@/i18n'

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code']

/**
 * 获取语言显示名称
 * @param code 语言代码
 */
export const getLanguageName = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code)
  return language?.name || code
}

/**
 * 获取语言国旗图标
 * @param code 语言代码
 */
export const getLanguageFlag = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code)
  return language?.flag || '🌐'
}

/**
 * 检查语言是否受支持
 * @param code 语言代码
 */
export const isLanguageSupported = (code: string): code is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
}

/**
 * 获取下一个语言
 * @param currentCode 当前语言代码
 */
export const getNextLanguage = (currentCode: string): SupportedLanguage => {
  const currentIndex = SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentCode)
  const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length
  return SUPPORTED_LANGUAGES[nextIndex].code
}

/**
 * 初始化 i18n
 */
export const initI18n = () => {
  return i18n
}
