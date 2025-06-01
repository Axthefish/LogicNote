# LogicNote - 智能知识图谱生成器

LogicNote 是一个基于 AI 的知识管理工具，可以将文本内容自动转换为结构化的知识图谱，帮助用户更好地理解和组织信息。

## 功能特性

- 📝 **文本分析**：智能分析文本内容，提取核心概念和关系
- 🧠 **知识图谱生成**：自动生成可视化的知识图谱
- 🏷️ **知识体系管理**：创建和管理多个知识体系
- 💾 **文本保存**：保存和管理分析过的文本
- 🎯 **目标管理**：设置和跟踪学习目标
- 📊 **可视化编辑**：交互式的图谱编辑功能
- 🤖 **AI 增强**：集成 Claude API 和 Firebase Functions

## 技术栈

- **前端框架**: Next.js 15.3.3 (App Router)
- **UI 组件**: Radix UI + Tailwind CSS
- **图表库**: @antv/g6
- **后端服务**: Firebase (Firestore, Functions, Storage, Auth)
- **AI 集成**: Claude API (Anthropic)
- **开发语言**: TypeScript

## 快速开始

### 前提条件

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- Firebase 项目（已配置）
- Claude API 密钥（可选）

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/yourusername/LogicNote.git
cd LogicNote
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env.local` 文件并添加以下配置：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Claude API Configuration (Optional)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查
- `npm run type-check` - 运行 TypeScript 类型检查
- `npm run format` - 格式化代码

## 项目结构

```
LogicNote/
├── app/                    # Next.js App Router 页面
├── components/            # React 组件
│   ├── graph/            # 图表相关组件
│   └── ui/               # UI 基础组件
├── lib/                   # 工具函数和配置
│   ├── api.ts            # API 接口
│   ├── firebase.ts       # Firebase 配置
│   ├── claude-api.ts     # Claude API 集成
│   └── graph-utils.ts    # 图表工具函数
├── public/               # 静态资源
└── hooks/                # React Hooks
```

## 部署

### 部署到 Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 点击部署

### 其他部署选项

- Firebase Hosting
- Netlify
- 自托管服务器

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至：your-email@example.com
