<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 检查当前用户是否为管理员
const isAdmin = computed(() => {
  return userStore.userInfo?.is_admin || false
})

// 检查当前页面是否为仪表盘
const isDashboardPage = computed(() => {
  return route.path === '/dashboard' || route.path.startsWith('/dashboard/')
})

// 检查当前页面是否为GitHub页面
const isGithubPage = computed(() => {
  return route.path === '/github-releases' || route.path.startsWith('/github-releases')
})

// 检查当前页面是否为设置页面
//const isSettingsPage = computed(() => {
//  return route.path === '/dashboard/settings'
//})

// 检查当前页面是否为管理页面
const isAdminPage = computed(() => {
  return route.path === '/dashboard/users' || 
         route.path === '/dashboard/permissions' || 
         route.path === '/dashboard/audit'
})

// 检查是否需要显示权限警告
const showPermissionWarning = computed(() => {
  // 非管理员用户，已登录，且访问设置页面或管理页面时显示警告
  return !isAdmin.value && ( isAdminPage.value) && userStore.token
})

// 返回仪表盘
function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div v-if="showPermissionWarning" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <!-- 红色透明模糊遮罩 -->
    <div class="absolute inset-0 bg-red-500/80 backdrop-blur-sm"></div>
    
    <!-- 警告内容 -->
    <div class="relative bg-card border border-red-200 rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
      <!-- 警告图标 -->
      <div class="flex justify-center mb-4">
        <AlertTriangle class="h-12 w-12 text-red-500" />
      </div>
      
      <!-- 警告标题 -->
      <h2 class="text-xl font-semibold text-red-600 mb-3">
        访问权限不足
      </h2>
      
      <!-- 警告信息 -->
      <p class="text-muted-foreground mb-6 leading-relaxed">
        您的帐户无运营权限，请向在职运营请求运营权限
      </p>
      
      <!-- 返回按钮 -->
      <Button 
        @click="goToDashboard" 
        variant="default"
        class="w-full"
      >
        回到仪表盘
      </Button>
    </div>
  </div>
</template> 