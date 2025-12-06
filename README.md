# 贻洋船舶服务官网 - door-web-v2

专业的船舶工程服务与供应公司网站，基于 Next.js 15 构建。

## 项目结构

```
door-web-v2/
├── src/
│   ├── app/
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 主页面
│   └── components/           # 组件目录
│       ├── Header.tsx        # 导航栏组件
│       ├── HeroSection.tsx   # 主视觉区域
│       ├── AboutSection.tsx  # 关于我们
│       ├── ServicesSection.tsx # 服务内容
│       ├── CasesSection.tsx  # 服务案例
│       ├── ContactSection.tsx # 联系我们
│       └── Footer.tsx        # 页脚
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 技术栈

- **Next.js 15.5.4** - React 框架
- **React 19.1.0** - UI 库
- **TypeScript** - 类型安全
- **CSS Modules** - 样式管理
- **Font Awesome** - 图标库
- **Framer Motion** - 动画库（已安装但未使用，可选）

## 功能特性

- ✅ 响应式设计，适配各种屏幕尺寸
- ✅ 平滑滚动导航
- ✅ 服务案例筛选功能
- ✅ 询价表单提交
- ✅ 移动端菜单
- ✅ 动画效果

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 页面结构

1. **首页 (Hero Section)** - 主视觉区域，展示公司核心业务
2. **关于我们** - 公司使命、优势和服务特色
3. **服务内容** - 六项核心服务展示
4. **服务案例** - 成功案例展示，支持分类筛选
5. **联系我们** - 联系方式展示和询价表单
6. **页脚** - 公司信息、快速链接和联系方式

## 部署

项目可以使用 Vercel、Netlify 或其他支持 Next.js 的平台进行部署。