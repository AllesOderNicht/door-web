# 卡片高度标准化文档

## 概述

本文档定义了门户网站中所有卡片组件的统一高度标准，确保在不同设备和屏幕尺寸下保持一致的视觉效果。

## 高度标准

### 主要卡片类型

所有主要卡片组件（服务卡片、案例卡片、项目卡片、证书卡片）遵循以下高度标准：

- **移动端** (≤ 767px): `280px`
- **平板端** (768px - 1023px): `320px`
- **桌面端** (≥ 1024px): `360px`

### 统计卡片类型

统计数据卡片组件遵循以下高度标准：

- **移动端** (≤ 767px): `120px`
- **平板端** (768px - 1023px): `140px`
- **桌面端** (≥ 1024px): `160px`

## 实现方式

### CSS 变量

所有高度标准通过 CSS 变量定义在 `src/styles/card-variables.css` 中：

```css
:root {
  /* 卡片高度标准 */
  --card-min-height-mobile: 280px;
  --card-min-height-tablet: 320px;
  --card-min-height-desktop: 360px;
  
  /* 统计卡片高度标准 */
  --stat-card-min-height-mobile: 120px;
  --stat-card-min-height-tablet: 140px;
  --stat-card-min-height-desktop: 160px;
}
```

### 布局方式

所有卡片使用 Flexbox 布局确保内容在卡片内均匀分布：

```css
.card-base {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 主要卡片 */
  /* 或 */
  justify-content: center; /* 统计卡片 */
}
```

## 涉及的组件

### 主要卡片组件

1. **ServicesSection** - 服务卡片
   - 类名: `.serviceCard`
   - 文件: `src/components/ServicesSection.module.css`

2. **CasesSection** - 案例卡片
   - 类名: `.caseCard`
   - 文件: `src/components/CasesSection.module.css`

3. **ComplexProjectsSection** - 项目卡片
   - 类名: `.projectCard`
   - 文件: `src/components/ComplexProjectsSection.module.css`

4. **CertificationsSection** - 证书卡片
   - 类名: `.certCard`
   - 文件: `src/components/CertificationsSection.module.css`

### 统计卡片组件

1. **StatsSection** - 统计数据卡片
   - 类名: `.statItem`
   - 文件: `src/components/StatsSection.module.css`

## 响应式设计

所有卡片组件都支持响应式设计，通过媒体查询在不同屏幕尺寸下应用不同的高度：

```css
/* 移动端 */
min-height: var(--card-min-height-mobile);

@media (min-width: 768px) {
  /* 平板端 */
  min-height: var(--card-min-height-tablet);
}

@media (min-width: 1024px) {
  /* 桌面端 */
  min-height: var(--card-min-height-desktop);
}
```

## 维护指南

### 修改高度标准

如需修改卡片高度标准，请按以下步骤操作：

1. 修改 `src/styles/card-variables.css` 中的 CSS 变量值
2. 确保所有相关组件都使用了这些变量
3. 测试不同屏幕尺寸下的显示效果
4. 更新本文档

### 添加新卡片组件

添加新的卡片组件时，请遵循以下规范：

1. 使用预定义的 CSS 变量
2. 应用 `.card-base` 或 `.stat-card-base` 基础样式类
3. 确保支持响应式设计
4. 更新本文档

## 注意事项

- 所有高度值都是最小高度（`min-height`），内容超出时会自动扩展
- 卡片内容使用 Flexbox 布局确保在卡片内均匀分布
- 保持与现有设计系统的一致性
- 考虑移动端优先的设计原则
