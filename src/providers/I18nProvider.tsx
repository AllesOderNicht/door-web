'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * i18n 提供者组件
 * 在客户端初始化 i18n，确保服务端和客户端语言一致
 */
export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [mounted, setMounted] = useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    // 客户端挂载后，从 localStorage 恢复语言设置
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('i18nextLng')
      if (stored && (stored === 'zh-CN' || stored === 'en-US') && stored !== i18n.language) {
        i18n.changeLanguage(stored)
      }
    }
    setMounted(true)
  }, [i18n])

  // 在客户端挂载前，使用默认语言渲染，避免 hydration 不匹配
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return <>{children}</>
}

