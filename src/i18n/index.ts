import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
}

// 服务端和客户端都使用相同的初始语言（fallback）
// 客户端会在 hydration 后从 localStorage 恢复语言设置
const initialLanguage = 'en-US'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en-US',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    
    // 仅在客户端启用语言检测
    detection: {
      order: typeof window !== 'undefined' ? ['localStorage', 'navigator'] : [],
      caches: typeof window !== 'undefined' ? ['localStorage'] : [],
      lookupLocalStorage: 'i18nextLng',
    }
  })

export default i18n

