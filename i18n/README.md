# i18n 国际化功能使用指南

本项目已集成 i18next 国际化功能，支持中英文切换。

## 功能特性

- ✅ 支持中文（zh-CN）和英文（en-US）
- ✅ 语言切换器位于导航栏右上角
- ✅ 自动语言检测（基于浏览器设置和本地存储）
- ✅ 类型安全的翻译 hooks
- ✅ 翻译文件完整性检查
- ✅ 自动翻译生成工具

## 文件结构

```
src/
├── i18n/
│   ├── index.ts                 # i18n 配置文件
│   └── locales/
│       ├── zh-CN.json          # 中文翻译
│       └── en-US.json          # 英文翻译
├── hooks/
│   └── useI18n.ts              # 自定义 i18n hook
├── utils/
│   └── i18n.ts                 # i18n 工具函数
└── components/
    └── LanguageSwitcher.tsx    # 语言切换组件
```

## 使用方法

### 1. 在组件中使用翻译

```tsx
import { useI18n } from '@/hooks/useI18n'

export const MyComponent = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  )
}
```

### 2. 语言切换

```tsx
import { useI18n } from '@/hooks/useI18n'

export const MyComponent = () => {
  const { changeLanguage, currentLanguage } = useI18n()
  
  const handleLanguageChange = () => {
    changeLanguage(currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN')
  }
  
  return (
    <button onClick={handleLanguageChange}>
      切换语言
    </button>
  )
}
```

### 3. 添加语言切换器组件

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// 简单切换模式（默认）
<LanguageSwitcher />

// 下拉菜单模式
<LanguageSwitcher showDropdown={true} />
```

## 脚本命令

### 检查翻译完整性

```bash
pnpm run check-i18n
```

检查所有语言文件是否包含相同的翻译键，确保翻译完整性。

### 自动生成翻译

```bash
pnpm run auto-gen-i18n
```

基于中文翻译文件自动生成其他语言的翻译文件。

## 添加新的翻译

1. 在 `src/i18n/locales/zh-CN.json` 中添加中文翻译
2. 在 `src/i18n/locales/en-US.json` 中添加对应的英文翻译
3. 运行 `pnpm run check-i18n` 检查完整性

### 翻译键命名规范

- 使用点号分隔层级：`section.subsection.key`
- 使用小写字母和连字符：`hero-title`
- 保持语义化：`nav.home`、`services.repair.title`

## 配置说明

### 支持的语言

在 `src/utils/i18n.ts` 中配置支持的语言：

```typescript
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
] as const
```

### 默认语言

在 `src/i18n/index.ts` 中配置默认语言：

```typescript
i18n.init({
  fallbackLng: 'zh-CN', // 默认语言
  // ...
})
```

## 注意事项

1. **类型安全**：使用 `useI18n` hook 而不是直接使用 `useTranslation`
2. **性能优化**：翻译文件会在构建时打包，无需额外网络请求
3. **SEO 友好**：服务端渲染时使用默认语言
4. **缓存策略**：语言选择会保存在 localStorage 中

## 扩展功能

### 添加新语言

1. 在 `SUPPORTED_LANGUAGES` 中添加新语言配置
2. 创建对应的翻译文件 `src/i18n/locales/新语言代码.json`
3. 在 `src/i18n/index.ts` 中导入新语言资源
4. 更新自动生成脚本的翻译映射

### 集成翻译 API

可以修改 `i18n/auto-gen-i18n.js` 脚本，集成 Google Translate API 或其他翻译服务：

```javascript
// 示例：集成 Google Translate API
async function translateText(text, fromLang, toLang) {
  // 调用翻译 API
  const response = await fetch('https://api.translate.com/v1/translate', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
    body: JSON.stringify({ text, from: fromLang, to: toLang })
  })
  return response.data.translatedText
}
```
