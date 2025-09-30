'use client'

import { useEffect } from 'react'
import { initI18n } from '@/utils/i18n'

/**
 * i18n 提供者组件
 * 在客户端初始化 i18n
 */
interface I18nProviderProps {
  children: React.ReactNode
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    // 初始化 i18n
    initI18n()
  }, [])

  return <>{children}</>
}
