# Vercel 404 错误排查指南

## 问题诊断

您的项目构建成功，但在 Vercel 上显示 404 错误。以下是可能的原因和解决方案：

## 1. 环境变量问题（最可能）

### 检查步骤：
1. 登录 [Vercel 控制台](https://vercel.com)
2. 进入您的项目 `logic-note`
3. 点击 Settings → Environment Variables
4. 确保添加了所有必需的环境变量（参见 VERCEL_ENV_SETUP.md）

### 特别注意：
- `NEXT_PUBLIC_BASE_URL` 必须设置为您的实际Vercel域名
- 所有 Firebase 相关的环境变量都必须设置
- `ANTHROPIC_API_KEY` 必须是完整的密钥

## 2. 部署问题

### 重新部署步骤：
```bash
# 方法1：通过Git推送
git add .
git commit -m "fix: update environment configuration"
git push origin main

# 方法2：通过Vercel CLI
vercel --prod
```

## 3. 检查Vercel日志

1. 在 Vercel 控制台中，点击您的部署
2. 查看 Functions 标签页，检查是否有错误
3. 查看 Runtime Logs 查看实时错误

## 4. 验证配置

### 检查 package.json 的构建脚本：
```json
"scripts": {
  "build": "next build",
  "start": "next start"
}
```

### 确保 next.config.js 正确：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 如果使用图片优化，添加域名白名单
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
```

## 5. 路由问题

确保以下文件存在：
- `app/page.tsx` - 主页面
- `app/layout.tsx` - 根布局
- `app/not-found.tsx` - 404页面

## 6. 清除缓存

1. 在 Vercel 控制台中，进入 Settings → Functions
2. 点击 "Purge Cache"
3. 重新访问网站

## 7. 域名配置

如果使用自定义域名：
1. 检查 DNS 设置是否正确
2. 等待 DNS 传播（可能需要几小时）

## 8. 测试步骤

1. 先访问 `https://logic-note.vercel.app`（默认域名）
2. 如果默认域名工作正常，检查自定义域名配置
3. 使用浏览器的开发者工具查看网络请求

## 快速修复清单

- [ ] 所有环境变量已在 Vercel 设置
- [ ] Git 仓库已推送最新代码
- [ ] Vercel 显示部署成功
- [ ] 检查了 Runtime Logs
- [ ] 清除了缓存
- [ ] 测试了默认 Vercel 域名

如果以上步骤都检查过还是有问题，请查看 Vercel 的 Function Logs 中的具体错误信息。 