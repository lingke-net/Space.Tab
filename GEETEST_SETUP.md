# 极验验证码配置说明

## 1. 获取极验配置

1. 访问 [极验官网](https://www.geetest.com/) 注册账号
2. 在控制台创建应用，获取 `captchaId`
3. 配置域名白名单

## 2. 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# 极验验证码配置
VITE_GEETEST_CAPTCHA_KEY=你的captchaId

# OAuth配置
VITE_OA_ID=你的OAuth客户端ID
VITE_OA_URL=https://oauth.example.com
```

## 3. CSP配置（如需要）

如果遇到CSP策略阻止脚本加载，需要在服务器配置中添加以下域名到白名单：

```html
<!-- 在HTML的meta标签中 -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.geetest.com https://gcaptcha4.geetest.com https://gcaptcha4.geevisit.com https://gcaptcha4.gsensebot.com https://static.geevisit.com;">

<!-- 或者在服务器配置中 -->
Content-Security-Policy: script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.geetest.com https://gcaptcha4.geetest.com https://gcaptcha4.geevisit.com https://gcaptcha4.gsensebot.com https://static.geevisit.com;
```

## 4. 后端验证

在登录接口中需要验证极验返回的验证结果：

```javascript
// 后端验证示例
const verifyGeetest = async (captchaResult) => {
  const { lot_number, captcha_output, pass_token, gen_time } = captchaResult
  
  // 调用极验服务端验证接口
  const response = await fetch('https://gcaptcha4.geetest.com/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lot_number,
      captcha_output,
      pass_token,
      gen_time,
      captcha_id: process.env.GEETEST_CAPTCHA_ID,
      sign_token: process.env.GEETEST_SECRET_KEY
    })
  })
  
  const result = await response.json()
  return result.status === 'success'
}
```

## 5. 组件使用

```vue
<template>
  <GeetestCaptcha
    :captcha-id="captchaId"
    @success="onCaptchaSuccess"
    @error="onCaptchaError"
    @close="onCaptchaClose"
  />
</template>

<script setup>
import GeetestCaptcha from '@/components/GeetestCaptcha.vue'

const onCaptchaSuccess = (result) => {
  console.log('验证成功:', result)
  // 将验证结果发送到后端
}

const onCaptchaError = (error) => {
  console.error('验证失败:', error)
}

const onCaptchaClose = () => {
  console.log('验证关闭')
}
</script>
```

## 6. 安全注意事项

- 不要在前端代码中硬编码 `captchaId`
- 使用环境变量管理敏感配置
- 后端必须验证极验返回的验证结果
- 定期更新极验配置和密钥

## 7. 故障排除

### 常见问题

1. **验证码不显示**
   - 检查 `captchaId` 是否正确
   - 检查域名是否在极验白名单中
   - 检查网络连接

2. **脚本加载失败**
   - 检查CSP策略是否阻止了极验域名
   - 确认环境变量 `VITE_GEETEST_CAPTCHA_KEY` 已正确设置
   - 尝试刷新页面或点击重试按钮
   - 检查浏览器控制台错误信息

3. **验证失败**
   - 检查后端验证逻辑
   - 确认极验密钥配置正确
   - 检查网络连接

4. **CSP策略问题**
   - 在服务器配置中添加极验域名到白名单
   - 或者使用 `unsafe-inline` 策略（不推荐）

### 调试步骤

1. 打开浏览器开发者工具
2. 查看Console标签页的错误信息
3. 查看Network标签页的请求状态
4. 检查Application标签页的CSP策略

### 联系支持

如果问题仍然存在，请：
1. 收集浏览器控制台的错误信息
2. 检查网络请求状态
3. 联系极验技术支持或项目管理员 