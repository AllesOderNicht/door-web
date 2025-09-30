'use client'

import { useEffect, useRef } from 'react'

interface ParallaxBannerProps {
  imageUrl: string
  className?: string
  speed?: number
}

/**
 * 视差滚动背景组件
 * 实现背景图片的视差滚动效果
 */
export const ParallaxBanner = ({ 
  imageUrl, 
  className = '', 
  speed = 0.5 
}: ParallaxBannerProps) => {
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        bannerRef.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={bannerRef}
      className={`bg-cover bg-center bg-fixed ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        willChange: 'transform'
      }}
    />
  )
}
