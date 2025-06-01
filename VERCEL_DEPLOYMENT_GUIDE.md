# Vercel 部署指南

## 重要提示：Firebase 和 Vercel 冲突

⚠️ **不要同时使用 Firebase Hosting 和 Vercel！** 
- Firebase Functions ✅ 可以使用
- Firebase Hosting ❌ 必须禁用（已在 firebase.json 中移除）

## 部署架构

- **前端（Next.js）**: 部署在 Vercel
- **后端 API**: 
  - Next.js API Routes（部署在 Vercel）
  - Firebase Functions（部署在 Firebase）
- **数据库**: Firebase Firestore
- **存储**: Firebase Storage

## ✅ 部署前检查清单

### 1. Git 仓库准备 ✅
- [x] 初始化 Git 仓库 (`git init`)
- [x] 设置主分支为 main
- [x] `.gitignore` 已正确配置（包含 `.env.local` 和 `.env`）

### 2. 环境变量准备 ✅  
- [x] 本地 `.env.local` 已配置
- [x] 确保不会提交敏感信息到 Git

### 3. 代码检查 ✅
- [x] 构建成功 (`npm run build`)
- [x] TypeScript 检查通过
- [x] Firebase 和 Claude API 已集成

## 🚀 部署步骤

### 第一步：添加并提交代码到 Git

```bash
# 添加所有文件
git add .

# 提交代码
git commit -m "fix: remove firebase hosting conflict"
```

### 第二步：推送到 GitHub

1. 在 GitHub 创建新仓库（不要初始化 README）
2. 添加远程仓库并推送：

```bash
# 替换 YOUR_USERNAME 和 YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 第三步：在 Vercel 部署

1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量：

#### 必须配置的环境变量：

```
# Firebase 配置（虽然代码有默认值，但建议在 Vercel 中配置）
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDeMT_ULlao2mhFv-h3GsSOzvw04bUkzbU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=logicnotev1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=logicnotev1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=logicnotev1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=136034258149
NEXT_PUBLIC_FIREBASE_APP_ID=1:136034258149:web:98db023629caf93fbc180c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-D5EM17RE29

# Claude API（重要：必须在 Vercel 配置真实密钥）
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# 可选：设置你的域名
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

5. 点击 "Deploy"

### 第四步：部署后配置

1. **自定义域名**（可选）：
   - 在 Vercel 项目设置中添加自定义域名
   - 更新 `NEXT_PUBLIC_BASE_URL` 环境变量

2. **Firebase 配置**：
   - 在 Firebase Console 中添加你的 Vercel 域名到授权域名列表
   - 位置：Authentication > Settings > Authorized domains

3. **监控设置**：
   - 查看 Vercel Analytics
   - 查看 Firebase Analytics 控制台

## ⚠️ 重要提示

1. **API 密钥安全**：
   - Claude API 密钥只在服务器端使用（通过 API 路由）
   - 确保环境变量在 Vercel 中正确设置

2. **Firebase 域名授权**：
   - 部署后需要在 Firebase Console 添加 Vercel 域名

3. **性能优化**：
   - Vercel 会自动优化和缓存静态资源
   - 考虑启用 Vercel Analytics 监控性能

4. **错误监控**：
   - 查看 Vercel Functions 日志监控 API 错误
   - 设置错误通知（可选）

## 🎯 部署后测试

1. 访问部署的 URL
2. 测试文本分析功能
3. 检查 Firebase Analytics 是否正常工作
4. 测试 Claude API 集成
5. 验证知识图谱生成功能

## 📞 故障排除

### 常见问题：

1. **构建失败**：
   - 检查 Vercel 构建日志
   - 确保所有依赖都已安装

2. **API 调用失败**：
   - 检查环境变量是否正确设置
   - 查看 Vercel Functions 日志

3. **Firebase 连接问题**：
   - 确保域名已添加到 Firebase 授权列表
   - 检查 Firebase 配置是否正确

### 1. 确保环境变量设置正确
在 Vercel Dashboard 中设置所有必需的环境变量（见 VERCEL_ENV_SETUP.md）

### 2. 推送代码到 GitHub
```bash
git add .
git commit -m "fix: remove firebase hosting conflict"
git push origin main
```

### 3. Vercel 自动部署
Vercel 会自动检测到新的提交并开始部署

### 4. 部署 Firebase Functions（如果需要）
```bash
# 只部署 Functions，不部署 Hosting
firebase deploy --only functions
```

---

完成以上步骤后，你的 LogicNote 应用就成功部署到 Vercel 了！🎉 