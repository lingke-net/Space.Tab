<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const userStore = useUserStore()

// 从路由参数或store获取封禁信息
const banReason = ref('')
const banExpiration = ref('')
const timeLeft = ref('')
const videoLoading = ref(true)

let countdownTimer: NodeJS.Timeout | null = null

// 计算剩余时间
const calculateTimeLeft = () => {
  if (!banExpiration.value) return

  const now = new Date().getTime()
  const expiration = new Date(banExpiration.value).getTime()
  const difference = expiration - now

  if (difference <= 0) {
    timeLeft.value = '已解封'
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
    return
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  if (days > 0) {
    timeLeft.value = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`
  } else if (hours > 0) {
    timeLeft.value = `${hours}小时 ${minutes}分钟 ${seconds}秒`
  } else if (minutes > 0) {
    timeLeft.value = `${minutes}分钟 ${seconds}秒`
  } else {
    timeLeft.value = `${seconds}秒`
  }
}

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/login')
}

// 返回首页
const goHome = () => {
  router.push('/')
}

onMounted(() => {
  // 从路由参数获取封禁信息
  const route = router.currentRoute.value
  if (route.query.banReason) {
    banReason.value = route.query.banReason as string
  }
  if (route.query.banExpiration) {
    banExpiration.value = route.query.banExpiration as string
  }

  // 如果没有从路由获取到，尝试从store获取
  if (!banReason.value && userStore.userInfo?.ban_reason) {
    banReason.value = userStore.userInfo.ban_reason
  }
  if (!banExpiration.value && userStore.userInfo?.ban_expiration) {
    banExpiration.value = userStore.userInfo.ban_expiration
  }

  // 设置默认值
  if (!banReason.value) {
    banReason.value = '无法获取数据，请回到主页，下列计时无效，请重新登录'
  }
  if (!banExpiration.value) {
    banExpiration.value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  // 开始倒计时
  calculateTimeLeft()
  countdownTimer = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <!-- 顶部安全区遮罩和顶栏，单独一层
  <AppHeader class="fixed top-0 left-0 w-full z-50" /> -->
  <!-- 封禁页面区域，单独一层，始终居中自适应 -->
  <div class="fixed inset-0 flex items-center justify-center overflow-hidden z-20">
    <video
      src="https://lunova.studio/wp-content/uploads/2025/03/dropbox_-_work_in_progress_keynote_opening_2019-1080p.mp4#t=9"
      autoplay loop muted playsinline disablePictureInPicture
      controlslist="nodownload noremoteplayback nofullscreen noplaybackrate"
      class="absolute inset-0 w-full h-full object-cover z-0" @canplay="videoLoading = false"
      @error="videoLoading = false"></video>
    <div class="relative bg-card rounded-lg shadow-md p-8 max-w-md w-full flex flex-col items-center mx-auto z-10">
      <div class="flex flex-col gap-6 w-full">
        <!-- 警告图标 -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle class="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <!-- 标题 -->
        <div class="flex flex-col items-center text-center">
          <h1 class="text-2xl font-bold text-red-600">账户已被停用</h1>
          <p class="text-muted-foreground text-balance">您的账户因情况被停用</p>
        </div>
        
        <!-- 封禁原因 -->
        <div class="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 class="font-semibold text-red-800 mb-2">停用原因</h3>
          <p class="text-red-700">{{ banReason }}</p>
        </div>

        <!-- 倒计时 -->
        <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div class="flex items-center gap-2 mb-2">
            <Clock class="w-5 h-5 text-orange-600" />
            <h3 class="font-semibold text-orange-800">倒计时</h3>
          </div>
          <p class="text-orange-700 font-mono text-lg">{{ timeLeft }}</p>
        </div>

        <!-- 解封时间 -->
        <div class="text-center text-sm text-muted-foreground">
          <p>预计解封时间：{{ new Date(banExpiration).toLocaleString('zh-CN') }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-col gap-3 pt-4">
          <Button 
            variant="outline" 
            @click="goHome"
            class="w-full"
          >
            返回首页
          </Button>
        </div>
        
        <!-- 底部说明 -->
        <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          如有疑问，请联系 <router-link to="#" class="underline underline-offset-4">Lingke Network Space.Tab Team</router-link>.
        </div>
      </div>
    </div>
  </div>
</template> 