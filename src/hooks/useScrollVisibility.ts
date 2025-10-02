import { useState, useEffect, useCallback } from 'react'

/**
 * 滚动可见性 Hook
 * 监听页面滚动，当滚动超过指定阈值时显示元素
 * 包含防抖优化以提升性能
 */
export const useScrollVisibility = (threshold: number = 100) => {
  const [isVisible, setIsVisible] = useState(false)

  // 防抖函数
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounce = useCallback((func: any, wait: number) => {
    let timeout: NodeJS.Timeout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollTop > threshold)
    }

    // 使用防抖优化滚动性能
    const debouncedHandleScroll = debounce(handleScroll, 10)

    // 添加滚动监听，使用 passive 选项提升性能
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
    
    // 初始化检查
    handleScroll()

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
    }
  }, [threshold, debounce])

  return isVisible
}
