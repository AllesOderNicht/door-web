'use client'

import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import React, { useEffect } from 'react'
import styles from './AuroraGradientAnimated.module.css'

/**
 * 极光渐变动画组件
 * 使用 Framer-Motion 实现动态颜色变化的极光背景
 */

// 用于动画的颜色数组 - 极光色彩
const AURORA_COLORS = [
  '#13FFAA', // 青绿色
  '#1E67C6', // 蓝色
  '#CE84CF', // 紫色
  '#DD335C', // 粉红色
  '#00D4FF', // 青色
  '#FF6B6B', // 珊瑚红
  '#4ECDC4', // 薄荷绿
  '#45B7D1'  // 天蓝色
]

export const AuroraGradientAnimated = () => {
  // 初始化 motion 值为第一个颜色
  const color = useMotionValue(AURORA_COLORS[0])

  useEffect(() => {
    // 循环动画颜色变化
    animate(color, AURORA_COLORS, {
      ease: 'easeInOut', // 平滑过渡的缓动函数
      duration: 12,      // 颜色过渡的持续时间
      repeat: Infinity,  // 无限重复动画
      repeatType: 'mirror', // 反向动画方向
    })
  }, [color])

  // 使用 motion 模板创建动态背景渐变
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`

  return (
    <motion.div
      className={styles.auroraGradientContainer}
      style={{ backgroundImage }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* 额外的渐变层增强效果 */}
      <div className={styles.auroraOverlay} />
      
      {/* 动态光晕效果 */}
      <motion.div
        className={styles.auroraGlow}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* 流动的光带效果 */}
      <motion.div
        className={styles.auroraStream}
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}

export default AuroraGradientAnimated