<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ref, computed, h } from 'vue'
import request from '@/lib/axiosConfig'
import { useUserStore } from '../store/user'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { Loader2, ShieldAlert } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import { AlertCircle } from "lucide-vue-next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AppFooter from '@/components/AppFooter.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const loading = ref(false)
const errorMsg = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const qqNum = ref('')
const showConfirmDialog = ref(false)
const userStore = useUserStore()
const router = useRouter()
const passwordFocused = ref(false)

const passwordStrength = computed(() => {
  const val = password.value
  if (!val) return { level: 0, text: '请输入密码', color: 'bg-gray-200' }
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[a-z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  if (score <= 2) return { level: 1, text: '弱', color: 'bg-red-400' }
  if (score === 3 || score === 4) return { level: 2, text: '中', color: 'bg-yellow-400' }
  if (score === 5) return { level: 3, text: '强', color: 'bg-green-500' }
  return { level: 0, text: '请输入密码', color: 'bg-gray-200' }
})

function onSubmit(e: Event) {
  e.preventDefault()
  errorMsg.value = ''
  
  console.log('📝 注册尝试:', { 
    username: username.value, 
    email: email.value,
    hasPassword: !!password.value,
    hasQQ: !!qqNum.value
  })
  
  if (!username.value || !email.value || !password.value || !confirmPassword.value || !qqNum.value) {
    errorMsg.value = '请填写所有字段'
    console.warn('⚠️ 注册验证失败: 缺少字段')
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致'
    console.warn('⚠️ 注册验证失败: 密码不一致')
    return
  }
  
  console.log('✅ 注册验证通过')
  // 显示确认对话框
  showConfirmDialog.value = true
}

// 确认注册
async function confirmRegister() {
  loading.value = true
  
  try {
    console.log('🔄 提交注册...')
    const { data } = await request.post('/user/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      qq_num: qqNum.value
    })
    
    console.log('✅ 注册响应接收:', { 
      code: data.code, 
      hasToken: !!data.data?.token 
    })
    
    if (data.code === 200 && data.data?.token) {
      console.log('🎉 注册成功, 设置用户数据')
      userStore.setUser(
        data.data.token,
        data.data.userId,
        data.data.userInfo
      )
      toast.success('注册成功')
      router.push('/dashboard')
    } else {
      console.error('❌ 注册失败:', { code: data.code, message: data.message })
      errorMsg.value = data.message || '注册失败'
      toast.error('注册失败', {
        description: data.message || "请稍后重试"
      })
    }
  } catch (err: any) {
    console.error('❌ 注册异常:', err)
    const errorMessage = err?.response?.data?.message || '注册失败'
    errorMsg.value = errorMessage
    toast.error('注册异常', {
      description: errorMessage
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 顶部安全区遮罩和顶栏，单独一层 -->
  <div class="fixed top-0 left-0 w-full h-16 z-40 pointer-events-none"></div>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <!-- 注册表单区域，单独一层，始终居中自适应 -->
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
        <!-- 注册表单已被暂时禁用 
        <div class="flex flex-col items-center text-center gap-4">
          <ShieldAlert class="w-16 h-16 text-amber-500" />
          <h1 class="text-2xl font-bold">我们仍在测试</h1>
          <p class="text-muted-foreground text-balance">如需参加测试，请联系我们的人员</p>
          <div class="p-4 border-2 border-amber-400 rounded-lg max-w-xs">
            <p class="text-sm text-muted-foreground text-balance">
              我们仍在测试同步服务，如果您需要尝试我们的服务，可以加入我们的测试群来提前获取账户
            </p>
          </div>
          <a href="https://qm.qq.com/q/7xV43DaOBi" target="_blank" rel="noopener noreferrer">
            <Button class="mt-2">加群联系负责人</Button>
          </a>
          <div class="text-center text-sm mt-4">已有帐户？<router-link to="/login" class="underline underline-offset-4">去登录</router-link></div>
        </div>-->
        
        <!-- 注册表单 -->
        <form class="flex flex-col gap-4 w-full" @submit="onSubmit">
          <div class="flex flex-col items-center text-center gap-4">
            <h1 class="text-2xl font-bold">注册新账户</h1>
            <p class="text-muted-foreground text-balance">请填写信息以注册 Lingke · Space 账户</p>
          </div>
          <div class="grid gap-3">
            <Label for="username">登录ID</Label>
            <Input id="username" type="text" placeholder="登录ID" required v-model="username" :disabled="loading" />
          </div>
          <div class="grid gap-3">
            <Label for="email">邮箱</Label>
            <Input id="email" type="email" placeholder="邮箱" required v-model="email" :disabled="loading" />
          </div>
          <div class="grid gap-3">
            <Label for="password">密码</Label>
            <Input id="password" type="password" required v-model="password" :disabled="loading"
              @focus="passwordFocused = true" @blur="passwordFocused = false" />
            <div v-if="passwordFocused" class="h-2 w-full rounded bg-gray-200 mt-1">
              <div :class="['h-2 rounded transition-all', passwordStrength.color]" :style="{ width: passwordStrength.level === 1 ? '33%' : passwordStrength.level === 2 ? '66%' : passwordStrength.level === 3 ? '100%' : '0%' }"></div>
            </div>
            <div v-if="passwordFocused" class="text-xs mt-1 text-gray-500">{{ passwordStrength.text }}</div>
          </div>
          <div class="grid gap-3">
            <Label for="confirmPassword">确认密码</Label>
            <Input id="confirmPassword" type="password" required v-model="confirmPassword" :disabled="loading" />
          </div>
          <div class="grid gap-3">
            <Label for="qqNum">QQ号码</Label>
            <Input id="qqNum" type="text" placeholder="QQ号码" required v-model="qqNum" :disabled="loading" />
            <div class="text-xs text-muted-foreground">头像将自动获取QQ头像</div>
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 class="w-4 h-4 mr-1 animate-spin" v-if="loading" />
            <span v-if="!loading">注册</span>
          </Button>
          
          <!-- 注册确认对话框 -->
          <AlertDialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认注册</AlertDialogTitle>
                <AlertDialogDescription>
                  点击继续注册，表示同意您同意我们的所有用户策略与条款，同时承诺您的操作或者行为与 Lingke Network 无关
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div class="flex flex-col gap-4 py-4">
                <Alert variant="destructive">
                  <AlertCircle class="w-4 h-4" />
                  <AlertTitle class="font-bold">我们仍在测试</AlertTitle>
                  <AlertDescription>
                    由于我们仍在测试部分功能，您的账户可能会在我们未通知的情况下被删除或者关停
                  </AlertDescription>
                </Alert>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel @click="showConfirmDialog = false">取消</AlertDialogCancel>
                <AlertDialogAction @click="confirmRegister">继续注册</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div v-if="errorMsg" class="text-red-500 text-center text-sm">{{ errorMsg }}</div>
          <div class="text-center text-sm">已有帐户？<a href="/login" class="underline underline-offset-4">去登录</a></div>
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
