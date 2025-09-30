'use client'

import { useEffect } from 'react'

/**
 * 科技感背景组件
 * 创建浮动元素和粒子效果
 */
export const TechBackground = () => {
  useEffect(() => {
    // 创建浮动元素
    const createFloatingElements = () => {
      const bg = document.getElementById('techBg')
      if (!bg) return

      // 清除现有元素
      bg.innerHTML = ''

      for (let i = 0; i < 15; i++) {
        const element = document.createElement('div')
        element.className = 'floating-element'
        element.style.width = Math.random() * 100 + 50 + 'px'
        element.style.height = element.style.width
        element.style.left = Math.random() * 100 + '%'
        element.style.top = Math.random() * 100 + '%'
        element.style.animationDelay = Math.random() * 5 + 's'
        element.style.animationDuration = (Math.random() * 10 + 10) + 's'
        bg.appendChild(element)
      }
    }

    createFloatingElements()

    // 定期重新创建元素以保持动态效果
    const interval = setInterval(createFloatingElements, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div id="techBg" className="tech-bg" />
}
