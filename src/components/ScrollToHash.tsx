'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * 处理 URL 锚点滚动的客户端组件
 * 当页面加载或路由变化时，如果 URL 中包含锚点，自动滚动到对应位置
 */
export const ScrollToHash = () => {
  const pathname = usePathname()

  useEffect(() => {
    // 延迟执行，确保页面内容已渲染
    const timer = setTimeout(() => {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.replace('#', '')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          })
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

