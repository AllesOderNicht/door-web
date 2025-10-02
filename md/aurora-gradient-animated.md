# AuroraGradientAnimated 极光渐变动画组件

## 概述

`AuroraGradientAnimated` 是一个使用 Framer-Motion 实现的动态极光渐变背景组件，为首屏提供丰富的视觉体验。

## 功能特性

### 🎨 动态颜色变化
- 使用 8 种极光色彩循环变化
- 平滑的颜色过渡动画
- 12 秒完整循环周期
- 镜像重复模式

### 🌈 极光色彩方案
```typescript
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
```

### ✨ 多层视觉效果
1. **主渐变层**: 径向渐变背景，颜色动态变化
2. **叠加层**: 线性渐变叠加，增强色彩层次
3. **光晕效果**: 径向光晕，模拟极光发光
4. **流动光带**: 水平流动的光带效果

## 技术实现

### 核心技术
- **Framer-Motion**: 动画和手势库
- **useMotionValue**: 响应式动画值
- **useMotionTemplate**: 动态模板字符串
- **animate**: 高级动画控制

### 性能优化
- 响应式设计，移动端优化
- 减少动画复杂度以提升性能
- 支持 `prefers-reduced-motion` 媒体查询
- 高分辨率屏幕增强效果

## 使用方法

```tsx
import { AuroraGradientAnimated } from '@/components/AuroraGradientAnimated'

// 在组件中使用
<AuroraGradientAnimated />
```

## 样式定制

### CSS 变量
组件使用模块化 CSS，支持以下定制：

```css
/* 主容器 */
.auroraGradientContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 叠加层 */
.auroraOverlay {
  /* 线性渐变叠加 */
}

/* 光晕效果 */
.auroraGlow {
  /* 径向光晕 */
}

/* 流动光带 */
.auroraStream {
  /* 水平流动效果 */
}
```

## 响应式设计

### 移动端优化 (≤768px)
- 简化渐变效果
- 减少动画复杂度
- 优化光晕效果

### 超小屏幕 (≤480px)
- 进一步简化效果
- 隐藏流动光带
- 缩短动画周期

### 高分辨率屏幕 (≥1920px)
- 增强色彩饱和度
- 更丰富的光晕效果
- 更细腻的渐变层次

## 可访问性

- 支持 `prefers-reduced-motion` 媒体查询
- 在用户偏好减少动画时自动禁用动画
- 保持内容可读性

## 浏览器兼容性

- 现代浏览器支持
- CSS Grid 和 Flexbox 支持
- Framer-Motion 兼容性

## 性能考虑

- 使用 CSS 动画和 Framer-Motion 优化
- 移动端性能优化
- 内存使用优化
- 60fps 流畅动画

## 集成说明

该组件已集成到 `HeroSection` 中，与现有的 `AuroraBackground` 粒子系统配合使用，形成多层次的极光效果。

## 未来扩展

- 支持自定义颜色方案
- 添加更多动画模式
- 支持用户交互控制
- 增加音效同步
