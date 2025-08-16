<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, onMounted, onBeforeMount, nextTick, watch } from 'vue'
import request from '@/lib/axiosConfig'
import { useUserStore } from '../store/user'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import GeetestCaptcha from './GeetestCaptcha.vue'
import AppFooter from '@/components/AppFooter.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const loading = ref(false)
const errorMsg = ref('')
const account = ref('')
const password = ref('')
const userStore = useUserStore()
const backgroundLoading = ref(true)
const router = useRouter()
const oaClientId = import.meta.env.VITE_OA_ID
const oaUrl = import.meta.env.VITE_OA_URL
const redirectUri = encodeURIComponent(window.location.origin + '/oauth-callback')

// 极验验证相关
const captchaRef = ref()
const captchaResult = ref<any>(null)
const captchaVerified = ref(false)
const captchaId = import.meta.env.VITE_GEETEST_CAPTCHA_ID || ''

// 调试信息
console.log('极验环境变量检查:', {
  VITE_GEETEST_CAPTCHA_ID: import.meta.env.VITE_GEETEST_CAPTCHA_ID,
  captchaId: captchaId,
  hasCaptchaId: !!captchaId
})

const inputRef = ref<any>(null)
// const captchaWidth = ref('310px')

// const updateCaptchaWidth = () => {
//   if (inputRef.value && inputRef.value.inputEl) {
//     const rect = inputRef.value.inputEl.getBoundingClientRect()
//     captchaWidth.value = rect.width + 'px'
//   }
// }

async function onSubmit(e: Event) {
  e.preventDefault()
  errorMsg.value = ''
  
  // 检查验证码
  if (!captchaVerified.value) {
    toast.error('请完成验证码验证', {
      description: '请先完成人机验证'
    })
    return
  }
  
  loading.value = true
  
  console.log('🔐 登录尝试:', { account: account.value, hasPassword: !!password.value })
  
  try {
    const { data } = await request.post('/user/login', {
      account: account.value,
      password: password.value,
      captcha: captchaResult.value // 添加验证码结果
    })
    
    console.log('✅ 登录响应接收:', { code: data.code, hasToken: !!data.data?.token })
    
    if (data.code === 200 && data.data?.token) {
      console.log('🎉 登录成功, 设置用户数据')
      userStore.setUser(
        data.data.token,
        data.data.userId,
        data.data.userInfo
      )
      toast.success('登录成功')
      router.push('/')
    } else {
      console.error('❌ 登录失败:', { code: data.code, message: data.message })
      
      if (data.code === 400) {
        toast.error('登录失败', {
          description: "缺少必要字段，请检查输入"
        })
      }
      if (data.code === 401) {
        toast.error('登录失败', {
          description: "用户未注册或密码错误"
        })
      }
      if (data.code === 402) {
        toast.error('登录失败', {
          description: "用户名或密码错误"
        })
      }
      if (data.code === 403) {
        console.warn('🚫 User banned:', data.data)
        // 用户被封禁，跳转到封禁页面
        const banReason = data.data?.banReason || '违反社区规定'
        const banExpiration = data.data?.banExpiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        
        router.push({
          path: '/banned',
          query: {
            banReason: banReason,
            banExpiration: banExpiration
          }
        })
        return
      }
    }
  } catch (err: any) {
    console.error('❌ 登录异常:', err)
    const errorMessage = err?.response?.data?.message || err?.message || '未知原因，请联系管理员'
    
    toast.error('登录异常', {
      description: errorMessage
    })
  } finally {
    loading.value = false
  }
}

function loginWithMCDA() {
  console.log('🔗 重定向到 MCDA OAuth')
  const authUrl = `${oaUrl}/oauth/authorize?client_id=${oaClientId}&redirect_uri=${redirectUri}&response_type=code&scope=`
  window.location.href = authUrl
}

// 极验验证回调
const onCaptchaSuccess = (result: any) => {
  console.log('极验验证成功:', result)
  captchaResult.value = result
  captchaVerified.value = true
  toast.success('验证码验证成功')
}

const onCaptchaError = (error: any) => {
  console.error('极验验证失败:', error)
  captchaVerified.value = false
  captchaResult.value = null
  toast.error('验证码验证失败', {
    description: '请重新验证'
  })
}

const onCaptchaClose = () => {
  console.log('极验验证关闭')
  captchaVerified.value = false
  captchaResult.value = null
}

// 在组件挂载前加载 Spline 查看器脚本
onBeforeMount(() => {
  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://unpkg.com/@splinetool/viewer@1.10.38/build/spline-viewer.js'
  document.head.appendChild(script)
})

onMounted(() => {
  userStore.loadFromCookie()
  // nextTick(updateCaptchaWidth)
  // window.addEventListener('resize', updateCaptchaWidth)
})

// watch([account], () => nextTick(updateCaptchaWidth))
</script>

<template>
  <!-- 顶部安全区遮罩和顶栏，单独一层 -->
  <!--<div class="fixed top-0 left-0 w-full h-16 bg-white z-40 pointer-events-none"></div>-->
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <!-- 登录表单区域，单独一层，始终居中自适应 -->
  <div class="fixed inset-0 flex items-center justify-center overflow-hidden z-20">
    <!-- Spline 3D背景 -->
    <video
      src="https://lunova.studio/wp-content/uploads/2025/03/dropbox_-_work_in_progress_keynote_opening_2019-1080p.mp4#t=9"
      autoplay loop muted playsinline disablePictureInPicture
      controlslist="nodownload noremoteplayback nofullscreen noplaybackrate"
      class="absolute inset-0 w-full h-full object-cover z-0" @canplay="videoLoading = false"
      @error="videoLoading = false"></video>
    <!--<spline-viewer loading-anim-type="spinner-big-dark" url="https://prod.spline.design/xkzt01c4g-JkvLwB/scene.splinecode" class="absolute inset-0 w-full h-full z-0"></spline-viewer>-->
    <div class="relative bg-card rounded-lg shadow-md p-8 max-w-md w-full flex flex-col items-center mx-auto z-10">
      <div :class="cn('flex flex-col gap-6', props.class)">
        <div v-if="userStore.token" class="flex flex-col items-center gap-2 text-center">
          <Loader2 class="size-6 animate-spin text-primary" />
          <span>正在登录...</span>
        </div>
        <form v-else @submit.prevent="onSubmit" class="flex flex-col gap-4 w-full">
          <div class="flex flex-col items-center text-center">
            <h1 class="text-2xl font-bold">欢迎回来</h1>
            <p class="text-muted-foreground text-balance">请登录你的 Lingke 账户</p>
          </div>
          <div class="grid gap-3">
            <Label for="account">用户名/邮箱</Label>
            <Input id="account" type="text" placeholder="用户名或邮箱" required v-model="account" :disabled="loading" ref="inputRef" />
          </div>
          <div class="grid gap-3">
            <div class="flex items-center">
              <Label for="password">密码</Label>
              <a href="#" class="ml-auto text-sm underline-offset-2 hover:underline">遗失了你的密码?</a>
            </div>
            <Input id="password" type="password" required v-model="password" :disabled="loading" />
          </div>
          
          <!-- 极验验证码 -->
          <div class="grid gap-3 w-full">
            <GeetestCaptcha
              ref="captchaRef"
              :captcha-id="captchaId"
              
              @success="onCaptchaSuccess"
              @error="onCaptchaError"
              @close="onCaptchaClose"
            />
          </div>
          
          <Button type="submit" class="" :disabled="loading || !captchaVerified">
            <Loader2 class="h-4 mr-2 animate-spin" v-if="loading" />
            <span v-if="!loading">登录</span>
          </Button>
          <div v-if="errorMsg" class="text-red-500 text-center text-sm">{{ errorMsg }}</div>
          <!--<div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span class="bg-transparent text-muted-foreground relative z-10 px-2">第三方登录</span>
          </div>
          <div class="grid-cols-3">
            <Button variant="outline" type="button" class="w-full" @click="loginWithMCDA">
              <img src="https://lunova.studio/wp-content/uploads/2025/03/lunova_icon_bold_black@svg.svg" class="h-5 w-5 mr-2 inline" />
              使用 MCDA One Account 登录
            </Button>
          </div>-->
          <div class="text-center text-sm">没有帐户？<router-link to="/register" class="underline underline-offset-4">立即注册</router-link></div>
        </form>
        <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          点击继续，表示您同意并遵守 <router-link to="/privacy-policy" class="underline underline-offset-4">Lingke Network 隐私策略</router-link> 和 <router-link to="/terms-of-service" class="underline underline-offset-4">Lingke Network 产品使用条款</router-link>.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.geetest-captcha) {
  width: 100% !important;
  margin-bottom: 10px; /* 添加底部间距 */
  position: relative; /* 确保定位正确 */
  z-index: 10; /* 确保验证码在上层 */
}

:deep(.captcha-container) {
  width: 100% !important;
  position: relative; /* 确保定位正确 */
  z-index: 10; /* 确保验证码在上层 */
}

:deep(.geetest_holder) {
  width: 100% !important;
}

/* 确保表单元素之间有足够的间距 
.grid.gap-3 {
  margin-bottom: 16px;
}*/

/* 确保按钮与验证码之间有足够的间距 */
button[type="submit"] {
  margin-top: 10px;
}
</style>
