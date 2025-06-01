# Vercel 环境变量设置指南

## 需要在Vercel控制台设置的环境变量：

### Firebase配置
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDeMT_ULlao2mhFv-h3GsSOzvw04bUkzbU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=logicnotev1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=logicnotev1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=logicnotev1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=136034258149
NEXT_PUBLIC_FIREBASE_APP_ID=1:136034258149:web:98db023629caf93fbc180c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-D5EM17RE29
```

### Claude API配置
```
ANTHROPIC_API_KEY=sk-ant-api03-eUIrxEYyvtUBjCVpT0Mxg6GPDEFQRPw...（您的完整API密钥）
```

### 基础URL配置
```
NEXT_PUBLIC_BASE_URL=https://logic-note.vercel.app
```

## 设置步骤：

1. 登录 Vercel 控制台
2. 进入您的项目设置
3. 点击 "Environment Variables" 选项卡
4. 逐一添加上述环境变量
5. 确保选择了正确的环境（Production/Preview/Development）
6. 保存后重新部署项目

## 注意事项：
- NEXT_PUBLIC_ 前缀的变量在客户端可见
- ANTHROPIC_API_KEY 不应该有 NEXT_PUBLIC_ 前缀，因为它应该只在服务器端使用
- 确保所有值都没有多余的空格或引号 