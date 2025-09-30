# 卡片描述文本溢出修复文档

## 问题描述

在门户网站的卡片组件中，`cardDescription` 文本内容可能会超出卡片边界，导致布局不美观和用户体验问题。

## 解决方案

### 1. 添加通用文本截断样式

在 `src/styles/card-variables.css` 中添加了多种文本截断的通用样式类：

```css
/* 文本截断通用样式 */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-truncate-multiline {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 默认显示3行 */
  line-height: 1.6;
}

.text-truncate-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.6;
}

.text-truncate-3-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.6;
}

.text-truncate-4-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-height: 1.6;
}
```

### 2. 修复的组件

#### CasesSection
- **文件**: `src/components/CasesSection.module.css`
- **类名**: `.caseDescription`
- **修复内容**: 
  - 移除了固定高度 `height: 60px`
  - 添加了多行文本截断，限制为3行
  - 设置了最小高度 `min-height: 4.8em` 保持布局一致性

#### CertificationsSection
- **文件**: `src/components/CertificationsSection.module.css`
- **类名**: `.cardDescription`
- **修复内容**: 
  - 移除了固定高度 `height: 60px`
  - 添加了多行文本截断，限制为3行
  - 设置了最小高度 `min-height: 4.8em` 保持布局一致性

#### ComplexProjectsSection
- **文件**: `src/components/ComplexProjectsSection.module.css`
- **类名**: `.cardDescription`
- **修复内容**: 
  - 添加了多行文本截断，限制为3行
  - 设置了最小高度 `min-height: 4.8em` 保持布局一致性

#### ServicesSection
- **文件**: `src/components/ServicesSection.module.css`
- **类名**: `.cardDescription`
- **修复内容**: 
  - 添加了多行文本截断，限制为3行
  - 设置了最小高度 `min-height: 4.8em` 保持布局一致性

### 3. 技术实现细节

#### CSS 属性说明
- `overflow: hidden` - 隐藏超出容器的内容
- `display: -webkit-box` - 使用弹性盒子布局
- `-webkit-box-orient: vertical` - 设置盒子方向为垂直
- `-webkit-line-clamp: 3` - 限制显示3行文本
- `line-clamp: 3` - 标准属性，提高浏览器兼容性
- `line-height: 1.6` - 设置行高为1.6倍
- `min-height: 4.8em` - 设置最小高度（3行 × 1.6行高 = 4.8em）

#### 兼容性考虑
- 使用了 `-webkit-line-clamp` 和标准的 `line-clamp` 属性
- 确保在支持和不支持 `line-clamp` 的浏览器中都能正常工作
- 通过 `min-height` 保证卡片高度的一致性

### 4. 效果

- ✅ 文本超出3行时自动截断并显示省略号
- ✅ 保持卡片高度的一致性
- ✅ 提升用户体验，避免文本溢出
- ✅ 保持响应式设计的完整性
- ✅ 兼容主流浏览器

### 5. 使用建议

如果需要在其他组件中使用文本截断，可以直接使用 `card-variables.css` 中定义的通用样式类：

- 单行截断：`.text-truncate`
- 2行截断：`.text-truncate-2-lines`
- 3行截断：`.text-truncate-3-lines`
- 4行截断：`.text-truncate-4-lines`
- 默认多行截断：`.text-truncate-multiline`（3行）

## 测试建议

1. 在不同屏幕尺寸下测试卡片布局
2. 使用不同长度的描述文本测试截断效果
3. 验证在移动端和桌面端的显示效果
4. 检查浏览器兼容性
