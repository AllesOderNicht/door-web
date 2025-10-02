'use client'

import { useCallback, useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import styles from './AuroraBackground.module.css'

/**
 * 极光背景组件
 * 使用 tsparticles 创建动态极光效果
 */
export const AuroraBackground = () => {
  const [particleCount, setParticleCount] = useState(80)

  // 根据屏幕尺寸动态调整粒子数量
  useEffect(() => {
    const updateParticleCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          setParticleCount(20)
        } else if (window.innerWidth < 768) {
          setParticleCount(40)
        } else if (window.innerWidth < 1024) {
          setParticleCount(60)
        } else {
          setParticleCount(80)
        }
      }
    }

    updateParticleCount()
    window.addEventListener('resize', updateParticleCount)
    
    return () => window.removeEventListener('resize', updateParticleCount)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async () => {
    // 粒子加载完成后的回调
  }, [])

  return (
    <div className={styles.auroraContainer}>
      <Particles
        id="aurora-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: ['#00d4ff', '#0099cc', '#0066ff', '#00ffcc', '#66ccff'],
            },
            links: {
              color: '#00d4ff',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: particleCount,
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
              animation: {
                enable: true,
                speed: 2,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
        className={styles.particles}
      />
      
      {/* 极光渐变层 */}
      <div className={styles.auroraGradient} />
      
      {/* 动态光晕效果 */}
      <div className={styles.auroraGlow} />
    </div>
  )
}
